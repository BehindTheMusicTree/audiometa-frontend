import "@testing-library/jest-dom/vitest";

if (!process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()) {
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = "contact@example.test";
}
