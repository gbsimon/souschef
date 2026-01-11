# Repository Guidelines

## Project Structure & Module Organization
This repository is currently empty. When you add code, keep a clear top-level structure and document it here. A common baseline is:
- `src/` for application or library code.
- `tests/` for automated tests.
- `assets/` for static files (images, fixtures, data).

If you introduce a framework (e.g., `app/` for Rails, `lib/` for Node/TS, or `cmd/` for Go), update this section with exact paths and module boundaries.

## Build, Test, and Development Commands
No build or run commands are defined yet. Once tooling is added, list the exact commands and what they do. Example:
- `npm run dev`: start local development server.
- `npm test`: run unit tests.
- `npm run build`: create a production build.

## Coding Style & Naming Conventions
No style rules are defined yet. When you add them, document indentation, formatter/linter (e.g., `prettier`, `eslint`, `ruff`), and naming patterns (e.g., `snake_case` files, `PascalCase` types).

## Testing Guidelines
No test framework is configured yet. When introduced, specify framework, command (e.g., `pytest`, `jest`), naming conventions, and coverage expectations.

## Product UX Flow (Nori)
Nori is a cozy, voice-first cooking assistant. The MVP UX should follow this flow:
- Onboarding: account creation, allergy/intolerance capture, and a short pantry essentials confirmation.
- Home/Ask: tap to speak (text fallback available).
- Follow-up: Nori asks up to two missing-ingredient questions.
- Results: show 3-5 recipe cards filtered by allergies; preferences may suggest substitutions.
- Recipe Detail: full in-app steps, ingredient list, and a clear Save button.
- Pantry/Preferences: inferred items and appliances show a confirm/deny toggle.

## Commit & Pull Request Guidelines
Commit history is not available in this directory. Until conventions are established: use concise, descriptive commit messages, include testing notes in PRs, and attach screenshots for UI changes.

## Configuration & Secrets
Do not commit secrets. If you add configuration files, include safe defaults and reference `.env` or local overrides as needed.
