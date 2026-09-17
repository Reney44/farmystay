import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  const property = await prisma.property.findUnique({
    where: { id },
    include: { location: true, media: { orderBy: { order: "asc" } } },
  });

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = session?.user?.id === property.ownerId;
  const isAdmin = session?.user?.role === "ADMIN";

  if (property.status !== "APPROVED" && !isOwner && !isAdmin) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (property.status === "APPROVED" && !isOwner && !isAdmin) {
    await prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return NextResponse.json(property);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = session?.user?.id === existing.ownerId;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { mediaUrls, ...data } = parsed.data;

  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      contactEmail: data.contactEmail || null,
      // Edits go back to pending so admin can re-review changed details.
      status: isAdmin ? existing.status : "PENDING",
      media: {
        deleteMany: {},
        create: mediaUrls.map((m, i) => ({
          url: m.url,
          type: m.type,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = session?.user?.id === existing.ownerId;
  const isAdmin = session?.user?.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
