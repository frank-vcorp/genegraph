# 🚀 Quick Start - App en Local

**Status:** ✅ Servidor corriendo en http://localhost:3000

---

## 👀 ¿Cómo Ver la App?

### **Opción 1: VS Code Simple Browser** (Recomendado)
```
VS Code → Command Palette (Ctrl+Shift+P)
├─ "Simple Browser: Open Preview"
├─ URL: http://localhost:3000
└─ Se abre en split view
```

### **Opción 2: Navegador Normal**
```
Abre tu navegador (Chrome, Firefox, Safari)
└─ Pega: http://localhost:3000
```

### **Opción 3: Network Access**
```
Si accedes desde otro dispositivo:
└─ http://172.17.0.3:3000
```

---

## 🎯 Primera Vez en la App

### **Flujo de Signup**
```
1. Landing Page
   └─ [SIGNUP] button
   
2. Signup Form
   ├─ Name: Tu nombre
   ├─ Email: tu@email.com
   └─ Password: (mínimo 6 caracteres)
   
3. Account Created
   └─ Redirigido a Dashboard
   
4. Dashboard Vacío
   ├─ Toolbox izquierda (Drag items)
   ├─ Canvas centro (Drop area)
   └─ Details panel derecha (Editar)
```

---

## 🧪 Cosas para Probar

### **1. Agregar Personas** (5 min)
```
1. Drag [Persona] desde Toolbox al Canvas
2. Persona aparece en canvas
3. Click en persona
4. Panel derecho: Editar nombre, género, edad
5. [Save] → SaveStatus: "Saving..." → "Saved"
```

### **2. Crear Relaciones** (5 min)
```
1. Add 2 personas al canvas
2. Click persona A → "Conectar"
3. Drag a persona B
4. Select tipo: Matrimonio / Padre / Hijo / etc
5. Edge visual aparece entre ellas
```

### **3. Offline Sync** ⭐ CRITICAL (10 min)
```
1. DevTools (F12) → Network tab
2. Click icono throttling → "Offline"
3. Agrega 5 personas al canvas
4. SaveStatus mostrará: "Offline"
5. DevTools → Offline → select "Online"
6. SaveStatus: "Syncing..." → "Saved"
   └─ Verificar sync en <1 segundo ✓
```

### **4. Export PDF** (3 min)
```
1. Add 5+ personas
2. [Export] button → PDF (Clinical) o PDF (Modern)
3. Descarga PDF
4. Abre y verifica layout
```

### **5. Dark Mode** (1 min)
```
1. [Settings] (esquina superior derecha)
2. Toggle "Dark Mode"
3. Interface cambia de tema
```

---

## 📊 Qué Esperar de Performance

| Operación | Tiempo | Status |
|-----------|--------|--------|
| Page Load | ~500ms | ✅ Fast |
| Add Person | ~100ms | ✅ Instant |
| Save (1 person) | <500ms | ✅ Quick |
| Save (50 personas) | <2s (1 batch) | ✅ Batch optimized |
| Offline→Online Sync | <1s | ✅ Fast |
| PDF Export | ~1-2s | ✅ Normal |

---

## 🔍 Debugging Tips

### **Ver IndexedDB (Offline Data)**
```
DevTools → Application → IndexedDB → genegraph
├─ genograms (tu genograma)
├─ persons (personas agregadas)
├─ relationships (conexiones)
└─ sync_queue (operaciones pendientes)
```

### **Monitor Network Requests**
```
DevTools → Network → XHR Filter
├─ POST requests = Writes a Firestore
├─ GET requests = Reads from Firestore
└─ Verificar que sean BATCH, no 50 writes
```

### **Check Console Errors**
```
DevTools → Console
├─ Rojo = Error real
├─ Amarillo = Warning (OK)
└─ Azul = Info logs
```

---

## 🎁 Funcionalidades Implementadas

✅ **Autenticación**
- Email/Password signup
- Password strength validation
- Persistent sessions

✅ **Canvas Interactivo**
- Drag & drop personas
- Visual relationships
- Editable node properties

✅ **Offline Support**
- IndexedDB storage
- Auto-sync queue
- Network status indicator

✅ **Performance**
- Batch writes (100 writes → 1)
- Auto-save (5s debounce)
- Turbopack dev server

✅ **UI/UX**
- Responsive design
- Dark mode
- Real-time SaveStatus
- Intuitive toolbox

---

## 🚀 Paso Siguiente (Deployment)

Si todo funciona bien en local:

```bash
# Detener servidor dev
Ctrl+C

# Build para producción
npm run build

# Deploy a Firebase Hosting
firebase deploy --only hosting,firestore:rules

# Resultado
├─ App en: https://genegraph.firebaseapp.com
├─ Security rules: Deployed
└─ Ready para usuarios reales
```

---

## 📝 Notas

- Si tienes error de autenticación: Verifica `.env.local` con credenciales Firebase
- Si IndexedDB no guarda: Verifica DevTools → Application → Storage
- Si Offline Sync no funciona: Check console para mensajes de error
- Si PDF export falla: Verifica permisos de navegador

---

**¿La ves? ¿Se ve bien?** 

Si tienes issues, escribe el error que ves en la consola. 🔍

