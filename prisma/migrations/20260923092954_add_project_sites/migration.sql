-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT,
ADD COLUMN     "completionDate" TEXT,
ADD COLUMN     "isProject" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "landType" TEXT;

-- CreateTable
CREATE TABLE "ProjectSite" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "villaType" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "highlight" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectSite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectSite" ADD CONSTRAINT "ProjectSite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
