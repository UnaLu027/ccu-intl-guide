# Content Maintenance Notes

The live source for website content and MCP responses is active data in the database. The public site and MCP tools should read the same active `content_items` records for offices, departments, tasks, student guide sections, and service categories.

Static TypeScript content is now first-time seed data only. Startup may insert missing `content_items` rows, but it must not overwrite existing active database content during deployment.

The normal way to update one item remains the existing Admin > Content Maintenance editor. Applied changes update `content_items` and append before/after JSON to `content_drafts`.

Cowork-assisted bulk edits must use this flow:

1. Export active content from the Content Maintenance area.
2. Edit the exported JSON into a content-update package.
3. Import the package for preview/dry run.
4. Explicitly apply the reviewed preview in admin.

Content Package Export/Import is only for reviewed editable website-content updates. It is the sanitized workflow for offices, departments, tasks, student guide sections, and service categories; it is not a full database backup format.

Full Data Backup Export is a private administrative archive for preserving content and historical/usage records before manual clearing operations. Administrators should download a full backup before using any manual clear action for search records, CCUGPT records, content drafts, or usage records.

Private full backups can contain administrative history and usage records. They must never be committed to the public repository or uploaded to Cowork/Codex as general content-update material.

Restoration from a private full backup is intentionally not implemented in this branch. Any future restore workflow would require a separately reviewed preview/apply design.

The `hotfix-live-guide-content-review` branch must not be merged or cherry-picked for content updates. Reviewed content from that branch should be prepared as a pending JSON package and applied only through the admin import preview/apply workflow.

Production backup ZIP files, content history exports, analytics data, CCUGPT logs, MCP logs, sessions, and private records must never be committed to this public repository.

The FAQ questions from the FAQ new-items PDF are deliberately deferred to a later content package after this architecture is validated. This branch only makes FAQ/service categories maintainable.
