import { getTranslations } from "next-intl/server";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {t("registerTitle")}
      </h1>
      <RegisterForm />
    </div>
  );
}
