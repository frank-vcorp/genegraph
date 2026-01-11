# 🧬 GenoGraph Pro - Sistema Web de Genogramas

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | GenoGraph Pro |
| **Tipo** | Aplicación Web SaaS |
| **Cliente** | Laura Liliana Arias Bravo (Tanatóloga) |
| **Propósito** | Creación de genogramas familiares para uso clínico |
| **Fecha** | Enero 2026 |

---

## 🎯 EJEMPLOS DE REFERENCIA VISUAL

> **IMPORTANTE PARA INTEGRA:** Los siguientes archivos HTML son **ejemplos del resultado esperado** de la aplicación. Fueron creados manualmente como prototipos y representan exactamente el output visual que debe generar el sistema automáticamente.

### Archivos de Ejemplo (en este mismo directorio):

| Archivo | Paciente | Características Especiales |
|---------|----------|---------------------------|
| `genograma_paciente1_v2.html` | Mariana (36 años) | 3 generaciones, mascota fallecida (gato), relaciones emocionales |
| `genograma_paciente2_v2.html` | Daniel (14 años) | 4 generaciones, padre ausente/desconocido, abuela cuidadora (★) |
| `genograma_paciente3_v2.html` | María del Carmen (27 años) | Pérdida gestacional (triángulo con X), duelo perinatal |

### ¿Qué demuestran estos ejemplos?

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LO QUE LA APP DEBE GENERAR AUTOMÁTICAMENTE:                            │
│                                                                          │
│  ✅ Símbolos GenoPro estándar (cuadrados, círculos, rombos, triángulos) │
│  ✅ Múltiples generaciones organizadas verticalmente                    │
│  ✅ Líneas de conexión familiares (matrimonio, hijos)                   │
│  ✅ Relaciones emocionales con colores (verde=cercana, rojo=hostil)     │
│  ✅ Marcadores especiales (★ cuidador, doble borde = paciente)          │
│  ✅ Tooltips informativos al pasar el mouse                             │
│  ✅ Leyenda de símbolos                                                 │
│  ✅ Datos demográficos (nombre, edad, fechas)                           │
│  ✅ Diseño profesional y limpio                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Para ver los ejemplos:
```bash
cd /home/frank/proyectos/genograma
python3 -m http.server 8080
# Abrir en navegador: http://localhost:8080/genograma_paciente1_v2.html
```

---

## 1. Descripción General

### 1.1 Problema a Resolver

GenoPro, el software más usado para crear genogramas, tiene una **interfaz anticuada** (estilo años 2000), es **poco intuitivo**, tiene una **curva de aprendizaje alta** y no es accesible desde dispositivos móviles. Los profesionales de salud mental necesitan una herramienta moderna, fácil de usar y accesible desde cualquier dispositivo.

### 1.2 Solución Propuesta

**GenoGraph Pro** es una aplicación web moderna para crear genogramas familiares de forma visual e intuitiva, usando drag & drop, con simbología estándar GenoPro, exportación a múltiples formatos y almacenamiento en la nube.

### 1.3 Usuarios Objetivo

- Psicólogos
- Tanatólogos
- Terapeutas familiares
- Trabajadores sociales
- Médicos de familia
- Estudiantes de psicología/medicina

---

## 2. Funcionalidades

### 2.1 MVP (Fase 1) - Esencial

#### 2.1.1 Panel de Símbolos Arrastrables
- [ ] Panel lateral con símbolos GenoPro estándar
- [ ] Drag & drop de símbolos al área de trabajo
- [ ] Categorías: Personas, Uniones, Relaciones Emocionales
- [ ] Tooltips explicativos en cada símbolo
- [ ] Feedback visual al arrastrar (sombra, highlight)

#### 2.1.2 Zona de Drop con Generaciones
- [ ] Áreas de drop organizadas por generación
- [ ] Generación 1 (Abuelos), Gen 2 (Padres), Gen 3 (Paciente), etc.
- [ ] Agregar/quitar generaciones dinámicamente
- [ ] Validación de drop (no permitir bisabuelo como hijo)
- [ ] Indicador visual de zona de drop activa

#### 2.1.3 Formulario de Datos (Auto-popup)
- [ ] Se abre automáticamente al soltar símbolo
- [ ] Campos básicos: nombre, fecha nacimiento, género
- [ ] Estado: vivo/fallecido con fecha
- [ ] Selector de relación: "es [hijo/padre/cónyuge] de [persona]"
- [ ] Checkbox: paciente identificado, cuidador principal
- [ ] Notas clínicas (textarea)
- [ ] Validación de campos obligatorios
- [ ] Botón cancelar / agregar

#### 2.1.4 Árbol Familiar (Lista Estructurada)
- [ ] Vista de lista de todos los miembros agregados
- [ ] Agrupados por generación
- [ ] Mostrar relaciones (hijo de X, casado con Y)
- [ ] Iconos de estado (vivo, fallecido, paciente)
- [ ] Botones editar y eliminar por miembro
- [ ] Indicadores de relaciones emocionales

#### 2.1.5 Genograma Automático
- [ ] Generación automática del layout (Dagre.js)
- [ ] Renderizado con React Flow
- [ ] Símbolos GenoPro estándar
- [ ] Líneas de parentesco correctas
- [ ] Líneas emocionales diferenciadas
- [ ] Botón "Regenerar Layout" si el usuario quiere
- [ ] Zoom y pan en la vista del genograma
- [ ] Actualización en tiempo real al agregar miembros

#### 2.1.6 Personas (Símbolos GenoPro)
- [ ] Hombre (cuadrado)
- [ ] Mujer (círculo)
- [ ] Sexo desconocido (rombo)
- [ ] Embarazo (triángulo)
- [ ] Pérdida gestacional (triángulo con X)
- [ ] Aborto (triángulo negro)
- [ ] Mascota (rombo con ícono)
- [ ] Fallecido (X diagonal superpuesta)
- [ ] Paciente identificado (doble borde verde)
- [ ] Cuidador principal (estrella ★)

#### 2.1.7 Datos de Persona
- [ ] Nombre completo
- [ ] Fecha de nacimiento
- [ ] Fecha de fallecimiento (si aplica)
- [ ] Edad (calculada automáticamente)
- [ ] Ocupación
- [ ] Notas/observaciones
- [ ] Condiciones médicas (lista)
- [ ] Foto (opcional)

#### 2.1.4 Conexiones Familiares
- [ ] Línea de matrimonio (horizontal sólida)
- [ ] Línea de unión libre (horizontal punteada)
- [ ] Línea de separación (con una diagonal)
- [ ] Línea de divorcio (con dos diagonales)
- [ ] Línea a hijos (vertical hacia abajo)
- [ ] Conexión automática al crear hijo
- [ ] Gemelos (líneas convergentes)
- [ ] Adopción (línea punteada a hijo)

#### 2.1.5 Relaciones Emocionales
- [ ] Cercana/armoniosa (doble línea verde)
- [ ] Muy cercana/fusionada (triple línea verde)
- [ ] Distante (línea punteada gris)
- [ ] Conflictiva/hostil (línea zigzag roja)
- [ ] Corte/ruptura (línea con X)
- [ ] Abuso (línea con flechas)
- [ ] Etiquetas personalizables en líneas

#### 2.1.6 Exportación
- [ ] Exportar a PNG (alta resolución)
- [ ] Exportar a PDF
- [ ] Exportar a SVG (vectorial)
- [ ] Imprimir directamente

#### 2.1.7 Guardar/Cargar
- [ ] Guardar genograma localmente (JSON)
- [ ] Cargar genograma desde archivo
- [ ] Autoguardado cada 30 segundos

---

### 2.2 Fase 2 - Mejoras

#### 2.2.1 Templates Prediseñados
- [ ] Familia nuclear (pareja + 2 hijos)
- [ ] Familia extendida (3 generaciones)
- [ ] Familia monoparental
- [ ] Familia reconstituida
- [ ] Genograma en blanco con guías

#### 2.2.2 Herramientas Avanzadas
- [ ] Deshacer/Rehacer (Ctrl+Z / Ctrl+Y)
- [ ] Copiar/Pegar personas
- [ ] Alinear personas (horizontal, vertical)
- [ ] Distribuir uniformemente
- [ ] Auto-layout inteligente
- [ ] Agrupar/desagrupar
- [ ] Capas (generaciones)

#### 2.2.3 Anotaciones
- [ ] Agregar notas de texto libre
- [ ] Cuadros de información
- [ ] Leyenda automática
- [ ] Título del genograma
- [ ] Fecha de elaboración
- [ ] Datos del examinador

#### 2.2.4 Compartir
- [ ] Generar link para compartir (solo lectura)
- [ ] Exportar link con contraseña
- [ ] Código QR del genograma

---

### 2.3 Fase 3 - Profesional

#### 2.3.1 Sistema de Usuarios
- [ ] Registro con email
- [ ] Login con Google/Facebook
- [ ] Perfil de usuario
- [ ] Configuración de cuenta
- [ ] Recuperar contraseña

#### 2.3.2 Gestión de Pacientes
- [ ] Crear expediente de paciente
- [ ] Datos de identificación
- [ ] Múltiples genogramas por paciente
- [ ] Historial de consultas
- [ ] Notas clínicas vinculadas
- [ ] Búsqueda de pacientes

#### 2.3.3 Almacenamiento en Nube
- [ ] Guardar genogramas en servidor
- [ ] Sincronización automática
- [ ] Acceso desde cualquier dispositivo
- [ ] Historial de versiones
- [ ] Restaurar versiones anteriores

#### 2.3.4 Colaboración
- [ ] Compartir genograma con colegas
- [ ] Edición colaborativa en tiempo real
- [ ] Comentarios en el genograma
- [ ] Permisos (ver, editar, administrar)

#### 2.3.5 Reportes
- [ ] Generar reporte clínico PDF
- [ ] Incluir genograma + notas
- [ ] Plantillas de reporte personalizables
- [ ] Marca de agua personalizada

---

## 3. Arquitectura Técnica

### 🎯 3.0 Filosofía de Diseño: "Drag → Form → Auto-Generate"

**El usuario NO dibuja el genograma manualmente.** En su lugar:

1. **Arrastra símbolos** estándar (GenoPro) desde un panel lateral al área de trabajo
2. **Completa un formulario** estructurado con datos del familiar
3. **El sistema genera** automáticamente el genograma con layout perfecto

```
┌──────────────────────────────────────────────────────────────────────┐
│                     FLUJO DE USUARIO                                  │
│                                                                       │
│  ┌──────────────┐      ┌────────────────┐      ┌──────────────────┐  │
│  │    Panel     │      │   Formulario   │      │    Genograma     │  │
│  │   Símbolos   │ ──►  │  Estructurado  │ ──►  │    Automático    │  │
│  │   (Drag)     │      │    (Datos)     │      │   (Perfecto)     │  │
│  └──────────────┘      └────────────────┘      └──────────────────┘  │
│                                                                       │
│  👆 Arrastra           ✏️ Llena datos          🎨 Se genera solo     │
│  "Padre"               Nombre: Juan            Layout automático     │
│  "Madre"               Edad: 65                Líneas perfectas      │
│  "Hermano"             Estado: Fallecido       Espaciado correcto    │
│  "Mascota"             Relación: Padre de...   Generaciones claras   │
└──────────────────────────────────────────────────────────────────────┘
```

#### ¿Por qué este enfoque?

| Enfoque Tradicional (GenoPro) | Nuestro Enfoque |
|-------------------------------|-----------------|
| Usuario dibuja manualmente | Usuario solo ingresa datos |
| Debe alinear símbolos | Layout automático perfecto |
| Curva de aprendizaje alta | Intuitivo desde el primer uso |
| Errores de posicionamiento | Siempre consistente |
| Requiere práctica | Profesional desde el día 1 |

### 3.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 18 + TypeScript + Vite                               │
│  ├── @dnd-kit/core (Drag & Drop accesible)                  │
│  ├── @dnd-kit/sortable (Ordenamiento)                       │
│  ├── Dagre.js (Algoritmo de layout para árboles)            │
│  ├── React Flow (Renderizado de nodos y conexiones)         │
│  ├── Zustand (Estado global)                                │
│  ├── TailwindCSS (Estilos)                                  │
│  ├── shadcn/ui (Componentes UI modernos)                    │
│  ├── React Hook Form + Zod (Formularios validados)          │
│  └── React Router (Navegación)                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  Node.js + Express + TypeScript                             │
│  ├── Prisma ORM (Base de datos)                             │
│  ├── JWT (Autenticación)                                    │
│  ├── Multer (Subida de archivos)                            │
│  ├── Sharp (Procesamiento imágenes)                         │
│  └── PDFKit (Generación de PDFs)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       BASE DE DATOS                          │
│  PostgreSQL                                                  │
│  ├── Usuarios                                               │
│  ├── Pacientes                                              │
│  ├── Genogramas (JSON)                                      │
│  ├── Personas                                               │
│  └── Relaciones                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICIOS                              │
│  ├── Vercel (Frontend hosting)                              │
│  ├── Railway / Render (Backend + DB)                        │
│  ├── Cloudinary (Almacenamiento imágenes)                   │
│  └── Resend (Emails transaccionales)                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Estructura de Carpetas (Actualizada)

```
genograph-pro/
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── DragPanel/              # Panel lateral de símbolos
│   │   │   │   ├── DragPanel.tsx       # Contenedor principal
│   │   │   │   ├── DraggableSymbol.tsx # Símbolo arrastrable
│   │   │   │   └── SymbolCategory.tsx  # Categorías (personas, relaciones)
│   │   │   │
│   │   │   ├── FamilyTree/             # Lista de miembros agregados
│   │   │   │   ├── FamilyTree.tsx      # Árbol estructurado de familia
│   │   │   │   ├── MemberCard.tsx      # Tarjeta de cada miembro
│   │   │   │   ├── DropZone.tsx        # Zona donde se sueltan símbolos
│   │   │   │   └── GenerationRow.tsx   # Fila por generación
│   │   │   │
│   │   │   ├── MemberForm/             # Formulario de datos
│   │   │   │   ├── MemberForm.tsx      # Formulario principal
│   │   │   │   ├── BasicInfoFields.tsx # Nombre, edad, género
│   │   │   │   ├── StatusFields.tsx    # Vivo, fallecido, fecha
│   │   │   │   ├── RelationFields.tsx  # Seleccionar parentesco
│   │   │   │   └── NotesFields.tsx     # Observaciones clínicas
│   │   │   │
│   │   │   ├── GenogramView/           # Visualización automática
│   │   │   │   ├── GenogramView.tsx    # Contenedor React Flow
│   │   │   │   ├── PersonNode.tsx      # Nodo de persona
│   │   │   │   ├── ConnectionEdge.tsx  # Línea de conexión
│   │   │   │   ├── EmotionalEdge.tsx   # Relación emocional
│   │   │   │   └── AutoLayout.ts       # Algoritmo Dagre
│   │   │   │
│   │   │   ├── Symbols/                # Símbolos GenoPro SVG
│   │   │   │   ├── Male.tsx
│   │   │   │   ├── Female.tsx
│   │   │   │   ├── Unknown.tsx
│   │   │   │   ├── Pregnancy.tsx
│   │   │   │   ├── Pet.tsx
│   │   │   │   ├── Deceased.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── Toolbar/
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   ├── ExportButton.tsx
│   │   │   │   ├── UndoRedo.tsx
│   │   │   │   └── ZoomControls.tsx
│   │   │   │
│   │   │   └── ui/                     # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── card.tsx
│   │   │       └── form.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDragAndDrop.ts       # Lógica drag & drop
│   │   │   ├── useAutoLayout.ts        # Calcular posiciones
│   │   │   ├── useFamilyTree.ts        # Gestión del árbol
│   │   │   ├── useGenogram.ts          # Estado del genograma
│   │   │   ├── useExport.ts            # Exportar PNG/PDF/SVG
│   │   │   └── useAutoSave.ts          # Guardado automático
│   │   │
│   │   ├── stores/
│   │   │   ├── familyStore.ts          # Miembros y relaciones
│   │   │   ├── uiStore.ts              # Estado de UI
│   │   │   └── userStore.ts            # Usuario actual
│   │   │
│   │   ├── lib/
│   │   │   ├── layoutEngine.ts         # Motor de layout Dagre
│   │   │   ├── relationshipRules.ts    # Reglas de parentesco válido
│   │   │   └── genogramExport.ts       # Lógica de exportación
│   │   │
│   │   ├── types/
│   │   │   ├── person.ts
│   │   │   ├── relation.ts
│   │   │   ├── genogram.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Settings.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── genogramController.ts
│   │   │   └── patientController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── genogramRoutes.ts
│   │   │   └── patientRoutes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── genogramService.ts
│   │   │   ├── exportService.ts
│   │   │   └── emailService.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── hash.ts
│   │   │   └── pdf.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types/
│       ├── person.ts
│       ├── relation.ts
│       └── genogram.ts
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── docker-compose.yml
├── .env.example
├── README.md
└── package.json
```

---

## 4. Modelos de Datos

### 4.1 Esquema de Base de Datos (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  password      String
  name          String
  profession    String?
  avatar        String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  patients      Patient[]
  genograms     Genogram[]
}

model Patient {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  
  // Datos de identificación
  name          String
  birthDate     DateTime?
  gender        Gender
  occupation    String?
  religion      String?
  address       String?
  phone         String?
  email         String?
  civilStatus   CivilStatus?
  socioeconomic String?
  
  // Datos clínicos
  consultReason String?     @db.Text
  notes         String?     @db.Text
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  genograms     Genogram[]
}

model Genogram {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  patientId     String?
  patient       Patient?    @relation(fields: [patientId], references: [id])
  
  title         String
  description   String?
  examiner      String?
  examDate      DateTime?
  
  // Datos del canvas (JSON)
  canvasData    Json
  
  // Metadatos
  thumbnail     String?
  isPublic      Boolean     @default(false)
  shareToken    String?     @unique
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  versions      GenogramVersion[]
}

model GenogramVersion {
  id            String      @id @default(cuid())
  genogramId    String
  genogram      Genogram    @relation(fields: [genogramId], references: [id])
  
  canvasData    Json
  createdAt     DateTime    @default(now())
}

enum Gender {
  MALE
  FEMALE
  OTHER
  UNKNOWN
}

enum CivilStatus {
  SINGLE
  MARRIED
  DIVORCED
  WIDOWED
  FREE_UNION
  SEPARATED
}
```

### 4.2 Estructura del Canvas (JSON)

```typescript
// types/genogram.ts

interface Genogram {
  id: string;
  version: string; // "1.0.0"
  metadata: {
    title: string;
    description?: string;
    examiner?: string;
    examDate?: string;
    createdAt: string;
    updatedAt: string;
  };
  canvas: {
    width: number;
    height: number;
    zoom: number;
    offsetX: number;
    offsetY: number;
    backgroundColor: string;
    showGrid: boolean;
  };
  persons: Person[];
  familyRelations: FamilyRelation[];
  emotionalRelations: EmotionalRelation[];
  annotations: Annotation[];
}

interface Person {
  id: string;
  type: 'male' | 'female' | 'unknown' | 'pregnancy' | 'miscarriage' | 'abortion' | 'pet';
  
  // Posición en canvas
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Datos personales
  data: {
    firstName: string;
    lastName: string;
    birthDate?: string;
    deathDate?: string;
    age?: number;
    occupation?: string;
    notes?: string;
    medicalConditions?: string[];
    photo?: string;
  };
  
  // Estado
  isDeceased: boolean;
  isIdentifiedPatient: boolean;
  isPrimaryCaregiver: boolean;
  isAbsent: boolean;
  
  // Estilo
  style: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

interface FamilyRelation {
  id: string;
  type: 'marriage' | 'freeUnion' | 'separated' | 'divorced' | 'engagement';
  person1Id: string;
  person2Id: string;
  
  // Datos
  date?: string;
  endDate?: string;
  
  // Hijos de esta unión
  childrenIds: string[];
  
  // Estilo de línea
  style: {
    strokeColor?: string;
    strokeWidth?: number;
  };
}

interface EmotionalRelation {
  id: string;
  type: 'close' | 'veryClose' | 'fused' | 'distant' | 'hostile' | 'cutoff' | 'abuse' | 'ambivalent';
  person1Id: string;
  person2Id: string;
  
  label?: string;
  notes?: string;
  
  // Estilo
  style: {
    strokeColor?: string;
    strokeWidth?: number;
    dashArray?: number[];
  };
}

interface Annotation {
  id: string;
  type: 'text' | 'box' | 'legend';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  style: {
    fontSize?: number;
    fontColor?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
}
```

### 4.3 Motor de Layout Automático (Dagre.js)

El corazón de la aplicación es el motor de layout que **calcula automáticamente** las posiciones de todos los elementos.

#### Reglas del Motor de Layout

```typescript
// lib/layoutEngine.ts

interface LayoutConfig {
  // Espaciado entre generaciones (vertical)
  generationGap: 120;
  
  // Espaciado entre personas en la misma generación
  siblingGap: 80;
  
  // Espaciado entre parejas
  coupleGap: 40;
  
  // Tamaño de símbolos
  nodeWidth: 60;
  nodeHeight: 60;
  
  // Margen del canvas
  padding: 50;
}

// Algoritmo de posicionamiento
function calculateLayout(familyData: FamilyData): LayoutResult {
  // 1. Identificar generaciones
  const generations = identifyGenerations(familyData);
  
  // 2. Agrupar parejas en cada generación
  const couples = groupCouples(familyData);
  
  // 3. Posicionar de arriba hacia abajo (abuelos → padres → hijos)
  // 4. Centrar hijos debajo de sus padres
  // 5. Evitar overlaps entre nodos
  // 6. Centrar todo el árbol horizontalmente
  
  return positions;
}
```

#### Reglas de Posicionamiento

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REGLAS DE LAYOUT AUTOMÁTICO                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ GENERACIONES VERTICALES                                         │
│     - Gen 1 (más vieja) arriba                                      │
│     - Cada generación 120px más abajo                               │
│                                                                      │
│  2️⃣ PAREJAS CENTRADAS                                               │
│     - Cónyuges lado a lado (40px gap)                               │
│     - Línea horizontal los conecta                                  │
│                                                                      │
│  3️⃣ HIJOS DEBAJO DE PADRES                                          │
│     - Línea vertical desde el centro de la pareja                   │
│     - Hijos centrados respecto a padres                             │
│     - Hermanos con 80px de separación                               │
│                                                                      │
│  4️⃣ EVITAR COLISIONES                                               │
│     - Si dos nodos se solapan, expandir horizontalmente             │
│     - Mínimo 60px entre cualquier par de nodos                      │
│                                                                      │
│  5️⃣ LÍNEAS DE CONEXIÓN                                              │
│     - Matrimonio: línea horizontal sólida                           │
│     - Padre-Hijo: línea vertical + horizontal                       │
│     - Gemelos: líneas convergentes desde mismo punto                │
│                                                                      │
│  6️⃣ RELACIONES EMOCIONALES                                          │
│     - Se dibujan encima de todo                                     │
│     - Curvas bezier para no cruzar otros elementos                  │
│     - Color y patrón según tipo de relación                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Ejemplo Visual del Motor

```
                    ENTRADA (Datos del Formulario)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  {                                                                   │
│    "members": [                                                      │
│      { "id": "1", "name": "Roberto", "gender": "M", "gen": 1 },     │
│      { "id": "2", "name": "Ana", "gender": "F", "gen": 1 },         │
│      { "id": "3", "name": "Mariana", "gender": "F", "gen": 2,       │
│        "parents": ["1", "2"], "isPatient": true }                   │
│    ],                                                                │
│    "relations": [                                                    │
│      { "type": "marriage", "between": ["1", "2"] }                  │
│    ]                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    MOTOR DE LAYOUT (Dagre.js)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    SALIDA (Posiciones Calculadas)                    │
│                                                                      │
│                     x:150       x:250                                │
│                     ┌───┐       ┌───┐                                │
│          y:50       │ ⬛ │───────│ ⚪ │                                │
│                     └─┬─┘       └─┬─┘                                │
│                       └─────┬─────┘                                  │
│                             │                                        │
│                     x:200   │                                        │
│                     ┌───────┴───────┐                                │
│          y:170      │     ⚪ ★       │                                │
│                     │    Mariana    │                                │
│                     └───────────────┘                                │
│                                                                      │
│  Nodos: [                                                            │
│    { id: "1", x: 150, y: 50, width: 60, height: 60 },              │
│    { id: "2", x: 250, y: 50, width: 60, height: 60 },              │
│    { id: "3", x: 200, y: 170, width: 60, height: 60 }              │
│  ]                                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Validaciones de Parentesco

```typescript
// lib/relationshipRules.ts

// Relaciones permitidas según el miembro ya existente
const allowedRelations = {
  // Si ya existe un hombre...
  male: ['wife', 'exWife', 'son', 'daughter', 'father', 'mother'],
  
  // Si ya existe una mujer...
  female: ['husband', 'exHusband', 'son', 'daughter', 'father', 'mother'],
  
  // Validaciones de lógica
  rules: [
    // No puede ser su propio padre/madre
    { deny: (a, b) => a.id === b.parentOf },
    
    // No puede ser padre de alguien mayor
    { deny: (parent, child) => parent.birthDate > child.birthDate },
    
    // Máximo 2 padres biológicos
    { deny: (child) => child.parents.length >= 2 },
    
    // No puede casarse consigo mismo
    { deny: (a, b) => a.id === b.id },
  ]
};

// Generar opciones dinámicas en el formulario
function getAvailableRelations(newPerson, existingMembers) {
  // Retorna solo las relaciones válidas para el dropdown
}
```

---

## 5. API REST

### 5.1 Endpoints

#### Autenticación
```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
POST   /api/auth/logout       - Cerrar sesión
POST   /api/auth/refresh      - Refrescar token
POST   /api/auth/forgot       - Recuperar contraseña
POST   /api/auth/reset        - Restablecer contraseña
```

#### Usuarios
```
GET    /api/users/me          - Obtener perfil
PUT    /api/users/me          - Actualizar perfil
DELETE /api/users/me          - Eliminar cuenta
PUT    /api/users/me/avatar   - Actualizar avatar
```

#### Pacientes
```
GET    /api/patients          - Listar pacientes
POST   /api/patients          - Crear paciente
GET    /api/patients/:id      - Obtener paciente
PUT    /api/patients/:id      - Actualizar paciente
DELETE /api/patients/:id      - Eliminar paciente
GET    /api/patients/:id/genograms - Genogramas del paciente
```

#### Genogramas
```
GET    /api/genograms         - Listar genogramas
POST   /api/genograms         - Crear genograma
GET    /api/genograms/:id     - Obtener genograma
PUT    /api/genograms/:id     - Actualizar genograma
DELETE /api/genograms/:id     - Eliminar genograma
POST   /api/genograms/:id/duplicate - Duplicar genograma
GET    /api/genograms/:id/versions  - Historial de versiones
POST   /api/genograms/:id/share     - Generar link compartir
GET    /api/genograms/shared/:token - Ver genograma compartido
```

#### Exportación
```
POST   /api/export/png        - Exportar a PNG
POST   /api/export/pdf        - Exportar a PDF
POST   /api/export/svg        - Exportar a SVG
POST   /api/export/report     - Generar reporte clínico
```

---

## 6. Interfaz de Usuario (NUEVO FLUJO)

### 6.1 Flujo Principal: Drag → Form → Auto-Generate

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  🧬 GenoGraph Pro      [💾 Guardar] [📤 Exportar ▼] [🔗 Compartir]       👤 Laura │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌────────────────────────────┐  ┌─────────────────────────┐  │
│  │  SÍMBOLOS   │  │    ÁRBOL FAMILIAR           │  │  GENOGRAMA AUTOMÁTICO   │  │
│  │  (Arrastrar)│  │    (Miembros agregados)     │  │  (Vista previa)          │  │
│  │             │  │                              │  │                          │  │
│  │ ┌─────────┐ │  │  ══════ GENERACIÓN 1 ══════ │  │      ┌───┐   ┌───┐       │  │
│  │ │   🔲    │ │  │                              │  │      │ ⬛ │───│ ⚪ │       │  │
│  │ │ Hombre  │ │  │  [Arrastra aquí un símbolo] │  │      └─┬─┘   └─┬─┘       │  │
│  │ └─────────┘ │  │                              │  │        │       │         │  │
│  │ ┌─────────┐ │  │  ══════ GENERACIÓN 2 ══════ │  │        └───┬───┘         │  │
│  │ │   ⚪    │ │  │                              │  │            │             │  │
│  │ │ Mujer   │ │  │  [Arrastra aquí un símbolo] │  │       ┌────┼────┐        │  │
│  │ └─────────┘ │  │                              │  │     ┌─┴─┐┌─┴─┐┌─┴─┐      │  │
│  │ ┌─────────┐ │  │  ══════ GENERACIÓN 3 ══════ │  │     │ ⬛ ││⚪★││ ⬛ │      │  │
│  │ │   ◇     │ │  │                              │  │     └───┘└───┘└───┘      │  │
│  │ │Desconoc.│ │  │  [Arrastra aquí un símbolo] │  │      Juan Mariana Pedro  │  │
│  │ └─────────┘ │  │                              │  │                          │  │
│  │ ┌─────────┐ │  └────────────────────────────┘  │  [🔄 Regenerar Layout]     │  │
│  │ │   △     │ │                                   │                          │  │
│  │ │Embarazo │ │  ┌────────────────────────────┐  │  [📥 Exportar PNG]        │  │
│  │ └─────────┘ │  │  FORMULARIO DE DATOS        │  │  [📄 Exportar PDF]        │  │
│  │ ┌─────────┐ │  │                              │  │                          │  │
│  │ │   🐾    │ │  │  Nombre: [________________] │  └─────────────────────────┘  │
│  │ │ Mascota │ │  │  Género: [Mujer ▼]          │                               │
│  │ └─────────┘ │  │  Nacimiento: [__/__/____]   │                               │
│  │             │  │  Estado: [○ Vivo ● Fallec.] │                               │
│  │ ─────────── │  │  Fallecimiento: [__/__/___] │                               │
│  │ RELACIONES  │  │                              │                               │
│  │ ┌─────────┐ │  │  Relación: [Es hijo/a de ▼] │                               │
│  │ │ ═══════ │ │  │  De: [Seleccionar padre ▼]  │                               │
│  │ │Matrimon.│ │  │                              │                               │
│  │ └─────────┘ │  │  ☑ Paciente identificado    │                               │
│  │ ┌─────────┐ │  │  ☐ Cuidador principal        │                               │
│  │ │ - - - - │ │  │                              │                               │
│  │ │Unión Lib│ │  │  Notas clínicas:            │                               │
│  │ └─────────┘ │  │  [________________________] │                               │
│  │ ┌─────────┐ │  │  [________________________] │                               │
│  │ │ ╱╲╱╲╱╲  │ │  │                              │                               │
│  │ │Conflict.│ │  │  [✓ Agregar al Árbol]       │                               │
│  │ └─────────┘ │  └────────────────────────────┘                               │
│  └─────────────┘                                                                │
│                                                                                 │
│  [↩️ Deshacer] [↪️ Rehacer]        Autoguardado: hace 30 seg                     │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Flujo de Interacción Paso a Paso

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PASO 1: ARRASTRAR SÍMBOLO                             │
│                                                                              │
│    Usuario arrastra "Mujer" desde el panel izquierdo                        │
│                                                                              │
│    ┌────────┐                ┌─────────────────────────┐                    │
│    │   ⚪   │  ─────────►    │  GENERACIÓN 2           │                    │
│    │ Mujer  │    DRAG        │  ┌─────────────────────┐│                    │
│    └────────┘                │  │ ⚪ Nuevo miembro... ││                    │
│                              │  └─────────────────────┘│                    │
│                              └─────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        PASO 2: LLENAR FORMULARIO                             │
│                                                                              │
│    Al soltar, se abre automáticamente el formulario                         │
│                                                                              │
│    ┌─────────────────────────────────────────┐                              │
│    │  📝 Agregar Familiar                     │                              │
│    │                                          │                              │
│    │  Nombre: [Mariana Carreño Chedrahui____]│                              │
│    │  Género: [Mujer ▼] (preseleccionado)    │                              │
│    │  Fecha Nac: [15/03/1988_______]         │                              │
│    │  Estado: (○) Vivo  ( ) Fallecido        │                              │
│    │                                          │                              │
│    │  ── Relación Familiar ──                 │                              │
│    │  Es: [Hija ▼]                           │                              │
│    │  De: [Roberto Carreño (Padre) ▼]        │                              │
│    │  Y de: [Ana María Chedrahui (Madre) ▼]  │                              │
│    │                                          │                              │
│    │  ☑ Marcar como paciente identificado    │                              │
│    │                                          │                              │
│    │         [Cancelar]  [✓ Agregar]          │                              │
│    └─────────────────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        PASO 3: GENOGRAMA AUTOMÁTICO                          │
│                                                                              │
│    El sistema calcula posiciones y genera el genograma                      │
│                                                                              │
│                    ┌───┐         ┌───┐                                      │
│                    │ ⬛ │─────────│ ⚪ │    ← Generación 1 (Abuelos)          │
│                    │ 85 │         │ 82 │                                      │
│                    └─┬─┘         └─┬─┘                                      │
│                      └──────┬──────┘                                         │
│                             │                                                │
│              ┌──────────────┼──────────────┐                                │
│            ┌─┴─┐          ┌─┴─┐          ┌─┴─┐   ← Generación 2 (Padres)    │
│            │ ⬛ │──────────│ ⚪ │          │ ⬛ │                              │
│            │ 62 │          │ 58 │          │ 55 │                              │
│            └─┬─┘          └─┬─┘          └───┘                              │
│              └──────┬───────┘                                                │
│                     │                                                        │
│        ┌────────────┼────────────┐                                          │
│      ┌─┴─┐       ┌──┴──┐      ┌─┴─┐   ← Generación 3 (Paciente)            │
│      │ ⬛ │       │⚪ ★  │      │ ⚪ │                                          │
│      │ 38 │       │ 36  │      │ 32 │                                          │
│      └───┘       └─────┘      └───┘                                          │
│      Juan        Mariana      Laura                                          │
│                  (Paciente)                                                  │
│                                                                              │
│    ✨ Layout calculado automáticamente por Dagre.js                         │
│    ✨ Líneas y conexiones dibujadas por React Flow                          │
│    ✨ Usuario NO tuvo que alinear nada manualmente                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Panel de Símbolos Disponibles (GenoPro Standard)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SÍMBOLOS ARRASTRABLES (Panel Izquierdo)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ═══════ PERSONAS ═══════                                                    │
│                                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                             │
│  │  ┌──┐  │  │  (  )  │  │   ◇    │  │   △    │                             │
│  │  │  │  │  │       │  │        │  │  / \   │                             │
│  │  └──┘  │  │  (  )  │  │   ◇    │  │ /   \  │                             │
│  │ Hombre │  │ Mujer  │  │ Descon.│  │Embarazo│                             │
│  └────────┘  └────────┘  └────────┘  └────────┘                             │
│                                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                             │
│  │   △    │  │   △    │  │  ┌──┐  │  │  ◇🐾  │                             │
│  │  / X   │  │  /╲    │  │  │╲╱│  │  │       │                             │
│  │ /   \  │  │ ╱  ╲   │  │  └──┘  │  │  ◇    │                             │
│  │Pérdida │  │ Aborto │  │Fallec. │  │Mascota │                             │
│  └────────┘  └────────┘  └────────┘  └────────┘                             │
│                                                                              │
│  ═══════ UNIONES ═══════                                                     │
│                                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                             │
│  │────────│  │- - - - │  │───/────│  │──//───│                             │
│  │Matrimo.│  │Unión L.│  │Separac.│  │Divorcio│                             │
│  └────────┘  └────────┘  └────────┘  └────────┘                             │
│                                                                              │
│  ═══════ EMOCIONALES ═══════                                                 │
│                                                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                             │
│  │════════│  │≡≡≡≡≡≡≡≡│  │........│  │╱╲╱╲╱╲╱│                             │
│  │Cercana │  │Fusión  │  │Distante│  │Hostil  │                             │
│  └────────┘  └────────┘  └────────┘  └────────┘                             │
│                                                                              │
│  ┌────────┐  ┌────────┐                                                     │
│  │───X────│  │→──────→│                                                     │
│  │ Corte  │  │ Abuso  │                                                     │
│  └────────┘  └────────┘                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Vista del Árbol Familiar (Lista Estructurada)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ÁRBOL FAMILIAR - Lista de Miembros por Generación                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ══════ GENERACIÓN 1 (Abuelos) ══════                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔲 Roberto Carreño Ruiz (85) - Abuelo paterno              [✏️] [🗑️]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚪ María Luisa García (82†) - Abuela paterna                [✏️] [🗑️]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ══════ GENERACIÓN 2 (Padres) ══════                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔲 Roberto Carreño García (62) - Padre                     [✏️] [🗑️]│   │
│  │    └─ Casado con Ana María                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚪ Ana María Chedrahui (58) - Madre                        [✏️] [🗑️]│   │
│  │    └─ Casada con Roberto                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ══════ GENERACIÓN 3 (Paciente y Hermanos) ══════                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚪★ Mariana Carreño Chedrahui (36) - PACIENTE              [✏️] [🗑️]│   │
│  │    └─ Hija de Roberto y Ana María                                   │   │
│  │    └─ 🐾 Dueña de: Simón (Gato †)                                   │   │
│  │    └─ 💚 Cercana con: Ana María (madre)                             │   │
│  │    └─ 📏 Distante con: Roberto (padre)                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔲 Juan Carreño Chedrahui (38) - Hermano mayor             [✏️] [🗑️]│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ══════ MASCOTAS ══════                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🐾 Simón (†) - Gato, 12 años                               [✏️] [🗑️]│   │
│  │    └─ Mascota de: Mariana                                           │   │
│  │    └─ Causa: Enfermedad renal crónica                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  [+ Agregar desde símbolos]                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.5 Paleta de Colores

```css
:root {
  /* Primarios */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Símbolos GenoPro */
  --male-fill: #e3f2fd;
  --male-stroke: #1976d2;
  --female-fill: #fce4ec;
  --female-stroke: #c2185b;
  --unknown-fill: #eceff1;
  --unknown-stroke: #607d8b;
  --pregnancy-fill: #f3e5f5;
  --pregnancy-stroke: #8e44ad;
  --pet-fill: #fff3e0;
  --pet-stroke: #f57c00;
  
  /* Relaciones */
  --relation-close: #27ae60;
  --relation-distant: #95a5a6;
  --relation-hostile: #e74c3c;
  --relation-cutoff: #c0392b;
  
  /* UI */
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
}
```

---

## 7. Simbología GenoPro Estándar

### 7.1 Personas

| Símbolo | Código | Descripción |
|---------|--------|-------------|
| ◻️ | `male` | Hombre |
| ⚪ | `female` | Mujer |
| ◇ | `unknown` | Sexo desconocido |
| △ | `pregnancy` | Embarazo en curso |
| △✗ | `miscarriage` | Aborto espontáneo |
| △✗ | `abortion` | Aborto inducido |
| ◇🐾 | `pet` | Mascota significativa |

### 7.2 Modificadores

| Símbolo | Descripción |
|---------|-------------|
| ✗ (diagonal) | Persona fallecida |
| Doble borde | Paciente identificado |
| Borde naranja | Cuidador principal |
| Borde punteado | Persona ausente |
| ? interior | Identidad desconocida |

### 7.3 Relaciones de Pareja

| Línea | Código | Descripción |
|-------|--------|-------------|
| ─── | `marriage` | Matrimonio |
| - - - | `freeUnion` | Unión libre |
| ──/── | `separated` | Separación |
| ──//── | `divorced` | Divorcio |
| ··· | `engagement` | Compromiso |

### 7.4 Relaciones Emocionales

| Línea | Código | Color | Descripción |
|-------|--------|-------|-------------|
| ══ | `close` | Verde | Cercana |
| ≡≡≡ | `veryClose` | Verde | Muy cercana |
| ════ | `fused` | Verde | Fusionada |
| ┈┈┈ | `distant` | Gris | Distante |
| ╱╲╱╲ | `hostile` | Rojo | Hostil/Conflictiva |
| ──✗── | `cutoff` | Rojo | Corte/Ruptura |
| →→ | `abuse` | Rojo | Abuso |
| ══┈┈ | `ambivalent` | Naranja | Ambivalente |

---

## 8. Cronograma de Desarrollo

### Fase 1: MVP (6 semanas)

| Semana | Actividad |
|--------|-----------|
| 1 | Setup proyecto, estructura base, Canvas básico |
| 2 | Símbolos de personas, drag & drop |
| 3 | Conexiones familiares (matrimonio, hijos) |
| 4 | Panel de propiedades, edición de datos |
| 5 | Guardar/cargar local, exportar PNG |
| 6 | Testing, correcciones, deploy MVP |

### Fase 2: Mejoras (4 semanas)

| Semana | Actividad |
|--------|-----------|
| 7 | Relaciones emocionales, líneas avanzadas |
| 8 | Templates, auto-layout básico |
| 9 | Deshacer/rehacer, exportar PDF/SVG |
| 10 | Testing, optimización, deploy v1.0 |

### Fase 3: Profesional (6 semanas)

| Semana | Actividad |
|--------|-----------|
| 11 | Backend: Auth, usuarios |
| 12 | Backend: CRUD genogramas |
| 13 | Gestión de pacientes |
| 14 | Almacenamiento en nube |
| 15 | Compartir, colaboración básica |
| 16 | Testing, seguridad, deploy v2.0 |

---

## 9. Requisitos No Funcionales

### 9.1 Rendimiento
- Tiempo de carga inicial: < 3 segundos
- Renderizado del canvas: 60 FPS
- Guardado automático: < 500ms
- Exportar PNG (1080p): < 2 segundos

### 9.2 Seguridad
- HTTPS obligatorio
- Autenticación JWT con refresh tokens
- Contraseñas hasheadas (bcrypt)
- Validación de inputs
- Rate limiting en API
- CORS configurado

### 9.3 Compatibilidad
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Responsive: 320px - 4K

### 9.4 Accesibilidad
- WCAG 2.1 AA
- Navegación por teclado
- Alto contraste disponible
- Labels en formularios

---

## 10. Estimación de Costos

### 10.1 Infraestructura Mensual

| Servicio | Plan | Costo/mes |
|----------|------|-----------|
| Vercel | Pro | $20 USD |
| Railway | Starter | $5 USD |
| PostgreSQL (Railway) | Incluido | $0 |
| Cloudinary | Free tier | $0 |
| Dominio | Anual/12 | ~$1 USD |
| **Total** | | **~$26 USD/mes** |

### 10.2 Escalabilidad

| Usuarios | Infra estimada |
|----------|---------------|
| 1-100 | $26/mes |
| 100-1000 | $50-80/mes |
| 1000-10000 | $150-300/mes |

---

## 11. Criterios de Aceptación

### MVP Completado cuando:

- [ ] Usuario puede agregar personas de todos los tipos
- [ ] Usuario puede mover personas con drag & drop
- [ ] Usuario puede conectar parejas y agregar hijos
- [ ] Usuario puede marcar personas como fallecidas
- [ ] Usuario puede editar datos de cada persona
- [ ] Usuario puede guardar genograma como archivo
- [ ] Usuario puede cargar genograma desde archivo
- [ ] Usuario puede exportar a PNG
- [ ] La aplicación funciona en móvil (básico)

---

## 12. Anexos

### 12.1 Referencias

- [GenoPro - Software actual](https://www.genopro.com/)
- [Simbología estándar de genogramas](https://www.genopro.com/genogram/symbols/)
- [Konva.js - Documentación](https://konvajs.org/docs/)
- [React-Konva](https://konvajs.org/docs/react/)

### 12.2 Ejemplos de Genogramas

Ver archivos generados en este proyecto:
- `genograma_paciente1_v2.html` - Duelo por mascota
- `genograma_paciente2_v2.html` - Duelo adolescente
- `genograma_paciente3_v2.html` - Duelo perinatal

Estos sirven como referencia visual del resultado esperado.

---

## 13. Contacto

| Rol | Persona |
|-----|---------|
| Cliente/Usuario principal | Laura Liliana Arias Bravo |
| Product Owner | Frank |
| Arquitectura | INTEGRA - Arquitecto |
| Desarrollo | SOFIA - Builder |

---

*Documento generado: 9 de enero de 2026*
*Versión: 1.0*
