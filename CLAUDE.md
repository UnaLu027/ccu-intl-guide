# CCU International Guide — Codebase Memory

> Last updated: 2026-05-27. Records current state of all key files after the student-guide admin feature was added.

---

## Project Overview

- **Stack**: React + TypeScript + Wouter (client), Express.js + SQLite/PostgreSQL (server), Vite (build)
- **Package manager**: `pnpm`
- **Monorepo layout**:
  ```
  ccu-intl-guide/
    client/         React SPA (Vite)
    server/         Express API + MCP endpoint
    shared/         Shared types & data (imported by both)
  ```
- **TypeScript check**: `pnpm run check`
- **Build**: `pnpm run build`

---

## Key File States (as of 2026-05-27)

### `shared/studentGuideData.ts` ✅ CREATED
- **Status**: Full copy of all student guide data and types.
- **Why**: Server uses ESM `.js` imports from `shared/`; client uses `@shared/` Vite alias.
- **Exports**:
  - Types: `StudentGuideId`, `StudentGuideAudience`, `StudentGuideCategoryId`, `StudentGuideCategory`, `StudentGuideLink`, `LocalizedTableValue`, `HandbookBlock`, `StudentGuideSourceReference`, `StudentGuideSection`, `StudentGuide`
  - Data: `degreeGuideFilters`, `exchangeGuideFilters`, `studentGuides`
  - Functions: `getStudentGuideById()`, `getCategoryName()`
- **Internal constants**: `degreeSources`, `exchangeSource`
- **Total sections** (degree + exchange): 1833 lines

#### 11 New Sections Added (2026-05-27 session):
| Section ID | Guide | Position |
|---|---|---|
| `degree_computer_wifi` | degree | after `degree_ecourse` |
| `degree_drivers_license` | degree | after `degree_computer_wifi` |
| `degree_oia_service_request` | degree | after `degree_drivers_license` |
| `degree_alert_assistance_mechanism` | degree | after `degree_oia_service_request` |
| `degree_important_laws` | degree | replaces `degree_taiwan_regulations` |
| `degree_transportation_regulations` | degree | after `degree_important_laws` |
| `degree_gender_incident_regulations` | degree | after `degree_anti_sexual_harassment` |
| `exchange_document_submission` | exchange | after `exchange_required_tasks` |
| `exchange_boarding_checklist` | exchange | after `exchange_document_submission` |
| `exchange_sim_card` | exchange | after `exchange_boarding_checklist` |
| `exchange_course_types` | exchange | after `exchange_ecourse` |

> `degree_taiwan_regulations` was deleted and replaced by `degree_important_laws` + `degree_transportation_regulations`.

---

### `client/src/data/studentGuideData.ts` ✅ RE-EXPORT WRAPPER
```ts
export * from "../../../shared/studentGuideData";
```
- All existing imports in client files remain valid.

---

### `server/index.ts` ✅ FULLY UPDATED (1671 lines)
- **Imports**: `import { studentGuides, type StudentGuide, type StudentGuideSection } from "../shared/studentGuideData.js"`
- **ContentType**: `"office" | "department" | "task" | "student_guide_section"`
- **contentTypes array**: `["office", "department", "task", "student_guide_section"]`

#### Key functions added/updated:
- `flattenStudentGuideSections()` — produces flat `{type, id, label, data}[]` for all guide sections
- `staticContentItems()` — returns `[...campusItems, ...flattenStudentGuideSections()]`
- `contentLabel()` — handles `student_guide_section` branch (`title_zh / title_en`)
- `getContentCollection()` — handles `student_guide_section`
- `findContentItem()` — works with all 4 types
- `staticStudentGuideContentItems()` — filter for student_guide_section only
- `syncStaticStudentGuideSectionsToDatabase()` — syncs static sections to DB, skips manually-changed
- `getStudentGuideSyncStatus()` — returns stale/missing/manually-changed stats
- `cloneStudentGuides()` — deep clone
- `getStudentGuidesFromContentItems()` — applies DB overrides/deletions/additions on top of static data, sorts by `order_index`

#### Routes added/updated:
- `GET /api/student-guides` — returns `{ studentGuides: StudentGuide[] }` from `getStudentGuidesFromContentItems()`
- `GET /api/admin/student-guide-sync-status` — returns sync diagnostics
- All admin routes use `contentTypes` array for validation (includes `student_guide_section`)

#### Startup sequence (in `startServer()`):
```
initDb → ensureContentItemsSchema → seedContentItems →
syncStaticStudentGuideSectionsToDatabase → applyKnownContentFixes
```

---

### `client/src/pages/StudentGuidePage.tsx` ✅ UPDATED (477 lines)
- **Imports**:
  ```ts
  import { getCategoryName, studentGuides as staticStudentGuides, ... } from "@/data/studentGuideData"
  ```
- **State**:
  ```ts
  const [guides, setGuides] = useState<StudentGuide[]>(staticStudentGuides);
  const [loadingGuides, setLoadingGuides] = useState(false);
  ```
- **API fetch** in `useEffect`:
  - Fetches `GET /api/student-guides`
  - On success: `setGuides(nextGuides)` if valid array
  - On failure: `setGuides(staticStudentGuides)` (fallback to static)
- **guide lookup**: `const guide = guides.find((item) => item.id === guideId)`
- **No white-screen**: static fallback prevents blank page on API failure

---

### `client/src/pages/Admin.tsx` ✅ FULLY UPDATED (1650+ lines)
- `type ContentType = "office" | "department" | "task" | "student_guide_section"`
- `typeLabel()`: student_guide_section → `"新生指南章節"`
- `CONTENT_TYPE_FILTERS`: includes `{ value: "student_guide_section", label: "新生指南章節 Student Guide Section" }`
- `makeContentTemplate("student_guide_section", id)`: returns empty section template with `guide_id`, `title_zh/en`, `categoryId`, `tags_zh/en`, `summary_zh/en`, `sourceReferences`, `relatedTaskIds`, `blocks`, `order_index`
- `FIELD_LABELS`: includes all student guide fields (title_zh/en, categoryId, tags_zh/en, summary_zh/en, blocks, order_index)

#### New Components (all in Admin.tsx):
| Component | Purpose |
|---|---|
| `StudentGuideSectionEditor` | Top-level editor for `student_guide_section` items; has JSON fallback |
| `BlocksEditor` | Manages array of `HandbookBlock`; add/remove/reorder |
| `BlockEditor` | Routes to correct editor by block type |
| `LinksListEditor` | url / label_zh / label_en list |
| `SourceReferencesEditor` | documentTitle_zh/en, pages |
| `StringListEditor` | Simple string array editor |
| `JsonTextareaField` | JSON text with apply button |
| `FieldInput`, `FieldTextarea` | Primitive labeled inputs |
| `createBlock(type)` | Factory for new blocks with correct shape |

#### Block type support in `BlockEditor`:
- `paragraph` → Chinese/English textarea grid
- `note` → tone select + content_zh/en
- `checklist` → items list with zh/en + up/down/delete
- `timeline` → date + event_zh/en + up/down/delete
- `table` → JSON editor for columns + rows
- `links` → `LinksListEditor`
- `contact` → name_zh/en, email, phone, location_zh/en, links

#### Conditional rendering in `ContentMaintenanceTab`:
```tsx
{selected.type === "student_guide_section" ? (
  <StudentGuideSectionEditor value={formData} onChange={setFormData} />
) : (
  <div className="grid gap-3 md:grid-cols-2">
    {/* generic FieldEditor for office/department/task */}
  </div>
)}
```

---

## Database Schema (content_items)

```sql
CREATE TABLE content_items (
  content_type TEXT NOT NULL,   -- "office" | "department" | "task" | "student_guide_section"
  item_id      TEXT NOT NULL,
  item_label   TEXT NOT NULL,
  data_json    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active',  -- "active" | "deleted"
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (content_type, item_id)
);
```

For `student_guide_section`, `data_json` contains a `StudentGuideSection` plus:
- `guide_id`: `"degree"` | `"exchange"`
- `order_index`: number (position within guide)

---

## Import Conventions

### Server (ESM, uses `.js` extension for TypeScript imports):
```ts
import { studentGuides } from "../shared/studentGuideData.js";
import { departments, offices, tasks } from "../shared/campusData.js";
```

### Client (Vite aliases):
```ts
import { ... } from "@/data/studentGuideData";   // resolves to shared/ via re-export
import { ... } from "@shared/studentGuideData";    // direct alias (also valid)
```

### Vite config aliases:
- `@` → `client/src`
- `@shared` → `shared/`

---

## Task Status Summary

| # | Task | Status |
|---|---|---|
| 1 | 檢查 repo 結構與已修改檔案 | ✅ completed |
| 2 | 找出並修正所有 TypeScript / runtime 問題 | ✅ completed |
| 3 | 修正 server/db.ts TypeScript 型別問題 | ✅ completed |
| 4 | 修正 StudentGuidePage.tsx 細節問題 | ✅ completed |
| 5 | 最終驗證：pnpm check 與視覺審查 | ✅ completed |
| 6 | Move studentGuideData.ts to shared/ + re-export | ✅ completed |
| 7 | server/index.ts: student_guide_section + /api/student-guides | ✅ completed |
| 8 | StudentGuidePage.tsx: fetch from API + static fallback | ✅ completed |
| 9 | Admin.tsx: StudentGuideSectionEditor + student_guide_section type | ✅ completed |
| 10 | Run pnpm check + pnpm build | ⏳ pending (sandbox unavailable) |

---

## Known Issues / Reminders

- **Sandbox**: `mcp__workspace__bash` has been unreliable (times out). Cannot run `pnpm run check` or `pnpm run build` programmatically. Must be done manually or wait for shell availability.
- **`degree_taiwan_regulations`**: Intentionally removed from data (confirmed 0 matches via Grep). Replaced by `degree_important_laws` + `degree_transportation_regulations`.
- **Fallback pattern**: All `/api/student-guides` failures fall back to static data silently — no white screen.
- **Admin constraint**: `student_guide_section` items in `content_items` have `guide_id` and `order_index` embedded in `data_json`; these are stripped when returning section content to the client via `getStudentGuidesFromContentItems()`.
