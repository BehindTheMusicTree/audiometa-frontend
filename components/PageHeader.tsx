interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex-none border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
        {title}
      </h1>
    </header>
  );
}
