'use client';

import { useMemo } from 'react';
import { Person } from '@/types/genogram';

interface SwimlanesProps {
  persons: Person[];
  showLabels?: boolean;
  enabled?: boolean;
}

/**
 * Swimlanes Component
 * Renderiza líneas horizontales para cada generación
 * Sirve como referencia visual para el layout del genograma
 */
export default function Swimlanes({
  persons,
  showLabels = true,
  enabled = true,
}: SwimlanesProps) {
  if (!enabled || persons.length === 0) {
    return null;
  }

  // Calcular generaciones únicas y ordenadas
  const generations = useMemo(() => {
    const genSet = new Set(persons.map((p) => p.generation || 0));
    return Array.from(genSet).sort((a, b) => a - b);
  }, [persons]);

  // Calcular altura de swimlane (promedio de altura de nodos)
  const SWIMLANE_HEIGHT = 150; // pixels entre generaciones
  const SWIMLANE_Y_OFFSET = 50; // offset superior inicial

  // Calcular ancho máximo (aproximado basado en cantidad de personas por generación)
  const maxPersonsPerGen = useMemo(() => {
    const genCounts: Record<number, number> = {};
    persons.forEach((p) => {
      const gen = p.generation || 0;
      genCounts[gen] = (genCounts[gen] || 0) + 1;
    });
    return Math.max(...Object.values(genCounts));
  }, [persons]);

  const SWIMLANE_WIDTH = Math.max(1200, maxPersonsPerGen * 250); // pixels

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      width="100%"
      height="100%"
      style={{
        minHeight: `${(generations.length + 1) * SWIMLANE_HEIGHT}px`,
      }}
    >
      {/* Definir patrones */}
      <defs>
        <pattern
          id="gridPattern"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="0.5" fill="#e5e7eb" />
        </pattern>
      </defs>

      {/* Fondo de patrón (opcional) */}
      <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.3" />

      {/* Swimlanes por generación */}
      {generations.map((generation, index) => {
        const yPosition = SWIMLANE_Y_OFFSET + generation * SWIMLANE_HEIGHT;
        const isEvenGen = generation % 2 === 0;
        const bgColor = isEvenGen ? '#f9fafb' : '#ffffff'; // Alternar colores
        const lineColor = '#d1d5db';

        return (
          <g key={`swimlane-${generation}`}>
            {/* Fondo de swimlane */}
            <rect
              x="0"
              y={yPosition - SWIMLANE_HEIGHT / 2}
              width="100%"
              height={SWIMLANE_HEIGHT}
              fill={bgColor}
              opacity="0.5"
            />

            {/* Línea de separación */}
            <line
              x1="0"
              y1={yPosition}
              x2="100%"
              y2={yPosition}
              stroke={lineColor}
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.6"
            />

            {/* Etiqueta de generación (opcional) */}
            {showLabels && (
              <g>
                {/* Fondo para etiqueta */}
                <rect
                  x="10"
                  y={yPosition - 14}
                  width="140"
                  height="24"
                  fill="white"
                  stroke={lineColor}
                  strokeWidth="1"
                  rx="4"
                />
                {/* Texto de generación */}
                <text
                  x="20"
                  y={yPosition + 2}
                  fontSize="12"
                  fontWeight="600"
                  fill="#6b7280"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  Gen {generation}
                </text>
              </g>
            )}

            {/* Contador de personas en esta generación (opcional) */}
            {showLabels && (
              <text
                x="160"
                y={yPosition + 2}
                fontSize="11"
                fill="#9ca3af"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                ({persons.filter((p) => (p.generation || 0) === generation).length} personas)
              </text>
            )}
          </g>
        );
      })}

      {/* Líneas verticales de referencia (cada 250px) */}
      {Array.from({ length: Math.ceil(SWIMLANE_WIDTH / 250) }).map((_, i) => {
        const xPosition = i * 250;
        return (
          <line
            key={`v-line-${i}`}
            x1={xPosition}
            y1="0"
            x2={xPosition}
            y2="100%"
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}

      {/* Leyenda en esquina inferior derecha */}
      {showLabels && (
        <g transform="translate(calc(100% - 200), calc(100% - 100))">
          <rect
            x="0"
            y="0"
            width="190"
            height="90"
            fill="white"
            stroke="#d1d5db"
            strokeWidth="1"
            rx="4"
            opacity="0.9"
          />
          <text
            x="10"
            y="20"
            fontSize="12"
            fontWeight="600"
            fill="#374151"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Swimlanes Info
          </text>
          <text
            x="10"
            y="40"
            fontSize="11"
            fill="#6b7280"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            • Líneas = generaciones
          </text>
          <text
            x="10"
            y="55"
            fontSize="11"
            fill="#6b7280"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            • Altura = 150px
          </text>
          <text
            x="10"
            y="70"
            fontSize="11"
            fill="#6b7280"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            • Alterna colores
          </text>
        </g>
      )}
    </svg>
  );
}
