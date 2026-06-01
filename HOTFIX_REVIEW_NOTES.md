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
**Problem:** Base section had 6 items (02/20–07/05); `studentGuideBlockSupplements` had 14 additional items starting from 02/27. Because base items are written first by `mergeGuideBlocksWithDedupe`, items 04/01 and 07/05 appeared before February/March events.

**Fix:**
- Base section `blocks` now contains the full 20-item timeline in correct date order (02/20 → 07/31).
- `studentGuideBlockSupplements.degree_calendar` cleared.

**Status: ✅ Effective immediately after deploy — section is not manually protected.**

---

### B. `exchange_calendar` — Timeline chronological order fix + Spring Holiday closure notice
**Problem:** Same root cause as degree_calendar. Base had 4 items; supplement had 13 items starting from 02/14. Result: 07/05 appeared at position 4, before all Feb–Jun events. Spring holiday closure notice was in `studentGuideCoverageGapAdditions` but rendered after the disordered timeline.

**Fix:**
- Base section now contains: (1) `note (warning)` — bilingual university closure notice for Spring Holidays; (2) complete 12-item timeline in chronological order (02/14 → 07/05).
- `studentGuideBlockSupplements.exchange_calendar` cleared.
- `studentGuideCoverageGapAdditions.exchange_calendar` cleared (notice now in base).

**Status: ✅ Effective immediately after deploy — section is not manually protected.**

---

### C. `degree_chinese_language` — Semantic repetition consolidated
**Problem:** Content was spread across 4 supplement layers with near-duplicate checklist items and the same Language Center link appearing twice (with and without `?Lang=en`, bypassing dedupe).

**Fix:**
- Base section now contains:
  1. One consolidated paragraph (credit-bearing + free, Language Center description, encouragement).
  2. One `note (info)` with the course-system URL update reminder (replaces the previous one-item checklist).
  3. Three unique links (華語中心, 學分課程, Google Docs supplement).
- The two checklist items that duplicated paragraph content (credit-bearing/free; encouraged to take one course) were removed.
- `studentGuideBlockSupplements.degree_chinese_language` cleared.
- `studentGuideFinalPdfCorrections.degree_chinese_language` cleared.
- `studentGuideCoverageGapAdditions.degree_chinese_language` cleared.

**Status: ✅ Effective immediately after deploy — section is not manually protected.**

---

### D. `degree_gender_incident_regulations` — Duplicate contact card removed
**Problem:** `studentGuideBlockSupplements` had a "學生事務處" contact card; `studentGuideFinalPdfCorrections` had a "學務處" contact card. Same office, same email/phone, but different `name_zh` and phone field formatting caused the dedupe key to treat them as distinct.

**Fix:**
- `studentGuideBlockSupplements.degree_gender_incident_regulations` cleared entirely.
- `studentGuideFinalPdfCorrections.degree_gender_incident_regulations` retained — complete contact card with formal English hotline labels plus the full 6-item procedural checklist.
- Base section warning note and 5-item checklist preserved unchanged.

**Status: ✅ Effective immediately after deploy — section is not manually protected.**

---

### E. `degree_arc_application_extension` — Static prep only (DB-protected, NO reset authorized)
**Problem:** `studentGuideBlockSupplements` and `studentGuideFinalPdfCorrections` each had a red danger note with slightly different wording. Different wording → different dedupe key → both rendered.

**Static change prepared:**
- Danger note removed from `studentGuideBlockSupplements.degree_arc_application_extension`.
- Checklist items retained in supplement.
- Canonical danger note kept in `studentGuideFinalPdfCorrections`.

⛔ **No DB reset authorized.** Before any reset decision:
1. Export current production JSON for `degree_arc_application_extension` via the admin API.
2. Compare it against the current static version to identify any manual edits that must be preserved.
3. Obtain explicit user approval before resetting this section.

**Status: ⚠️ Static code ready. Production DB unchanged until user approves reset.**

---

### F. `degree_accommodation` — Static prep only (DB-protected, NO reset authorized)
**Problem:** `studentGuidePdfDetailSupplements` had a 3-column room-type table; `studentGuideFinalPdfCorrections` had a different 3-column room-type table. Different row text → different dedupe keys → both rendered.

**Static change prepared:**
- `studentGuidePdfDetailSupplements.degree_accommodation` cleared (redundant subset).
- Canonical table and checklist in `studentGuideFinalPdfCorrections` retained.

⛔ **No DB reset authorized.** Before any reset decision:
1. Export current production JSON for `degree_accommodation`.
2. Check for any manual currency-format corrections (e.g. `NT$` vs `NTD`) or other admin edits.
3. Obtain explicit user approval before resetting.

**Status: ⚠️ Static code ready. Production DB unchanged until user approves reset.**

---

### G. `degree_registration_overview` — Partial static prep only (DB-protected, NO reset authorized)
**Problem:** `studentGuidePdfDetailSupplements` had a redundant 2-column (unit, documents) table that is a subset of the fuller 4-column tables in `studentGuideBlockSupplements` and `studentGuideFinalPdfCorrections`. The 2-column table was removed.

**Remaining issue — NOT yet resolved:**
`studentGuideBlockSupplements.degree_registration_overview` and `studentGuideFinalPdfCorrections.degree_registration_overview` each contain a 4-column (unit, location, documents, notes) table with 3 rows. These have different wording in the documents and notes fields, so they produce two overlapping tables. **This residual duplication must be resolved before any reset is performed.**

⛔ **No DB reset authorized under any circumstances for this section until:**
1. Current production JSON is exported and reviewed.
2. The two overlapping 4-column table sources are compared and merged into a single authoritative version.
3. Explicit user approval is obtained.

**Status: ⚠️ 2-column table cleared. Residual 4-column duplication still present in static data. Reset explicitly blocked pending content review.**

---

## DB Reset Summary

| Section ID | Manually protected | Static fix | DB reset authorized | Prerequisite |
|---|---|---|---|---|
| `degree_arc_application_extension` | ✅ Yes | ✅ Ready | ❌ Not yet | Export + compare production JSON |
| `degree_accommodation` | ✅ Yes | ✅ Ready | ❌ Not yet | Export + compare production JSON |
| `degree_registration_overview` | ✅ Yes | ⚠️ Partial | ❌ Blocked | Resolve residual 4-col duplication first; then export + compare |

**No production database reset should be performed until all prerequisites above are met and the user explicitly approves each section.**

---

## Items Deliberately Deferred (require official-source verification)

These items appear in the user proposal PDF but are NOT implemented in this branch:

- **Sports facility opening hours and conditions** — needs official CCU Sports Center confirmation
- **Driving-license fines and required documents** — needs Motor Vehicle Division official source
- **OIA fax/contact additions** — needs OIA confirmation of current info
- **Work Information / Gold Card / job platform content** — audience and placement TBD
- **Expanded health examination instructions and off-campus hospital procedure** — needs hospital confirmation
- **Bulk FAQ additions** — need deduplication against existing guide sections first
- **Sexual harassment statutes, penalties, and campus policy PDFs** — must not replace existing procedural help content; new legal content requires official law citation

---

## Do Not Regress

- Do not restore vegetarian-food-stand statement in campus life.
- Do not restore bowling-center statement in sports facilities.
- Do not recreate previously removed duplicate library/sports blocks.
