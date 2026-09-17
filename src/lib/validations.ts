import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["OWNER", "BROKER"]),
});

export const propertyCategoryEnum = z.enum([
  "LAND",
  "LAND_WITH_BUILDING",
  "WETLAND",
  "DRYLAND",
]);

export const sizeUnitEnum = z.enum(["CENT", "ACRE", "SQFT"]);

export const propertySchema = z.object({
  title: z.string().min(4, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  category: propertyCategoryEnum,
  price: z.coerce.number().positive("Price must be greater than 0"),
  size: z.coerce.number().positive("Size must be greater than 0"),
  sizeUnit: sizeUnitEnum,
  locationId: z.string().min(1, "Location is required"),
  latitude: z.coerce.number({ message: "Pin the property's location on the map" }).min(-90).max(90),
  longitude: z.coerce.number({ message: "Pin the property's location on the map" }).min(-180).max(180),
  addressDetails: z.string().optional(),
  nearbyAttractions: z.string().optional(),
  sellerType: z.enum(["OWNER", "BROKER"]),
  contactName: z.string().min(2, "Contact name is required"),
  contactPhone: z.string().min(10, "Enter a valid phone number"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  mediaUrls: z
    .array(z.object({ url: z.string(), type: z.enum(["IMAGE", "VIDEO"]) }))
    .min(1, "Add at least one photo"),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
