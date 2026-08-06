# 🤝 Contributing

Thanks for contributing to RahatVerse! Please follow these guidelines.

## Development rules

- **Phase-based:** build one phase at a time; never skip or combine phases. Every
  phase must leave the project stable and deployable.
- **Branching:** create a new Git branch matching the phase name (e.g.
  `phase-30-final-testing-and-documentation`). Never work directly on `main`.
- **Stack:** Next.js + TypeScript + Tailwind; Supabase; Cloudinary; Vercel. Do not
  introduce conflicting technologies without approval.

## Getting started

1. Fork / clone and set up locally (see `DEVELOPER_GUIDE.md`).
2. Create your branch.
3. Make changes; add tests for new logic or API routes (`tests/`).
4. Validate locally:
   ```bash
   npm install
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```
5. Update `docs/CHANGELOG.md`.
6. Commit with a clear message, push, and open a pull request.

## Code style

- TypeScript strict mode; no `any` unless absolutely necessary.
- Use the `@/*` path alias for imports.
- Keep server-only modules out of client code.
- Authorize server-side via `getCurrentUserContext()`; never trust client roles.
- Write user-facing strings in both `bn` and `en` in `src/i18n/messages`.

## Commit message convention

Use conventional prefixes: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`,
`perf:`, `security:`. Example: `feat: add newsletter double opt-in`.

## Pull request checklist

- [ ] Branch matches the phase name
- [ ] Lint, type-check, tests, and build all pass
- [ ] Tests added/updated for new behavior
- [ ] Documentation/changelog updated
- [ ] No secrets or `.env` files committed
- [ ] RLS/Supabase changes reflected in migrations
