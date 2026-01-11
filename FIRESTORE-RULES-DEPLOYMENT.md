# Firebase Security Rules - Deployment Guide

## 📋 Descripción

Este archivo documenta cómo desplegar las Firestore Security Rules en Firebase.

## 📄 Archivo de Reglas

Ubicación: `/firestore.rules`

## 🔒 Estructura de Seguridad

```
users/{uid}/                          ← Solo uid puede acceder
  ├─ genograms/{genogramId}/          ← Heredado: solo uid
  │  ├─ persons/{personId}            ← Heredado: solo uid
  │  └─ relationships/{relationshipId} ← Heredado: solo uid
```

## 📋 Reglas Implementadas

### 1. User Documents
- ✅ `allow read, write: if request.auth.uid == uid`
- Solo el usuario autenticado puede leer/escribir su propio documento

### 2. Genograms
- ✅ `allow read, write: if request.auth.uid == uid`
- Usuario solo puede acceder a sus propios genogramas
- No hay genogramas "públicos" sin autorización explícita

### 3. Persons (sub-collection)
- ✅ Hereda permisos del padre (genogram)
- ✅ Validación: requiere `name` y `gender`
- ✅ No permite documentos vacíos

### 4. Relationships (sub-collection)
- ✅ Hereda permisos del padre
- ✅ Validación: requiere `sourceId`, `targetId`, `relationType`

## 🚀 Deployment

### Opción 1: Firebase CLI (Recomendado)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Autenticarse
firebase login

# 3. Inicializar Firebase en el proyecto (si no está hecho)
firebase init firestore

# 4. Desplegar solo las reglas
firebase deploy --only firestore:rules

# 5. Verificar (opcional)
firebase firestore:indexes
```

### Opción 2: Firebase Console (Manual)

1. Ir a https://console.firebase.google.com
2. Seleccionar proyecto
3. Firestore Database → Rules
4. Copiar contenido de `firestore.rules`
5. Pegar en editor web
6. Click "Publish"

## 🧪 Testing las Reglas

### Firebase Emulator (Local Testing)

```bash
# 1. Instalar emulators
firebase init emulators

# 2. Iniciar emulators
firebase emulators:start

# 3. Ejecutar tests
firebase emulators:exec 'npm test'
```

### Test Manual en Firebase Console

1. Ir a Firestore Database
2. Seleccionar "Rules" tab
3. Click "Test" en la esquina superior derecha
4. Crear casos de test:

**Test 1: Escribir a propio usuario (debe pasar)**
```javascript
// Path: users/user123/genograms/gen1
// Auth: user123
// Action: write
// Expected: ALLOW
```

**Test 2: Escribir a usuario diferente (debe fallar)**
```javascript
// Path: users/user456/genograms/gen1
// Auth: user123
// Action: write
// Expected: DENY
```

**Test 3: Leer sin autenticación (debe fallar)**
```javascript
// Path: users/user123
// Auth: null
// Action: read
// Expected: DENY
```

## ⚠️ Consideraciones de Seguridad

### ✅ Implementado
- [x] Owner-only access pattern
- [x] No lectura cross-user
- [x] Validación de campos requeridos
- [x] Sub-colecciones protegidas

### 📋 Pendiente (Futuro)
- [ ] Rate limiting
- [ ] Data size limits
- [ ] Timestamp validation
- [ ] Soft delete pattern (is_deleted field)

## 🔄 Actualización de Reglas

Cuando cambies los datos o estructura:

1. Actualizar `firestore.rules`
2. Testear en emulator local
3. `firebase deploy --only firestore:rules`
4. Verificar en Console que las reglas sean publicadas

## 📞 Troubleshooting

### "Permission denied" en app
- Verificar que `request.auth.uid == uid` coincida
- Revisar que user está autenticado
- Check browser console para uid exacto

### "Invalid rule syntax"
- Validar sintaxis en https://firebase.google.com/docs/firestore/security/get-started
- Usar Firebase CLI: `firebase deploy --only firestore:rules` (da errores claros)

### Rules no se actualizan
- Refrescar página en console
- Limpiar cache del navegador
- Esperar ~1 minuto para propagación global

## 📚 Referencias

- [Firestore Security Rules Docs](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Language Guide](https://firebase.google.com/docs/reference/rules/rules.firestore.Request)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-structure)
