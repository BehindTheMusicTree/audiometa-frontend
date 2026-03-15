import Image from "next/image";

function LinkedInIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MastodonIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icons/mastodon.svg"
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 min-h-5 min-w-5 shrink-0 object-contain"
      aria-hidden
    />
  );
}

function MailIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function DeveloperCredit() {
  const name = process.env.NEXT_PUBLIC_DEVELOPER;
  if (!name) return null;

  return (
    <span className="flex items-center gap-2 text-sm text-slate-400">
      <a
        href={process.env.NEXT_PUBLIC_GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-300 underline decoration-amber-500/50 underline-offset-2 transition-colors hover:text-amber-400 hover:decoration-amber-400"
      >
        {name}
      </a>
      <span className="flex items-center gap-1" aria-hidden="true">
        <a
          href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded p-0.5 text-slate-400 transition-colors hover:text-amber-400"
          aria-label="Developer on LinkedIn"
        >
          <LinkedInIcon />
        </a>
        <a
          href={process.env.NEXT_PUBLIC_MASTODON_URL}
          target="_blank"
          rel="me noopener noreferrer"
          className="rounded p-0.5 text-slate-400 transition-colors hover:text-amber-400"
          aria-label="Developer on Mastodon"
        >
          <MastodonIcon />
        </a>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
          className="rounded p-0.5 text-slate-400 transition-colors hover:text-amber-400"
          aria-label="Email developer"
        >
          <MailIcon />
        </a>
      </span>
    </span>
  );
}

export default function PageFooter() {
  return (
    <footer className="flex flex-none flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-amber-500/20 bg-linear-to-t from-slate-800 to-slate-900 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        Powered by
        <Image
          src="/logo-round.png"
          alt="Audiometa"
          width={28}
          height={28}
          className="h-7 w-7 rounded-full ring-1 ring-slate-600"
        />
      </span>
      <DeveloperCredit />
    </footer>
  );
}
