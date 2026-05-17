type StatusBadgeTone = "neutral" | "online" | "offline";

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
}) {
  const className =
    tone === "neutral" ? "status-badge" : `status-badge ${tone}`;

  return <span className={className}>{children}</span>;
}
