import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Función para generar SVG
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo -->
  <rect width="${size}" height="${size}" fill="#2c3e50"/>
  
  <!-- Círculo (Mujer) y Cuadrado (Hombre) representando un genograma -->
  <circle cx="${size * 0.3}" cy="${size * 0.4}" r="${size * 0.15}" fill="#f8bbd9" stroke="#ffffff" stroke-width="3"/>
  <rect x="${size * 0.55}" y="${size * 0.25}" width="${size * 0.3}" height="${size * 0.3}" fill="#bbdefb" stroke="#ffffff" stroke-width="3"/>
  
  <!-- Línea conectora -->
  <line x1="${size * 0.45}" y1="${size * 0.4}" x2="${size * 0.55}" y2="${size * 0.4}" stroke="#ffffff" stroke-width="3"/>
  
  <!-- Triángulo (Hijo) -->
  <polygon points="${size * 0.5},${size * 0.75} ${size * 0.35},${size * 0.9} ${size * 0.65},${size * 0.9}" fill="#fff3e0" stroke="#ffffff" stroke-width="3"/>
  
  <!-- Línea a hijo -->
  <line x1="${size * 0.5}" y1="${size * 0.55}" x2="${size * 0.5}" y2="${size * 0.75}" stroke="#ffffff" stroke-width="3"/>
</svg>`;

// Crear directorio de íconos
const iconDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generar SVGs para diferentes tamaños
const sizes = [192, 512];
sizes.forEach(size => {
  fs.writeFileSync(
    path.join(iconDir, `icon-${size}.svg`),
    generateSVG(size)
  );
  console.log(`✅ Generado: icon-${size}.svg`);
});

console.log('✅ Todos los íconos generados exitosamente');
