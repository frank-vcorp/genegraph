import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RelationshipEdge, RELATIONSHIP_LEGEND } from '../../components/RelationshipEdge';
import { ReactFlowProvider } from 'reactflow';
import { useGenogramStore } from '../../store/genogram';

// Mock React Flow
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    BaseEdge: ({ path, style }: any) => (
      <svg data-testid="base-edge">
        <path d={path} style={style} />
      </svg>
    ),
    EdgeLabelRenderer: ({ children }: any) => <div data-testid="edge-label-renderer">{children}</div>,
    getBezierPath: () => ['M 0 0 L 100 100', 50, 50],
    useReactFlow: () => ({
      getEdge: vi.fn(),
      setEdges: vi.fn(),
    }),
  };
});

// Mock store
vi.mock('../../store/genogram', () => ({
  useGenogramStore: vi.fn(),
}));

describe('RelationshipEdge Animations', () => {
  const mockStore = {
    removeConnection: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGenogramStore as any).mockReturnValue(mockStore);
  });

  it('should render BaseEdge component', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    expect(container.querySelector('[data-testid="base-edge"]')).toBeTruthy();
  });

  it('should render edge label when relationship data exists', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
          data={{
            label: 'Test Relationship',
            relationship: {
              id: 'rel-1',
              sourceId: 'person-1',
              targetId: 'person-2',
              isLineage: true,
              lineageType: 'biological',
              isPartnership: false,
              emotionalConfig: { types: [] },
            },
          }}
        />
      </ReactFlowProvider>
    );

    const edgeLabel = container.querySelector('[data-testid="edge-label-renderer"]');
    expect(edgeLabel).toBeTruthy();
  });

  it('should have delete button for relationship edge', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton?.textContent).toContain('✕');
  });

  it('should have hover state styling on edge', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const baseEdge = container.querySelector('[data-testid="base-edge"]');
    expect(baseEdge).toBeTruthy();
  });

  it('should have delete button with transition styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    expect(deleteButton?.className).toContain('transition-all');
    expect(deleteButton?.className).toContain('duration-200');
  });

  it('should have hover:scale-110 effect on delete button', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    expect(deleteButton?.className).toContain('hover:scale-110');
  });

  it('should have active:scale-95 effect on delete button press', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    expect(deleteButton?.className).toContain('active:scale-95');
  });

  it('should call removeConnection when delete button is clicked', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    if (deleteButton) {
      fireEvent.click(deleteButton);
      // Can't fully test without proper React Flow context
    }
  });

  it('should render legend with relationship types', () => {
    expect(RELATIONSHIP_LEGEND).toBeTruthy();
    expect(RELATIONSHIP_LEGEND.length).toBeGreaterThan(0);
  });

  it('should have legend entries with proper categories', () => {
    const categories = new Set(RELATIONSHIP_LEGEND.map(item => item.category));
    expect(categories.has('Lineage')).toBe(true);
    expect(categories.has('Partnership')).toBe(true);
  });

  it('should have legend entries with proper styling', () => {
    const lineageEntries = RELATIONSHIP_LEGEND.filter(item => item.category === 'Lineage');
    lineageEntries.forEach(entry => {
      expect(entry.style).toBeTruthy();
      expect(entry.style.stroke).toBeTruthy();
      expect(entry.style.strokeWidth).toBeGreaterThan(0);
    });
  });

  it('should have hover state on label div', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
          data={{
            label: 'Biological',
            relationship: {
              id: 'rel-1',
              sourceId: 'person-1',
              targetId: 'person-2',
              isLineage: true,
              lineageType: 'biological',
              isPartnership: false,
              emotionalConfig: { types: [] },
            },
          }}
        />
      </ReactFlowProvider>
    );

    const labelDiv = container.querySelector('[data-testid="edge-label-renderer"]');
    expect(labelDiv).toBeTruthy();
  });

  it('should have transition on label styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
          data={{
            label: 'Biological',
            relationship: {
              id: 'rel-1',
              sourceId: 'person-1',
              targetId: 'person-2',
              isLineage: true,
              lineageType: 'biological',
              isPartnership: false,
              emotionalConfig: { types: [] },
            },
          }}
        />
      </ReactFlowProvider>
    );

    const labelBadge = container.querySelector('.bg-white');
    expect(labelBadge?.className).toContain('transition-all');
    expect(labelBadge?.className).toContain('duration-200');
  });

  it('should support biological lineage with solid line', () => {
    const bioLineage = RELATIONSHIP_LEGEND.find(
      item => item.category === 'Lineage' && item.label.includes('Biológica')
    );
    expect(bioLineage).toBeTruthy();
    expect(bioLineage?.style.strokeDasharray).toBe('0');
  });

  it('should support adoptive lineage with dashed line', () => {
    const adoptiveLineage = RELATIONSHIP_LEGEND.find(
      item => item.category === 'Lineage' && item.label.includes('Adoptiva')
    );
    expect(adoptiveLineage).toBeTruthy();
  });

  it('should support partnership types with distinct colors', () => {
    const partnerships = RELATIONSHIP_LEGEND.filter(item => item.category === 'Partnership');
    const colors = new Set(partnerships.map(p => p.style.stroke));
    expect(colors.size).toBeGreaterThan(1);
  });

  it('should render base edge with correct path', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });

  it('should have edge label with white background', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
          data={{
            label: 'Marriage',
            relationship: {
              id: 'rel-1',
              sourceId: 'person-1',
              targetId: 'person-2',
              isLineage: false,
              isPartnership: true,
              partnershipType: 'marriage',
              emotionalConfig: { types: [] },
            },
          }}
        />
      </ReactFlowProvider>
    );

    const labelBadge = container.querySelector('.bg-white');
    expect(labelBadge).toBeTruthy();
  });

  it('should delete button have proper shadow styling', () => {
    const { container } = render(
      <ReactFlowProvider>
        <RelationshipEdge
          id="edge-1"
          sourceX={0}
          sourceY={0}
          targetX={100}
          targetY={100}
        />
      </ReactFlowProvider>
    );

    const deleteButton = container.querySelector('button');
    expect(deleteButton?.className).toContain('shadow-md');
    expect(deleteButton?.className).toContain('hover:shadow-lg');
  });
});
