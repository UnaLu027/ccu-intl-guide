# Hotfix Review Notes — hotfix-live-guide-content-review

## Branch
`hotfix-live-guide-content-review` (do not merge to main without explicit user approval)

---

## Files Changed

| File | Change type |
|------|-------------|
| `shared/studentGuideData.ts` | All content fixes — see detail below |
| `HOTFIX_REVIEW_NOTES.md` | This file (new) |

---

## Changes Made

### A. `degree_calendar` — Timeline chronological order fix
**Problem:** Base section had 6 items (02/20–07/05); `studentGuideBlockSupplements` had 14 additional items starting from 02/27. Because base items are written first by `mergeGuideBlocksWithDedupe`, items 04/01 and 07/05 appeared before February/March events in the supplement.

**Fix:**
- Base section `blocks` now contains the full 20-item timeline in correct date order (02/20 → 07/31).
- `studentGuideBlockSupplements.degree_calendar` cleared (was causing the out-of-order tail).

---

### B. `exchange_calendar` — Timeline chronological order fix + Spring Holiday closure notice
**Problem:** Same root cause as degree_calendar. Base had 4 items; supplement had 13 items starting from 02/14. Result: 07/05 appeared at position 4, before all Feb–Jun events. Spring holiday university closure notice was in `studentGuideCoverageGapAdditions` but rendered after the disordered timeline.

**Fix:**
- Base section now contains: (1) `note (warning)` — bilingual university closure notice for Spring Holidays; (2) complete 12-item timeline in chronological order (02/14 → 07/05).
- `studentGuideBlockSupplements.exchange_calendar` cleared.
- `studentGuideCoverageGapAdditions.exchange_calendar` cleared (notice now in base).

---

### C. `degree_chinese_language` — Semantic repetition consolidated
**Problem:** Content was spread across 4 supplement layers with near-duplicate checklist items and the same Language Center link appearing twice (with and without `?Lang=en` query string, causing deduplication to miss it).

**Fix:**
- Base section now contains: one consolidated paragraph, one canonical checklist (3 items), and 3 unique links (華語中心, 學分課程, Google Docs supplement).
- `studentGuideBlockSupplements.degree_chinese_language` cleared.
- `studentGuideFinalPdfCorrections.degree_chinese_language` cleared.
- `studentGuideCoverageGapAdditions.degree_chinese_language` cleared.

---

### D. `degree_gender_incident_regulations` — Duplicate contact card removed
**Problem:** `studentGuideBlockSupplements` had a "學生事務處" contact card; `studentGuideFinalPdfCorrections` had a "學務處" contact card. Both refer to the same office (same email/phone) but with slightly different `name_zh` and phone field formatting, so the deduplication key did not catch them.

**Fix:**
- `studentGuideBlockSupplements.degree_gender_incident_regulations` cleared entirely.
- `studentGuideFinalPdfCorrections.degree_gender_incident_regulations` retained — it contains the complete contact card with formal English hotline labels, plus a full 6-item procedural checklist.
- The base section (`degree_gender_incident_regulations`) warning note and 5-item checklist are preserved.

---

### E. `degree_arc_application_extension` — Duplicate danger note (static prep, DB-protected)
**Problem:** `studentGuideBlockSupplements` and `studentGuideFinalPdfCorrections` each had a red danger note with slightly different wording for the ARC late-application penalties. Different wording → different dedupe key → both rendered.

**Static fix prepared:**
- Danger note removed from `studentGuideBlockSupplements.degree_arc_application_extension`.
- Checklist items retained in supplement (unique items will survive dedupe against finalPdfCorrections).
- Canonical danger note kept in `studentGuideFinalPdfCorrections.degree_arc_application_extension`.

⚠️ **DB reset required:** This section is manually protected. Static change does not affect production until admin resets via `/api/admin/student-guide-reset-section` or equivalent.

---

### F. `degree_accommodation` — Duplicate room-type table (static prep, DB-protected)
**Problem:** `studentGuidePdfDetailSupplements` had a 3-column room-type table; `studentGuideFinalPdfCorrections` had a 3-column room-type table with slightly different row text. Different column key signatures → both rendered.

**Static fix prepared:**
- `studentGuidePdfDetailSupplements.degree_accommodation` cleared (redundant subset).
- Canonical table and checklist in `studentGuideFinalPdfCorrections` retained.

⚠️ **DB reset required:** Manually protected. See E above.

---

### G. `degree_registration_overview` — Redundant 2-column table removed (static prep, DB-protected)
**Problem:** `studentGuidePdfDetailSupplements` had a 2-column (unit, documents) table with only the OIA row. `studentGuideBlockSupplements` and `studentGuideFinalPdfCorrections` both had fuller 4-column (unit, location, documents, notes) tables with all 3 units. The 2-column table was a subset but had a different dedupe key, causing a third overlapping table block.

**Static fix prepared:**
- `studentGuidePdfDetailSupplements.degree_registration_overview` cleared.
- Both 4-column tables (supplement + finalPdfCorrections) retained for now; residual repetition between these two will require admin review of the production DB version before deciding which to keep.

⚠️ **DB reset required:** Manually protected.

---

## Manual DB Sections Affected

| Section ID | Protected | Static fix present | DB reset required | Notes |
|---|---|---|---|---|
| `degree_arc_application_extension` | ✅ Yes | ✅ Yes | ✅ Required | Remove duplicate danger note |
| `degree_accommodation` | ✅ Yes | ✅ Yes | ✅ Required | Remove duplicate room-type table |
| `degree_registration_overview` | ✅ Yes | ✅ Yes | ✅ Required | Remove redundant 2-col table |

**After deployment, request admin reset only for these 3 section IDs.** Then re-run:
- `/api/admin/student-guide-sync-status`
- `/api/admin/student-guide-duplicate-report`

and visually verify each page.

---

## Items Deliberately Deferred (require official-source verification)

These items appear in the user proposal PDF (`網站資料新增_使用者需求與截圖.pdf`) but are NOT implemented in this branch:

- **Sports facility opening hours and conditions** (PDF p.6) — needs official CCU Sports Center confirmation
- **Driving-license fines and required documents** (PDF p.7–8) — needs Motor Vehicle Division official source
- **OIA fax/contact additions** (PDF p.9) — needs OIA confirmation of current info
- **Work Information / Gold Card / job platform content** (PDF p.11–12) — audience and placement TBD
- **Expanded health examination instructions and off-campus hospital procedure** (PDF p.13–15) — needs hospital confirmation
- **Bulk FAQ additions** (PDF p.16–28) — need deduplication against existing guide sections first
- **Sexual harassment statutes, penalties, and campus policy PDFs** (PDF p.30–34) — must not replace or delete existing procedural help content; new legal content requires official law citation

---

## Do Not Regress

- Do not restore vegetarian-food-stand statement in campus life.
- Do not restore bowling-center statement in sports facilities.
- Do not recreate previously removed duplicate library/sports blocks.
