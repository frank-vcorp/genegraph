#!/bin/bash
# Script para generar íconos PWA

# Crear directorio de íconos si no existe
mkdir -p /workspaces/genegraph/frontend/public/icons

# Crear íconos en SVG y convertir a PNG (usaremos un placeholder simple por ahora)
# Los íconos reales se pueden hacer con herramientas gráficas, pero por MVP usaremos HTML Canvas

cat > /workspaces/genegraph/frontend/generate-icons.mjs << 'EOF'
import fs from 'fs';
import path from 'path';

// Función para generar SVG
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo -->
  <rect width="${size}" height="${size}" fill="#2c3e50"/>
  
  <!-- Círculo (Mujer) y Cuadrado (Hombre) representando un genograma -->
  <circle cx="${size * 0.3}" cy="${size * 0.4}" r="${size * 0.15}" fill="#f8bbd9" stroke="#2c3e50" stroke-width="2"/>
  <rect x="${size * 0.55}" y="${size * 0.25}" width="${size * 0.3}" height="${size * 0.3}" fill="#bbdefb" stroke="#2c3e50" stroke-width="2"/>
  
  <!-- Línea conectora -->
  <line x1="${size * 0.45}" y1="${size * 0.4}" x2="${size * 0.55}" y2="${size * 0.4}" stroke="#7f8c8d" stroke-width="2"/>
  
  <!-- Triángulo (Hijo) -->
  <polygon points="${size * 0.5},${size * 0.75} ${size * 0.35},${size * 0.9} ${size * 0.65},${size * 0.9}" fill="#fff3e0" stroke="#2c3e50" stroke-width="2"/>
  
  <!-- Línea a hijo -->
  <line x1="${size * 0.5}" y1="${size * 0.55}" x2="${size * 0.5}" y2="${size * 0.75}" stroke="#7f8c8d" stroke-width="2"/>
</svg>`;

// Generar SVGs para diferentes tamaños
const sizes = [192, 512];
sizes.forEach(size => {
  fs.writeFileSync(
    path.join('/workspaces/genegraph/frontend/public/icons', `icon-${size}.svg`),
    generateSVG(size)
  );
  console.log(`✅ Generado: icon-${size}.svg`);
});

console.log('✅ Íconos generados exitosamente');
EOF

node /workspaces/genegraph/frontend/generate-icons.mjs
