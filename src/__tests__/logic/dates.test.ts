/**
 * Tests para lógica de fechas (GenoGraph v2.0)
 * Cubre: validación, cálculo de edad, formateo, parseo
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isValidISODate,
  validateLifeDateRange,
  validateRelationshipDateRange,
  calculateAge,
  calculateRelationshipDuration,
  formatGenoDate,
  formatAge,
  parseGenoDate,
  getTodayAsGenoDate,
  getCurrentYear,
  sortGenoDates,
} from '@/logic/dates';
import { GenoDate } from '@/types/genogram';

describe('Dates Logic', () => {
  // ============= isValidISODate =============
  describe('isValidISODate', () => {
    it('valida fechas ISO correctas', () => {
      expect(isValidISODate('2000-01-15')).toBe(true);
      expect(isValidISODate('1990-12-31')).toBe(true);
      expect(isValidISODate('2025-02-28')).toBe(true);
    });

    it('rechaza formatos inválidos', () => {
      expect(isValidISODate('15/01/2000')).toBe(false);
      expect(isValidISODate('2000-1-15')).toBe(false);
      expect(isValidISODate('2000-13-01')).toBe(false);
      expect(isValidISODate('1900-02-29')).toBe(false); // 1900 NO es bisiesto
      expect(isValidISODate('2001-02-29')).toBe(false); // 2001 NO es bisiesto
    });

    it('rechaza strings vacíos', () => {
      expect(isValidISODate('')).toBe(false);
    });
  });

  // ============= validateLifeDateRange =============
  describe('validateLifeDateRange', () => {
    it('valida que nacimiento sea antes que muerte', () => {
      const birth: GenoDate = { date: '1950-01-01', precision: 'exact' };
      const death: GenoDate = { date: '2020-12-31', precision: 'exact' };
      
      expect(validateLifeDateRange(birth, death)).toBe(true);
    });

    it('rechaza cuando muerte es antes que nacimiento', () => {
      const birth: GenoDate = { date: '2020-12-31', precision: 'exact' };
      const death: GenoDate = { date: '1950-01-01', precision: 'exact' };
      
      expect(() => validateLifeDateRange(birth, death)).toThrow();
    });

    it('permite muerte en el mismo año de nacimiento', () => {
      const birth: GenoDate = { date: '2000-01-01', precision: 'exact' };
      const death: GenoDate = { date: '2000-12-31', precision: 'exact' };
      
      expect(validateLifeDateRange(birth, death)).toBe(true);
    });

    it('permite valores undefined', () => {
      const birth: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(validateLifeDateRange(birth, undefined)).toBe(true);
      expect(validateLifeDateRange(undefined, undefined)).toBe(true);
    });
  });

  // ============= validateRelationshipDateRange =============
  describe('validateRelationshipDateRange', () => {
    it('valida que inicio sea antes que fin', () => {
      const start: GenoDate = { date: '2000-01-01', precision: 'exact' };
      const end: GenoDate = { date: '2010-12-31', precision: 'exact' };
      
      expect(validateRelationshipDateRange(start, end)).toBe(true);
    });

    it('rechaza cuando fin es antes que inicio', () => {
      const start: GenoDate = { date: '2010-12-31', precision: 'exact' };
      const end: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(() => validateRelationshipDateRange(start, end)).toThrow();
    });

    it('permite undefined', () => {
      const start: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(validateRelationshipDateRange(start, undefined)).toBe(true);
      expect(validateRelationshipDateRange(undefined, undefined)).toBe(true);
    });
  });

  // ============= calculateAge =============
  describe('calculateAge', () => {
    it('calcula edad correcta con nacimiento conocido', () => {
      const birthDate: GenoDate = { 
        date: `${getCurrentYear() - 30}-06-15`, 
        precision: 'exact' 
      };
      
      const age = calculateAge(birthDate, false);
      expect(age).toBeGreaterThanOrEqual(29);
      expect(age).toBeLessThanOrEqual(30);
    });

    it('retorna undefined si blockAgeCalculation es true', () => {
      const birthDate: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(calculateAge(birthDate, true)).toBeUndefined();
    });

    it('retorna undefined si no hay fecha de nacimiento', () => {
      expect(calculateAge(undefined, false)).toBeUndefined();
    });

    it('retorna 0 para edades negativas', () => {
      const birthDate: GenoDate = { date: `${getCurrentYear() + 5}-01-01`, precision: 'exact' };
      
      expect(calculateAge(birthDate, false)).toBe(0);
    });

    it('rechaza edades >150', () => {
      const birthDate: GenoDate = { date: '1800-01-01', precision: 'exact' };
      
      expect(calculateAge(birthDate, false)).toBeUndefined();
    });
  });

  // ============= calculateRelationshipDuration =============
  describe('calculateRelationshipDuration', () => {
    it('calcula duración correcta', () => {
      const start: GenoDate = { date: '2000-01-01', precision: 'exact' };
      const end: GenoDate = { date: '2010-12-31', precision: 'exact' };
      
      expect(calculateRelationshipDuration(start, end)).toBe(10);
    });

    it('usa año actual si no hay endDate', () => {
      const start: GenoDate = { date: `${getCurrentYear() - 5}-01-01`, precision: 'exact' };
      
      const duration = calculateRelationshipDuration(start, undefined);
      expect(duration).toBeGreaterThanOrEqual(4);
      expect(duration).toBeLessThanOrEqual(6);
    });

    it('retorna undefined sin startDate', () => {
      expect(calculateRelationshipDuration(undefined, undefined)).toBeUndefined();
    });

    it('retorna undefined si duración es negativa', () => {
      const start: GenoDate = { date: '2020-01-01', precision: 'exact' };
      const end: GenoDate = { date: '2010-12-31', precision: 'exact' };
      
      expect(calculateRelationshipDuration(start, end)).toBeUndefined();
    });
  });

  // ============= formatGenoDate =============
  describe('formatGenoDate', () => {
    it('formatea fecha exact como DD/MM/YYYY', () => {
      const date: GenoDate = { date: '2000-06-15', precision: 'exact' };
      
      expect(formatGenoDate(date)).toBe('15/06/2000');
    });

    it('formatea fecha about como ~YYYY', () => {
      const date: GenoDate = { date: '1990-01-01', precision: 'about' };
      
      expect(formatGenoDate(date)).toBe('~1990');
    });

    it('formatea fecha before como <YYYY', () => {
      const date: GenoDate = { date: '1980-01-01', precision: 'before' };
      
      expect(formatGenoDate(date)).toBe('<1980');
    });

    it('formatea fecha after como >YYYY', () => {
      const date: GenoDate = { date: '2010-01-01', precision: 'after' };
      
      expect(formatGenoDate(date)).toBe('>2010');
    });

    it('formatea fecha unknown como ?', () => {
      const date: GenoDate = { date: '2000-01-01', precision: 'unknown' };
      
      expect(formatGenoDate(date)).toBe('?');
    });

    it('usa display custom si existe', () => {
      const date: GenoDate = { 
        date: '1990-01-01', 
        precision: 'about',
        display: 'Invierno 1990'
      };
      
      expect(formatGenoDate(date)).toBe('Invierno 1990');
    });

    it('retorna —si no hay fecha', () => {
      expect(formatGenoDate(undefined)).toBe('—');
    });
  });

  // ============= formatAge =============
  describe('formatAge', () => {
    it('formatea edad simple', () => {
      const birthDate: GenoDate = { 
        date: `${getCurrentYear() - 30}-01-01`, 
        precision: 'exact' 
      };
      
      const age = formatAge(birthDate, false, false);
      expect(age).toMatch(/^[2-3]\d$/);
    });

    it('añade ~ para precisión about', () => {
      const birthDate: GenoDate = { 
        date: `${getCurrentYear() - 30}-01-01`, 
        precision: 'about' 
      };
      
      const age = formatAge(birthDate, false, false);
      expect(age).toMatch(/^~[2-3]\d$/);
    });

    it('añade † si fallecido', () => {
      const birthDate: GenoDate = { 
        date: `${getCurrentYear() - 60}-01-01`, 
        precision: 'exact' 
      };
      
      const age = formatAge(birthDate, false, true);
      expect(age).toMatch(/†$/);
    });

    it('retorna † si blockAgeCalculation y fallecido', () => {
      const birthDate: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(formatAge(birthDate, true, true)).toBe('†');
    });

    it('retorna — si blockAgeCalculation y vivo', () => {
      const birthDate: GenoDate = { date: '2000-01-01', precision: 'exact' };
      
      expect(formatAge(birthDate, true, false)).toBe('—');
    });
  });

  // ============= parseGenoDate =============
  describe('parseGenoDate', () => {
    it('parsea fecha ISO exacta', () => {
      const result = parseGenoDate('2000-06-15');
      
      expect(result).toEqual({
        date: '2000-06-15',
        precision: 'exact'
      });
    });

    it('parsea fecha approximate ~YYYY', () => {
      const result = parseGenoDate('~1990');
      
      expect(result).toEqual({
        date: '1990-01-01',
        precision: 'about',
        display: '~1990'
      });
    });

    it('parsea fecha before <YYYY', () => {
      const result = parseGenoDate('<1980');
      
      expect(result).toEqual({
        date: '1980-01-01',
        precision: 'before',
        display: '<1980'
      });
    });

    it('parsea fecha after >YYYY', () => {
      const result = parseGenoDate('>2010');
      
      expect(result).toEqual({
        date: '2010-01-01',
        precision: 'after',
        display: '>2010'
      });
    });

    it('retorna undefined para formato inválido', () => {
      expect(parseGenoDate('invalid')).toBeUndefined();
      expect(parseGenoDate('15/06/2000')).toBeUndefined();
      expect(parseGenoDate('~xx')).toBeUndefined();
    });

    it('retorna undefined para string vacío', () => {
      expect(parseGenoDate('')).toBeUndefined();
    });
  });

  // ============= getTodayAsGenoDate =============
  describe('getTodayAsGenoDate', () => {
    it('retorna fecha de hoy con precisión exact', () => {
      const today = getTodayAsGenoDate();
      
      expect(today.precision).toBe('exact');
      expect(today.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('la fecha es válida ISO', () => {
      const today = getTodayAsGenoDate();
      
      expect(isValidISODate(today.date)).toBe(true);
    });
  });

  // ============= sortGenoDates =============
  describe('sortGenoDates', () => {
    it('ordena fechas de forma ascendente', () => {
      const dates: GenoDate[] = [
        { date: '2010-01-01', precision: 'exact' },
        { date: '1990-01-01', precision: 'exact' },
        { date: '2000-12-31', precision: 'exact' },
      ];
      
      const sorted = sortGenoDates(dates);
      
      expect(sorted[0].date).toBe('1990-01-01');
      expect(sorted[1].date).toBe('2000-12-31');
      expect(sorted[2].date).toBe('2010-01-01');
    });

    it('mantiene fechas en mismo año ordenadas por mes/día', () => {
      const dates: GenoDate[] = [
        { date: '2000-12-31', precision: 'exact' },
        { date: '2000-01-01', precision: 'exact' },
        { date: '2000-06-15', precision: 'exact' },
      ];
      
      const sorted = sortGenoDates(dates);
      
      expect(sorted[0].date).toBe('2000-01-01');
      expect(sorted[1].date).toBe('2000-06-15');
      expect(sorted[2].date).toBe('2000-12-31');
    });

    it('no modifica array original', () => {
      const dates: GenoDate[] = [
        { date: '2010-01-01', precision: 'exact' },
        { date: '1990-01-01', precision: 'exact' },
      ];
      
      const sorted = sortGenoDates(dates);
      
      expect(dates[0].date).toBe('2010-01-01');
      expect(sorted[0].date).toBe('1990-01-01');
    });
  });
});
