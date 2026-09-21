"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import GoogleSignInButton from "./GoogleSignInButton";

export default function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "OWNER" },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error || "Something went wrong");
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("name")}
        </label>
        <input
          {...register("name")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("phone")}
        </label>
        <input
          {...register("phone")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("password")}
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          {t("iAmA")}
        </label>
        <select
          {...register("role")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="OWNER">{t("owner")}</option>
          <option value="BROKER">{t("broker")}</option>
        </select>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {t("registerButton")}
      </button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton />

      <p className="text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-primary">
          {t("loginButton")}
        </Link>
      </p>
    </form>
  );
}
