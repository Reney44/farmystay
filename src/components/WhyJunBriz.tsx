import { getTranslations } from "next-intl/server";
import { Leaf, Sprout, Users, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: Leaf, titleKey: "why1Title", bodyKey: "why1Body" },
  { icon: Sprout, titleKey: "why2Title", bodyKey: "why2Body" },
  { icon: Users, titleKey: "why3Title", bodyKey: "why3Body" },
  { icon: ShieldCheck, titleKey: "why4Title", bodyKey: "why4Body" },
] as const;

export default async function WhyJunBriz() {
  const t = await getTranslations("home");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("whyTitle")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("whyIntro")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, titleKey, bodyKey }) => (
          <div key={titleKey} className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-semibold text-foreground">{t(titleKey)}</h3>
            <p className="text-sm text-muted-foreground">{t(bodyKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
