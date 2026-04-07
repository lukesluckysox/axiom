# Changelog

All notable changes to Liminal are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] — 2026-04-06

### Fixed

**Auth 500 — poison-state bug in `initializeDatabase()`**
- When schema initialization failed (transient DB connection, cold start, missing env var), `initPromise` retained the rejected promise permanently. Every subsequent request immediately re-threw that rejection without retrying, causing a persistent 500 on signup and login until the server restarted.
- Fixed: the catch block now resets `initPromise = null` before re-throwing, so the next request gets a fresh attempt. Concurrent callers during a failing init still share the single rejected promise correctly.
- Added an explicit guard: if `DATABASE_URL` is unset, throws a clear `[db] DATABASE_URL is not set` error immediately rather than timing out on pool.connect().

### Changed

**Philosophical color palette — full sitewide redesign**
- Background: midnight ink `#0F1720` (cool, dark blue-black — replaced warm brown-black)
- Text: aged parchment `#E8E2D6` (readable, warm white against midnight ink)
- Primary accent: burnished gold `#C6A75C` (more aged and muted than previous `#B8963A`)
- New tokens: oxidized bronze `--color-bronze` `#6E7C73` and dusty plum `--color-plum` `#6B5A6E`
- All tool accent colors updated to harmonize with new palette (muted, philosophical):
  - Small Council → burnished gold · Genealogist → oxidized bronze · Interlocutor → muted steel blue
  - Stoic's Ledger → stone · The Fool → muted crimson · The Interpreter → dusty plum
- Council advisor accents updated to match: Instinct → terra cotta · Critic → steel blue · Realist → bronze · Shadow → plum · Sage → gold

**Homepage — hexagonal layout**
- Six tool cards repositioned from a responsive grid to a hexagonal arrangement: one card at each vertex of a regular hexagon (pointy-top orientation)
- SVG overlay draws the connecting hexagon outline, six dashed spokes, and a decorative inner portal hexagon at center
- Center portal shows "liminal / choose your lens" in display italic + small caps
- Cards are compact (148 × ~120px): glyph, accent bar, name, tagline, enter cue
- Tablet (600–900px): CSS `scale(0.72)` preserves hex layout at smaller viewports
- Mobile (<600px): graceful grid fallback (2-col → 1-col), SVG and center portal hidden

---



## [1.1.0] — 2026-04-06

### Added

**Small Council — progressive advisor disclosure**
- Real-time streaming SSE route at `/api/tools/small-council/stream`
- New `SmallCouncilClient` replaces the generic tool form: submit a question, then watch each of the five advisors arrive on screen as they complete — Round I first, Round II after all five have spoken, synthesis at the end
- Auto-navigates to the session page 1.8 seconds after synthesis appears, with an "Open now →" escape link for users who don't want to wait
- Round I and Round II section headers appear progressively with divider animations
- Per-advisor fade-in animation on arrival

**Small Council — advisor rename**
- Advisors renamed from Game of Thrones-adjacent titles to pure epistemic archetypes: The Instinct, The Critic, The Realist, The Shadow, The Sage
- Each advisor has a distinct stance and personality grounded in its archetype

**Homepage — Small Council session preview**
- Static example session below the tool grid showing all five advisors and a synthesis
- Each advisor rendered with its own persona accent color (terra cotta, steel blue, sage, violet, gold)
- Synthesis strip with gold accent border
- "Begin / Free to start" CTA for logged-out visitors

**Tool input pages — preambles**
- The Genealogist: explains the seven excavation findings before the user submits
- The Interlocutor: explains the six-part examination structure
- The Fool: names the Fool's historical role and the seven fields returned
- The Interpreter: names all five lenses (Jungian, Narrative, Somatic, Cultural/Historical, Existential) and explains the notices/misses structure

**Session management — delete**
- `DeleteSessionButton` component with a two-step confirm flow (click → confirm/cancel)
- Delete button on every session page footer
- Delete button on every archive card (positioned outside the link to avoid nesting)
- `DELETE /api/sessions/[sessionId]` route was already present; UI wiring added

**Infrastructure**
- `lib/tools/constants.ts`: single source of truth for all tool accent colors and display labels — used by archive page, session page, and tool pages (eliminates three-location duplication)
- `SessionOutputErrorBoundary`: wraps the session output renderer; malformed session data no longer crashes the page

### Changed

- **Interlocutor tagline**: "Test an idea against rigorous questioning." → "Submit an argument. Receive its full examination."
- **Stoic's Ledger accent**: `172 142 100` (amber, too close to gold) → `148 140 124` (stone — distinct and more austere)
- **Stoic's Ledger minimum input**: 10 chars → 80 chars (requires a genuine day's account)
- **All other tools minimum input**: 10 chars → 20 chars
- **Small Council summary truncation**: previously sliced mid-sentence at 200 chars; now finds the last complete sentence within 200 chars
- **Session page metadata**: `generateMetadata` previously returned "Session — Liminal" for every session; now returns `"[question title] — [Tool Name] — Liminal"`
- **Small Council blurb on homepage**: updated to reflect new advisor names

### Fixed

- **Health check regression**: `/api/health` previously called `initializeDatabase()` on every ping, which runs the full schema SQL. On Railway cold starts, PostgreSQL isn't always warm when the health check begins, causing repeated 503 responses that exhaust the 300-second `healthcheckTimeout` and mark a valid deployment as failed. Fixed: health check now uses a raw pool connection (no schema init, no side effects) and always returns HTTP 200 — DB status is reported in the JSON body for observability but never gates the response code. Real crashes are caught by Railway's process monitoring independently.
- **Health check static pre-render**: added `export const dynamic = 'force-dynamic'` so Next.js does not pre-render the health route at build time (which would have cached a stale DB-unavailable response)

---

## [1.0.0] — 2026-04-05

Initial production release.

### Included

- Six thinking tools: Small Council, The Genealogist, The Interlocutor, The Stoic's Ledger, The Fool, The Interpreter
- Email/password auth with HTTP-only cookie sessions (bcryptjs + pg)
- PostgreSQL on Railway with inline schema initialization
- All six tool orchestrators (Anthropic SDK, `claude-sonnet-4-20250514`)
- Session archive with per-tool accent badges
- Session viewer with collapsible original input
- nixpacks.toml with separate install/build phases (fixes EBUSY cache conflict)
- Railway health check at `/api/health`
