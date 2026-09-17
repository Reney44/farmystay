import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import AdminUserRow from "@/components/AdminUserRow";

export default async function AdminUsersPage() {
  const t = await getTranslations("admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isBlocked: true,
      _count: { select: { properties: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">{t("title")}</h1>
      <AdminNav />
      <h2 className="mb-4 text-lg font-semibold text-foreground">{t("users")}</h2>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <AdminUserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
