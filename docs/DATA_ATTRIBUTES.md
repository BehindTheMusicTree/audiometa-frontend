# Data Attributes in React

Industry-standard use of HTML `data-*` attributes in React projects: when to use them, naming, and what to avoid.

## Summary of data-* attributes

| Attribute | Purpose | When to use |
|-----------|---------|-------------|
| `data-testid` | Stable hook for tests | Fallback when role/label/text queries aren't practical. Prefer `getByRole` / `getByLabelText` first. |
| `data-state` | Component UI state | On components that define it (e.g. TableRow `selected`, Radix `open`/`closed`). Use only values the component documents. |
| `data-page` | Page/section identity | Root container of a page or major section, for E2E ("am I on this page?") or analytics. Value = route/feature name, kebab-case. |
| `data-analytics-event`, `data-track` | Analytics event name | When you need to tag elements for analytics. Prefer small identifiers. |
| `data-feature` | Feature flag / experiment | To target elements for A/B tests or feature detection. |

---

## Common use cases

### 1. Testing (e.g. `data-testid`)

[Testing Library](https://testing-library.com/docs/queries/about#priority) recommends querying by **role, label, or text** first. Use `data-testid` as a **fallback** when:

- There is no accessible role/label (e.g. a non-interactive wrapper)
- The visible text or label is unstable or duplicated
- You need a stable hook for E2E or integration tests

In this project we use **Vitest + Testing Library**. Prefer querying by role, label, or text; add `data-testid` only when those are impractical. See [Testing strategy](./testing.md) for query best practices.

```tsx
// Prefer: query by role/label
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');

// Fallback: when no semantic hook is available
<div data-testid="metadata-form">...</div>
// In test: screen.getByTestId('metadata-form')
```

**Naming:** Use kebab-case, and a name that reflects the **purpose or scope** (e.g. `metadata-form`, `track-list`), not implementation details.

---

### 2. Component / UI state (e.g. `data-state`)

Libraries like **Radix UI** use `data-state` to expose component state to CSS and JS (e.g. `open`, `closed`, `selected`). Use only the values that the component defines; don't invent new `data-state` values on arbitrary elements.

---

### 3. Page or section identification (e.g. `data-page`)

Use a single attribute on a root container to identify the **page or major section** for E2E tests or analytics.

```tsx
<div data-page="metadata-editor">...</div>
<div data-page="auth-callback">...</div>
```

Keep values **short, kebab-case, and stable** (tied to route or feature name, not UI copy).

---

### 4. Analytics and feature flags

- `data-analytics-event="..."` or `data-track="..."` for event names
- `data-feature="..."` for feature-flag or experiment targeting

Avoid storing **large or sensitive payloads** in attributes; use small identifiers and resolve details in code or backend. **See also:** [Analytics](./ANALYTICS.md) (custom events and `trackEvent` usage).

---

## Naming conventions

| Convention    | Example              | Notes                                      |
|---------------|----------------------|--------------------------------------------|
| **Kebab-case**| `data-testid="user-card"` | Matches HTML/JS convention                |
| **Stable names** | `data-page="metadata-editor"` | Tie to route/feature, not UI copy          |
| **Scoped**    | `data-testid="track-list-123"` | Optional suffix for lists when needed     |
| **Purpose, not implementation** | `data-testid="track-list"` not `data-testid="div-with-flex"` | Keeps tests meaningful if markup changes |

---

## When not to use data-*

- **Styling only:** Prefer Tailwind classes. Use `data-state` only when it's the standard hook for a component (e.g. Radix).
- **Large or complex data:** Don't put big JSON or sensitive data in attributes. Use React state, context, or the backend.
- **Semantics or accessibility:** Use proper elements (`<main>`, `<nav>`, `<button>`, ARIA) and visible labels; don't replace them with `data-*`.
- **Every element:** Add `data-testid` only where tests or tooling need a stable hook.

---

## References

- [HTML5: Custom data attributes (WHATWG)](https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
- [Testing Library – Priority of queries](https://testing-library.com/docs/queries/about#priority)
- [Project testing strategy](./testing.md)
