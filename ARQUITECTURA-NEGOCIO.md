# Arquitectura Técnica para Funcionalidad de Negocio Completa (GenoGraph v2.0)

> **Estado:** Propuesta Técnica Aprobada
> **Fecha:** Enero 2026
> **Responsable:** GEMINI (Arquitectura)
> **Objetivo:** Definir el stack, esquema de datos y plan de implementación para alcanzar paridad funcional con GenoPro (~100% features).

## 1. Visión Técnica

GenoPro destaca por su profundidad técnica en simbología médica y relacional. Para alcanzar ese nivel en web (GenoGraph), debemos migrar de un modelo de datos "plano" a uno "relacional complejo" optimizado para renderizado en Canvas (React Flow).

**Retos Principales:**
1.  **Explosión de nodos/aristas:** Un genograma completo tiene 3x-4x más elementos visuales que lógicos (ej: líneas de gemelos, grupos de convivencia, etiquetas de fechas).
2.  **Validación Temporal:** Las fechas no son meros strings; son motores de cálculo para edades, duración de relaciones y time-travel.
3.  **Persistencia Atómica:** Moverse de documentos gigantes a subcolecciones optimizadas en Firestore.

---

## 2. Nuevo Modelo de Datos (Firestore & TypeScript)

El cambio más crítico es la redefinición de `Person`, `Relationship` y la introducción de `Event`.

### 2.1. Tipos Base Actualizados (`types/genogram.ts`)

```typescript
// --- FECHAS AVANZADAS ---
export type DatePrecision = 'exact' | 'about' | 'before' | 'after' | 'unknown';

export interface GenoDate {
  date: string; // ISO 8601 YYYY-MM-DD
  precision: DatePrecision;
  display?: string; // override manual opcional, ej: "Invierno 1990"
}

// --- TRANSICIÓN DE GÉNERO Y ESTADO ---
export type Gender = 'male' | 'female' | 'unknown' | 'trans_male' | 'trans_female' | 'other';
export type PregnancyStatus = 'none' | 'pregnant' | 'miscarriage' | 'abortion' | 'stillbirth';

// --- NUEVOS ATRIBUTOS MÉDICOS Y SOCIALES ---
export interface MedicalCondition {
  id: string;
  code?: string; // CIE-10 / DSM-5 opcional
  name: string;
  status: 'active' | 'remission' | 'cured' | 'chronic' | 'carrier';
  onsetDate?: GenoDate;
  endDate?: GenoDate;
  notes?: string;
}

export interface SubstanceUse {
  substance: 'alcohol' | 'tobacco' | 'drugs' | 'medication';
  amount?: string;
  frequency?: string;
  inRecovery: boolean;
}

// --- ENTIDAD PERSONA (Expandida) ---
export interface Person {
  id: string; // UUID
  // Identidad
  firstName: string;
  lastName: string;
  alias?: string;
  gender: Gender;
  
  // Ciclo Vital
  birthDate?: GenoDate;
  deathDate?: GenoDate;
  isDeceased: boolean;
  blockAgeCalculation: boolean; // para ocultar edad

  // Genética y Reproducción
  pregnancyStatus?: PregnancyStatus;
  twinGroupId?: string; // ID compartido para dibujar arcos de gemelos
  twinType?: 'identical' | 'fraternal' | 'unknown';
  
  // Datos Clínicos (Arrays estructurados en lugar de strings simples)
  medicalConditions: MedicalCondition[];
  substanceUse?: SubstanceUse[];
  
  // Layout & Visual
  generation: number; // Swimlane Y-axis
  x: number;
  y: number;
  
  // Metadatos
  tags: string[]; // Etiquetas libres ("cuidador", "vive en casa")
  createdAt: number;
  updatedAt: number;
}
```

### 2.2. Relaciones Complejas (Visual + Lógica)

En React Flow, separamos la *conexión lógica* de la *arista visual*.

```typescript
export type LineageType = 'biological' | 'adoptive' | 'foster' | 'donor';
export type EmotionalInteraction = 
  | 'conflicted'    // Zigzag
  | 'distant'       // Punteada
  | 'close'         // Doble linea
  | 'fused'         // Triple linea
  | 'fused_hostile' // Triple + Zigzag
  | 'cutoff'        // Cortada
  | 'abuse_physical' // Flecha gruesa
  | 'abuse_emotional';

// Edge Lógico (Guardado en BD)
export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  
  // Capa 1: Estructural (Parentesco)
  isLineage: boolean; // Si es true, define estructura del árbol
  lineageType?: LineageType;
  
  // Capa 2: Pareja (Horizontal)
  isPartnership: boolean;
  partnershipType?: 'marriage' | 'cohabitation' | 'separation' | 'divorce' | 'widowhood';
  startDate?: GenoDate;
  endDate?: GenoDate; // Divorcio/Muerte
  
  // Capa 3: Emocional (Overlay)
  emotionalConfig?: {
    types: EmotionalInteraction[]; // Array porque pueden ser múltiples (ej: fused + hostile)
    direction?: 'bi' | '1to2' | '2to1';
  };
}
```

---

## 3. Estrategia de Persistencia (Firestore Schema)

Optimizamos para lecturas rápidas y escrituras atómicas.

**Estructura de Colecciones:**

```text
users/
  {userId}/
    genograms/
      {genogramId}/          -> Meta info (nombre, created, thumbnail)
        persons/
          {personId}         -> Documento completo de Persona (incluye conditions)
        relationships/
          {relId}            -> Documento de Relación
        events/
          {eventId}          -> Timeline events (opcional para Fase 3)
```

**Justificación:**
*   Las **condiciones médicas** se guardan DENTRO del documento `Person`. Un historial médico raramente excede 10-20 items (2KB), muy por debajo del límite de 1MB de Firestore. Simplifica la carga.
*   Las **relaciones** se mantienen en colección separada para facilitar queries de grafo ("dame todas las relaciones donde personId == X").

---

## 4. Estado Global (Zustand Store)

El store actual es monolítico. Debemos refactorizar para update granular.

**Nuevas Actions necesarias (`store/genogramStore.ts`):**

1.  **Lineage Management:**
    *   `setTwinStatus(personIds: string[], type: TwinType)`: Agrupa nodos y asigna `twinGroupId`.
    *   `addGeneration(direction: 'up' | 'down')`: Ajusta masivamente coordenadas Y.

2.  **Data Operations:**
    *   `upsertMedicalCondition(personId: string, condition: MedicalCondition)`: Lógica para "active" vs "remission".
    *   `setDate(entityId: string, field: 'birth'|'death', date: GenoDate)`: Dispara re-cálculo de edad.

3.  **Visual State:**
    *   `toggleSwimlanes()`: Activa/Desactiva visualización de fondo de franjas generacionales.

---

## 5. Plan de Pruebas (Vitest)

La complejidad lógica aumenta drásticamente. Requerimos Tests Unitarios puros (sin React).

**Test Suites Requeridas:**

1.  **`src/__tests__/logic/dates.test.ts`**
    *   Calcular edad con precisión 'about'.
    *   Validar que `deathDate` > `birthDate`.
    *   Formateo de string para display ("~1990", ">2000").

2.  **`src/__tests__/logic/relationships.test.ts`**
    *   Detectar ciclos de linaje (un hijo no puede ser padre de su abuelo).
    *   Validar estados de pareja exclusivos (no puede estar casado y divorciado a la vez sin fechas de cierre).

3.  **`src/__tests__/logic/layout.test.ts`**
    *   (Soft-gate) Verificar que nodos de Generación 2 siempre tengan Y > Generación 1.

---

## 6. Criterios de Aceptación (Soft-Gates)

Para considerar una funcionalidad como "Done" (v 2.0), debe cumplir:

### Feature: Simbología Médica
*   [ ] Se puede añadir una condición customizada (nombre, color).
*   [ ] Se visualiza un icono/color en la esquina del nodo (cuadrante estándar genopro).
*   [ ] El reporte PDF lista las condiciones crónicas.

### Feature: Relaciones Emocionales
*   [ ] Se pueden superponer relaciones emocionales sobre relaciones de linaje (ej: padre e hijo que se odian).
*   [ ] Las líneas de "conflicto" (zigzag) se renderizan correctamente entre nodos distantes.
*   [ ] Performance: El drag & drop mantiene 60fps con >20 aristas emocionales.

### Feature: Generaciones
*   [ ] Algoritmo de "Auto-Layout" ordena verticalmente por generación.
*   [ ] Drag & drop tiene "snap-to-grid" vertical basado en swimlanes.

---

## 7. Performance & Roadmap

1.  **Rendering Optimizado:**
    *   Usar `React.memo` agresivamente en componentes `CustomNode` y `CustomEdge`.
    *   Implementar "Virtual Scrolling" en React Flow (prop `onlyRenderVisibleElements={true}`) para genogramas >50 personas.

2.  **PDF Export:**
    *   Usar `html2canvas` con scale x2 para retina quality.
    *   Generar una página anexa de "Leyenda" automática basada en los símbolos usados en el diagrama actual.

### Pasos Siguientes para SOFIA:

1.  Actualizar `types/genogram.ts` con las interfaces propuestas.
2.  Migrar componentes UI para usar el nuevo objeto `GenoDate`.
3.  Implementar el componente/modal `MedicalConditionEditor`.
