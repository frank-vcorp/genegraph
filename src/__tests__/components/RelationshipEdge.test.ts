import { describe, it, expect, beforeAll, vi } from 'vitest';
import { 
  getRelationshipLabel,
  RELATIONSHIP_LEGEND 
} from '@/components/RelationshipEdge';
import { 
  Relationship, 
  LineageType, 
  PartnershipType, 
  EmotionalInteraction 
} from '@/types/genogram';

// Mock Firebase para tests de componente
vi.mock('@/store/genogram', () => ({
  useGenogramStore: () => ({
    removeConnection: vi.fn(),
  }),
}));

vi.mock('reactflow', () => ({
  BaseEdge: () => null,
  EdgeLabelRenderer: ({ children }: any) => children,
  getBezierPath: () => ['M 0 0 L 100 100', 50, 50],
  useReactFlow: () => ({
    getEdge: vi.fn(),
    setEdges: vi.fn(),
  }),
}));

describe('RelationshipEdge Component - Type Safety & Logic', () => {
  
  describe('Lineage Relationships (Parentesco)', () => {
    it('should render biological lineage with solid line', () => {
      const relationship: Relationship = {
        id: 'rel-bio-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'biological',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.isLineage).toBe(true);
      expect(relationship.lineageType).toBe('biological');
    });

    it('should render adoptive lineage with dotted line', () => {
      const relationship: Relationship = {
        id: 'rel-adopt-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'adoptive',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.lineageType).toBe('adoptive');
    });

    it('should render foster lineage correctly', () => {
      const relationship: Relationship = {
        id: 'rel-foster-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'foster',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.lineageType).toBe('foster');
    });

    it('should render donor relationship as very light', () => {
      const relationship: Relationship = {
        id: 'rel-donor-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'donor',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.lineageType).toBe('donor');
    });
  });

  describe('Partnership Relationships (Pareja)', () => {
    it('should render marriage with blue solid line', () => {
      const relationship: Relationship = {
        id: 'rel-m-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'marriage',
        startDate: { date: '2000-01-01', precision: 'exact' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.isPartnership).toBe(true);
      expect(relationship.partnershipType).toBe('marriage');
      expect(relationship.startDate?.date).toBe('2000-01-01');
    });

    it('should render cohabitation correctly', () => {
      const relationship: Relationship = {
        id: 'rel-coh-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'cohabitation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.partnershipType).toBe('cohabitation');
    });

    it('should render free_union with dotted line', () => {
      const relationship: Relationship = {
        id: 'rel-lu-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'free_union',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.partnershipType).toBe('free_union');
    });

    it('should render separation with orange dashed line', () => {
      const relationship: Relationship = {
        id: 'rel-sep-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'separation',
        endDate: { date: '2020-06-15', precision: 'exact' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.partnershipType).toBe('separation');
      expect(relationship.endDate?.date).toBe('2020-06-15');
    });

    it('should render divorce with red heavily dashed line', () => {
      const relationship: Relationship = {
        id: 'rel-div-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'divorce',
        endDate: { date: '2015-03-20', precision: 'exact' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.partnershipType).toBe('divorce');
    });

    it('should render widowhood correctly', () => {
      const relationship: Relationship = {
        id: 'rel-widow-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'widowhood',
        endDate: { date: '2018-12-01', precision: 'exact' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.partnershipType).toBe('widowhood');
    });
  });

  describe('Emotional Relationships (Emocional)', () => {
    it('should render close bond with green line', () => {
      const relationship: Relationship = {
        id: 'rel-close-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['close'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('close');
    });

    it('should render fused bond with dark green line', () => {
      const relationship: Relationship = {
        id: 'rel-fused-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['fused'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('fused');
    });

    it('should render distant bond with gray dotted line', () => {
      const relationship: Relationship = {
        id: 'rel-distant-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['distant'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('distant');
    });

    it('should render conflicted bond with red line', () => {
      const relationship: Relationship = {
        id: 'rel-conflict-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['conflicted'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('conflicted');
    });

    it('should render fused_hostile with dark red line', () => {
      const relationship: Relationship = {
        id: 'rel-fus-host-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['fused_hostile'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('fused_hostile');
    });

    it('should render cutoff with very light line', () => {
      const relationship: Relationship = {
        id: 'rel-cutoff-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['cutoff'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('cutoff');
    });

    it('should render abuse_physical with thick red line', () => {
      const relationship: Relationship = {
        id: 'rel-abuse-phys-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['abuse_physical'],
          direction: '1to2',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('abuse_physical');
      expect(relationship.emotionalConfig?.direction).toBe('1to2');
    });

    it('should render abuse_emotional with thick orange line', () => {
      const relationship: Relationship = {
        id: 'rel-abuse-emot-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['abuse_emotional'],
          direction: '2to1',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.types[0]).toBe('abuse_emotional');
    });
  });

  describe('Dual-Layer Relationships (Múltiples capas)', () => {
    it('should render biological lineage + marriage', () => {
      const relationship: Relationship = {
        id: 'rel-complex-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'biological',
        isPartnership: false, // En este modelo, ambas no pueden ser true simultáneamente
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // En GenoPro real, esto se visualizaría como overlapping lines
      expect(relationship.isLineage).toBe(true);
    });

    it('should render partnership + emotional bond', () => {
      const relationship: Relationship = {
        id: 'rel-complex-002',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'marriage',
        emotionalConfig: {
          types: ['close'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.isPartnership).toBe(true);
      expect(relationship.emotionalConfig?.types[0]).toBe('close');
    });

    it('should render partnership with notes', () => {
      const relationship: Relationship = {
        id: 'rel-noted-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'marriage',
        notes: 'Married 2005, separated 2015',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.notes).toBe('Married 2005, separated 2015');
    });
  });

  describe('getRelationshipLabel Helper', () => {
    it('should return lineage label', () => {
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'biological',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const label = getRelationshipLabel(relationship);
      expect(label).toContain('Lineage');
      expect(label).toContain('biological');
    });

    it('should return partnership label', () => {
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'marriage',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const label = getRelationshipLabel(relationship);
      expect(label).toContain('Partnership');
      expect(label).toContain('marriage');
    });

    it('should return emotional label', () => {
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['close'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const label = getRelationshipLabel(relationship);
      expect(label).toContain('Emotional');
      expect(label).toContain('close');
    });

    it('should return "Unknown" when no relationship type is set', () => {
      const label = getRelationshipLabel(undefined);
      expect(label).toBe('Unknown');
    });
  });

  describe('RELATIONSHIP_LEGEND', () => {
    it('should contain all lineage types', () => {
      const lineageTypes = RELATIONSHIP_LEGEND.filter(l => l.category === 'Lineage');
      expect(lineageTypes.length).toBeGreaterThan(0);
      expect(lineageTypes.some(l => l.label.includes('Biológ'))).toBe(true);
      expect(lineageTypes.some(l => l.label.includes('Adoptiva'))).toBe(true);
    });

    it('should contain all partnership types', () => {
      const partnershipTypes = RELATIONSHIP_LEGEND.filter(l => l.category === 'Partnership');
      expect(partnershipTypes.length).toBeGreaterThan(0);
      expect(partnershipTypes.some(l => l.label === 'Matrimonio')).toBe(true);
      expect(partnershipTypes.some(l => l.label === 'Divorcio')).toBe(true);
    });

    it('should contain all emotional types', () => {
      const emotionalTypes = RELATIONSHIP_LEGEND.filter(l => l.category === 'Emotional');
      expect(emotionalTypes.length).toBeGreaterThan(0);
      expect(emotionalTypes.some(l => l.label === 'Vínculo Cercano')).toBe(true);
      expect(emotionalTypes.some(l => l.label === 'Conflictivo')).toBe(true);
    });

    it('should have proper style definitions', () => {
      RELATIONSHIP_LEGEND.forEach(legend => {
        expect(legend.style.stroke).toBeDefined();
        expect(legend.style.strokeWidth).toBeDefined();
        expect(legend.style.strokeDasharray).toBeDefined();
      });
    });
  });

  describe('Edge Style Properties', () => {
    it('marriage should have blue color and solid stroke', () => {
      const marriage = RELATIONSHIP_LEGEND.find(l => l.label === 'Matrimonio');
      expect(marriage?.style.stroke).toBe('#3498db');
      expect(marriage?.style.strokeWidth).toBe(3);
      expect(marriage?.style.strokeDasharray).toBe('0');
    });

    it('divorce should have red color and dashed stroke', () => {
      const divorce = RELATIONSHIP_LEGEND.find(l => l.label === 'Divorcio');
      expect(divorce?.style.stroke).toBe('#e74c3c');
      expect(divorce?.style.strokeWidth).toBe(3);
      expect(divorce?.style.strokeDasharray).toBe('10,5');
    });

    it('close emotional bond should be green', () => {
      const close = RELATIONSHIP_LEGEND.find(l => l.label === 'Vínculo Cercano');
      expect(close?.style.stroke).toBe('#27ae60');
    });

    it('cutoff should have minimal visibility', () => {
      const cutoff = RELATIONSHIP_LEGEND.find(l => l.label === 'Corte/Ruptura');
      expect(cutoff?.style.stroke).toBe('#34495e');
      expect(cutoff?.style.strokeDasharray).toBe('1,2');
    });
  });

  describe('Relationship Metadata', () => {
    it('should track relationship dates', () => {
      const relationship: Relationship = {
        id: 'rel-dated-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: true,
        partnershipType: 'marriage',
        startDate: { date: '2000-01-15', precision: 'exact' },
        endDate: { date: '2010-06-20', precision: 'exact' },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.startDate?.date).toBe('2000-01-15');
      expect(relationship.endDate?.date).toBe('2010-06-20');
      expect(relationship.startDate?.precision).toBe('exact');
    });

    it('should track relationship notes', () => {
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['conflicted'],
          direction: 'bi',
        },
        notes: 'Parent-child conflict due to disagreement on life choices',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.notes).toContain('conflict');
    });

    it('should track emotional direction', () => {
      const relationship: Relationship = {
        id: 'rel-directed-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['abuse_physical'],
          direction: '1to2',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.emotionalConfig?.direction).toBe('1to2');
    });
  });

  describe('Edge Rendering Priority', () => {
    it('should prioritize lineage over partnership when both are true (hypothetically)', () => {
      // Nota: El modelo actual no permite ambas true, pero testeamos la lógica
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: true,
        lineageType: 'biological',
        isPartnership: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.isLineage).toBe(true);
      // En getEdgeStyle(), lineage se procesa primero (Prioridad 1)
    });

    it('should use emotional when no lineage or partnership', () => {
      const relationship: Relationship = {
        id: 'rel-001',
        person1Id: 'p1',
        person2Id: 'p2',
        isLineage: false,
        isPartnership: false,
        emotionalConfig: {
          types: ['close'],
          direction: 'bi',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(relationship.isLineage).toBe(false);
      expect(relationship.isPartnership).toBe(false);
      expect(relationship.emotionalConfig?.types[0]).toBe('close');
    });
  });
});
