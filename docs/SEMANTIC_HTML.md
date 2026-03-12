# Semantic HTML: Layout Elements

Industry-standard use of `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, and `<footer>` in React and Next.js apps. Prefer these over generic `<div>` when the meaning fits.

## Summary

| Element | Role | Use for |
|---------|------|--------|
| `<header>` | Banner (or intro to a section) | Site/app header, or heading block of a section/article |
| `<main>` | Main content | Single main content of the page; one per page |
| `<section>` | Generic section | Thematic grouping with (usually) a heading |
| `<article>` | Self-contained content | Blog post, card, comment, product—content that could stand alone |
| `<nav>` | Navigation | Links for getting around the site or within the page |
| `<footer>` | Content info / footer | Site footer, or footer of a section/article |

Use Tailwind (or other utilities) on these elements as needed; they are layout and meaning, not visual style.

---

## &lt;header&gt;

**Meaning:** Introductory or navigational content for the page or for a section/article.

**Use for:**

- The **top bar** of the app (logo, primary nav, user menu).
- The **title section** at the top of a page: wrap the page `<h1>` and optional intro in `<header>` inside `<main>`.
- The **intro block** of a `<section>` or `<article>` (title, meta, byline).

**Don't:** Use for every "top" div; reserve for real headers. Prefer one main page header; section/article headers as needed.

```tsx
<header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4">
  <Logo />
  <Nav />
</header>

<section>
  <header>
    <h2>Uploaded files</h2>
    <p>Manage your local files.</p>
  </header>
  ...
</section>
```

---

## &lt;main&gt;

**Meaning:** The primary content of the document. There should be **one** `<main>` per page (or one visible at a time in SPAs).

**Use for:** The main content area of the page (after layout header/sidebar).

**Don't:** Put `<main>` inside `<header>`, `<footer>`, `<nav>`, or `<aside>`. Don't use multiple `<main>` elements unless only one is visible.

```tsx
<>
  <Header />
  <main className="flex-1 p-4 md:p-6">
    <header>
      <h1>Metadata Editor</h1>
      <p>Optional intro or description.</p>
    </header>
    ...
  </main>
  <Footer />
</>
```

---

## &lt;section&gt;

**Meaning:** A thematic grouping of content, usually with a heading.

**Use for:** Chunks of the page that have a clear topic. Use a heading (`<h2>`, etc.) inside to define the section.

**Don't:** Use as a generic wrapper for any div; if there's no theme or heading, a `<div>` is fine.

```tsx
<section className="space-y-4" aria-labelledby="files-heading">
  <h2 id="files-heading">Uploaded files</h2>
  ...
</section>
```

---

## &lt;article&gt;

**Meaning:** Self-contained content that could be distributed or reused on its own.

**Use for:** Blog posts, news items, product cards, track cards, playlist cards—anything that is a discrete "piece" of content.

**Don't:** Use for every card or block; reserve for content that is actually self-contained.

```tsx
<article className="rounded-lg border p-4">
  <header>
    <h2>Track title</h2>
    <p className="text-sm text-muted-foreground">Artist · Album</p>
  </header>
  <p>...</p>
  <footer>...</footer>
</article>
```

---

## &lt;nav&gt;

**Meaning:** A block of links for navigating the site or within the page.

**Use for:** Primary site nav (sidebar, top bar links), table of contents, pagination. Use `aria-label` when you have multiple navs (e.g. "Main", "Breadcrumb").

```tsx
<nav className="flex flex-col gap-2" aria-label="Main">
  <Link href="/">Home</Link>
  <Link href="/metadata">Metadata</Link>
  ...
</nav>
```

---

## &lt;footer&gt;

**Meaning:** Footer for the page or for a section/article (copyright, links, meta).

**Use for:** Site-wide footer (copyright, legal links). Footer of an `<article>` or `<section>` (e.g. "Posted on …", actions).

```tsx
<footer className="border-t py-4 text-center text-sm text-muted-foreground">
  <p>© 2025 …</p>
  <nav aria-label="Legal">...</nav>
</footer>
```

---

## Quick reference

- **One `<main>` per page** (or one visible at a time).
- **`<header>` / `<footer>`** can appear at page level and again inside each `<section>` or `<article>`.
- **`<section>`** = thematic group with a heading; **`<article>`** = self-contained content.
- **`<nav>`** = navigation links; use `aria-label` when you have multiple navs.
- Prefer these over `<div>` when the meaning matches; combine with Tailwind for layout and styling.

## See also

- [MDN: HTML content sections](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
- [Project style guide](./STYLE_GUIDE.md)
