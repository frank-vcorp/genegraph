/**
 * Lógica de Layout para GenoGraph v2.0
 * Auto-layout por generación, swimlanes, snap-to-grid
 */

import { Person, Relationship } from '@/types/genogram';
import { calculateGeneration } from './relationships';

// ============= CONSTANTES =============

// Espaciamiento en el canvas
export const LAYOUT_CONFIG = {
  SWIMLANE_HEIGHT: 150, // Altura de cada banda generacional
  NODE_WIDTH: 60,
  NODE_HEIGHT: 60,
  HORIZONTAL_SPACING: 100, // Espacio entre hermanos
  VERTICAL_SPACING: 150, // Espacio entre generaciones
  SNAP_GRID: 10, // Snap to grid en píxeles
};

// ============= AUTO-LAYOUT =============

/**
 * Calcula automáticamente las coordenadas (x, y) y generación para todas las personas
 * Algoritmo:
 * 1. Calcula generation para cada persona (profundidad)
 * 2. Agrupa por generación (swimlanes)
 * 3. Distribuye horizontalmente dentro de cada grupo
 * 4. Asigna Y basado en swimlane
 * 
 * @returns Persons actualizado con x, y, generation
 */
export function autoLayoutByGeneration(
  persons: Person[],
  relationships: Relationship[]
): Person[] {
  // Paso 1: Calcular generation para cada persona
  const personsByGeneration = new Map<number, Person[]>();
  
  persons.forEach(person => {
    const gen = calculateGeneration(person.id, relationships);
    
    if (!personsByGeneration.has(gen)) {
      personsByGeneration.set(gen, []);
    }
    
    personsByGeneration.get(gen)!.push({
      ...person,
      generation: gen
    });
  });
  
  // Paso 2: Distribuir horizontalmente dentro de cada generación
  const layoutPersons: Person[] = [];
  let minX = 0;
  
  // Orden generaciones de arriba a abajo
  const generations = Array.from(personsByGeneration.keys()).sort((a, b) => a - b);
  
  generations.forEach(gen => {
    const peopleInGen = personsByGeneration.get(gen)!;
    
    // Distribuir horizontalmente
    const totalWidth = peopleInGen.length * LAYOUT_CONFIG.HORIZONTAL_SPACING;
    let startX = Math.max(0, (minX + totalWidth) / 2 - totalWidth / 2);
    
    peopleInGen.forEach((person, index) => {
      const x = startX + index * LAYOUT_CONFIG.HORIZONTAL_SPACING;
      const y = gen * LAYOUT_CONFIG.SWIMLANE_HEIGHT + LAYOUT_CONFIG.SWIMLANE_HEIGHT / 2;
      
      layoutPersons.push({
        ...person,
        x: snapToGrid(x),
        y: snapToGrid(y),
        generation: gen
      });
      
      minX = Math.max(minX, x);
    });
  });
  
  return layoutPersons;
}

/**
 * Calcula el mejor X para un nuevo nodo basado en sus hermanos
 * Mantiene espaciamiento consistente
 */
export function calculateBestXPosition(
  personId: string,
  persons: Person[],
  relationships: Relationship[]
): number {
  const person = persons.find(p => p.id === personId);
  if (!person) return 0;
  
  // Encontrar hermanos de la misma generación
  const siblings = persons.filter(
    p => p.generation === person.generation &&
         p.id !== personId &&
         p.x !== undefined
  );
  
  if (siblings.length === 0) {
    return 100; // Default position
  }
  
  // Promedio de hermanos + offset
  const avgX = siblings.reduce((sum, s) => sum + (s.x || 0), 0) / siblings.length;
  const offset = (siblings.length + 1) * (LAYOUT_CONFIG.HORIZONTAL_SPACING / 2);
  
  return snapToGrid(avgX + offset);
}

/**
 * Calcula el Y basado en generación
 * Y = generation * SWIMLANE_HEIGHT + offset dentro de la banda
 */
export function calculateYFromGeneration(generation: number): number {
  return snapToGrid(generation * LAYOUT_CONFIG.SWIMLANE_HEIGHT + LAYOUT_CONFIG.SWIMLANE_HEIGHT / 2);
}

// ============= SNAP TO GRID =============

/**
 * Redondea una coordenada al grid más cercano
 * Facilita alineación visual
 */
export function snapToGrid(value: number, gridSize: number = LAYOUT_CONFIG.SNAP_GRID): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Valida que una coordenada esté dentro de limites razonables
 */
export function isValidCoordinate(x: number, y: number): boolean {
  const MAX_COORD = 5000;
  const MIN_COORD = -5000;
  
  return x >= MIN_COORD && x <= MAX_COORD && y >= MIN_COORD && y <= MAX_COORD;
}

// ============= SWIMLANES =============

/**
 * Genera configuración de swimlanes para rendering
 * @returns Array de objetos con { generation, y, height, label }
 */
export function generateSwimlanes(maxGeneration: number): Array<{
  generation: number;
  y: number;
  height: number;
  label: string;
}> {
  const swimlanes = [];
  
  for (let gen = 0; gen <= maxGeneration; gen++) {
    swimlanes.push({
      generation: gen,
      y: gen * LAYOUT_CONFIG.SWIMLANE_HEIGHT,
      height: LAYOUT_CONFIG.SWIMLANE_HEIGHT,
      label: getGenerationLabel(gen)
    });
  }
  
  return swimlanes;
}

/**
 * Etiqueta legible para una generación
 */
export function getGenerationLabel(generation: number): string {
  const labels: Record<number, string> = {
    0: 'Generación 0 (Raíz)',
    1: 'Generación 1 (Hijos)',
    2: 'Generación 2 (Nietos)',
    3: 'Generación 3 (Bisnietos)',
    4: 'Generación 4+',
  };
  
  return labels[generation] || `Generación ${generation}`;
}

// ============= VALIDACIONES LAYOUT =============

/**
 * Valida que el layout sea consistente
 * - Ningún nodo se superpone (distancia > NODE_WIDTH)
 * - Nodos Gen N tienen Y > nodos Gen N-1
 * - Todas las coordenadas válidas
 */
export function validateLayout(persons: Person[]): boolean {
  // 1. Chequear coordenadas válidas
  for (const person of persons) {
    if (person.x !== undefined && person.y !== undefined) {
      if (!isValidCoordinate(person.x, person.y)) {
        console.warn(`Invalid coordinates for ${person.firstName}: (${person.x}, ${person.y})`);
        return false;
      }
    }
  }
  
  // 2. Chequear que generaciones están ordenadas
  for (let i = 0; i < persons.length; i++) {
    for (let j = i + 1; j < persons.length; j++) {
      const p1 = persons[i];
      const p2 = persons[j];
      
      if (p1.generation > p2.generation && p1.y !== undefined && p2.y !== undefined) {
        if (p1.y <= p2.y) {
          console.warn(
            `Generation ordering mismatch: ${p1.firstName} (gen ${p1.generation}, y=${p1.y}) ` +
            `should have y > ${p2.firstName} (gen ${p2.generation}, y=${p2.y})`
          );
          return false;
        }
      }
    }
  }
  
  return true;
}

/**
 * Detecta si dos nodos se superponen
 */
export function doNodesOverlap(
  person1: Person,
  person2: Person,
  minDistance: number = LAYOUT_CONFIG.NODE_WIDTH + 20
): boolean {
  if (person1.x === undefined || person1.y === undefined ||
      person2.x === undefined || person2.y === undefined) {
    return false;
  }
  
  const dx = person1.x - person2.x;
  const dy = person1.y - person2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance < minDistance;
}

/**
 * Resuelve superposiciones moviendo nodos
 * Algoritmo simple: empujar el segundo nodo a la derecha
 */
export function resolveSuperposition(persons: Person[]): Person[] {
  const result = [...persons];
  
  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (doNodesOverlap(result[i], result[j])) {
        // Mover person j a la derecha
        if (result[j].x !== undefined) {
          result[j].x = snapToGrid(result[j].x + LAYOUT_CONFIG.HORIZONTAL_SPACING);
        }
      }
    }
  }
  
  return result;
}

// ============= ZOOM & PAN =============

/**
 * Calcula el bounding box de todos los nodos
 * Útil para auto-fit en canvas
 */
export function calculateBoundingBox(persons: Person[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  
  persons.forEach(person => {
    if (person.x !== undefined) {
      minX = Math.min(minX, person.x - LAYOUT_CONFIG.NODE_WIDTH / 2);
      maxX = Math.max(maxX, person.x + LAYOUT_CONFIG.NODE_WIDTH / 2);
    }
    
    if (person.y !== undefined) {
      minY = Math.min(minY, person.y - LAYOUT_CONFIG.NODE_HEIGHT / 2);
      maxY = Math.max(maxY, person.y + LAYOUT_CONFIG.NODE_HEIGHT / 2);
    }
  });
  
  // Padding
  const padding = 50;
  minX -= padding;
  maxX += padding;
  minY -= padding;
  maxY += padding;
  
  return {
    minX: isFinite(minX) ? minX : 0,
    maxX: isFinite(maxX) ? maxX : 1000,
    minY: isFinite(minY) ? minY : 0,
    maxY: isFinite(maxY) ? maxY : 1000,
    width: isFinite(maxX - minX) ? maxX - minX : 1000,
    height: isFinite(maxY - minY) ? maxY - minY : 1000,
  };
}

/**
 * Calcula zoom level para que todo el árbol quepa en viewport
 */
export function calculateFitToViewZoom(
  boundingBox: ReturnType<typeof calculateBoundingBox>,
  viewportWidth: number,
  viewportHeight: number
): number {
  const scaleX = viewportWidth / boundingBox.width;
  const scaleY = viewportHeight / boundingBox.height;
  
  return Math.min(scaleX, scaleY, 1); // No zoom in más de 1x
}
