/**
 * Tests para lógica de relaciones (GenoGraph v2.0)
 * Cubre: detección de ciclos, validación, gémelos, ancestros
 */

import { describe, it, expect } from 'vitest';
import {
  wouldCreateCycle,
  getAncestors,
  getDescendants,
  validatePartnershipExclusivity,
  getTwins,
  getTwinGroup,
  assignTwinGroup,
  getPartners,
  getBiologicalParents,
  getBiologicalSiblings,
  getBiologicalChildren,
  calculateGeneration,
} from '@/logic/relationships';
import { Person, Relationship } from '@/types/genogram';

describe('Relationships Logic', () => {
  let persons: Person[];
  let relationships: Relationship[];

  const createPerson = (id: string, name: string = ''): Person => ({
    id,
    firstName: name || `Person${id}`,
    lastName: 'Test',
    gender: 'male',
    medicalConditions: [],
    tags: [],
    attributes: { status: 'alive', isPrimaryPatient: false, isPrimaryCareiver: false },
    isDeceased: false,
    blockAgeCalculation: false,
    generation: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const createRelationship = (
    id: string,
    person1Id: string,
    person2Id: string,
    isLineage: boolean = false,
    isPartnership: boolean = false
  ): Relationship => ({
    id,
    person1Id,
    person2Id,
    isLineage,
    isPartnership,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  beforeEach(() => {
    persons = [];
    relationships = [];
  });

  // ============= wouldCreateCycle =============
  describe('wouldCreateCycle', () => {
    it('detecta ciclo simple: A -> B -> A', () => {
      persons = [createPerson('A'), createPerson('B')];
      relationships = [
        createRelationship('r1', 'A', 'B', true), // A es padre de B
      ];

      // Tratar de hacer B padre de A crear‚aía ciclo
      const cycleDetected = wouldCreateCycle(persons, relationships, 'B', 'A');
      expect(cycleDetected).toBe(true);
    });

    it('no detecta ciclo para hermanos', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        createRelationship('r1', 'C', 'A', true), // C es padre de A
        createRelationship('r2', 'C', 'B', true), // C es padre de B
      ];

      // A y B pueden ser hermanos sin ciclo
      const cycleDetected = wouldCreateCycle(persons, relationships, 'A', 'B');
      expect(cycleDetected).toBe(false);
    });

    it('detecta ciclo generacional profundo', () => {
      persons = [
        createPerson('A'),
        createPerson('B'),
        createPerson('C'),
        createPerson('D'),
      ];
      relationships = [
        createRelationship('r1', 'A', 'B', true), // A -> B
        createRelationship('r2', 'B', 'C', true), // B -> C
        createRelationship('r3', 'C', 'D', true), // C -> D
      ];

      // Hacer D padre de A crearía ciclo A -> B -> C -> D -> A
      const cycleDetected = wouldCreateCycle(persons, relationships, 'D', 'A');
      expect(cycleDetected).toBe(true);
    });

    it('retorna true si relación ya existe', () => {
      persons = [createPerson('A'), createPerson('B')];
      relationships = [
        createRelationship('r1', 'A', 'B', true),
      ];

      // Intentar crear la misma relación
      const cycleDetected = wouldCreateCycle(persons, relationships, 'A', 'B');
      expect(cycleDetected).toBe(true);
    });
  });

  // ============= getAncestors =============
  describe('getAncestors', () => {
    it('retorna ancestros directos', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        createRelationship('r1', 'A', 'B', true), // A es padre de B
        createRelationship('r2', 'B', 'C', true), // B es padre de C
      ];

      const ancestors = getAncestors('C', relationships);
      expect(ancestors).toContain('B');
      expect(ancestors).toContain('A');
    });

    it('retorna empty array si no hay ancestros', () => {
      persons = [createPerson('A')];
      relationships = [];

      const ancestors = getAncestors('A', relationships);
      expect(ancestors).toEqual([]);
    });

    it('no incluye la misma persona', () => {
      persons = [createPerson('A'), createPerson('B')];
      relationships = [
        createRelationship('r1', 'A', 'B', true),
      ];

      const ancestors = getAncestors('A', relationships);
      expect(ancestors).not.toContain('A');
    });
  });

  // ============= getDescendants =============
  describe('getDescendants', () => {
    it('retorna descendientes directos', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        createRelationship('r1', 'A', 'B', true), // A es padre de B
        createRelationship('r2', 'A', 'C', true), // A es padre de C
      ];

      const descendants = getDescendants('A', relationships);
      expect(descendants).toContain('B');
      expect(descendants).toContain('C');
    });

    it('retorna empty array si no hay descendientes', () => {
      persons = [createPerson('A')];
      relationships = [];

      const descendants = getDescendants('A', relationships);
      expect(descendants).toEqual([]);
    });
  });

  // ============= validatePartnershipExclusivity =============
  describe('validatePartnershipExclusivity', () => {
    it('permite partnership único activo', () => {
      relationships = [
        createRelationship('r1', 'A', 'B', false, true),
      ];

      expect(validatePartnershipExclusivity('A', relationships)).toBe(true);
    });

    it('rechaza múltiples marriages activos', () => {
      relationships = [
        { ...createRelationship('r1', 'A', 'B', false, true), partnershipType: 'marriage' as const },
        { ...createRelationship('r2', 'A', 'C', false, true), partnershipType: 'marriage' as const },
      ];

      expect(() => validatePartnershipExclusivity('A', relationships)).toThrow();
    });

    it('permite múltiples partnerships si tienen endDate', () => {
      const today = new Date().toISOString().substring(0, 10);
      relationships = [
        {
          ...createRelationship('r1', 'A', 'B', false, true),
          endDate: { date: today, precision: 'exact' },
        },
        createRelationship('r2', 'A', 'C', false, true),
      ];

      expect(validatePartnershipExclusivity('A', relationships)).toBe(true);
    });
  });

  // ============= getTwins =============
  describe('getTwins', () => {
    it('retorna gémelos correctos', () => {
      const twinGroupId = 'twins_group_1';
      persons = [
        { ...createPerson('A'), twinGroupId },
        { ...createPerson('B'), twinGroupId },
        createPerson('C'),
      ];

      const twins = getTwins('A', persons);
      expect(twins).toHaveLength(1);
      expect(twins[0].id).toBe('B');
    });

    it('retorna empty array si no hay gémelos', () => {
      persons = [createPerson('A'), createPerson('B')];

      const twins = getTwins('A', persons);
      expect(twins).toEqual([]);
    });

    it('no incluye la misma persona', () => {
      const twinGroupId = 'twins_group_1';
      persons = [
        { ...createPerson('A'), twinGroupId },
        { ...createPerson('B'), twinGroupId },
      ];

      const twins = getTwins('A', persons);
      expect(twins.map(p => p.id)).not.toContain('A');
    });
  });

  // ============= getTwinGroup =============
  describe('getTwinGroup', () => {
    it('retorna todos los miembros del grupo', () => {
      const twinGroupId = 'twins_group_1';
      persons = [
        { ...createPerson('A'), twinGroupId },
        { ...createPerson('B'), twinGroupId },
        { ...createPerson('C'), twinGroupId },
      ];

      const group = getTwinGroup(twinGroupId, persons);
      expect(group).toHaveLength(3);
    });

    it('retorna empty array si grupo no existe', () => {
      persons = [createPerson('A')];

      const group = getTwinGroup('nonexistent', persons);
      expect(group).toEqual([]);
    });
  });

  // ============= assignTwinGroup =============
  describe('assignTwinGroup', () => {
    it('asigna twinGroupId a múltiples personas', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];

      const result = assignTwinGroup(['A', 'B'], 'identical', persons);
      const personA = result.find(p => p.id === 'A');
      const personB = result.find(p => p.id === 'B');
      const personC = result.find(p => p.id === 'C');

      expect(personA?.twinGroupId).toBeDefined();
      expect(personB?.twinGroupId).toBeDefined();
      expect(personA?.twinGroupId).toBe(personB?.twinGroupId);
      expect(personC?.twinGroupId).toBeUndefined();
    });

    it('rechaza grupos con <2 personas', () => {
      persons = [createPerson('A')];

      expect(() => assignTwinGroup(['A'], 'identical', persons)).toThrow();
    });

    it('mantiene twinType correcto', () => {
      persons = [createPerson('A'), createPerson('B')];

      const result = assignTwinGroup(['A', 'B'], 'fraternal', persons);
      const personA = result.find(p => p.id === 'A');

      expect(personA?.twinType).toBe('fraternal');
    });
  });

  // ============= getPartners =============
  describe('getPartners', () => {
    it('retorna parejas correctamente', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        { ...createRelationship('r1', 'A', 'B', false, true), partnershipType: 'marriage' },
      ];

      const partners = getPartners('A', relationships, persons);
      expect(partners).toHaveLength(1);
      expect(partners[0].id).toBe('B');
    });

    it('retorna empty array sin parejas', () => {
      persons = [createPerson('A')];
      relationships = [];

      const partners = getPartners('A', relationships, persons);
      expect(partners).toEqual([]);
    });
  });

  // ============= getBiologicalParents =============
  describe('getBiologicalParents', () => {
    it('retorna padres biológicos', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        { ...createRelationship('r1', 'A', 'C', true), lineageType: 'biological' },
        { ...createRelationship('r2', 'B', 'C', true), lineageType: 'biological' },
      ];

      const parents = getBiologicalParents('C', relationships, persons);
      expect(parents).toHaveLength(2);
      expect(parents.map(p => p.id)).toContain('A');
      expect(parents.map(p => p.id)).toContain('B');
    });

    it('retorna empty array sin padres', () => {
      persons = [createPerson('A')];
      relationships = [];

      const parents = getBiologicalParents('A', relationships, persons);
      expect(parents).toEqual([]);
    });
  });

  // ============= getBiologicalSiblings =============
  describe('getBiologicalSiblings', () => {
    it('retorna hermanos biológicos', () => {
      persons = [
        createPerson('A'),
        createPerson('B'),
        createPerson('C'),
        createPerson('D'),
      ];
      relationships = [
        { ...createRelationship('r1', 'A', 'C', true), lineageType: 'biological' },
        { ...createRelationship('r2', 'A', 'D', true), lineageType: 'biological' },
        { ...createRelationship('r3', 'B', 'D', true), lineageType: 'biological' },
      ];

      const siblings = getBiologicalSiblings('C', relationships, persons);
      expect(siblings).toHaveLength(1);
      expect(siblings[0].id).toBe('D');
    });

    it('retorna empty array sin hermanos', () => {
      persons = [createPerson('A'), createPerson('B')];
      relationships = [
        { ...createRelationship('r1', 'A', 'B', true), lineageType: 'biological' },
      ];

      const siblings = getBiologicalSiblings('B', relationships, persons);
      expect(siblings).toEqual([]);
    });
  });

  // ============= getBiologicalChildren =============
  describe('getBiologicalChildren', () => {
    it('retorna hijos biológicos', () => {
      persons = [createPerson('A'), createPerson('B'), createPerson('C')];
      relationships = [
        { ...createRelationship('r1', 'A', 'B', true), lineageType: 'biological' },
        { ...createRelationship('r2', 'A', 'C', true), lineageType: 'biological' },
      ];

      const children = getBiologicalChildren('A', relationships, persons);
      expect(children).toHaveLength(2);
    });

    it('retorna empty array sin hijos', () => {
      persons = [createPerson('A')];
      relationships = [];

      const children = getBiologicalChildren('A', relationships, persons);
      expect(children).toEqual([]);
    });
  });

  // ============= calculateGeneration =============
  describe('calculateGeneration', () => {
    it('calcula generación 0 para raíz', () => {
      relationships = [];

      const gen = calculateGeneration('A', relationships);
      expect(gen).toBe(0);
    });

    it('calcula generación 1 para hijos', () => {
      relationships = [
        createRelationship('r1', 'A', 'B', true),
      ];

      const gen = calculateGeneration('B', relationships);
      expect(gen).toBe(1);
    });

    it('calcula generación correcta en árbol profundo', () => {
      relationships = [
        createRelationship('r1', 'A', 'B', true),
        createRelationship('r2', 'B', 'C', true),
        createRelationship('r3', 'C', 'D', true),
      ];

      expect(calculateGeneration('A', relationships)).toBe(0);
      expect(calculateGeneration('B', relationships)).toBe(1);
      expect(calculateGeneration('C', relationships)).toBe(2);
      expect(calculateGeneration('D', relationships)).toBe(3);
    });
  });
});
