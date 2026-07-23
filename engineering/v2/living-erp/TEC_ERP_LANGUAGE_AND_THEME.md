# TEC.ERP Language and Theme

## Language

| Rule | Implementation |
|------|----------------|
| Default locale | **FR** (`LocaleProvider` → `"fr"` when storage empty) |
| Switch | Top bar `locale-switch` → FR / EN |
| Persistence | `localStorage` key `tec-erp.locale` (+ per-employee `tec-erp.locale.{employeeId}`) |
| Document lang | `document.documentElement.lang` |
| Catalogs | `apps/web/src/i18n/messages/fr.ts`, `en.ts` |
| Status labels | `statusLabels.ts` + `t(statusMessageKey)` |
| Dates / numbers | `Intl` `fr-CA` / `en-CA` |
| Login errors | `localizeLoginError` maps English credential/validation leaks to FR copy |

### Coverage (honest)

- **Wired:** shell controls, home section titles, professor nav labels, KPI field labels, AI mode labels, many status chips, login form labels.
- **Still FR-hardcoded / mixed:** substantial body copy in Capstone, Certificates, Mission Center, Transaction workspace, parts of LearnerHome/ModuleHub narrative, some attention strings.
- EN switch does **not** yet guarantee 100% English on every legacy page.

## Theme

| Preference | Behavior |
|------------|----------|
| `light` | Force light tokens |
| `dark` | Force dark tokens |
| `system` (**default**) | `prefers-color-scheme` + live media listener |

- Storage: `tec-erp.theme`
- Applied as `data-theme` on `<html>`
- Control: top bar `theme-switch`

## Tests

`apps/web/src/__tests__/living-erp-shell.test.tsx`:

- FR default + EN persistence
- Theme persistence + dark `data-theme`
- Context panel collapse
- FR localization of English login credential error
