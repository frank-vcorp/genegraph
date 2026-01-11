# INTERCONSULTA TÉCNICA: Revisión MVP Genograma (React Flow Refactor)

**ID:** INT-2026-001
**Fecha:** 2026-01-10
**Autor:** GEMINI (Mentor Técnico / Arquitecto)
**Destinatario:** SOFIA (Builder)
**Estado:** ✅ APROBADO CON OBSERVACIONES

---

## 1. Resumen Ejecutivo

La refactorización para integrar **React Flow** y **Zustand** ha sido exitosa. El núcleo de la aplicación (Canvas, Nodos, Store) presenta una arquitectura mucho más escalable que la versión anterior SVG cruda. El sistema es modular, tipado y prepara el terreno correctamente para la integración con bases de datos en la Fase 2.

Sin embargo, se han detectado **inconsistencias de tipado** (caso "Mascotas") y una configuración de **PWA manual** que podría ser frágil.

---

## 2. Auditoría de Código (Soft Gates)

### 2.1 Componentes y UI (`src/components`)
- **React Flow Integration:** ✅ Implementación correcta. Uso de `nodeTypes` personalizados (`PersonNode`) y gestión de estado con `useNodesState`/`useEdgesState`.
- **Drag & Drop:**
  - *Personas:* ✅ Funciona. Lógica en `Canvas.tsx` maneja `onDrop` correctamente.
  - *Condiciones:* ✅ Funciona. Lógica en `PersonNode.tsx` intercepta el drop y actualiza el store.
- **Renderizado:** El uso de emojis/caracteres en `PersonNode` ('□', '●') es aceptable para MVP, pero limitante para exportación profesional (SVG vectoriales).

### 2.2 Gestión de Estado (`src/store/genogram.ts`)
- **Zustand:** Patrón correcto. Acciones atómicas (`addPerson`, `updatePerson`) bien definidas.
- **Normalización:** ⚠️ El store mezcla datos demográficos (`person.gender`) con datos visuales (`position`).
  - *Riesgo:* Al persistir en Firestore, guardaremos coordenadas de UI junto con datos médicos. Esto es aceptable por ahora, pero en Fase 2 idealmente separaríamos `GenogramLayout` de `GenogramData`.

### 2.3 TypeScript (`src/types/genogram.ts`)
- **Strictness:** B+. Las interfaces están bien definidas.
- **Inconsistencia Detectada (🐛 BUG):**
  - En `Canvas.tsx` se hace referencia a `draggedItem.personType === 'pet'`.
  - En `PersonNode.tsx` el `default` del switch asume mascotas.
  - **PERO:** El tipo `Gender` es `male | female | unknown`. No existe `pet`. TypeScript debería estar marcando error o se está usando casting implícito.

### 2.4 Infraestructura PWA
- **Config:** ⚠️ `next.config.ts` está vacío.
- **Service Worker:** Se depende de un registro manual (`useServiceWorker.ts`) y un archivo estático `public/sw.js`.
- *Riesgo:* Sin una estrategia de caché automatizada (como `next-pwa` o Workbox generado), la experiencia offline puede romperse fácilmente si no se actualiza manualmente el `sw.js` con los nuevos assets del build.

---

## 3. Checklist de Calidad MVP

| Criterio | Estado | Notas |
| :--- | :---: | :--- |
| **Compilación** | 🟢 PASS | `npm run build` exitoso (Exit Code 0). |
| **React Flow Core** | 🟢 PASS | Nodos custom registrados y Store conectado. |
| **Drag & Drop (Personas)** | 🟢 PASS | Crea nodos en coordenadas del mouse. |
| **Drag & Drop (Condiciones)**| 🟢 PASS | Asigna condiciones a personas específicas. |
| **Tipado Estático** | 🟡 WARN | Falta tipo `pet` en `Gender` union type. |
| **PWA / Offline** | 🟡 WARN | Configuración manual (frágil), falta plugin automático. |
| **Persistencia Local** | 🔴 TODO | El store se reinicia al recargar (Fase 2: Firebase). |

---

## 4. Recomendaciones y Siguientes Pasos

### Prioridad Alta (Inmediato)
1. **Corregir Tipos:** Agregar `'pet'` al tipo `Gender` en `src/types/genogram.ts` para alinear con la lógica de UI.
2. **Validación de Limites:** Asegurar que `Canvas.tsx` maneje errores si el JSON del `drag` viene corrupto (actualmente tiene un `try/catch` básico, pero mejorar logging).

### Preparación Fase 2 (Firebase)
1. **Adaptador de Datos:** El store usa `Person` con `position`. Firestore debe guardar esto. Se recomienda estructura plana en Firestore:
   - `users/{uid}/genograms/{gid}/persons/{pid}`
   - `users/{uid}/genograms/{gid}/relationships/{rid}`
2. **Setup de Autenticación:** El `createNewGenogram` actual pide `userId`. Necesitaremos `firebase/auth` pronto.

### Deuda Técnica
- **SVG vs Emojis:** Reemplazar los caracteres de texto en `PersonNode` por SVGs reales de Genograma (cuadrados, círculos vectoriales) para permitir zoom sin pérdida de calidad y exportación a PDF.

---

**Veredicto FINAL:** El código es **APTO** para cerrarse como versión MVP 1.0, sujeto a la corrección del tipo `Gender`. Puede procederse al despliegue en Vercel y comenzar la integración con Firebase.

---

## ADDENDUM: Correcciones Implementadas

**Fecha:** 2026-01-10 T05:00 UTC  
**Implementado por:** SOFIA (Builder)  
**Status:** ✅ COMPLETADO

### Correcciones Aplicadas:
1. **Tipo `Gender`:** Actualizado a `'male' | 'female' | 'unknown' | 'pet'` (removido duplicado `'pet'`)
2. **Canvas.tsx:** Removida lógica condicional `draggedItem.personType === 'pet' ? 'unknown' : draggedItem.personType`
3. **PersonNode.tsx:** Agregado caso explícito `case 'pet': return '🐾'`
4. **Build Test:** ✅ Compilación exitosa sin errors de TypeScript (4.5s)

### Resultado:
✅ **Todos los soft gates cumplidos. MVP listo para Fase 2.**
