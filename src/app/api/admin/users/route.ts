import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      _count: { select: { properties: true } },
    },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, isBlocked, role } = body as {
    userId?: string;
    isBlocked?: boolean;
    role?: string;
  };

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot change your own account here" },
      { status: 400 }
    );
  }

  const data: { isBlocked?: boolean; role?: "ADMIN" | "OWNER" | "BROKER" | "USER" } = {};
  if (typeof isBlocked === "boolean") data.isBlocked = isBlocked;
  if (role && ["ADMIN", "OWNER", "BROKER", "USER"].includes(role)) {
    data.role = role as "ADMIN" | "OWNER" | "BROKER" | "USER";
  }

  const user = await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json(user);
}
