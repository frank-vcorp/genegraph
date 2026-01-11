# 📱 Manual QA Instructions - GenoGraph Pro

**Objetivo:** Validar funcionalidad crítica en dispositivo real (iPad/Tablet)  
**Duración Estimada:** 2-3 horas  
**Build Status:** ✅ Production ready (npm run build clean)  
**Tests Status:** ✅ 64/64 passing  
**Prerequisito:** Dispositivo iOS/Android con WiFi + acceso a prod/staging

---

## 🚀 Quick Start QA

### Step 1: Setup Device
1. Open browser on iPad/Tablet
2. Navigate to: **https://genegraph.firebaseapp.com** (or staging URL)
3. Create test account (email: qa-test-DATE@example.com, password: Test123!)
4. Login

### Step 2: Core Tests (Critical Path - Must Pass)

**Time: ~30 minutes**

#### ✅ Test A: Profile Name Persistence
1. Signup with **Name: "QA Tester"**
2. Logout
3. Login again
4. **Expected:** Name visible/remembered ✅

#### ✅ Test B: Offline Add Persons
1. **Airplane Mode ON**
2. Create new genogram "QA Test"
3. Add **5 persons** to canvas (drag from toolbox)
4. Save each person
5. **Expected:** SaveStatus shows "Offline", data in IndexedDB ✅

#### ✅ Test C: Reconnect & Sync
1. **Airplane Mode OFF**
2. Wait 2 seconds
3. **Expected:** SaveStatus shows "Syncing..." → "Saved"
4. Refresh page
5. **Expected:** All 5 persons appear (from Firestore) ✅

#### ✅ Test D: Batch Performance
1. Add **50 persons** while online
2. Save
3. **Expected:** Completes in <2 seconds ✅

#### ✅ Test E: PDF Export
1. Click "Export" button
2. Select "PDF (Clinical)"
3. **Expected:** PDF downloads, displays correctly ✅

---

### Step 3: Extended Tests (If Time Permits)

**Time: ~1-2 hours additional**

See detailed test matrix in [QA-SESSION-LOG.md](./QA-SESSION-LOG.md)

- Phase 1-2: Auth flows (5 tests)
- Phase 4-5: CRUD + Relationships (8 tests)
- Phase 6-8: UI, Error handling, Security (8 tests)

---

## 📋 What to Test

### **Critical (Must Pass)**
```
☐ Signup + displayName persistence
☐ Offline data entry (5+ persons)
☐ Reconnection sync (IndexedDB → Firestore)
☐ Batch write performance (<2s)
☐ PDF export functionality
```

### **High Priority**
```
☐ Login/Logout flow
☐ Create/Edit/Delete person
☐ Relationships (drag to connect)
☐ SaveStatus indicator accuracy
☐ UI responsiveness (portrait/landscape)
```

### **Optional**
```
☐ Error recovery (network disconnect)
☐ Enum validation (server-side)
☐ Owner-only access (different account)
```

---

## 🧠 What to Watch For

### **Good Signs ✅**
- SaveStatus shows real-time status (Saving → Saved)
- Offline mode works smoothly
- Data syncs instantly when reconnecting
- No console errors (DevTools → Console)
- Performance feels snappy (<500ms saves)

### **Red Flags 🚩**
- Data disappears after reconnect
- SaveStatus stuck on "Saving"
- Sync takes >5 seconds
- Manual page refresh needed to see offline data
- Relationships don't visually connect
- PDF export fails or is blank
- App crashes or freezes

---

## 🔍 How to Debug Issues

### **Check IndexedDB (Offline Data)**
1. DevTools → Application → IndexedDB → genegraph
2. Expand: genograms, persons, relationships, sync_queue
3. Verify data exists before/after sync

### **Check Firestore (Cloud Data)**
1. Firebase Console → genegraph project
2. Firestore Database → Collections
3. Verify data synced to users/{uid}/genograms/{gid}/persons/{pid}

### **Check Console Errors**
1. DevTools → Console tab
2. Look for red errors (not warnings)
3. Copy/paste any errors to report

### **Check Network Tab**
1. DevTools → Network tab
2. Go offline, make changes
3. Go online, watch for POST requests to Firestore
4. Should see batch operation succeed

---

## 📝 Reporting Results

### **If All Tests Pass ✅**
Create result file:
```
Status: APPROVED
Date: [TODAY]
Tester: [NAME]
Overall Verdict: Ready for production
```

### **If Issues Found 🚩**
Document:
```
Test Case: [Name]
Expected: [What should happen]
Actual: [What happened]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
...
Error Message: [If any]
Severity: Critical / High / Medium / Low
```

---

## 📞 Support

- **Code Issue?** → Contact SOFIA (Builder)
- **Unclear Test?** → Check HANDOFF-MANUAL-QA.md for detailed guide
- **Need Data Reset?** → Firebase Console → delete collection → refresh app
- **Build Issues?** → `npm run build` to verify local

---

## ✅ Sign-Off Checklist

- [ ] All Critical tests passed (A-E)
- [ ] Offline sync verified
- [ ] Performance acceptable (<2s)
- [ ] PDF export works
- [ ] No critical errors in console
- [ ] UI responsive on device
- [ ] Ready to approve OR issues documented

**Final Verdict:** ☐ APPROVED ☐ REJECTED ☐ APPROVED WITH NOTES

---

**Estimated QA Timeline:**
- Critical Path: 30 mins
- Extended Tests: 1-2 hours
- **Total: 2-3 hours**

**Start time:** _______________  
**End time:** _______________  

Good luck! 🎉
