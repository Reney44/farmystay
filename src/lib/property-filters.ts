import type { Prisma, PropertyCategory, SizeUnit } from "@prisma/client";

export type PropertySearchParams = {
  locationId?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minSize?: string;
  maxSize?: string;
  sizeUnit?: string;
};

export function buildPropertyWhere(
  params: PropertySearchParams
): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { status: "APPROVED" };

  if (params.locationId) where.locationId = params.locationId;
  if (params.category) where.category = params.category as PropertyCategory;

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = Number(params.minPrice);
    if (params.maxPrice) where.price.lte = Number(params.maxPrice);
  }

  if (params.minSize || params.maxSize) {
    where.size = {};
    if (params.minSize) where.size.gte = Number(params.minSize);
    if (params.maxSize) where.size.lte = Number(params.maxSize);
    if (params.sizeUnit) where.sizeUnit = params.sizeUnit as SizeUnit;
  }

  return where;
}
