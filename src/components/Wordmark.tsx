export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      <span className="text-primary">Jun</span>
      <span className="text-accent">Briz</span>
      <span className="text-muted-foreground font-normal" style={{ fontSize: "0.62em" }}>
        .com
      </span>
    </span>
  );
}
