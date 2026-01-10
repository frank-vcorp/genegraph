// Types para el sistema de genogramas

export type Gender = 'male' | 'female' | 'unknown' | 'pet';
export type Status = 'alive' | 'deceased' | 'miscarriage' | 'abortion';
export type RelationType = 'marriage' | 'free_union' | 'separation' | 'divorce';
export type EmotionalType = 'close' | 'very_close' | 'distant' | 'conflict' | 'cutoff' | 'abuse';

export interface PersonAttributes {
  status: Status;
  isPrimaryPatient: boolean;
  isPrimaryCareiver: boolean;
  conditions: string[]; // Lista de condiciones médicas: 'diabetes', 'depression', 'alcoholism', etc.
}

export interface Position {
  x: number;
  y: number;
}

export interface Person {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth?: string;
  dateOfDeath?: string;
  age?: number;
  occupation?: string;
  notes?: string;
  attributes: PersonAttributes;
  photo?: string;
  generation: number;
  position?: Position; // Para persistencia gráfica en React Flow
}

// Tipos para React Flow
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
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType | EmotionalType;
}

export interface Genogram {
  id: string;
  userId: string;
  pacientName: string;
  createdAt: Date;
  updatedAt: Date;
  persons: Person[];
  connections: Connection[];
  metadata: {
    motivoConsulta?: string;
    examinador?: string;
    fecha?: string;
  };
}

// Utilidades para IDs seguros
export const generateId = (prefix: string): string => {
  return `${prefix}_${typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString(36)}`;
};

// Opciones de condiciones médicas disponibles
export const MEDICAL_CONDITIONS = [
  { id: 'diabetes', name: 'Diabetes', icon: '🩸', color: '#ff6b6b' },
  { id: 'depression', name: 'Depresión', icon: '😔', color: '#4ecdc4' },
  { id: 'alcoholism', name: 'Alcoholismo', icon: '🍷', color: '#f0ad4e' },
  { id: 'cancer', name: 'Cáncer', icon: '🔴', color: '#d64545' },
  { id: 'heart_disease', name: 'Cardiopatía', icon: '❤️', color: '#e74c3c' },
  { id: 'schizophrenia', name: 'Esquizofrenia', icon: '🧠', color: '#9b59b6' },
  { id: 'bipolar', name: 'Trastorno Bipolar', icon: '⚡', color: '#f39c12' },
  { id: 'anxiety', name: 'Ansiedad', icon: '😰', color: '#3498db' },
  { id: 'hypertension', name: 'Hipertensión', icon: '⚠️', color: '#c0392b' },
  { id: 'dementia', name: 'Demencia', icon: '🧓', color: '#95a5a6' },
];

// Opciones de vínculos emocionales
export const EMOTIONAL_BONDS = [
  { id: 'close', name: 'Cercano/Armónico', icon: '💚', color: '#27ae60' },
  { id: 'very_close', name: 'Muy Cercano/Fusionado', icon: '💚💚', color: '#1e8449' },
  { id: 'distant', name: 'Distante', icon: '⚪', color: '#bdc3c7' },
  { id: 'conflict', name: 'Conflictivo/Hostil', icon: '⚡', color: '#e74c3c' },
  { id: 'cutoff', name: 'Corte/Ruptura', icon: '✂️', color: '#34495e' },
  { id: 'abuse', name: 'Abuso', icon: '⚠️', color: '#c0392b' },
];
