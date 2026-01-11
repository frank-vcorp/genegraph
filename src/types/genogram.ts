// Types para el sistema de genogramas v2.0
// Actualizado según Arquitectura de Negocio (GenoPro parity)

// ============= FECHAS AVANZADAS =============
export type DatePrecision = 'exact' | 'about' | 'before' | 'after' | 'unknown';

export interface GenoDate {
  date: string; // ISO 8601 YYYY-MM-DD
  precision: DatePrecision;
  display?: string; // Override manual opcional, ej: "Invierno 1990"
}

// ============= GÉNERO Y REPRODUCCIÓN =============
export type Gender = 'male' | 'female' | 'trans_male' | 'trans_female' | 'other' | 'unknown';
export type PregnancyStatus = 'none' | 'pregnant' | 'miscarriage' | 'abortion' | 'stillbirth';
export type TwinType = 'identical' | 'fraternal' | 'unknown';

// ============= CONDICIONES MÉDICAS ESTRUCTURADAS =============
export interface MedicalCondition {
  id: string;
  code?: string; // CIE-10 / DSM-5 opcional
  name: string;
  status: 'active' | 'remission' | 'cured' | 'chronic' | 'carrier';
  onsetDate?: GenoDate;
  endDate?: GenoDate;
  notes?: string;
  // Visual
  color?: string; // Hexadecimal para override
}

export interface SubstanceUse {
  substance: 'alcohol' | 'tobacco' | 'drugs' | 'medication' | 'other';
  amount?: string;
  frequency?: string;
  inRecovery: boolean;
  notes?: string;
}

// ============= PERSONA EXPANDIDA =============
export type Status = 'alive' | 'deceased' | 'miscarriage' | 'abortion' | 'stillbirth';

export interface PersonAttributes {
  status: Status;
  isPrimaryPatient: boolean;
  isPrimaryCareiver: boolean;
  // Obsoleto (backward compatibility): conditions?: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Person {
  id: string;
  // Identidad
  firstName: string;
  lastName: string;
  alias?: string;
  name?: string; // Deprecated: usar firstName + lastName
  gender: Gender;
  
  // Ciclo Vital
  birthDate?: GenoDate;
  dateOfBirth?: string; // Deprecated: usar birthDate
  deathDate?: GenoDate;
  dateOfDeath?: string; // Deprecated: usar deathDate
  isDeceased: boolean;
  blockAgeCalculation: boolean; // Para ocultar edad cuando no se conoce
  age?: number; // Calculated, no guardar en BD
  
  // Genética y Reproducción
  pregnancyStatus?: PregnancyStatus; // Para visualizar embarazo, aborto, etc.
  twinGroupId?: string; // ID compartido para dibujar arcos de gemelos
  twinType?: TwinType; // Solo si twinGroupId definido
  
  // Datos Clínicos (Arrays estructurados)
  medicalConditions: MedicalCondition[];
  substanceUse?: SubstanceUse[];
  
  // Layout & Visual
  generation: number; // Swimlane Y-axis (profundidad en árbol)
  position?: Position; // Para persistencia gráfica en React Flow (legacy)
  x?: number; // Coordenada X en canvas
  y?: number; // Coordenada Y en canvas (puede ser override de generation)
  
  // Atributos tradicionales
  occupation?: string;
  notes?: string;
  attributes: PersonAttributes;
  photo?: string;
  
  // Metadatos
  tags: string[]; // Etiquetas libres: "cuidador", "vive en casa", etc.
  createdAt: number;
  updatedAt: number;
}

// ============= RELACIONES COMPLEJAS (Dual-Layer) =============
export type LineageType = 'biological' | 'adoptive' | 'foster' | 'donor';
export type PartnershipType = 'marriage' | 'cohabitation' | 'separation' | 'divorce' | 'widowhood' | 'free_union';
export type EmotionalInteraction = 
  | 'conflicted'      // Zigzag rojo
  | 'distant'         // Punteada gris
  | 'close'           // Doble línea verde
  | 'fused'           // Triple línea verde
  | 'fused_hostile'   // Triple + Zigzag
  | 'cutoff'          // Cortada
  | 'abuse_physical'  // Flecha gruesa roja
  | 'abuse_emotional' // Flecha gruesa naranja
  | 'unknown';        // ?

// Edge Lógico (Guardado en Firestore)
export interface Relationship {
  id: string;
  person1Id: string;
  person2Id: string;
  
  // Capa 1: Parentesco (Linaje)
  isLineage: boolean; // Si es true, define estructura del árbol
  lineageType?: LineageType; // biological, adoptive, foster, donor
  
  // Capa 2: Pareja (Relación horizontal)
  isPartnership: boolean;
  partnershipType?: PartnershipType;
  startDate?: GenoDate;
  endDate?: GenoDate; // Cuando termina matrimonio/separación
  
  // Capa 3: Emocional (Overlay visual)
  emotionalConfig?: {
    types: EmotionalInteraction[]; // Array porque pueden ser múltiples
    direction?: 'bi' | '1to2' | '2to1'; // Dirección de la interacción
  };
  
  // Metadatos
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Tipos para React Flow (Compatibilidad)
export type RelationType = PartnershipType | LineageType;
export type EmotionalType = EmotionalInteraction;

export interface GenogramNode {
  id: string;
  data: { person: Person };
  position: Position;
  type: string;
}

export interface GenogramEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType | EmotionalType;
  data?: { relationship: Relationship }; // Nuevo
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType | EmotionalType;
  // Deprecated: usar Relationship
}

export interface Genogram {
  id: string;
  userId: string;
  pacientName: string;
  createdAt: Date;
  updatedAt: Date;
  persons: Person[];
  relationships: Relationship[]; // Nuevo
  connections: Connection[]; // Deprecated
  notes?: string; // Notas clínicas adicionales
  metadata: {
    motivoConsulta?: string;
    examinador?: string;
    fecha?: string;
  };
}

// ============= UTILIDADES =============
export const generateId = (prefix: string): string => {
  return `${prefix}_${typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString(36)}`;
};

// Mapeo de condiciones médicas (Simbología GenoPro)
export const MEDICAL_CONDITIONS = [
  // Nuevas condiciones con colores de cuadrante GenoPro
  { id: 'cancer', name: 'Cáncer', icon: '🔴', color: '#FF0000', quadrant: 'top_right' }, // Rojo
  { id: 'diabetes', name: 'Diabetes', icon: '🩸', color: '#FFA500', quadrant: 'bottom_right' }, // Naranja
  { id: 'depression', name: 'Depresión', icon: '😔', color: '#4169E1', quadrant: 'top_left' }, // Azul
  { id: 'alcoholism', name: 'Alcoholismo', icon: '🍷', color: '#8B4513', quadrant: 'bottom_left' }, // Marrón
  { id: 'schizophrenia', name: 'Esquizofrenia', icon: '🧠', color: '#800080', quadrant: 'front' }, // Púrpura
  { id: 'hypertension', name: 'Hipertensión', icon: '⚠️', color: '#90EE90', quadrant: 'corner' }, // Verde claro
  { id: 'heart_disease', name: 'Cardiopatía', icon: '❤️', color: '#e74c3c', quadrant: 'top_right' },
  { id: 'bipolar', name: 'Trastorno Bipolar', icon: '⚡', color: '#f39c12', quadrant: 'bottom_left' },
  { id: 'anxiety', name: 'Ansiedad', icon: '😰', color: '#3498db', quadrant: 'top_left' },
  { id: 'dementia', name: 'Demencia', icon: '🧓', color: '#95a5a6', quadrant: 'front' },
  { id: 'ptsd', name: 'TEPT', icon: '⚡', color: '#e74c3c', quadrant: 'top_right' },
  { id: 'substance_use', name: 'Consumo de sustancias', icon: '⚠️', color: '#c0392b', quadrant: 'bottom_left' },
];

// Vínculos emocionales (Simbología GenoPro)
export const EMOTIONAL_BONDS = [
  { id: 'close', name: 'Cercano/Armónico', icon: '💚', color: '#27ae60', lineStyle: 'double' }, // Verde, doble línea
  { id: 'very_close', name: 'Muy Cercano/Fusionado', icon: '💚💚', color: '#1e8449', lineStyle: 'triple' }, // Verde oscuro, triple
  { id: 'distant', name: 'Distante', icon: '⚪', color: '#bdc3c7', lineStyle: 'dotted' }, // Gris, punteada
  { id: 'conflict', name: 'Conflictivo/Hostil', icon: '⚡', color: '#e74c3c', lineStyle: 'zigzag' }, // Rojo, zigzag
  { id: 'cutoff', name: 'Corte/Ruptura', icon: '✂️', color: '#34495e', lineStyle: 'dashed_cross' }, // Gris oscuro, cortada
  { id: 'abuse', name: 'Abuso', icon: '⚠️', color: '#c0392b', lineStyle: 'thick_arrow' }, // Rojo, flecha gruesa
  { id: 'fused', name: 'Fusionado', icon: '🔗', color: '#27ae60', lineStyle: 'triple' }, // Verde, triple
];

// Partnership types (Simbología)
export const PARTNERSHIP_TYPES = [
  { id: 'marriage', name: 'Matrimonio', icon: '💍', lineStyle: 'solid_horizontal' },
  { id: 'cohabitation', name: 'Convivencia', icon: '🏠', lineStyle: 'double_horizontal' },
  { id: 'free_union', name: 'Unión libre', icon: '👥', lineStyle: 'solid_horizontal' },
  { id: 'separation', name: 'Separación', icon: '👋', lineStyle: 'dashed_horizontal' },
  { id: 'divorce', name: 'Divorcio', icon: '💔', lineStyle: 'solid_with_x' },
  { id: 'widowhood', name: 'Viudez', icon: '🖤', lineStyle: 'solid_horizontal' },
];

