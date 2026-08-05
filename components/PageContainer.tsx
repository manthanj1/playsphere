interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main className={`flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-12 ${className}`}>
      {children}
    </main>
  );
}
