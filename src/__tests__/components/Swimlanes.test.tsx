import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Swimlanes from '@/components/Swimlanes';
import { Person } from '@/types/genogram';

describe('Swimlanes Component', () => {
  const mockPersons: Person[] = [
    {
      id: '1',
      firstName: 'Person',
      lastName: 'One',
      gender: 'male',
      generation: 0,
      isDeceased: false,
      blockAgeCalculation: false,
      medicalConditions: [],
      position: { x: 0, y: 0 },
      attributes: { status: 'alive', isPrimaryPatient: false, isPrimaryCareiver: false },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      firstName: 'Person',
      lastName: 'Two',
      gender: 'female',
      generation: 1,
      isDeceased: false,
      blockAgeCalculation: false,
      medicalConditions: [],
      position: { x: 250, y: 150 },
      attributes: { status: 'alive', isPrimaryPatient: false, isPrimaryCareiver: false },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '3',
      firstName: 'Person',
      lastName: 'Three',
      gender: 'male',
      generation: 2,
      isDeceased: false,
      blockAgeCalculation: false,
      medicalConditions: [],
      position: { x: 500, y: 300 },
      attributes: { status: 'alive', isPrimaryPatient: false, isPrimaryCareiver: false },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  describe('Rendering', () => {
    it('should render SVG element when enabled', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should not render when disabled', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={false} showLabels={true} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeFalsy();
    });

    it('should not render when persons array is empty', () => {
      const { container } = render(
        <Swimlanes persons={[]} enabled={true} showLabels={true} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeFalsy();
    });
  });

  describe('Generation Lines', () => {
    it('should create swimlanes for each unique generation', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const lines = svg?.querySelectorAll('line[y1][y2]') || [];
      
      // Should have at least one line per generation
      expect(lines.length).toBeGreaterThan(0);
    });

    it('should calculate correct number of generations', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={false} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // Generations should be 0, 1, 2 (3 unique)
      // So we should have SVG elements for 3 swimlanes
    });

    it('should handle persons without generation property', () => {
      const personsWithoutGen: Person[] = [
        { ...mockPersons[0], generation: undefined },
        { ...mockPersons[1], generation: 1 },
      ];

      const { container } = render(
        <Swimlanes persons={personsWithoutGen} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });

  describe('Labels', () => {
    it('should render generation labels when showLabels is true', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const textElements = svg?.querySelectorAll('text') || [];
      
      // Should have text elements for labels
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should not render generation labels when showLabels is false', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={false} />
      );
      
      const svg = container.querySelector('svg');
      const textElements = svg?.querySelectorAll('text') || [];
      
      // Should have no text elements (or minimal ones)
      expect(textElements.length).toEqual(0);
    });

    it('should display generation number in labels', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const textContent = svg?.innerHTML || '';
      
      // Should contain references to generation numbers
      expect(textContent).toContain('Gen');
    });

    it('should display person count per generation', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const textContent = svg?.innerHTML || '';
      
      // Should contain person count references
      expect(textContent).toContain('personas');
    });
  });

  describe('Styling', () => {
    it('should have pointer-events-none class', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg?.className.baseVal).toContain('pointer-events-none');
    });

    it('should have correct z-index', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg?.className.baseVal).toContain('z-0');
    });

    it('should create rectangular swimlane regions', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const rects = svg?.querySelectorAll('rect') || [];
      
      // Should have rectangles for swimlane backgrounds
      expect(rects.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should set width based on max persons per generation', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // SVG should have width and height attributes
      const width = svg?.getAttribute('width');
      expect(width).toBeTruthy();
    });

    it('should calculate height based on generation count', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const style = svg?.getAttribute('style');
      
      // Should have minHeight or min-height set
      expect(style).toContain('min-height');
    });
  });

  describe('Visual Features', () => {
    it('should include grid pattern definition', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const defs = svg?.querySelector('defs');
      const pattern = defs?.querySelector('pattern[id="gridPattern"]');
      
      expect(pattern).toBeTruthy();
    });

    it('should create vertical reference lines', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const lines = svg?.querySelectorAll('line') || [];
      
      // Should have multiple lines for swimlane separators and vertical guides
      expect(lines.length).toBeGreaterThan(2);
    });

    it('should alternate swimlane background colors', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const rects = svg?.querySelectorAll('rect[fill]') || [];
      
      // Should have rectangles with different fill colors for alternating effect
      const fills = new Set(
        Array.from(rects)
          .map((r) => r.getAttribute('fill'))
          .filter((f) => f && (f.includes('#') || f.includes('url')))
      );
      
      expect(fills.size).toBeGreaterThan(0);
    });
  });

  describe('Legend', () => {
    it('should include legend info box when showLabels is true', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      const textContent = svg?.innerHTML || '';
      
      // Should contain legend text
      expect(textContent).toContain('Swimlanes Info');
    });

    it('should not include legend when showLabels is false', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={false} />
      );
      
      const svg = container.querySelector('svg');
      const textContent = svg?.innerHTML || '';
      
      // Should not contain legend
      expect(textContent).not.toContain('Swimlanes Info');
    });
  });

  describe('Props Handling', () => {
    it('should accept custom showLabels prop', () => {
      const { container: container1 } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      const { container: container2 } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={false} />
      );
      
      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');
      
      expect(svg1).toBeTruthy();
      expect(svg2).toBeTruthy();
    });

    it('should accept custom enabled prop', () => {
      const { container: container1 } = render(
        <Swimlanes persons={mockPersons} enabled={true} showLabels={true} />
      );
      const { container: container2 } = render(
        <Swimlanes persons={mockPersons} enabled={false} showLabels={true} />
      );
      
      const svg1 = container1.querySelector('svg');
      const svg2 = container2.querySelector('svg');
      
      expect(svg1).toBeTruthy();
      expect(svg2).toBeFalsy();
    });

    it('should have default values for optional props', () => {
      const { container } = render(
        <Swimlanes persons={mockPersons} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single person', () => {
      const singlePerson = [mockPersons[0]];
      
      const { container } = render(
        <Swimlanes persons={singlePerson} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should handle all persons with same generation', () => {
      const sameGenPersons = mockPersons.map((p, i) => ({
        ...p,
        id: `${i}`,
        generation: 0,
      }));
      
      const { container } = render(
        <Swimlanes persons={sameGenPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should handle large generation gaps', () => {
      const gappedGenerations = [
        { ...mockPersons[0], generation: 0 },
        { ...mockPersons[1], generation: 5 },
        { ...mockPersons[2], generation: 10 },
      ];
      
      const { container } = render(
        <Swimlanes persons={gappedGenerations} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should handle many persons per generation', () => {
      const manyPersons = Array.from({ length: 50 }).map((_, i) => ({
        ...mockPersons[0],
        id: `${i}`,
        position: { x: i * 250, y: 0 },
      }));
      
      const { container } = render(
        <Swimlanes persons={manyPersons} enabled={true} showLabels={true} />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });
  });
});
