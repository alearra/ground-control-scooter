export type StatusTone = "neutral" | "ok" | "warn" | "danger" | "accent";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral: "border-line text-muted",
  ok: "border-ok/60 text-ok",
  warn: "border-warn/60 text-warn",
  danger: "border-danger/60 text-danger",
  accent: "border-accent/60 text-accent",
};

export function StatusPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-surface-2/60 px-2.5 py-1 text-xs ${TONE_CLASS[tone]}`}
    >
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}
