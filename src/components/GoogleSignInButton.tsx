"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
    >
      <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11.3-3.9-13.2-9.3l-6.6 5.1C7.9 38.4 15.3 43 24 43c10.5 0 19-8.5 19-19 0-1.2-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l6-6C34.6 5.1 29.6 3 24 3 15.6 3 8.4 7.9 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 43c5.2 0 9.9-1.8 13.6-4.9l-6.3-5.3C29.3 34.5 26.8 35 24 35c-5.2 0-9.6-2.6-11.6-6.9l-6.6 5.1C8.4 39.5 15.6 43 24 43z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.7l6.3 5.3C40.8 36.1 43 30.6 43 24c0-1.2-.1-2.4-.4-3.5z" />
      </svg>
      Continue with Google
    </button>
  );
}
