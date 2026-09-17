import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";
import { buildPropertyWhere } from "@/lib/property-filters";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine");
  const session = await auth();

  const where = buildPropertyWhere({
    locationId: searchParams.get("locationId") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    minSize: searchParams.get("minSize") || undefined,
    maxSize: searchParams.get("maxSize") || undefined,
    sizeUnit: searchParams.get("sizeUnit") || undefined,
  });

  if (mine === "true" && session?.user) {
    where.status = undefined;
    where.ownerId = session.user.id;
  }

  const properties = await prisma.property.findMany({
    where,
    include: { location: true, media: { orderBy: { order: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(properties);
}

export async function POST(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    !["OWNER", "BROKER", "ADMIN"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const property = await prisma.property.create({
    data: {
      ...data,
      contactEmail: data.contactEmail || null,
      ownerId: session.user.id,
      media: {
        create: mediaUrls.map((m, i) => ({
          url: m.url,
          type: m.type,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json(property, { status: 201 });
}
