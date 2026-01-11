# 📋 HANDOFF GUIDE - GenoGraph Pro MVP → Fase 2

**Documento:** Guía de Transición para Arquitecto, Infraestructura y Builder  
**Fecha:** 2026-01-10  
**Estado MVP:** ✅ Completado y Aprobado  
**Próxima Fase:** PWA Setup + Edges + Firebase

---

## 👤 Para INTEGRA (Arquitecto / Product Owner)

### ¿Qué se entrega?
✅ **MVP 1.0 con arquitectura sólida y escalable**
- React Flow + Zustand: Patrón modular, fácil de extender
- TypeScript strict: Tipado completo para seguridad
- Componentes reutilizables: Header, Canvas, Sidebar, DetailsPanel
- Store normalizado: Personas, relaciones, condiciones listos para persistencia

### ¿Qué validaciones se hicieron?
✅ **Auditoría completa por GEMINI**
- Code review (13+ componentes)
- TypeScript strict mode check
- React Flow integration validation
- Build time & bundle size check
- PWA configuration review

### ¿Qué riesgos fueron identificados?
🟡 **PWA Manual Setup (Deuda Técnica)**
- Current: `public/sw.js` + manual registration
- Risk: Sin actualización automática de assets, puede desincronizarse
- Solution: Integrar `@ducanh2912/next-pwa` en Fase 2 (1-2 días)

🟡 **UI/Data Mixing en Store**
- Current: `Person` contiene tanto datos médicos como visuales (position)
- Risk: Al persistir en Firestore, se guardan coordenadas junto con datos clínicos
- Solution: En Fase 2, considerar separar `GenogramData` y `GenogramLayout`
- Impact: No-bloqueante, funcional pero arquitecturalmente mejorable

### Recomendaciones Inmediatas
1. ✅ **NO NECESITA RE-ARQUITECTURA** - La base está bien
2. ⏳ **PLANIFICAR Fase 2** - Timeline: 2-3 semanas
3. 📊 **VALIDAR con Cliente** - Feedback sobre genograma funcional
4. 🔒 **DEFINIR Scope Fase 2** - Edges + PDF + Firebase o en orden diferente?

### Información para Cliente (Laura Liliana)
📱 **El genograma funciona:**
- Arrastra personas al lienzo → aparecen como símbolos
- Arrastra condiciones sobre personas → se asocian
- Edita atributos en el panel derecho → se actualizan en tiempo real
- Cambia vista (Clásico/Moderno) → estética diferente, datos igual

❌ **Falta:**
- Líneas entre personas (matrimonio, parentesco) - **Fase 2**
- Exportación a PDF - **Fase 2**
- Sincronización en nube - **Fase 2**

✅ **Está listo para:**
- Demo local
- Feedback de UI/UX
- Iteraciones sobre diseño
- Preparación de Fase 2

---

## 🛠️ Para GEMINI (Infraestructura / QA)

### ¿Qué se auditoró?
✅ **Auditoría Técnica Completa Realizada**
- Documento: `context/interconsultas/INTERCONSULTA-GEMINI-MVP-Review.md`
- Scope: Code review, soft gates, risk assessment, recommendations
- Resultado: **APROBADO CON OBSERVACIONES**

### Build & Deployment Ready
```
Status:     ✅ Production-ready build
Compile:    4.5 segundos (Turbopack)
Size:       ~100KB gzipped (approx, sin medir)
TypeScript: 0 errores, 0 warnings (Strict mode)
Tests:      No configurados aún (mock tests: vitest ready)
```

### Checklist para Producción
- [ ] **PWA Plugin:** Integrar `@ducanh2912/next-pwa` (1-2 días)
- [ ] **Firebase Setup:** Credenciales proyecto (TBD por cliente)
- [ ] **Domain:** Configurar genopro.app (TBD)
- [ ] **CI/CD:** GitHub Actions para build automático
- [ ] **Monitoring:** Sentry para error tracking
- [ ] **Analytics:** Google Analytics o Plausible (no invasivo)

### Recomendaciones de Infraestructura
🟢 **Deployment Sugerido: Vercel**
- Next.js first-class support
- Edge functions para Firebase sync
- Automatic PWA optimizations
- Edge caching para assets estáticos

🔵 **Alternativa: Render.com**
- PostgreSQL + Redis (si es necesario)
- Docker support
- Auto-deploy desde GitHub

### Post-MVP Improvements
1. **PWA Professional Setup** (CRÍTICO)
   - Instalar `@ducanh2912/next-pwa`
   - Configurar cache strategy
   - Test offline en Chrome DevTools
   - Estimated: 1-2 días

2. **Performance Monitoring**
   - Web Vitals tracking
   - TypeScript strict mode checks en CI/CD
   - Build size monitoring

3. **Security Review**
   - CORS configuration (para Firebase)
   - CSP headers setup
   - Input sanitization review

---

## 💻 Para SOFIA (Builder / Developer)

### Estructura Actual del Código
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout + PWA provider
│   │   ├── page.tsx            # Main genogram page
│   │   └── globals.css         # Tailwind imports
│   ├── components/             # React components
│   │   ├── Canvas.tsx          # React Flow board
│   │   ├── PersonNode.tsx      # Custom node component
│   │   ├── Header.tsx          # Navigation + view toggle
│   │   ├── ToolSidebar.tsx     # Drag sources (personas, condiciones)
│   │   ├── DetailsPanel.tsx    # Right-side editor
│   │   ├── PersonDraggable.tsx # Drag-source for personas
│   │   ├── ConditionDraggable.tsx  # Drag-source for conditions
│   │   └── ServiceWorkerProvider.tsx # PWA registration
│   ├── store/
│   │   └── genogram.ts         # Zustand store (20+ actions)
│   ├── types/
│   │   └── genogram.ts         # Type definitions (Gender, Person, etc.)
│   ├── hooks/
│   │   └── useServiceWorker.ts # SW registration hook
│   └── utils/
│       ├── hooks.ts            # Reusable hooks
│       └── ...
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker (manual)
│   ├── icons/                  # SVG icons for PWA
│   └── ...
├── package.json                # Dependencies
├── next.config.ts              # Next.js config (empty, ready for PWA plugin)
└── tsconfig.json               # TypeScript strict mode
```

### Key Files to Know
1. **Store:** `src/store/genogram.ts`
   - Central Zustand store with all CRUD logic
   - Actions: addPerson, updatePerson, addCondition, etc.
   - No external dependencies, mock-friendly

2. **Types:** `src/types/genogram.ts`
   - Single source of truth for type definitions
   - MEDICAL_CONDITIONS array (editable)
   - EMOTIONAL_BONDS array (for future edges)

3. **Canvas:** `src/components/Canvas.tsx`
   - React Flow integration
   - Drag-drop handlers for persons
   - Converts Zustand state to React Flow nodes

4. **PersonNode:** `src/components/PersonNode.tsx`
   - Custom React Flow node
   - Renders gender symbols
   - Handles drag-drop for conditions

### Common Tasks for Fase 2

#### Task: Add Relationship Edges
```typescript
// In Canvas.tsx, already supports:
const [edges, setEdges] = useEdgesState([]);
// Just need to populate from store.relationships

// In PersonNode.tsx, Handles already exist:
<Handle type="target" position={Position.Top} />
<Handle type="source" position={Position.Bottom} />
```

#### Task: PDF Export
```typescript
// Already installed: html2canvas, jsPDF
// Path: src/components/Header.tsx → "Exportar PDF" button
// Implementation: Capture Canvas → Generate PDF
```

#### Task: Firebase Sync
```typescript
// Store structure is ready for Firestore:
// users/{uid}/genograms/{gid}/persons/{pid}
// Just add:
// 1. Firebase setup (SDK + config)
// 2. Sync actions (savePerson, deletePerson)
// 3. Real-time listeners
```

### Testing Strategy
- **Manual Testing:** Done, all features validated
- **Unit Tests:** Not implemented (scope: Phase 2)
- **E2E Tests:** Not implemented (scope: Phase 2)
- **Config:** `vitest` ready to use (`npm run test`)

### Build & Deploy Commands
```bash
# Development
npm run dev              # Run locally on :3000

# Production build
npm run build            # Compile with Next.js
npm run start            # Serve production build

# Lint (if configured)
npm run lint             # TypeScript check

# Type check
npm run type-check       # Full TypeScript validation
```

### Dependencies to Know
- **React Flow:** 11.11.4 - Graph visualization
- **Zustand:** 5.x - State management
- **Tailwind CSS:** 4.x - Styling
- **Next.js:** 16.1.1 - Framework
- **TypeScript:** 5.x - Language

### Next Steps for Phase 2
1. ✅ Code review complete (GEMINI signed off)
2. ⏳ Implement PWA plugin setup
3. ⏳ Add relationship edges with React Flow
4. ⏳ Implement PDF export with templates
5. ⏳ Integrate Firebase

---

## 📚 Documentation References

### Key Artifacts
1. [INTERCONSULTA TÉCNICA](context/interconsultas/INTERCONSULTA-GEMINI-MVP-Review.md)
   - Formal QA report with code audit
   - Soft gates validation
   - Risks and recommendations

2. [CP-003 Checkpoint](Checkpoints/CP-003-MVP-1.0-CLOSURE.md)
   - Technical status at closure
   - Deuda técnica documentada
   - Handoff information

3. [PROYECTO.md](PROYECTO.md)
   - Master project file
   - Bitácora de cambios
   - Backlog status

4. [MVP Summary](MVP-1.0-SUMMARY.md)
   - Visual overview
   - Feature status
   - Roadmap for Phase 2

### Architecture References
- [SPEC-CODIGO](meta/SPEC-CODIGO.md) - Code quality standards
- [SPEC-TESTING](context/SPEC-TESTING.md) - Testing requirements
- [soft-gates](meta/soft-gates.md) - Quality checkpoints
- [STACK-TECNOLOGICO](meta/STACK-TECNOLOGICO.md) - Tech stack details

---

## 🚀 Timeline Fase 2 (Estimado)

```
Week 1:
  ├─ PWA Plugin Integration (1-2 días)
  ├─ Relationship Edges First Draft (2-3 días)
  └─ Testing & Review

Week 2:
  ├─ PDF Export Implementation (2-3 días)
  ├─ Firebase Firestore Setup (1-2 días)
  └─ Firebase Authentication (1 día)

Week 3:
  ├─ End-to-end Firebase Sync (2-3 días)
  ├─ Offline Support (IndexedDB) (1-2 días)
  ├─ Bug fixes & Polish (1 día)
  └─ Client Validation & Demo

Post-Phase 2:
  ├─ SVG Symbols Implementation
  ├─ Advanced UX Features
  └─ Performance Optimizations
```

---

## ✅ Checklist Entrega MVP

- [x] Code implementado y probado
- [x] TypeScript strict mode passing
- [x] React Flow integrado
- [x] Zustand store funcional
- [x] Drag & Drop operacional
- [x] View mode toggle funcional
- [x] PWA configurado (básico)
- [x] QA audit completado (GEMINI)
- [x] Checkpoints creados (CP-001, CP-002, CP-003)
- [x] Interconsulta generada
- [x] PROYECTO.md actualizado
- [x] Documentación completa

---

**Handoff completado. MVP listo para Fase 2.**

Cualquier pregunta sobre código, arquitectura o roadmap → contactar SOFIA.  
Cualquier pregunta sobre infraestructura o deployment → contactar GEMINI.  
Cualquier pregunta sobre alcance o decisiones → contactar INTEGRA.
