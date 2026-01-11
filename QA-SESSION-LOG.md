# 🧪 Manual QA Testing Session - GenoGraph Pro

**Fecha Inicio:** 2026-01-10  
**Responsable:** Manual QA (Device Real)  
**Build Version:** Production (npm run build ✅)  
**Tests Status:** 64/64 passing ✅  
**Security Audit:** 88/100 GEMINI ✅

---

## 📋 QA Test Plan

### **Phase 1: Authentication & User Profiles**

#### Test 1.1: Signup Flow
- [ ] Navigate to `/signup`
- [ ] Enter valid email, password (≥6 chars), confirm password
- [ ] Enter name (required)
- [ ] Click Submit
- **Expected:** User created, redirected to app, displayName visible in profile (if profile view exists)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 1.2: Profile Name Persistence
- [ ] After signup, verify displayName is saved in Firebase Auth
- [ ] Logout
- [ ] Login with same credentials
- **Expected:** Name persists across login/logout
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 1.3: Login with Existing Account
- [ ] Navigate to `/login`
- [ ] Enter valid credentials (email + password)
- [ ] Click Submit
- **Expected:** Authenticated, redirected to dashboard
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 1.4: Logout
- [ ] Click Logout button in header
- **Expected:** User logged out, redirected to `/login`
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 2: Genogram CRUD Operations**

#### Test 2.1: Create Genogram
- [ ] In dashboard, click "New Genogram"
- [ ] Enter genogram name
- [ ] Click Create
- **Expected:** Genogram created, canvas loads
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 2.2: Add Person to Canvas
- [ ] Drag "Person" from toolbox to canvas
- [ ] Fill in: Name, Gender, Age
- [ ] Click Save
- **Expected:** Person appears on canvas, data saved to IndexedDB
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 2.3: Update Person Data
- [ ] Click on person node on canvas
- [ ] Edit name/gender/age in details panel
- [ ] Click Save
- **Expected:** Changes persist both in canvas and IndexedDB
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 2.4: Delete Person
- [ ] Right-click on person node
- [ ] Select Delete
- **Expected:** Person removed from canvas and database
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 2.5: Create Relationship
- [ ] Add 2 persons to canvas
- [ ] Drag from Person A → Person B to create connection
- [ ] Select relationship type (Parent, Child, Spouse, etc.)
- **Expected:** Visual edge appears, relationship stored
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 3: Offline Sync (Critical Path)**

#### Test 3.1: Offline Data Entry
- [ ] Go Offline (turn off WiFi or toggle network in browser DevTools)
- [ ] Verify app shows "Offline" indicator
- [ ] Add 3 persons to canvas
- [ ] Add relationships between them
- [ ] Click Save
- **Expected:** Data saves to IndexedDB, "SaveStatus" shows "Offline"
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 3.2: Offline Indicator
- [ ] While offline, check SaveStatus component (bottom-right)
- **Expected:** Shows "Offline" or icon indicating no connection
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 3.3: Sync Queue Formation
- [ ] (DevTools → Application → IndexedDB → genegraph → sync_queue)
- [ ] Verify operations are pending in sync_queue
- **Expected:** Queue has 3+ pending operations (add persons + relationships)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 3.4: Reconnection Sync
- [ ] Turn WiFi back on (or toggle network)
- [ ] Verify app shows "Online" indicator
- [ ] Wait 1-2 seconds
- **Expected:** 
  - SaveStatus shows "Syncing..."
  - Data syncs from IndexedDB → Firestore
  - SaveStatus shows "Saved" + timestamp
  - sync_queue in IndexedDB is cleared
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 3.5: Data Integrity After Sync
- [ ] Refresh page while online
- [ ] Load same genogram
- **Expected:** All 3 persons + relationships appear (from Firestore)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 3.6: Multiple Offline Sessions
- [ ] Go offline, add 5 persons
- [ ] Go online, wait for sync
- [ ] Go offline again, add 3 more persons
- [ ] Go online, wait for sync
- **Expected:** All 8 persons appear after final sync
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 4: Performance Validation**

#### Test 4.1: Batch Write Performance
- [ ] Add 50 persons to canvas
- [ ] Click Save
- [ ] Observe save time in SaveStatus component
- **Expected:** Completes in <2 seconds (not 5+ seconds)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 4.2: Batch Sync Performance
- [ ] Go offline, add 50 persons
- [ ] Go online
- **Expected:** Sync completes in <3 seconds
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 5: PDF Export**

#### Test 5.1: Export as Clinical PDF
- [ ] Add 5+ persons and relationships
- [ ] Click "Export" → "PDF (Clinical)"
- [ ] PDF downloads
- **Expected:** Professional PDF with standard genogram symbols
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 5.2: Export as Modern PDF
- [ ] Click "Export" → "PDF (Modern)"
- [ ] PDF downloads
- **Expected:** Colorful, modern-style PDF
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 6: UI Responsiveness (Tablet/iPad)**

#### Test 6.1: Portrait Mode
- [ ] Rotate iPad to portrait
- [ ] Verify toolbox, canvas, details panel layout adjusts
- **Expected:** No overlapping elements, readable text
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 6.2: Landscape Mode
- [ ] Rotate back to landscape
- **Expected:** Optimal layout, good use of width
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 6.3: Touch Interactions
- [ ] Drag persons with touch
- [ ] Tap to select/deselect
- [ ] Long-press for context menu
- **Expected:** All gestures work smoothly
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 7: Error Handling**

#### Test 7.1: Network Error Recovery
- [ ] Disconnect network mid-sync
- [ ] Reconnect
- **Expected:** App retries sync, completes successfully
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 7.2: Invalid Data Submission
- [ ] Try to create person without name
- **Expected:** Form validation error, prevented submission
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 7.3: Duplicate Prevention
- [ ] Try to create person with same name as existing
- **Expected:** Either allowed or warning shown (per design)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

### **Phase 8: Security Validation (Server-Side)**

#### Test 8.1: Enum Validation
- [ ] In browser DevTools (Network tab), intercept Firestore write
- [ ] Attempt to send invalid gender value (e.g., "xyz")
- **Expected:** Server rejects, error in console
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 8.2: Owner-Only Access
- [ ] Copy Firestore document ID
- [ ] In private window, try to access with different account
- **Expected:** Permission denied (403)
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

#### Test 8.3: Type Validation
- [ ] Attempt to inject non-string in "name" field
- **Expected:** Server validation rejects, returns error
- **Actual:** 
- **Status:** ☐ PASS ☐ FAIL
- **Notes:**

---

## 📊 Summary

### Overall Results
- **Total Tests:** 31 (8 phases)
- **Passed:** ☐ / 31
- **Failed:** ☐ / 31
- **Blocked:** ☐ / 31

### Critical Path (Must Pass)
- [ ] Phase 1: Auth ✅
- [ ] Phase 3: Offline Sync ✅
- [ ] Phase 4: Performance ✅
- [ ] Phase 5: PDF Export ✅

### Nice-to-Have
- [ ] Phase 6: UI Responsiveness
- [ ] Phase 7: Error Handling
- [ ] Phase 8: Security Validation

---

## 🎯 Sign-Off

**QA Tester:** ________________  
**Date:** ________________  
**Overall Verdict:** ☐ APPROVED ☐ APPROVED WITH NOTES ☐ REJECTED

**Critical Issues Found:**
```
(List any blocking issues here)
```

**Recommendations:**
```
(List any improvements suggested)
```

---

**Next Step After QA:**
- If APPROVED: Ready for deployment
- If APPROVED WITH NOTES: Fix issues, re-test critical path
- If REJECTED: Escalate to SOFIA for fixes

