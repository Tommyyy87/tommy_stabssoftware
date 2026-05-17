export function PageSection({
  children,
  className = "panel"
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={className}>{children}</section>;
}
