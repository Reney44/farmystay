import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
