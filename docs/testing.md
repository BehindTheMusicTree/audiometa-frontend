# Testing Strategy

## Table of Contents

1. [Goals](#1-goals)
2. [Tools](#2-tools)
3. [Test Types](#3-test-types)
4. [Next.js-Specific Testing Rules](#4-nextjs-specific-testing-rules)
5. [Mocking Strategy](#5-mocking-strategy)
6. [React Strict Mode](#6-react-strict-mode)
7. [Directory Structure](#7-directory-structure)
8. [Running Tests](#8-running-tests)

---

## 1. Goals

- Ensure reliability of client and server components.
- Prevent regressions in routing, rendering, and data‑fetching logic.
- Provide fast feedback during development using Vitest.
- Maintain confidence in critical user flows through integration and E2E testing.
- Keep tests deterministic, isolated, and easy to maintain.

---

## 2. Tools

### Unit & Component Testing

- Vitest
- @testing-library/react
- @testing-library/jest-dom
- happy-dom or jsdom
- MSW (Mock Service Worker)

### End-to-End Testing

- Playwright (recommended) or Cypress

---

## 3. Test Types

### 3.1 Unit Tests

Used for: utility functions, server‑side logic, small client components. Keep tests isolated; mock external dependencies; avoid rendering full pages.

### 3.2 Component Tests

Used for: client components, server components (rendering only). Test behavior, not implementation details. **Finding elements:** Use Testing Library queries. Prefer, in order: `getByRole`, `getByLabelText`, `getByText`. Use `getByTestId` only when role/label/text are impractical; see [Data attributes](./DATA_ATTRIBUTES.md). Do **not** use `document.querySelector` or other DOM selectors. Mock server actions and data‑fetching.

### 3.3 Integration Tests

Used for: API routes, server actions, data‑fetching logic, component + API interaction. Use MSW for network mocking; avoid real external API calls.

### 3.4 End-to-End Tests

Used for: routing, authentication, critical user journeys. Keep E2E tests minimal and focused; only test critical paths; avoid flakiness.

---

## 4. Next.js-Specific Testing Rules

### Server Components

- Test pure logic with unit tests
- Test rendering with component tests
- Mock `fetch`, server actions, and external services

### Client Components

- Use React Testing Library
- Mock `next/navigation` when needed

### Routing

Example mock:

```ts
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));
```

---

## 6. React Strict Mode

We use a **hybrid** approach:

- **Unit and component tests (Vitest):** Run **without** React Strict Mode. Do not wrap components in `<StrictMode>` in custom render helpers or test setup; do not call `configure({ reactStrictMode: true })` in RTL. Prefer exact assertions (e.g. `toHaveLength(n)`, `getByRole(...)` for a single element). If your environment still double-renders, use resilient assertions: `expect(elements.length).toBeGreaterThanOrEqual(n)` for counts and `getAllByRole` / `getAllByLabelText` then `expect(...length).toBeGreaterThanOrEqual(1)` for elements that should appear once.
- **E2E tests:** Run the real app. The app uses whatever is configured in the Next.js root (e.g. `reactStrictMode` in `next.config.js`).

---

## 7. Directory Structure

- **Unit and component tests:** Co-locate with source as `*.test.ts` or `*.test.tsx` next to the file under test (e.g. `page.tsx` → `page.test.tsx`, `utils.ts` → `utils.test.ts`).
- **Integration tests:** Place in **`tests/integration/`** at the project root (e.g. `tests/integration/metadata-flow.test.tsx`). Use MSW and real or wrapped providers only where the test needs a multi-module flow.
- **E2E tests:** Place in **`e2e/`** or **`tests/e2e/`** (e.g. Playwright specs). Keep them separate from Vitest so they can be run with a different command and config.

---

## 8. Running Tests

Configure scripts in `package.json` as needed, for example:

- `npm run test` or `vitest` for unit/component tests
- `npm run test:integration` for integration tests (if configured)
- `npm run test:e2e` for E2E (Playwright/Cypress)
