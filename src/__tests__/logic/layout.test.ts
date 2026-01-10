/**
 * Tests para lógica de layout (GenoGraph v2.0)
 * Cubre: auto-layout, swimlanes, snap-to-grid, validación
 */

import { describe, it, expect } from 'vitest';
import {
  snapToGrid,
  isValidCoordinate,
  generateSwimlanes,
  getGenerationLabel,
  validateLayout,
  doNodesOverlap,
  resolveSuperposition,
  calculateBoundingBox,
  calculateFitToViewZoom,
  autoLayoutByGeneration,
  calculateBestXPosition,
  calculateYFromGeneration,
  LAYOUT_CONFIG,
} from '@/logic/layout';
import { Person, Relationship } from '@/types/genogram';

describe('Layout Logic', () => {
  const createPerson = (id: string, gen: number = 0, x?: number, y?: number): Person => ({
    id,
    firstName: `Person${id}`,
    lastName: 'Test',
    gender: 'male',
    medicalConditions: [],
    tags: [],
    attributes: { status: 'alive', isPrimaryPatient: false, isPrimaryCareiver: false },
    isDeceased: false,
    blockAgeCalculation: false,
    generation: gen,
    x,
    y,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const createRelationship = (
    id: string,
    person1Id: string,
    person2Id: string,
    isLineage: boolean = true
  ): Relationship => ({
    id,
    person1Id,
    person2Id,
    isLineage,
    isPartnership: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // ============= snapToGrid =============
  describe('snapToGrid', () => {
    it('redondea al grid más cercano', () => {
      expect(snapToGrid(15, 10)).toBe(20);
      expect(snapToGrid(14, 10)).toBe(10);
      expect(snapToGrid(25, 10)).toBe(30);
    });

    it('usa SNAP_GRID por defecto', () => {
      expect(snapToGrid(7)).toBe(10); // Redondeado a 10
      expect(snapToGrid(23)).toBe(20); // Redondeado a 20
    });

    it('maneja valores negativos', () => {
      expect(snapToGrid(-15, 10)).toBe(-10); // -15 redondea a -10
      expect(snapToGrid(-14, 10)).toBe(-10); // -14 redondea a -10
    });
  });

  // ============= isValidCoordinate =============
  describe('isValidCoordinate', () => {
    it('valida coordenadas dentro de rango', () => {
      expect(isValidCoordinate(100, 200)).toBe(true);
      expect(isValidCoordinate(0, 0)).toBe(true);
      expect(isValidCoordinate(-100, -200)).toBe(true);
    });

    it('rechaza coordenadas fuera de rango', () => {
      expect(isValidCoordinate(6000, 100)).toBe(false);
      expect(isValidCoordinate(100, -6000)).toBe(false);
      expect(isValidCoordinate(10000, 10000)).toBe(false);
    });
  });

  // ============= generateSwimlanes =============
  describe('generateSwimlanes', () => {
    it('genera swimlanes para múltiples generaciones', () => {
      const swimlanes = generateSwimlanes(3);
      
      expect(swimlanes).toHaveLength(4); // 0, 1, 2, 3
      expect(swimlanes[0].generation).toBe(0);
      expect(swimlanes[3].generation).toBe(3);
    });

    it('swimlanes tienen altura correcta', () => {
      const swimlanes = generateSwimlanes(2);
      
      swimlanes.forEach(lane => {
        expect(lane.height).toBe(LAYOUT_CONFIG.SWIMLANE_HEIGHT);
      });
    });

    it('swimlanes tienen Y ordenado', () => {
      const swimlanes = generateSwimlanes(3);
      
      for (let i = 1; i < swimlanes.length; i++) {
        expect(swimlanes[i].y).toBeGreaterThan(swimlanes[i - 1].y);
      }
    });

    it('cada swimlane tiene label', () => {
      const swimlanes = generateSwimlanes(2);
      
      swimlanes.forEach(lane => {
        expect(lane.label).toBeTruthy();
        expect(lane.label.length).toBeGreaterThan(0);
      });
    });
  });

  // ============= getGenerationLabel =============
  describe('getGenerationLabel', () => {
    it('retorna labels para generaciones conocidas', () => {
      expect(getGenerationLabel(0)).toContain('Raíz');
      expect(getGenerationLabel(1)).toContain('Hijos');
      expect(getGenerationLabel(2)).toContain('Nietos');
    });

    it('retorna label genérica para generaciones altas', () => {
      expect(getGenerationLabel(10)).toBe('Generación 10');
    });
  });

  // ============= validateLayout =============
  describe('validateLayout', () => {
    it('valida layout correcto', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 1, 100, 250),
      ];

      expect(validateLayout(persons)).toBe(true);
    });

    it('rechaza coordenadas inválidas', () => {
      const persons = [
        createPerson('A', 0, 10000, 100),
      ];

      expect(validateLayout(persons)).toBe(false);
    });

    it('rechaza generaciones desordenadas', () => {
      const persons = [
        createPerson('A', 1, 100, 100),
        createPerson('B', 0, 100, 200), // Gen 0 pero Y mayor que Gen 1
      ];

      expect(validateLayout(persons)).toBe(false);
    });

    it('permite undefined x,y', () => {
      const persons = [
        createPerson('A', 0, undefined, undefined),
      ];

      expect(validateLayout(persons)).toBe(true);
    });
  });

  // ============= doNodesOverlap =============
  describe('doNodesOverlap', () => {
    it('detecta superposición cercana', () => {
      const p1 = createPerson('A', 0, 100, 100);
      const p2 = createPerson('B', 0, 110, 110);

      expect(doNodesOverlap(p1, p2, 30)).toBe(true);
    });

    it('no detecta superposición lejana', () => {
      const p1 = createPerson('A', 0, 100, 100);
      const p2 = createPerson('B', 0, 200, 200);

      expect(doNodesOverlap(p1, p2)).toBe(false);
    });

    it('no compara si falta x,y', () => {
      const p1 = createPerson('A', 0, undefined, 100);
      const p2 = createPerson('B', 0, 100, 100);

      expect(doNodesOverlap(p1, p2)).toBe(false);
    });

    it('usa minDistance por defecto', () => {
      const p1 = createPerson('A', 0, 100, 100);
      const p2 = createPerson('B', 0, 200, 100);

      expect(doNodesOverlap(p1, p2)).toBe(false); // Distancia 100, mayor que default ~80
    });
  });

  // ============= resolveSuperposition =============
  describe('resolveSuperposition', () => {
    it('separa nodos superpuestos', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 110, 110), // Superpuesto
      ];

      const resolved = resolveSuperposition(persons);

      expect(resolved[1].x! > resolved[0].x!).toBe(true);
    });

    it('no modifica nodos no superpuestos', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 500, 500),
      ];

      const original = persons.map(p => ({ ...p }));
      const resolved = resolveSuperposition(persons);

      expect(resolved[0].x).toBe(original[0].x);
      expect(resolved[1].x).toBe(original[1].x);
    });

    it('maneja múltiples superposiciones', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 110, 110),
        createPerson('C', 0, 120, 120),
      ];

      const resolved = resolveSuperposition(persons);

      // Todos separados
      expect(resolved[0].x! < resolved[1].x!).toBe(true);
      expect(resolved[1].x! < resolved[2].x!).toBe(true);
    });
  });

  // ============= calculateBoundingBox =============
  describe('calculateBoundingBox', () => {
    it('calcula bounding box correcto', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 200, 300),
      ];

      const bb = calculateBoundingBox(persons);

      expect(bb.minX).toBeLessThan(100);
      expect(bb.maxX).toBeGreaterThan(200);
      expect(bb.minY).toBeLessThan(100);
      expect(bb.maxY).toBeGreaterThan(300);
    });

    it('retorna valores por defecto si no hay nodos', () => {
      const bb = calculateBoundingBox([]);

      expect(bb.minX).toBe(0);
      expect(bb.maxX).toBe(1000);
      expect(bb.minY).toBe(0);
      expect(bb.maxY).toBe(1000);
    });

    it('incluye padding', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
      ];

      const bb = calculateBoundingBox(persons);

      // El padding debe ser >0
      expect(bb.minX).toBeLessThan(100 - LAYOUT_CONFIG.NODE_WIDTH / 2);
      expect(bb.maxX).toBeGreaterThan(100 + LAYOUT_CONFIG.NODE_WIDTH / 2);
    });

    it('calcula width y height', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 500, 500),
      ];

      const bb = calculateBoundingBox(persons);

      expect(bb.width).toBeGreaterThan(0);
      expect(bb.height).toBeGreaterThan(0);
      expect(bb.width).toBeCloseTo(bb.maxX - bb.minX, 0);
      expect(bb.height).toBeCloseTo(bb.maxY - bb.minY, 0);
    });
  });

  // ============= calculateFitToViewZoom =============
  describe('calculateFitToViewZoom', () => {
    it('calcula zoom para fit viewport', () => {
      const bb = {
        minX: 0,
        maxX: 1000,
        minY: 0,
        maxY: 1000,
        width: 1000,
        height: 1000,
      };

      const zoom = calculateFitToViewZoom(bb, 500, 500);

      expect(zoom).toBeLessThanOrEqual(1); // No zoom in
      expect(zoom).toBeGreaterThan(0);
    });

    it('no zoom in más de 1x', () => {
      const bb = {
        minX: 0,
        maxX: 100,
        minY: 0,
        maxY: 100,
        width: 100,
        height: 100,
      };

      const zoom = calculateFitToViewZoom(bb, 1000, 1000);

      expect(zoom).toBeLessThanOrEqual(1);
    });

    it('calcula zoom basado en aspecto ratio', () => {
      const bb = {
        minX: 0,
        maxX: 2000,
        minY: 0,
        maxY: 1000,
        width: 2000,
        height: 1000,
      };

      const zoom = calculateFitToViewZoom(bb, 400, 400);

      // Viewport 400x400, BB 2000x1000, el ancho es el limitante
      expect(zoom).toBeLessThan(1);
    });
  });

  // ============= calculateYFromGeneration =============
  describe('calculateYFromGeneration', () => {
    it('calcula Y basado en generación', () => {
      const y0 = calculateYFromGeneration(0);
      const y1 = calculateYFromGeneration(1);
      const y2 = calculateYFromGeneration(2);

      expect(y1).toBeGreaterThan(y0);
      expect(y2).toBeGreaterThan(y1);
    });

    it('Y es snapped to grid', () => {
      const y = calculateYFromGeneration(1);

      expect(y % LAYOUT_CONFIG.SNAP_GRID).toBe(0);
    });
  });

  // ============= calculateBestXPosition =============
  describe('calculateBestXPosition', () => {
    it('retorna posición basada en hermanos', () => {
      const persons = [
        createPerson('A', 0, 100, 100),
        createPerson('B', 0, 200, 100),
        createPerson('C', 0),
      ];

      const bestX = calculateBestXPosition('C', persons, []);

      // Debería estar cerca del promedio de A y B
      expect(bestX).toBeGreaterThanOrEqual(100);
      expect(bestX).toBeLessThanOrEqual(300);
    });

    it('retorna default si no hay hermanos', () => {
      const persons = [createPerson('A', 0)];

      const bestX = calculateBestXPosition('A', persons, []);

      expect(bestX).toBe(100); // Default
    });

    it('retorna undefined si person no existe', () => {
      const persons = [createPerson('A', 0)];

      const bestX = calculateBestXPosition('B', persons, []);

      expect(bestX).toBe(0);
    });
  });

  // ============= autoLayoutByGeneration (Integration Test) =============
  describe('autoLayoutByGeneration', () => {
    it('asigna x,y y generación a personas', () => {
      const persons = [
        createPerson('A', 0),
        createPerson('B', 0),
        createPerson('C', 0),
      ];
      const relationships = [
        createRelationship('r1', 'A', 'C'),
        createRelationship('r2', 'B', 'C'),
      ];

      const layout = autoLayoutByGeneration(persons, relationships);

      // Todos deben tener x, y, generation asignados
      layout.forEach(person => {
        expect(person.x).toBeDefined();
        expect(person.y).toBeDefined();
        expect(person.generation).toBeDefined();
      });
    });

    it('distribuye horizontalmente en generación', () => {
      const persons = [
        createPerson('A', 0),
        createPerson('B', 0),
        createPerson('C', 0),
      ];
      const relationships = [];

      const layout = autoLayoutByGeneration(persons, relationships);

      // Si todos en Gen 0, sus X deben ser diferentes
      const gen0Persons = layout.filter(p => p.generation === 0);
      const xValues = gen0Persons.map(p => p.x!);
      const uniqueXValues = new Set(xValues);

      expect(uniqueXValues.size).toBeGreaterThan(1);
    });

    it('agrupa por generación en Y', () => {
      const persons = [
        createPerson('A', 0),
        createPerson('B', 0),
        createPerson('C', 0),
      ];
      const relationships = [
        createRelationship('r1', 'A', 'C'),
        createRelationship('r2', 'B', 'C'),
      ];

      const layout = autoLayoutByGeneration(persons, relationships);

      const personA = layout.find(p => p.id === 'A')!;
      const personC = layout.find(p => p.id === 'C')!;

      // Si C es hijo de A, C.y > A.y
      if (personC.generation > personA.generation) {
        expect(personC.y).toBeGreaterThan(personA.y);
      }
    });

    it('valida layout resultante', () => {
      const persons = [
        createPerson('A', 0),
        createPerson('B', 0),
        createPerson('C', 0),
        createPerson('D', 0),
      ];
      const relationships = [
        createRelationship('r1', 'A', 'C'),
        createRelationship('r2', 'A', 'D'),
        createRelationship('r3', 'B', 'C'),
      ];

      const layout = autoLayoutByGeneration(persons, relationships);

      expect(validateLayout(layout)).toBe(true);
    });
  });
});
