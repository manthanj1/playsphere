interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  actions,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#0b1c30]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-lg text-[#434656] max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
