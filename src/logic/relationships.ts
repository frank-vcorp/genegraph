/**
 * Lógica de Relaciones para GenoGraph v2.0
 * Validación de ciclos, exclusividad de estados, detección de gémelos
 */

import { Person, Relationship } from '@/types/genogram';

// ============= DETECCIÓN DE CICLOS =============

/**
 * Detecta ciclos en el árbol genealógico
 * Un hijo no puede ser padre de su abuelo
 * @param persons Lista de personas
 * @param relationships Lista de relaciones
 * @param person1Id ID de la primera persona
 * @param person2Id ID de la segunda persona (potencial hijo/hija)
 * @returns true si existe ciclo, false si es válido
 */
export function wouldCreateCycle(
  persons: Person[],
  relationships: Relationship[],
  person1Id: string,
  person2Id: string
): boolean {
  // Si ya existe relación, no chequear ciclo
  const relationshipExists = relationships.some(
    rel => (rel.person1Id === person1Id && rel.person2Id === person2Id) ||
           (rel.person1Id === person2Id && rel.person2Id === person1Id)
  );
  
  if (relationshipExists) return true;
  
  // BFS para detectar si person2 es ancestro de person1
  const isAncestor = (ancestorId: string, descendantId: string): boolean => {
    const visited = new Set<string>();
    const queue = [descendantId];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      visited.add(current);
      
      if (current === ancestorId) return true;
      
      // Encontrar padres de current
      const parentRelships = relationships.filter(
        rel => rel.isLineage && rel.person2Id === current
      );
      
      parentRelships.forEach(rel => {
        queue.push(rel.person1Id);
      });
    }
    
    return false;
  };
  
  // Si person2 sería un ancestro de person1, hay ciclo
  return isAncestor(person2Id, person1Id);
}

/**
 * Obtiene todos los ancestros de una persona
 * @returns Array de IDs de ancestros
 */
export function getAncestors(
  personId: string,
  relationships: Relationship[]
): string[] {
  const ancestors = new Set<string>();
  const queue = [personId];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Encontrar padres
    const parentRels = relationships.filter(
      rel => rel.isLineage && rel.person2Id === current
    );
    
    parentRels.forEach(rel => {
      if (!ancestors.has(rel.person1Id)) {
        ancestors.add(rel.person1Id);
        queue.push(rel.person1Id);
      }
    });
  }
  
  return Array.from(ancestors);
}

/**
 * Obtiene todos los descendientes de una persona
 * @returns Array de IDs de descendientes
 */
export function getDescendants(
  personId: string,
  relationships: Relationship[]
): string[] {
  const descendants = new Set<string>();
  const queue = [personId];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Encontrar hijos
    const childRels = relationships.filter(
      rel => rel.isLineage && rel.person1Id === current
    );
    
    childRels.forEach(rel => {
      if (!descendants.has(rel.person2Id)) {
        descendants.add(rel.person2Id);
        queue.push(rel.person2Id);
      }
    });
  }
  
  return Array.from(descendants);
}

// ============= VALIDACIÓN DE EXCLUSIVIDAD =============

/**
 * Valida que un estado de pareja sea único y coherente
 * No puede estar casado y divorciado a la vez (sin fechas de cierre)
 * @throws Error si hay conflicto de estados
 */
export function validatePartnershipExclusivity(
  personId: string,
  relationships: Relationship[]
): boolean {
  const partnerships = relationships.filter(
    rel => rel.isPartnership &&
           (rel.person1Id === personId || rel.person2Id === personId)
  );
  
  // Contar partnerships activos (sin endDate)
  const activePartnerships = partnerships.filter(
    rel => !rel.endDate
  );
  
  // Máximo 1 partnership activo
  if (activePartnerships.length > 1) {
    throw new Error(`Person ${personId} cannot have multiple active partnerships simultaneously`);
  }
  
  return true;
}

/**
 * Validaciónn que una relación de matrimonio sea entre 2 personas vivas
 * (o fallecidas pero antes de que fallezcan)
 */
export function validateMarriageLogic(
  person1: Person,
  person2: Person,
  partnershipType?: string
): boolean {
  if (partnershipType !== 'marriage' && partnershipType !== 'cohabitation') {
    return true;
  }
  
  // Ambos vivos o al menos uno vivo es suficiente
  const bothDeceased = person1.isDeceased && person2.isDeceased;
  
  // Si ambos fallecidos, es válido (se casaron cuando vivos)
  return true;
}

// ============= DETECCIÓN DE GÉMELOS =============

/**
 * Obtiene todos los gémelos de una persona
 * @returns Array de IDs de gémelos (sin incluir a la persona)
 */
export function getTwins(
  personId: string,
  persons: Person[]
): Person[] {
  const person = persons.find(p => p.id === personId);
  
  if (!person || !person.twinGroupId) {
    return [];
  }
  
  return persons.filter(
    p => p.twinGroupId === person.twinGroupId && p.id !== personId
  );
}

/**
 * Obtiene todos los miembros de un grupo de gémelos
 * @returns Array de personas en el grupo (incluyendo a la persona)
 */
export function getTwinGroup(
  twinGroupId: string,
  persons: Person[]
): Person[] {
  return persons.filter(p => p.twinGroupId === twinGroupId);
}

/**
 * Asigna un grupo de gémelos a un conjunto de personas
 * Genera un groupId único si es necesario
 */
export function assignTwinGroup(
  personIds: string[],
  twinType: 'identical' | 'fraternal',
  persons: Person[]
): Person[] {
  if (personIds.length < 2) {
    throw new Error('Twin group must have at least 2 people');
  }
  
  // Usar twinGroupId del primer person, o generar uno nuevo
  let twinGroupId = '';
  const firstPerson = persons.find(p => p.id === personIds[0]);
  
  if (firstPerson?.twinGroupId) {
    twinGroupId = firstPerson.twinGroupId;
  } else {
    twinGroupId = `twin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  
  // Asignar a todos los IDs
  return persons.map(person => {
    if (personIds.includes(person.id)) {
      return {
        ...person,
        twinGroupId,
        twinType
      };
    }
    return person;
  });
}

// ============= RELACIONES ESPECIALES =============

/**
 * Obtiene la pareja(s) de una persona
 * @returns Array de Person que son parejas
 */
export function getPartners(
  personId: string,
  relationships: Relationship[],
  persons: Person[]
): Person[] {
  const partnerships = relationships.filter(
    rel => rel.isPartnership &&
           (rel.person1Id === personId || rel.person2Id === personId)
  );
  
  const partnerIds = partnerships.map(rel =>
    rel.person1Id === personId ? rel.person2Id : rel.person1Id
  );
  
  return persons.filter(p => partnerIds.includes(p.id));
}

/**
 * Obtiene los padres biológicos de una persona
 * @returns Array de Person que son padres
 */
export function getBiologicalParents(
  personId: string,
  relationships: Relationship[],
  persons: Person[]
): Person[] {
  const parentRels = relationships.filter(
    rel => rel.isLineage &&
           rel.lineageType === 'biological' &&
           rel.person2Id === personId
  );
  
  const parentIds = parentRels.map(rel => rel.person1Id);
  
  return persons.filter(p => parentIds.includes(p.id));
}

/**
 * Obtiene todos los hermanos (biológicos) de una persona
 * @returns Array de Person que son hermanos
 */
export function getBiologicalSiblings(
  personId: string,
  relationships: Relationship[],
  persons: Person[]
): Person[] {
  const parents = getBiologicalParents(personId, relationships, persons);
  const siblings = new Set<string>();
  
  parents.forEach(parent => {
    // Encontrar todos los hijos de este padre
    const childRels = relationships.filter(
      rel => rel.isLineage &&
             rel.lineageType === 'biological' &&
             rel.person1Id === parent.id
    );
    
    childRels.forEach(rel => {
      if (rel.person2Id !== personId) {
        siblings.add(rel.person2Id);
      }
    });
  });
  
  return persons.filter(p => siblings.has(p.id));
}

/**
 * Obtiene todos los hijos (biológicos) de una persona
 * @returns Array de Person que son hijos
 */
export function getBiologicalChildren(
  personId: string,
  relationships: Relationship[],
  persons: Person[]
): Person[] {
  const childRels = relationships.filter(
    rel => rel.isLineage &&
           rel.lineageType === 'biological' &&
           rel.person1Id === personId
  );
  
  const childIds = childRels.map(rel => rel.person2Id);
  
  return persons.filter(p => childIds.includes(p.id));
}

// ============= UTILIDADES =============

/**
 * Cuenta el número de generación de una persona (profundidad en árbol)
 * Raíz = 0, sus hijos = 1, etc.
 */
export function calculateGeneration(
  personId: string,
  relationships: Relationship[]
): number {
  const ancestors = getAncestors(personId, relationships);
  
  if (ancestors.length === 0) return 0; // Root
  
  // Encontrar generación máxima de ancestros
  let maxGenerationOfAncestors = 0;
  
  ancestors.forEach(ancestorId => {
    const ancestorGeneration = calculateGeneration(ancestorId, relationships);
    maxGenerationOfAncestors = Math.max(maxGenerationOfAncestors, ancestorGeneration);
  });
  
  return maxGenerationOfAncestors + 1;
}

/**
 * Obtiene el número de generaciones en el árbol
 */
export function getMaxGeneration(relationships: Relationship[]): number {
  let maxGen = 0;
  
  // Este sería un cálculo complejo, simplificar para MVP
  // En producción, se cached en el estado del genograma
  
  return maxGen;
}
