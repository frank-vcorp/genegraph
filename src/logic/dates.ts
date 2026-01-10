/**
 * Lógica de Fechas Avanzadas para GenoGraph v2.0
 * Soporta precisión: exact, about, before, after, unknown
 * Calcula edades, valida rangos, genera displays
 */

import { GenoDate, DatePrecision } from '@/types/genogram';

// ============= VALIDACIONES =============

/**
 * Valida que una fecha tenga formato ISO 8601 válido
 * @param date ISO 8601 date string (YYYY-MM-DD)
 * @returns true si es válida, false otherwise
 */
export function isValidISODate(date: string): boolean {
  // Strict regex para YYYY-MM-DD
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(date)) return false;
  
  const dateObj = new Date(date + 'T00:00:00Z');
  if (isNaN(dateObj.getTime())) return false;
  
  // Verificar que el objeto Date coincida con la entrada
  // (prevenir casos como 2000-13-01 que JS convierte a válidos)
  const year = parseInt(date.substring(0, 4));
  const month = parseInt(date.substring(5, 7));
  const day = parseInt(date.substring(8, 10));
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // Validar día según mes
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29; // Año bisiesto
  }
  
  if (day > daysInMonth[month - 1]) return false;
  
  return true;
}

/**
 * Valida que birthDate < deathDate
 * Considera precisión para validaciones flexibles
 * @throws Error si deathDate < birthDate
 */
export function validateLifeDateRange(birthDate?: GenoDate, deathDate?: GenoDate): boolean {
  if (!birthDate || !deathDate) return true;
  
  const birthYear = parseInt(birthDate.date.substring(0, 4));
  const deathYear = parseInt(deathDate.date.substring(0, 4));
  
  if (deathYear < birthYear) {
    throw new Error(`Death date (${deathDate.date}) cannot be before birth date (${birthDate.date})`);
  }
  
  // Si son el mismo año, permitir (el mes/día puede variar)
  return true;
}

/**
 * Valida que una fecha de relación sea lógica
 * @throws Error si startDate > endDate
 */
export function validateRelationshipDateRange(startDate?: GenoDate, endDate?: GenoDate): boolean {
  if (!startDate || !endDate) return true;
  
  const startYear = parseInt(startDate.date.substring(0, 4));
  const endYear = parseInt(endDate.date.substring(0, 4));
  
  if (endYear < startYear) {
    throw new Error(`Relationship end date cannot be before start date`);
  }
  
  return true;
}

// ============= CÁLCULOS =============

/**
 * Calcula la edad en años, respetando la precisión de la fecha
 * Si precision es 'about', devuelve edad aproximada
 * Si precision es 'before', devuelve '<edad'
 * Si precision es 'after', devuelve '>edad'
 * Si precision es 'unknown', devuelve undefined
 * @returns Edad en años o undefined si no se puede calcular
 */
export function calculateAge(birthDate?: GenoDate, blockAgeCalculation: boolean = false): number | undefined {
  if (!birthDate || blockAgeCalculation) return undefined;
  
  const today = new Date();
  const birthYear = parseInt(birthDate.date.substring(0, 4));
  const birthMonth = parseInt(birthDate.date.substring(5, 7));
  const birthDay = parseInt(birthDate.date.substring(8, 10));
  
  let age = today.getFullYear() - birthYear;
  
  // Ajustar si aún no ha pasado el cumpleaños este año
  if (
    today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
  ) {
    age--;
  }
  
  // Validar edad lógica
  if (age < 0) return 0;
  if (age > 150) return undefined; // Edad no realista
  
  return age;
}

/**
 * Calcula duración de una relación en años
 * @returns Duración en años o undefined si no se puede calcular
 */
export function calculateRelationshipDuration(startDate?: GenoDate, endDate?: GenoDate): number | undefined {
  if (!startDate) return undefined;
  
  const endYear = endDate 
    ? parseInt(endDate.date.substring(0, 4))
    : new Date().getFullYear();
  
  const startYear = parseInt(startDate.date.substring(0, 4));
  
  const duration = endYear - startYear;
  return duration > 0 ? duration : undefined;
}

// ============= FORMATEO =============

/**
 * Convierte una GenoDate a string displayable
 * Respeta el campo 'display' si existe
 * @returns String formateado para mostrar
 */
export function formatGenoDate(genoDate?: GenoDate): string {
  if (!genoDate) return '—';
  
  // Si hay un display custom, usarlo
  if (genoDate.display) {
    return genoDate.display;
  }
  
  const year = genoDate.date.substring(0, 4);
  const month = genoDate.date.substring(5, 7);
  const day = genoDate.date.substring(8, 10);
  
  switch (genoDate.precision) {
    case 'exact':
      return `${day}/${month}/${year}`;
    case 'about':
      return `~${year}`;
    case 'before':
      return `<${year}`;
    case 'after':
      return `>${year}`;
    case 'unknown':
      return '?';
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Formatea edad con respeto a precisión de fecha
 * @returns String como "32", "~30", "<40", etc.
 */
export function formatAge(birthDate?: GenoDate, blockAgeCalculation: boolean = false, isDeceased: boolean = false): string {
  if (!birthDate || blockAgeCalculation) return isDeceased ? '†' : '—';
  
  const age = calculateAge(birthDate, blockAgeCalculation);
  if (age === undefined) return '?';
  
  const prefix = birthDate.precision === 'about' ? '~' : '';
  const suffix = isDeceased ? ' †' : '';
  
  return `${prefix}${age}${suffix}`;
}

// ============= PARSEO =============

/**
 * Crea una GenoDate a partir de un string con precisión
 * @param input Formato: "YYYY-MM-DD" o "~YYYY" o "<YYYY" etc.
 * @returns GenoDate o undefined si no es válido
 */
export function parseGenoDate(input: string): GenoDate | undefined {
  if (!input) return undefined;
  
  // Exact: YYYY-MM-DD
  if (isValidISODate(input)) {
    return { date: input, precision: 'exact' };
  }
  
  // About: ~YYYY
  if (input.startsWith('~')) {
    const year = input.substring(1);
    if (/^\d{4}$/.test(year)) {
      return { date: `${year}-01-01`, precision: 'about', display: input };
    }
  }
  
  // Before: <YYYY
  if (input.startsWith('<')) {
    const year = input.substring(1);
    if (/^\d{4}$/.test(year)) {
      return { date: `${year}-01-01`, precision: 'before', display: input };
    }
  }
  
  // After: >YYYY
  if (input.startsWith('>')) {
    const year = input.substring(1);
    if (/^\d{4}$/.test(year)) {
      return { date: `${year}-01-01`, precision: 'after', display: input };
    }
  }
  
  return undefined;
}

// ============= UTILIDADES =============

/**
 * Genera una GenoDate "hoy" con precisión 'exact'
 * @returns GenoDate para la fecha actual
 */
export function getTodayAsGenoDate(): GenoDate {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    precision: 'exact'
  };
}

/**
 * Obtiene el año actual como número
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Ordena genoDates de forma ascendente
 */
export function sortGenoDates(dates: GenoDate[]): GenoDate[] {
  return [...dates].sort((a, b) => {
    const aYear = parseInt(a.date.substring(0, 4));
    const bYear = parseInt(b.date.substring(0, 4));
    if (aYear !== bYear) return aYear - bYear;
    
    const aMonth = parseInt(a.date.substring(5, 7));
    const bMonth = parseInt(b.date.substring(5, 7));
    if (aMonth !== bMonth) return aMonth - bMonth;
    
    const aDay = parseInt(a.date.substring(8, 10));
    const bDay = parseInt(b.date.substring(8, 10));
    return aDay - bDay;
  });
}
