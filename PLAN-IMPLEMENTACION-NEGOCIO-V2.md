# Plan Maestro: Funcionalidades de Negocio Completas (GenoGraph v2.0)

**Estado:** En Ejecución por SOFIA  
**Objetivo:** Lograr paridad 100% con GenoPro (profesional)  
**Estimación:** 70-80 horas  
**Responsables:** SOFIA (código), GEMINI (QA/infra), Deby (especificaciones)

---

## 📊 Hoja de Ruta

### SPRINT 1: Arquitectura Base + Tipos (Semana 1)
**Duración:** 15 horas  
**Deliverable:** types/genogram.ts actualizado + Store refactorizado

**Tareas:**
- [ ] CP-012-01: Actualizar `types/genogram.ts` con interfaces (GenoDate, Gender, MedicalCondition, SubstanceUse)
- [ ] CP-012-02: Migrar `store/genogramStore.ts` a acciones granulares (twin status, medical conditions, dates)
- [ ] CP-012-03: Tests para lógica de fechas (edad, precisión, validaciones)
- [ ] CP-012-04: Tests para lógica de relaciones (ciclos, estados exclusivos)

**Quality Gates:**
- ✅ Todos los tests del sprint pasen (vitest)
- ✅ TypeScript: 0 errores
- ✅ Build: Clean

---

### SPRINT 2: Simbología Visual + Relaciones Emocionales (Semana 2)
**Duración:** 18 horas  
**Deliverable:** Nodos de personas con condiciones + Edges emocionales

**Tareas:**
- [ ] CP-012-05: Crear `PersonNode.tsx` mejorado (símbolos, colores, condiciones médicas)
  - Soportar gender spectrum (male, female, trans, other)
  - Mostrar cuadrante de condición médica
  - Visualizar embarazo/aborto
- [ ] CP-012-06: Crear `RelationshipEdge.tsx` mejorado (estructural + emocional)
  - Líneas sólidas (matrimonio), punteadas (separación), zigzag (conflicto), doble (fusión)
  - Superponer múltiples tipos emocionales
  - Color rojo para conflicto, amarillo para distancia, verde para cercanía
- [ ] CP-012-07: Modal `MedicalConditionEditor` (CRUD condiciones)
- [ ] CP-012-08: Tests visualización (snapshot, renderizado)

**Quality Gates:**
- ✅ Nodes con condiciones visibles
- ✅ Edges emocionales en múltiples capas
- ✅ 60fps en drag & drop con >20 relaciones emocionales

---

### SPRINT 3: Generaciones + Swimlanes + Fechas (Semana 3)
**Duración:** 17 horas  
**Deliverable:** Auto-layout por generación + Interfaz de fechas avanzadas

**Tareas:**
- [ ] CP-012-09: Implementar algoritmo `autoLayoutByGeneration()`
  - Calcula generation automáticamente (profundidad de árbol)
  - Ajusta Y basado en swimlanes
  - Snap-to-grid en drag & drop
- [ ] CP-012-10: Visualizar swimlanes (líneas horizontales de fondo por generación)
- [ ] CP-012-11: Componente `GenoDateInput` (selector con precisión)
  - Exact (YYYY-MM-DD)
  - About (~YYYY)
  - Before / After
  - Unknown
- [ ] CP-012-12: Cálculo de edad dinámica (respeta precisión)
- [ ] CP-012-13: Tests layout (generaciones, swimlanes)

**Quality Gates:**
- ✅ Personas ordenadas verticalmente por generación
- ✅ Snap-to-grid funciona sin desalineaciones
- ✅ Edad calculada correctamente con precisión 'about'

---

### SPRINT 4: PDF Profesional + Leyendas (Semana 4)
**Duración:** 15 horas  
**Deliverable:** Reporte PDF clínico completo

**Tareas:**
- [ ] CP-012-14: Mejorar `PdfExporter.ts`
  - Renderizar diagrama en alta resolución (2x scale)
  - Incluir página de "Leyenda" (símbolos usados, colores, abreviaturas)
  - Listar condiciones médicas por persona
  - Timeline de eventos (nacimiento, muerte, cambios)
- [ ] CP-012-15: Plantilla PDF profesional
  - Header con nombre del paciente
  - Footer con fecha/hora generación
  - Página 2: Condiciones médicas indexadas
  - Página 3: Notas clínicas de relaciones emocionales
- [ ] CP-012-16: Tests PDF (estructura, metadata)

**Quality Gates:**
- ✅ PDF genera sin errores
- ✅ Contiene todas las condiciones médicas
- ✅ Leyenda legible y completa

---

## 🎯 Funcionalidades Específicas (Mapeo GenoPro)

### Simbología Visual
| Elemento | Símbolo | Color | Implementación |
|----------|---------|-------|-----------------|
| Hombre | Cuadrado | #FFFFFF (borde #000000) | PersonNode width=40, height=40 |
| Mujer | Círculo | #FFFFFF (borde #000000) | PersonNode borderRadius=50% |
| Trans M | Cuadrado + Triángulo | #87CEEB | PersonNode custom shape |
| Trans F | Círculo + Triángulo | #FFB6C1 | PersonNode custom shape |
| Desconocido | Diamante | #D3D3D3 | PersonNode rotate 45° |
| Fallecido | Símbolo + línea diagonal | #808080 | PersonNode opacity=0.6 + stroke-through |
| Embarazado | Triángulo adentro | #90EE90 | PersonNode inner triangle |
| Aborto | X roja | #FF0000 | PersonNode "X" large |

### Condiciones Médicas (Colores Cuadrante)
| Condición | Color | Posición | Código |
|-----------|-------|----------|--------|
| Cáncer | Rojo | Superior derecha | #FF0000 |
| Diabetes | Naranja | Inferior derecha | #FFA500 |
| Depresión | Azul | Superior izquierda | #4169E1 |
| Alcoholismo | Marrón | Inferior izquierda | #8B4513 |
| Psicosis | Púrpura | Frente | #800080 |
| Hipotensión | Verde claro | Esquina | #90EE90 |

### Relaciones Emocionales (Tipos de Línea)
| Interacción | Línea | Color | Aplicación |
|-------------|-------|-------|-----------|
| Matrimonio | ─────── | Negro | Horizontal, sólida |
| Separación | - - - - | Gris | Horizontal, punteada |
| Divorcio | ─X─X─ | Negro | Horizontal con X |
| Convivencia | ═════ | Negro | Horizontal doble |
| Paternidad | \│/ | Negro | Vertical sólida |
| Afinidad | ═════ | Negro | Doble línea |
| Conflicto | ╱╲╱╲ | Rojo | Zigzag |
| Distancia | ┄┄┄┄ | Gris | Punteada con espacio |
| Cercanía | ║║║║ | Verde | Triple línea |
| Fusión | ╬╬╬╬ | Verde | Cuádruple línea |
| Abuso | ➔ (gruesa) | Rojo | Flecha gruesa |

---

## 🔧 Arquitectura Técnica (Resumen)

**Tipos Base Actualizados:**
```typescript
// GenoDate: Precisión de fechas
type DatePrecision = 'exact' | 'about' | 'before' | 'after' | 'unknown';
interface GenoDate { date: string; precision: DatePrecision; display?: string; }

// Género expandido
type Gender = 'male' | 'female' | 'trans_male' | 'trans_female' | 'other';

// Condiciones médicas estructuradas
interface MedicalCondition {
  id: string; code?: string; name: string; status: 'active'|'remission'|'cured'|'chronic'|'carrier';
  onsetDate?: GenoDate; endDate?: GenoDate;
}

// Persona completa
interface Person {
  id: string; firstName: string; lastName: string;
  gender: Gender; birthDate?: GenoDate; deathDate?: GenoDate;
  pregnancyStatus?: 'none'|'pregnant'|'miscarriage'|'abortion'|'stillbirth';
  medicalConditions: MedicalCondition[];
  generation: number; // Para swimlanes
  twinGroupId?: string; twinType?: 'identical'|'fraternal';
  x: number; y: number; createdAt: number; updatedAt: number;
}

// Relaciones duales
interface Relationship {
  id: string; person1Id: string; person2Id: string;
  // Capa 1: Parentesco
  isLineage: boolean; lineageType?: 'biological'|'adoptive'|'foster'|'donor';
  // Capa 2: Pareja
  isPartnership: boolean; partnershipType?: 'marriage'|'cohabitation'|'divorce';
  startDate?: GenoDate; endDate?: GenoDate;
  // Capa 3: Emocional
  emotionalConfig?: { types: EmotionalInteraction[]; direction?: 'bi'|'1to2'|'2to1'; };
}
```

**Firestore Schema:**
```
users/{userId}/
  genograms/{genogramId}/
    persons/{personId} -> Documento completo (incluye condiciones médicas)
    relationships/{relId} -> Relación estructural + emocional
```

**Store (Zustand) - Acciones Nuevas:**
- `setTwinStatus(personIds[], type)` - Agrupa gemelos
- `addGeneration(direction)` - Ajusta swimlanes
- `upsertMedicalCondition(personId, condition)` - CRUD médico
- `setDate(entityId, field, date)` - Actualiza fechas + cálculos

---

## 📈 Progreso Esperado

| Fase | Sprint | Horas | % Negocio | % Técnico | Estado |
|------|--------|-------|-----------|-----------|--------|
| Pre | CP-001 a CP-011 | 140 | 45% | 70% | ✅ COMPLETADO |
| v2.0 | CP-012 (Sprint 1) | 15 | 55% | 75% | ⏳ EN PROGRESO |
| v2.0 | CP-012 (Sprint 2) | 18 | 65% | 82% | ⏳ PENDIENTE |
| v2.0 | CP-012 (Sprint 3) | 17 | 80% | 90% | ⏳ PENDIENTE |
| v2.0 | CP-012 (Sprint 4) | 15 | 100% | 95% | ⏳ PENDIENTE |

---

## 🚀 Inicio Inmediato (SOFIA)

1. **YA**: Verificar tipos actuales vs propuestos
2. **YA**: Refactorizar store con acciones granulares
3. **YA**: Crear suite de tests para fechas y relaciones
4. **Siguiente**: Implementar PersonNode mejorado con condiciones
5. **Siguiente**: Implementar RelationshipEdge emocional
6. **Siguiente**: Auto-layout por generación

---

## 📞 Escalación / Bloqueos

- **GEMINI**: Validar performance de render en genogramas >50 personas
- **Deby**: Revisar símbolos médicos adicionales (psicosis, hipotensión, etc.)
- **Integra**: Confirmar si PDF debe incluir "Assessment clínico" (texto libre)

---

**Última Actualización:** Enero 10, 2026 | SOFIA - Constructor
