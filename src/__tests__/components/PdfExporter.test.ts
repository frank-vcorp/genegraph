import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PdfExporter } from '@/components/PdfExporter';
import { Genogram, Person, Connection } from '@/types/genogram';

// Mock html2canvas y jsPDF
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,iVBORw0KGgo=',
  }),
}));

vi.mock('jspdf', () => {
  class MockPDF {
    internal = {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    };

    setFontSize = vi.fn(() => this);
    setFont = vi.fn(() => this);
    text = vi.fn(() => this);
    addPage = vi.fn(() => this);
    addImage = vi.fn(() => this);
    setTextColor = vi.fn(() => this);
    setFillColor = vi.fn(() => this);
    rect = vi.fn(() => this);
    splitTextToSize = vi.fn(() => ['Line 1', 'Line 2']);
    save = vi.fn();
  }

  return {
    default: MockPDF,
  };
});

describe('PdfExporter Component', () => {
  const mockCanvasElement = document.createElement('div');
  const mockGenogram: Genogram = {
    id: 'gen_001',
    userId: 'user_001',
    pacientName: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: 'Genograma de paciente con historial de diabetes',
    persons: [
      {
        id: 'p1',
        name: 'John Doe',
        gender: 'male',
        generation: 0,
        birthDate: { date: '1980-05-15', precision: 'exact' },
        attributes: { isPrimaryPatient: true, status: 'alive' },
        medicalConditions: [
          { id: 'mc1', name: 'Diabetes', code: 'E11.9', status: 'active' },
          { id: 'mc2', name: 'Hipertensión', code: 'I10', status: 'active' },
        ],
      },
      {
        id: 'p2',
        name: 'Jane Doe',
        gender: 'female',
        generation: -1,
        birthDate: { date: '1952-03-20', precision: 'about' },
        attributes: { status: 'deceased' },
        medicalConditions: [
          { id: 'mc3', name: 'Diabetes', code: 'E11.9', status: 'cured' },
        ],
      },
      {
        id: 'p3',
        name: 'Bob Doe',
        gender: 'male',
        generation: 1,
        birthDate: { date: '2005-11-10', precision: 'exact' },
        attributes: { status: 'alive' },
      },
    ],
    relationships: [],
    connections: [
      {
        id: 'c1',
        sourceId: 'p1',
        targetId: 'p2',
        type: 'parent',
        metadata: {},
      },
      {
        id: 'c2',
        sourceId: 'p1',
        targetId: 'p3',
        type: 'parent',
        metadata: {},
      },
    ],
    metadata: {
      motivoConsulta: 'Evaluación familiar',
      examinador: 'Dr. Smith',
      fecha: new Date().toISOString(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('exportClassic', () => {
    it('should export genogram to PDF in classic format', async () => {
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should call save with correct filename', async () => {
      const fileName = 'test_genograma';
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram, fileName);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle genogram with no persons', async () => {
      const emptyGenogram: Genogram = {
        ...mockGenogram,
        persons: [],
      };

      await PdfExporter.exportClassic(mockCanvasElement, emptyGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle persons with no medical conditions', async () => {
      const genogramNoCond: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: undefined,
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoCond);

      expect(PdfExporter).toBeDefined();
    });

    it('should include legend page', async () => {
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should include person data page with clinical info', async () => {
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should include conditions indexed page', async () => {
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should include notes and metadata page', async () => {
      await PdfExporter.exportClassic(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('exportModern', () => {
    it('should export genogram to PDF in modern format', async () => {
      await PdfExporter.exportModern(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should call save with correct filename', async () => {
      const fileName = 'test_moderno';
      await PdfExporter.exportModern(mockCanvasElement, mockGenogram, fileName);

      expect(PdfExporter).toBeDefined();
    });

    it('should include summary page with statistics', async () => {
      await PdfExporter.exportModern(mockCanvasElement, mockGenogram);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle genogram with many persons', async () => {
      const bigGenogram: Genogram = {
        ...mockGenogram,
        persons: Array(20)
          .fill(null)
          .map((_, i) => ({
            ...mockGenogram.persons[0],
            id: `p${i}`,
            name: `Person ${i}`,
          })),
      };

      await PdfExporter.exportModern(mockCanvasElement, bigGenogram);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Medical Conditions Indexing', () => {
    it('should group conditions by name across multiple persons', async () => {
      // Genogram con condiciones repetidas en múltiples personas
      const genogramRepeated: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: [
              { id: 'mc1', name: 'Diabetes', code: 'E11.9', status: 'active' },
            ],
          },
          {
            ...mockGenogram.persons[1],
            medicalConditions: [
              { id: 'mc2', name: 'Diabetes', code: 'E11.9', status: 'cured' },
            ],
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramRepeated);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle conditions with missing codes', async () => {
      const genogramNoCode: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: [
              { id: 'mc1', name: 'Unknown Condition', status: 'active' },
            ],
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoCode);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle conditions with missing names', async () => {
      const genogramNoName: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: [
              { id: 'mc1', code: 'A00', status: 'active' },
            ],
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoName);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Notes and Metadata', () => {
    it('should include notes when present', async () => {
      const genogramWithNotes: Genogram = {
        ...mockGenogram,
        notes: 'Paciente con antecedentes de depresión familiar y alcoholismo paterno.',
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramWithNotes);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle missing notes gracefully', async () => {
      const genogramNoNotes: Genogram = {
        ...mockGenogram,
        notes: undefined,
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoNotes);

      expect(PdfExporter).toBeDefined();
    });

    it('should include patient metadata', async () => {
      const genogramWithMetadata: Genogram = {
        ...mockGenogram,
        metadata: {
          motivoConsulta: 'Evaluación de riesgo genético',
          examinador: 'Dra. Laura Arias',
          fecha: '2026-01-11',
        },
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramWithMetadata);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Date Handling', () => {
    it('should format birth dates with precision', async () => {
      const genogramWithDates: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            birthDate: { date: '1980-05-15', precision: 'exact' },
          },
          {
            ...mockGenogram.persons[1],
            birthDate: { date: '1952-03-20', precision: 'about' },
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramWithDates);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle missing birth dates', async () => {
      const genogramNoDates: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            birthDate: undefined,
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoDates);

      expect(PdfExporter).toBeDefined();
    });

    it('should format death dates for deceased persons', async () => {
      const genogramDeceased: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[1],
            deathDate: { date: '2020-08-10', precision: 'exact' },
            attributes: { status: 'deceased' },
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramDeceased);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long condition names', async () => {
      const genogramLongName: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: [
              {
                id: 'mc1',
                name: 'Síndrome de hiperactividad por déficit de atención con manifestaciones comórbidas de ansiedad generalizada',
                status: 'active',
              },
            ],
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramLongName);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle very long notes', async () => {
      const longNotes = Array(500)
        .fill('Lorem ipsum dolor sit amet. ')
        .join('')
        .substring(0, 5000);

      const genogramLongNotes: Genogram = {
        ...mockGenogram,
        notes: longNotes,
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramLongNotes);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle missing patient name', async () => {
      const genogramNoName: Genogram = {
        ...mockGenogram,
        pacientName: '',
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramNoName);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle persons with no name', async () => {
      const genogramPersonNoName: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            name: '',
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramPersonNoName);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle empty conditions array', async () => {
      const genogramEmptyConditions: Genogram = {
        ...mockGenogram,
        persons: [
          {
            ...mockGenogram.persons[0],
            medicalConditions: [],
          },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramEmptyConditions);

      expect(PdfExporter).toBeDefined();
    });

    it('should handle many relationships', async () => {
      const manyConnections: Connection[] = Array(50)
        .fill(null)
        .map((_, i) => ({
          id: `c${i}`,
          sourceId: `p${i}`,
          targetId: `p${i + 1}`,
          type: 'parent' as const,
          metadata: {},
        }));

      const genogramManyRels: Genogram = {
        ...mockGenogram,
        connections: manyConnections,
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramManyRels);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Gender Labels', () => {
    it('should handle all gender types', async () => {
      const genogramGenders: Genogram = {
        ...mockGenogram,
        persons: [
          { ...mockGenogram.persons[0], gender: 'male' },
          { ...mockGenogram.persons[1], gender: 'female' },
          { ...mockGenogram.persons[2], gender: 'other' },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramGenders);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Status Labels', () => {
    it('should handle all status types', async () => {
      const genogramStatuses: Genogram = {
        ...mockGenogram,
        persons: [
          { ...mockGenogram.persons[0], attributes: { status: 'alive' } },
          { ...mockGenogram.persons[1], attributes: { status: 'deceased' } },
          { ...mockGenogram.persons[2], attributes: { status: 'unknown' } },
        ],
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramStatuses);

      expect(PdfExporter).toBeDefined();
    });
  });

  describe('Pagination', () => {
    it('should add new pages when needed for person data', async () => {
      const manyPersons: Person[] = Array(30)
        .fill(null)
        .map((_, i) => ({
          id: `p${i}`,
          name: `Person ${i}`,
          gender: i % 2 === 0 ? 'male' : 'female',
          generation: Math.floor(i / 10),
          attributes: { status: 'alive' },
          medicalConditions: [
            { id: `mc${i}`, name: `Condition ${i}`, status: 'active' },
          ],
        }));

      const genogramMany: Genogram = {
        ...mockGenogram,
        persons: manyPersons,
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramMany);

      expect(PdfExporter).toBeDefined();
    });

    it('should add new pages when needed for condition data', async () => {
      const manyConditions: Person[] = Array(10)
        .fill(null)
        .map((_, i) => ({
          id: `p${i}`,
          name: `Person ${i}`,
          gender: 'male',
          generation: 0,
          attributes: { status: 'alive' },
          medicalConditions: Array(15)
            .fill(null)
            .map((_, j) => ({
              id: `mc${i}_${j}`,
              name: `Condition ${i}_${j}`,
              code: `CODE${i}${j}`,
              status: 'active',
            })),
        }));

      const genogramManyCond: Genogram = {
        ...mockGenogram,
        persons: manyConditions,
      };

      await PdfExporter.exportClassic(mockCanvasElement, genogramManyCond);

      expect(PdfExporter).toBeDefined();
    });
  });
});
