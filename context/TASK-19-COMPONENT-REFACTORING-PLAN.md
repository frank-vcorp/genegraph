# 📋 Task 19 Plan - Component Library Refactoring (P2)

**Sprint**: Fase 2.2 Sprint 4  
**Priority**: P2 (IMPORTANTE - Deuda Técnica)  
**Status**: 🚀 **IN PROGRESS**  
**Date**: 2026-01-12  
**Agent**: SOFIA - Builder  

---

## 🎯 Objetivo

Reorganizar la estructura de `/components` en carpetas funcionales, mejorando escalabilidad, claridad de imports y preparando la base para Storybook integration.

**Beneficio**: 
- Better code organization for growing codebase
- Clearer component dependencies
- Easier to locate and maintain components
- Foundation for component library (Task 20)

---

## 📊 Current Component Inventory

### Canvas & Visualization (7 components)
- `Canvas.tsx` - React Flow wrapper + node/edge management
- `PersonNode.tsx` - Genogram person node rendering
- `RelationshipEdge.tsx` - Connection lines with styling
- `Swimlanes.tsx` - Generation background lines
- `PersonDraggable.tsx` - Drag-and-drop person handler
- `ConditionDraggable.tsx` - Drag-and-drop condition handler
- `PdfExporter.ts` - PDF generation logic (utility, not component)

### Form & Input Components (4 components)
- `GenoDateInput.tsx` - Date input with precision selector
- `MedicalConditionEditor.tsx` - Condition form with category selector
- `LoginForm.tsx` - Authentication login form
- `SignupForm.tsx` - User registration form

### Layout & Navigation (3 components)
- `Header.tsx` - App header with theme switch, undo/redo, PDF export
- `ToolSidebar.tsx` - Left panel with category buttons (Farmacia)
- `DetailsPanel.tsx` - Right panel showing person/condition details

### Modals & Dialogs (1 component)
- `RelationshipModal.tsx` - Modal for creating/editing relationships

### Infrastructure & Providers (4 components)
- `ServiceWorkerProvider.tsx` - PWA service worker registration
- `KeyboardShortcutsProvider.tsx` - Keyboard shortcut initialization
- `PdfExportButton.tsx` - Button with PDF export logic
- `SaveStatus.tsx` - Save status indicator

**Total**: 19 components + 1 utility

---

## 🏗️ Proposed New Structure

```
src/components/
├── ui/                           # Reusable UI components
│   ├── Button.tsx               # (future: extract from Header/Forms)
│   ├── Input.tsx                # (future: extract from GenoDateInput)
│   ├── Modal.tsx                # (future: wrapper around RelationshipModal)
│   ├── Badge.tsx                # (future: for relationship types)
│   └── README.md                # UI component documentation
│
├── domain/                       # Domain-specific (Genogram) components
│   ├── genogram/
│   │   ├── PersonNode.tsx
│   │   ├── RelationshipEdge.tsx
│   │   ├── Swimlanes.tsx
│   │   ├── Canvas.tsx
│   │   └── README.md
│   ├── person/
│   │   ├── PersonDraggable.tsx
│   │   ├── DetailsPanel.tsx
│   │   └── README.md
│   ├── condition/
│   │   ├── ConditionDraggable.tsx
│   │   ├── MedicalConditionEditor.tsx
│   │   └── README.md
│   ├── relationship/
│   │   ├── RelationshipModal.tsx
│   │   └── README.md
│   └── README.md
│
├── layout/                      # Layout & Navigation components
│   ├── Header.tsx
│   ├── ToolSidebar.tsx
│   ├── SaveStatus.tsx
│   └── README.md
│
├── feedback/                    # User feedback & utilities
│   ├── PdfExportButton.tsx
│   ├── PdfExporter.ts
│   └── README.md
│
├── auth/                        # Authentication components
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── README.md
│
├── providers/                   # Context providers & setup
│   ├── KeyboardShortcutsProvider.tsx
│   ├── ServiceWorkerProvider.tsx
│   └── README.md
│
└── index.ts                    # Barrel exports for clean imports
```

**Impact Analysis**:
- ✅ No new files (reorganization only)
- ✅ All files move to subdirectories
- ❌ Requires import path updates throughout codebase
- ⚠️ Small performance impact from additional folder nesting (negligible)

---

## 📋 Detailed Task Breakdown

### Phase 1: Planning & Preparation (0.5 hours)

**[✓] Completed**
- ✓ Inventory all 19 components + PdfExporter utility
- ✓ Categorize by function (canvas, form, layout, etc.)
- ✓ Design new folder structure
- ✓ Identify all files that import from `/components`

### Phase 2: Folder Creation & File Movement (1.5 hours)

**[~] Next Step**

**Steps**:
1. Create folder structure:
   ```bash
   mkdir -p frontend/src/components/{ui,domain/{genogram,person,condition,relationship},layout,feedback,auth,providers}
   ```

2. Move files to new locations:
   - Canvas.tsx → domain/genogram/Canvas.tsx
   - PersonNode.tsx → domain/genogram/PersonNode.tsx
   - RelationshipEdge.tsx → domain/genogram/RelationshipEdge.tsx
   - Swimlanes.tsx → domain/genogram/Swimlanes.tsx
   - PersonDraggable.tsx → domain/person/PersonDraggable.tsx
   - DetailsPanel.tsx → domain/person/DetailsPanel.tsx
   - ConditionDraggable.tsx → domain/condition/ConditionDraggable.tsx
   - MedicalConditionEditor.tsx → domain/condition/MedicalConditionEditor.tsx
   - RelationshipModal.tsx → domain/relationship/RelationshipModal.tsx
   - Header.tsx → layout/Header.tsx
   - ToolSidebar.tsx → layout/ToolSidebar.tsx
   - SaveStatus.tsx → layout/SaveStatus.tsx
   - PdfExportButton.tsx → feedback/PdfExportButton.tsx
   - PdfExporter.ts → feedback/PdfExporter.ts
   - LoginForm.tsx → auth/LoginForm.tsx
   - SignupForm.tsx → auth/SignupForm.tsx
   - KeyboardShortcutsProvider.tsx → providers/KeyboardShortcutsProvider.tsx
   - ServiceWorkerProvider.tsx → providers/ServiceWorkerProvider.tsx
   - GenoDateInput.tsx → ui/GenoDateInput.tsx (or domain/person for now)

3. Create README.md files in each folder with description and contents

### Phase 3: Import Path Updates (2 hours)

**[~] After movement**

**Files to update**:
1. `src/app/layout.tsx` - KeyboardShortcutsProvider, ServiceWorkerProvider imports
2. `src/app/page.tsx` - Multiple component imports
3. `src/hooks/useUndoRedoShortcuts.ts` - No component imports
4. `src/__tests__/**` - All test file imports (50+ files)
5. `src/components/index.ts` - Create barrel exports

**Import Patterns**:
- Old: `import { Canvas } from '@/components'`
- New: `import { Canvas } from '@/components/domain/genogram'`
- Or via barrel: `import { Canvas } from '@/components'` (if we export from index.ts)

### Phase 4: Test Updates (1 hour)

**[~] After imports updated**

- Update test file imports to point to new paths
- Run `npm run test` to verify all 428 tests still pass
- No test logic changes needed

### Phase 5: Verification & Documentation (1 hour)

**[~] Final step**

- Verify build compiles: `npm run build`
- Check for circular dependencies or missing imports
- Update any internal documentation
- Create CP-024 checkpoint

**Expected Results**:
- ✅ All 428 tests passing
- ✅ Build time unchanged or improved
- ✅ 0 TypeScript errors
- ✅ Cleaner project structure

---

## 🔗 Dependencies & Impact

### Files Importing from `/components` (Estimate: 20+ files)

**Key Files**:
- `src/app/layout.tsx`
- `src/app/page.tsx` (Home component)
- `src/context/AuthContext.tsx`
- `src/store/genogram.ts` (potentially)
- `src/__tests__/**` (all test files)

### Update Strategy

1. **Create Barrel Exports** (easiest):
   ```typescript
   // src/components/index.ts
   export * from './domain/genogram/Canvas';
   export * from './domain/genogram/PersonNode';
   // ... all exports
   ```
   **Benefit**: Minimal changes to existing imports
   **Trade-off**: Defeats purpose of better organization (imports still vague)

2. **Update All Imports** (recommended):
   - More work initially
   - Makes dependencies explicit
   - Aligns with new structure
   - Example: `import { Canvas } from '@/components/domain/genogram'`

**Decision**: Use approach #2 with barrel exports as backup

---

## 📊 Success Criteria

| Criteria | Metric | Target | Status |
|----------|--------|--------|--------|
| **Build Success** | npm run build | 0 errors | ⏳ Verify |
| **Test Coverage** | npm run test | 428/428 passing | ⏳ Verify |
| **No Regressions** | Previous tests | All still passing | ⏳ Verify |
| **Type Safety** | TypeScript errors | 0 | ⏳ Verify |
| **Documentation** | README files | One per folder | ⏳ Create |
| **Import Clarity** | New paths | Explicit category | ⏳ Update |
| **Build Time** | Compilation time | <12s | ⏳ Verify |

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Missing imports | Build failure | Use barrel exports initially, then search for all imports |
| Circular dependencies | Type errors | Check with TypeScript strict mode |
| Test failures | Broken tests | Update test imports, run test suite |
| Path conflicts | Runtime errors | Use absolute paths (@/components/*) |

---

## 📅 Timeline

- **Phase 1 (Planning)**: ✅ Completed
- **Phase 2 (Folders & Movement)**: 2026-01-12 (1.5 hours)
- **Phase 3 (Import Updates)**: 2026-01-12 (2 hours)
- **Phase 4 (Tests)**: 2026-01-12 (1 hour)
- **Phase 5 (Verification)**: 2026-01-12 (1 hour)

**Total Estimated**: 5-6 hours
**Actual Target**: Complete Task 19 by end of 2026-01-12

---

## 🎓 Next Steps After Task 19

### Task 20: Shared Component Library (P2)
- Extract reusable UI components (Button, Input, Modal, etc.)
- Create shared component patterns
- Add Storybook integration
- Document component APIs

### Future: Task 21-22 (P3-P4)
- E2E Testing with Playwright (P3)
- Performance Optimization (P4)
- Dark Mode / Theme System (P5)

---

## 📝 Notes

- This is a **refactoring task** - no new features
- All existing functionality remains the same
- Focus on code organization and maintainability
- Foundation for Task 20 (Shared Components)

---

**Plan Created By**: SOFIA - Builder  
**Date**: 2026-01-12 19:45 UTC  
**Methodology**: INTEGRA v2.0
