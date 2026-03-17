import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocContentProps {
  content: string;
}

interface MdProps {
  children?: ReactNode;
}

const docComponents = {
  h1: ({ children }: MdProps) => (
    <h1 className="mb-4 mt-6 text-2xl font-semibold text-slate-900 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: MdProps) => (
    <h2 className="mb-3 mt-8 border-b border-slate-200 pb-1 text-xl font-semibold text-slate-800">
      {children}
    </h2>
  ),
  h3: ({ children }: MdProps) => (
    <h3 className="mb-2 mt-6 text-lg font-semibold text-slate-800">{children}</h3>
  ),
  p: ({ children }: MdProps) => <p className="mb-3 text-slate-700">{children}</p>,
  a: ({ href, children }: MdProps & { href?: string }) => (
    <a
      href={href}
      className="font-medium text-amber-600 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-700 hover:decoration-amber-500"
    >
      {children}
    </a>
  ),
  ul: ({ children }: MdProps) => (
    <ul className="mb-3 list-disc space-y-1 pl-6 text-slate-700">{children}</ul>
  ),
  ol: ({ children }: MdProps) => (
    <ol className="mb-3 list-decimal space-y-1 pl-6 text-slate-700">{children}</ol>
  ),
  table: ({ children }: MdProps) => (
    <div className="mb-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-slate-300 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: MdProps) => (
    <thead className="bg-slate-100">{children}</thead>
  ),
  th: ({ children }: MdProps) => (
    <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">
      {children}
    </th>
  ),
  td: ({ children }: MdProps) => (
    <td className="border border-slate-300 px-3 py-2 text-slate-700">{children}</td>
  ),
  tr: ({ children }: MdProps) => <tr className="border-b border-slate-200">{children}</tr>,
  code: ({ children }: MdProps) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">
      {children}
    </code>
  ),
  pre: ({ children }: MdProps) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800">
      {children}
    </pre>
  ),
  blockquote: ({ children }: MdProps) => (
    <blockquote className="border-l-4 border-amber-500/50 pl-4 italic text-slate-600">
      {children}
    </blockquote>
  ),
};

export default function DocContent({ content }: DocContentProps) {
  return (
    <article className="max-w-none" data-testid="doc-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={docComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
