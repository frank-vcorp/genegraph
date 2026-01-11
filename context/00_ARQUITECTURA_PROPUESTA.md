# Arquitectura Propuesta: GenoGraph Pro

## 1. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Frontend** | Next.js 14 (App Router) | React Standard, fácil despliegue en Vercel, Server Components. |
| **Estilos** | Tailwind CSS | Desarrollo rápido, consistente con los ejemplos visuales. |
| **PWA** | **@serwist/next** | Soporte PWA moderno (Service Workers, Manifest, Offline support). |
| **Diagramado** | **React Flow** | Librería estándar para grafos interactivos en React. Soporta Custom Nodes, Edges y Drag&Drop nativo. |
| **Estado Global** | Zustand | Manejo de estado simple y ligero (selección de nodos, datos del paciente). |
| **Backend** | Next.js Server Actions | API simplificada, sin necesidad de servidor express separado. |
| **Base de Datos** | Firebase Firestore | Estructura flexible (NoSQL) ideal para guardar grafos JSON complejos. Capa gratuita generosa. |
| **Autenticación** | Firebase Auth | Manejo seguro de usuarios (profesionales de salud). |

## 2. Estructura de Datos (Firestore)

### Colección: `genogramas`
```typescript
interface Genograma {
  id: string; // Auto-generated
  userId: string; // Owner (Terapeuta)
  pacienteName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Datos del Grafo (React Flow compatible)
  nodes: Node[]; 
  edges: Edge[];
  
  // Metadatos clínicos
  casoInfo: {
    motivoConsulta: string;
    ocupacion: string;
    estadoCivil: string;
  };
}
```

### Definición de Nodos (Custom Types)
React Flow requiere tipos específicos. Definiremos:
- `personNode`: Renderiza Símbolo (Cuadrado/Círculo) + Datos (Nombre, Edad).
- `petNode`: Renderiza Símbolo (Rombo/Pata) + Nombre.
- `unionNode`: Nodo invisible o pequeño para conectar familias.

## 3. Diagrama de Componentes (Frontend)

```mermaid
graph TD
    Page --> Layout
    Layout --> AppStateProvider[Zustand Store]
    Layout --> Workspace
    
    Workspace --> ToolShelf[Panel "Farmacia" (Drag Source)]
    Workspace --> CanvasArea[Lienzo ReactFlow]
    Workspace --> ViewToggle[Switch Clásico/Moderno]
    
    CanvasArea --> SmartNode[Nodo Inteligente]
    
    SmartNode --> |Renderiza| VisualLayer
    VisualLayer --> |Si Tema=Clásico| GenomeIcon[SVG Estándar]
    VisualLayer --> |Si Tema=Moderno| ModernIcon[Icono Amigable]
    
    ToolShelf -.-> |Drop Persona| CanvasArea
    ToolShelf -.-> |Drop Condición| SmartNode
```

## 4. Estrategia de Implementación (MVP)

1.  **Setup:** Next.js + Tailwind + React Flow.
2.  **Motor de Temas:** Crear un hook `useGenogramTheme` que dicte cómo se renderizan los nodos.
3.  **Smart Nodes:** 
    *   El nodo no es un simple dibujo. Es un contenedor de datos (`attributes: ['diabetes', 'fallecido']`).
    *   Al recibir un drop de "Diabetes", actualiza su array de atributos.
    *   Al renderizarse, consulta el Tema activo para saber si dibuja un cuadrante azul (Clásico) o una gotita de sangre (Moderno).
4.  **Panel tipo "Farmacia":** 
    *   Tabs visuales: Personas, Vínculos, Patologías.
    *   Iconos grandes y claros.

## 5. Referencias Visuales
Se mantendrá la capacidad de generar la estética de `genograma_paciente1_v2.html` (Modo Clásico) pero añadiendo la capa de iconografía moderna opcional.
