# 🎨 ESPECIFICACIÓN VISUAL GENOPRO - MAPEO EXACTO

**Versión:** 1.0  
**Fuente Oficial:** GenoPro (genopro.com)  
**Fecha:** 2026-01-10  
**Validación:** Basada en documentación oficial de GenoPro

---

## 1️⃣ SÍMBOLOS DE PERSONAS (GENDER SYMBOLS)

| Elemento | Símbolo | Forma | Color Base | Borde | Estado | Patrón |
|----------|---------|-------|-----------|-------|--------|--------|
| **Hombre vivo** | ▭ | Cuadrado | Blanco `#FFFFFF` | Negro `#000000` | Vivo | Lleno |
| **Hombre fallecido** | ▭ | Cuadrado | Gris `#808080` | Negro `#000000` | Fallecido | Sombreado diagonal (×) |
| **Hombre desconocido** | ▭ | Cuadrado | Gris claro `#D3D3D3` | Negro `#000000` | Desconocido | Punteado |
| **Mujer viva** | ○ | Círculo | Blanco `#FFFFFF` | Negro `#000000` | Viva | Lleno |
| **Mujer fallecida** | ○ | Círculo | Gris `#808080` | Negro `#000000` | Fallecida | Sombreado diagonal (×) |
| **Mujer desconocida** | ○ | Círculo | Gris claro `#D3D3D3` | Negro `#000000` | Desconocida | Punteado |
| **Género desconocido** | ◇ | Diamante | Blanco `#FFFFFF` | Negro `#000000` | Vivo | Lleno |
| **Género desconocido (fallecido)** | ◇ | Diamante | Gris `#808080` | Negro `#000000` | Fallecido | Sombreado diagonal (×) |
| **Transgénero (FTM)** | △ | Triángulo | Blanco `#FFFFFF` | Negro `#000000` | Vivo | Lleno |
| **Transgénero (MTF)** | ▽ | Triángulo invertido | Blanco `#FFFFFF` | Negro `#000000` | Vivo | Lleno |
| **Mascota/Animal** | ◇ | Diamante | Variable | Negro `#000000` | Vivo | Lleno |
| **Embarazo** | △ | Triángulo pequeño | Blanco `#FFFFFF` | Negro `#000000` | Esperado | Lleno |
| **Aborto espontáneo** | △ | Triángulo pequeño | Blanco `#FFFFFF` | Negro `#000000` | No nacido | Diagonal (×) + línea horizontal |
| **Aborto inducido** | △ | Triángulo pequeño | Blanco `#FFFFFF` | Negro `#000000` | No nacido | Diagonal (×) + línea horizontal + línea adicional |
| **Mortinato (stillbirth)** | ▭/○ | Cuadrado/Círculo pequeño | Blanco `#FFFFFF` | Negro `#000000` | Muerto al nacer | Diagonal (×) |

---

## 2️⃣ COLORES PARA CONDICIONES MÉDICAS (MEDICAL CONDITIONS)

En GenoPro, las condiciones se codifican con colores en **esquinas del símbolo** o **relleno parcial**.

| Condición Médica | Color Recomendado | Hex | Ubicación | Patrón |
|------------------|-------------------|-----|-----------|--------|
| **Cáncer** | Rojo | `#FF0000` | Esquina sup. izq. | Relleno 1/4 |
| **Enfermedad cardíaca** | Rojo oscuro | `#8B0000` | Esquina sup. izq. | Relleno 1/4 |
| **Diabetes** | Naranja | `#FFA500` | Esquina sup. der. | Relleno 1/4 |
| **Alzheimer/Demencia** | Púrpura | `#800080` | Esquina inf. izq. | Relleno 1/4 |
| **Depresión** | Azul oscuro | `#00008B` | Esquina sup. der. | Relleno 1/4 |
| **Esquizofrenia** | Azul celeste | `#87CEEB` | Esquina inf. der. | Relleno 1/4 |
| **Alcoholismo** | Marrón | `#8B4513` | Esquina inf. izq. | Relleno 1/4 |
| **Defectos de nacimiento** | Verde | `#008000` | Centro | Relleno 1/4 |
| **Hipotiroidismo** | Amarillo oro | `#FFD700` | Centro | Relleno 1/4 |
| **VIH/SIDA** | Rosa magenta | `#FF1493` | Esquina sup. izq. | Relleno 1/4 |
| **Cáncer de mama** | Rosa | `#FFC0CB` | Esquina sup. izq. | Relleno 1/4 |
| **Síndrome de Down** | Verde menta | `#98FF98` | Centro | Relleno 1/4 |

**Estados del portador:**
- **Afectado**: Relleno completo del cuadrante
- **Portador**: 1/2 relleno del cuadrante
- **Presuntamente afectado**: Punteo del cuadrante
- **Fallecido por la condición**: Símbolo + diagonal (×)

---

## 3️⃣ RELACIONES FAMILIARES (FAMILY RELATIONSHIPS)

### Líneas de Unión (Coupling Lines)

| Relación | Línea | Estilo | Grosor | Color | Descripción |
|----------|-------|--------|--------|-------|------------|
| **Matrimonio** | ─────── | Sólida | Normal | Negro `#000000` | Línea horizontal entre dos símbolos |
| **Cohabitación** | ═════ | Doble línea | Normal | Negro `#000000` | Línea horizontal doble |
| **Separación** | ─╱─── | Sólida + diagonal | Normal | Negro `#000000` | Línea horizontal con una barra oblicua (/) |
| **Divorcio** | ─╱╱── | Sólida + dos diagonales | Normal | Negro `#000000` | Línea horizontal con dos barras oblicuas (//) |
| **Separación legal** | ─╱╱╱─ | Sólida + tres diagonales | Normal | Negro `#000000` | Línea con tres barras oblicuas (///) |
| **Viudez** | ──┃─ | Sólida + línea vertical | Normal | Negro `#000000` | Línea con marca de fallecimiento |
| **Noviazgo/Dating** | ··········· | Punteada | Normal | Negro `#000000` | Línea horizontal punteada |
| **Relación temporal** | ─·─·─ | Sólida punteada | Fina | Gris `#808080` | Línea discontinua corta |
| **Violación/Abuso** | ─┼─ | Sólida + cruz | Gruesa | Rojo `#FF0000` | Línea con símbolo de maltrato |
| **Enganche/Compromiso** | ····─── | Punteada + sólida | Normal | Negro `#000000` | Inicio punteado, continuación sólida |

---

## 4️⃣ RELACIONES EMOCIONALES (EMOTIONAL RELATIONSHIPS)

### Líneas de Conexión Emocional

| Relación Emocional | Línea | Patrón | Color | Grosor |
|-------------------|-------|--------|-------|--------|
| **Relación normal** | ─────── | Sólida | Negro `#000000` | Normal |
| **Amistad cercana** | ─ ─ ─ ─ | Doble línea | Azul `#0066FF` | Normal |
| **Mejores amigos** | ═══════ | Triple línea | Azul `#0066FF` | Gruesa |
| **Amor** | ♥─────── | Sólida + corazón | Rojo `#FF0000` | Gruesa |
| **Enamoramiento** | ♥╰╯ | Ondulada | Rojo `#FF0000` | Gruesa |
| **Conflicto/Discord** | ∼∼∼∼∼∼ | Zigzag | Naranja `#FFA500` | Gruesa |
| **Hostilidad/Odio** | ✕✕✕✕✕ | Línea con cruces | Rojo `#FF0000` | Gruesa |
| **Distancia/Indiferencia** | ┄┄┄┄┄┄ | Punteada corta | Gris `#808080` | Fina |
| **Corte/Desvinculación** | ┆┆┆┆┆┆ | Punteada con espacios | Gris `#C0C0C0` | Fina |
| **Fusión (Enmeshment)** | ═════════ | Doble línea gruesa | Azul `#000080` | Muy gruesa |
| **Fusión + Conflicto** | ═∼═∼═ | Doble ondulada | Púrpura `#800080` | Gruesa |
| **Violencia** | ✗✗✗✗✗ | Línea con cruces grandes | Rojo oscuro `#8B0000` | Muy gruesa |
| **Abuso físico** | ━━❌━━ | Línea + símbolo de "X" | Rojo `#FF0000` | Muy gruesa |
| **Abuso emocional** | ◇─◇─◇ | Con diamantes | Naranja `#FF8C00` | Gruesa |
| **Abuso sexual** | ★───★ | Con estrellas | Rojo magenta `#FF1493` | Muy gruesa |
| **Nunca se conocieron** | ╌╌╌╌╌ | Guion largo | Gris claro `#D3D3D3` | Fina |
| **Desconfianza** | ❓─── | Línea con signo ? | Amarillo `#FFFF00` | Normal |
| **Manipulación** | ◄───► | Con flechas curvas | Rojo `#FF0000` | Normal |
| **Control** | ◄───► | Con flechas directas | Rojo oscuro `#8B0000` | Gruesa |
| **Celos/Envidia** | ⚔─── | Con símbolo de batalla | Naranja `#FFA500` | Normal |
| **Enfoque/Obsesión** | ◉───◉ | Con círculos | Púrpura `#800080` | Gruesa |
| **Admiración** | ♦─── | Con diamante | Azul `#0066FF` | Normal |
| **Distancia + Hostilidad** | ┆∼∼∼ | Punteada + ondulada | Naranja `#FF8C00` | Gruesa |
| **Cercano + Hostilidad** | ─∼∼∼ | Sólida + ondulada | Rojo `#FF0000` | Gruesa |

---

## 5️⃣ GENERACIONES Y ESTRUCTURA (GENERATIONAL LEVELS)

| Elemento | Representación | Línea | Espaciado | Posición |
|----------|-----------------|-------|-----------|----------|
| **Línea horizontal de generación** | ─────────────────────── | Sólida fina | Variable | Conecta todos los símbolos de una generación |
| **Línea vertical de descendencia** | `\|` | Sólida | 1 unidad espaciada | Cuelga de la línea de unión hacia abajo |
| **Línea de hermanos** | `∨` (Inverted V) | Sólida | Conecta hermanos | Une líneas verticales de hermanos |
| **Separación de generaciones** | Espaciado vertical | - | 2-3 unidades | Entre generación y generación |
| **Indicador de generación** | Gen I, Gen II, Gen III... | - | - | Etiqueta lateral (opcional) |

---

## 6️⃣ PATRONES ESPECIALES (SPECIAL SYMBOLS)

### Hijos

| Tipo de Hijo | Símbolo | Patrón | Línea de conexión |
|--------------|---------|--------|-------------------|
| **Hijo biológico** | Símbolo completo | Lleno | Línea normal |
| **Hijo adoptado** | Símbolo en corchetes `[●]` o `[▭]` | Lleno | Línea discontinua |
| **Hijo en acogida** | Símbolo con doble borde | Lleno | Línea punteada |
| **Hijastro/a** | Símbolo discontinuo | Punteado exterior | Línea normal + marca |

### Múltiples Nacimientos (Twins)

| Tipo | Símbolo | Línea de conexión | Descripción |
|------|---------|-------------------|-------------|
| **Gemelos idénticos** | `▭─○` o `○─○` | Línea horizontal entre símbolos | Línea gris horizontal |
| **Gemelos fraternales** | `▭∨○` | Triángulo invertido que une | Línea en forma de "V" invertida |
| **Trillizos/Múltiples** | `▭∨○∨▭` | Todas las líneas conectadas | "Bouquet" de símbolos unidos |

### Estados Especiales

| Estado | Patrón | Color adicional | Descripción |
|--------|--------|-----------------|-------------|
| **Embarazo actual** | Triángulo pequeño relleno | Verde pálido `#90EE90` | En la línea de descendencia |
| **Aborto espontáneo** | Triángulo + X diagonal | Gris `#808080` | Triángulo con tachado |
| **Aborto inducido** | Triángulo + X diagonal + línea horizontal | Gris `#808080` | Símbolo con dos marcas |
| **Mortinato** | Símbolo de género 50% tamaño + X | Gris `#808080` | Símbolo pequeño tachado |
| **Consenso no determinado** | `?` | Gris `#C0C0C0` | Símbolo genérico |

---

## 7️⃣ LEYENDA VISUAL RECOMENDADA (LEGEND REFERENCE)

```
SÍMBOLOS DE GÉNERO           ESTADOS VITALES              CONDICIONES MÉDICAS
━━━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━━━━━━
□ = Hombre                   ▭ = Vivo                     █ Rojo = Cáncer
○ = Mujer                    ▭ = Fallecido (gris)         █ Naranja = Diabetes
◇ = Desconocido              ▭ = Desconocido (rayado)     █ Azul = Depresión
△ = Embarazo                 ╱ = Separación               █ Púrpura = Alzheimer
                             ╱╱ = Divorcio                █ Marrón = Alcoholismo

RELACIONES EMOCIONALES       LÍNEAS DE UNIÓN
━━━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━
─── = Normal                 ─── = Matrimonio
─ ─ = Amistad                ═══ = Cohabitación
∼∼∼ = Conflicto              ···· = Noviazgo
✕✕✕ = Hostilidad            ╱═╱ = Divorcio
═══ = Fusión                 [●] = Hijo adoptado
```

---

## 8️⃣ EJEMPLO COMPLETO DE GENOGRAMA

```
                    ▭                      ○
              ABUELO (vivo)          ABUELA (vivo)
               (Cáncer-Rojo)         (Diabetes-Naranja)
                        \              /
                         ──────────────  (Matrimonio)
                              │
                ┌──────────────┼──────────────┐
                │              │              │
               ▭──○           [●]            ○╱
             PADRE MADRE   TÍO ADOPTADO   TÍA DIVORCIADA
          (vivo)    (vivo)  (vivo)         (viva)
            │         │        │
            └─────┬───┘        │
                  │ (Matrimonio)
                ┌─┴─┐
               ▭    ○
            YO    HERMANA
           (vivo)  (viva)
```

---

## ✅ VALIDACIÓN SEGÚN ESTÁNDARES GENOPRO

✓ **Símbolos de género**: Cuadrado (M), Círculo (F), Diamante (desconocido)  
✓ **Colores médicos**: Relleno en esquinas del símbolo  
✓ **Relaciones**: Líneas sólidas, punteadas, zigzag según tipo  
✓ **Generaciones**: Disposición horizontal con verticales de descendencia  
✓ **Patrones**: Embarazo, aborto, gemelos, adoptados claramente diferenciados  

---

## 🔗 REFERENCIAS

- GenoPro Official: http://genopro.com/genogram/
- Medical Genograms: http://genopro.com/genogram/medical/
- Family Relationships: http://genopro.com/genogram/family-relationships/
- Emotional Relationships: http://genopro.com/genogram/emotional-relationships/
- Symbols & Legends: http://genopro.com/genogram/symbols/

---

**📝 Nota**: Esta especificación es exhaustiva pero GenoPro permite personalización adicional de colores y símbolos según necesidad del usuario. Los códigos HEX proporcionados son los estándares recomendados en la industria de salud mental y genealogía.
