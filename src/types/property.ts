import type { Prisma } from "@prisma/client";

export type PropertyWithRelations = Prisma.PropertyGetPayload<{
  include: { location: true; media: true };
}>;
