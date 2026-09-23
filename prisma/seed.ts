import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DUMMY_LISTER_EMAIL = "demo@junbriz.com";

const DUMMY_PROPERTIES = [
  {
    title: "Sandalwood-adjacent plot near Marayoor town",
    description:
      "A well-shaped level plot a short walk from Marayoor town, bordered by the reserve forest edge. Road access on two sides, ideal for a farmhouse or holiday home.",
    category: "LAND" as const,
    price: 1200000,
    size: 30,
    sizeUnit: "CENT" as const,
    locationName: "Marayoor",
    lat: 10.3178,
    lng: 77.1339,
    addressDetails: "1.5 km from Marayoor town junction, off the Munnar road",
    nearbyAttractions: "Marayoor sandalwood forest, Muniyara dolmens",
    photos: ["farmystay-1", "farmystay-2"],
    featured: true,
  },
  {
    title: "Cardamom estate with old plantation house",
    description:
      "Established cardamom estate with a 2-bedroom plantation-style house, a small stream along one boundary, and mature shade trees. Estate has been maintained for over 15 years.",
    category: "LAND_WITH_BUILDING" as const,
    price: 8500000,
    size: 3.5,
    sizeUnit: "ACRE" as const,
    locationName: "Marayoor",
    lat: 10.3241,
    lng: 77.1281,
    addressDetails: "Near Kottakamboor, 4 km from Marayoor",
    nearbyAttractions: "Rajiv Gandhi National Park viewpoint",
    photos: ["farmystay-3", "farmystay-4", "farmystay-5"],
    featured: true,
  },
  {
    title: "Riverside wetland plot, Marayoor",
    description:
      "Fertile wetland plot along a seasonal stream, currently used for paddy. Good water retention through most of the year and easy tractor access.",
    category: "WETLAND" as const,
    price: 650000,
    size: 45,
    sizeUnit: "CENT" as const,
    locationName: "Marayoor",
    lat: 10.3132,
    lng: 77.1402,
    addressDetails: "Near the old sugar factory road",
    nearbyAttractions: "Marayoor sugar factory",
    photos: ["farmystay-6"],
    featured: false,
  },
  {
    title: "Dry hillside plot with valley view",
    description:
      "Elevated dryland plot with an open, unobstructed view of the surrounding hills. Suitable for a hill-view holiday home. Approach road being widened by panchayat.",
    category: "DRYLAND" as const,
    price: 480000,
    size: 25,
    sizeUnit: "CENT" as const,
    locationName: "Marayoor",
    lat: 10.3095,
    lng: 77.1257,
    addressDetails: "Above Chinnar road, 3 km from town",
    nearbyAttractions: "Chinnar Wildlife Sanctuary",
    photos: ["farmystay-7"],
    featured: false,
  },
  {
    title: "Apple and strawberry farm plot, Kanthalloor",
    description:
      "Active fruit farm growing apple, strawberry and seasonal vegetables — Kanthalloor's specialty. Drip irrigation already installed, farm caretaker available to continue on request.",
    category: "LAND" as const,
    price: 1800000,
    size: 1.2,
    sizeUnit: "ACRE" as const,
    locationName: "Kanthalloor",
    lat: 10.2701,
    lng: 77.2358,
    addressDetails: "Near Kanthalloor town, off the Kambakallu road",
    nearbyAttractions: "Kambakallu viewpoint, local fruit farms",
    photos: ["farmystay-8", "farmystay-9"],
    featured: true,
  },
  {
    title: "Family home on 20 cents, Kanthalloor",
    description:
      "Compact 2-bedroom home on a fenced, garden plot in a quiet residential lane. Move-in ready, with a small vegetable patch and fruit trees.",
    category: "LAND_WITH_BUILDING" as const,
    price: 3200000,
    size: 20,
    sizeUnit: "CENT" as const,
    locationName: "Kanthalloor",
    lat: 10.2664,
    lng: 77.2291,
    addressDetails: "Kanthalloor town, near the panchayat office",
    nearbyAttractions: "Kanthalloor market, fruit farms",
    photos: ["farmystay-10"],
    featured: false,
  },
  {
    title: "Terraced dryland plot with fruit trees",
    description:
      "Gently terraced dryland plot planted with mixed fruit trees (plum, pear, orange). Good sun exposure, ideal for expanding into a small orchard or farmstay.",
    category: "DRYLAND" as const,
    price: 720000,
    size: 60,
    sizeUnit: "CENT" as const,
    locationName: "Kanthalloor",
    lat: 10.2745,
    lng: 77.2412,
    addressDetails: "Near Kovilkadavu, 2 km from Kanthalloor town",
    nearbyAttractions: "Kovilkadavu river bathing spot",
    photos: ["farmystay-11"],
    featured: false,
  },
  {
    title: "Low-lying wetland plot near stream",
    description:
      "Waterlogged plot suited for paddy or continued vegetable cultivation, fed by a nearby perennial stream. Boundary stones in place, clear title.",
    category: "WETLAND" as const,
    price: 380000,
    size: 35,
    sizeUnit: "CENT" as const,
    locationName: "Kanthalloor",
    lat: 10.2618,
    lng: 77.2276,
    addressDetails: "Below the Kanthalloor-Marayoor link road",
    nearbyAttractions: "Kanthalloor fruit farms",
    photos: ["farmystay-12"],
    featured: false,
  },
];

const FLAGSHIP_PROJECT_TITLE = "Reney's JunBriz Paradise";

const FLAGSHIP_SITES = [
  {
    label: "Plot 1",
    villaType: "Restaurant & View Suite",
    bedrooms: 2,
    highlight: "Ground-floor restaurant & shop, panoramic 2-room suite above",
  },
  {
    label: "Plot 2",
    villaType: "Honeymoon Villa",
    bedrooms: 2,
    highlight: "Private whirlpool bath in the upstairs primary suite",
  },
  {
    label: "Plot 3",
    villaType: "3 Bedroom Villa",
    bedrooms: 3,
    highlight: "One bedroom on the ground floor, two upstairs",
  },
  {
    label: "Plot 4",
    villaType: "2 Bedroom Villa",
    bedrooms: 2,
    highlight: "Twin bedrooms, each with a private whirlpool ensuite",
  },
  {
    label: "Plot 5",
    villaType: "3 Bedroom Villa",
    bedrooms: 3,
    highlight: "Twin layout to Plot 3",
  },
  {
    label: "Plot 6",
    villaType: "6 Bedroom Villa + Common Pool",
    bedrooms: 6,
    highlight: "The project's largest site, anchoring the shared swimming pool",
  },
];

async function seedFlagshipProject() {
  const existing = await prisma.property.findFirst({
    where: { title: FLAGSHIP_PROJECT_TITLE },
  });
  if (existing) {
    console.log("Flagship project already seeded, skipping.");
    return;
  }

  const admin = await prisma.user.findUnique({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@junbriz.com" },
  });
  const location = await prisma.location.findUnique({ where: { name: "Kanthalloor" } });
  if (!admin || !location) return;

  await prisma.property.create({
    data: {
      title: FLAGSHIP_PROJECT_TITLE,
      description:
        "A boutique 6-villa nature resort and farmland investment on 47 cents of peaceful purayidam land in Kanthalloor — for people who want more than a holiday home: a working relationship with the land itself. Each site pairs a fully designed villa with an adjoining farmland parcel (25-200 cents) that our team can maintain and farm on your behalf, so the investment grows whether or not you're there. Invest in the whole project or choose a single site.",
      category: "LAND_WITH_BUILDING",
      price: null,
      size: 47,
      sizeUnit: "CENT",
      locationId: location.id,
      latitude: 10.2695,
      longitude: 77.2305,
      addressDetails: "Kanthalloor, Idukki — exact plot access road on request",
      nearbyAttractions: "Kanthalloor fruit farms, Kambakallu viewpoint",
      landType: "Purayidam",
      completionDate: "End of 2027",
      amenities: [
        "Common swimming pool",
        "On-site restaurant & café with panoramic view suite",
        "Landscaped gardens throughout",
        "On-call maintenance & farming team for your farmland",
        "Landscape design, architectural drawings, 3D visualization, building permits and stonework already complete",
      ].join("\n"),
      isProject: true,
      sellerType: "OWNER",
      contactName: "Reneesh",
      contactPhone: "9000000000",
      status: "APPROVED",
      featured: true,
      ownerId: admin.id,
      media: {
        create: [
          { type: "IMAGE", url: "https://res.cloudinary.com/caje1sco/image/upload/v1790155904/junbriz/projects/kanthalloor-resort/v7o5nobiwd1jbyefel8g.jpg", order: 0 },
          { type: "IMAGE", url: "https://res.cloudinary.com/caje1sco/image/upload/v1790155901/junbriz/projects/kanthalloor-resort/zucscqtouat0jlhxrwgp.webp", order: 1 },
          { type: "IMAGE", url: "https://res.cloudinary.com/caje1sco/image/upload/v1790155903/junbriz/projects/kanthalloor-resort/hjcw1dphq2qtqpjqh7mk.webp", order: 2 },
        ],
      },
      sites: {
        create: FLAGSHIP_SITES.map((s, i) => ({ ...s, order: i })),
      },
    },
  });

  console.log("Flagship project seeded (contactPhone is a PLACEHOLDER — update it).");
}

async function main() {
  const locations = [
    { name: "Marayoor", nameMl: "മറയൂർ", district: "Idukki" },
    { name: "Kanthalloor", nameMl: "കാന്തല്ലൂർ", district: "Idukki" },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { name: loc.name },
      update: {},
      create: loc,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@junbriz.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Site Admin",
        email: adminEmail,
        phone: "9999999999",
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: "ADMIN",
      },
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  let demoLister = await prisma.user.findUnique({ where: { email: DUMMY_LISTER_EMAIL } });
  if (!demoLister) {
    demoLister = await prisma.user.create({
      data: {
        name: "Demo Lister",
        email: DUMMY_LISTER_EMAIL,
        phone: "9876500000",
        passwordHash: await bcrypt.hash("Demo1234!", 10),
        role: "OWNER",
      },
    });
    console.log(`Demo lister created: ${DUMMY_LISTER_EMAIL} / Demo1234!`);
  }

  const existingDummyCount = await prisma.property.count({
    where: { ownerId: demoLister.id },
  });

  if (existingDummyCount > 0) {
    console.log("Dummy properties already seeded, skipping.");
  } else {
    for (const p of DUMMY_PROPERTIES) {
      const location = await prisma.location.findUnique({
        where: { name: p.locationName },
      });
      if (!location) continue;

      await prisma.property.create({
        data: {
          title: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          size: p.size,
          sizeUnit: p.sizeUnit,
          locationId: location.id,
          latitude: p.lat,
          longitude: p.lng,
          addressDetails: p.addressDetails,
          nearbyAttractions: p.nearbyAttractions,
          sellerType: "OWNER",
          contactName: "Demo Lister",
          contactPhone: "9876500000",
          status: "APPROVED",
          featured: p.featured,
          ownerId: demoLister.id,
          media: {
            create: p.photos.map((seed, i) => ({
              type: "IMAGE" as const,
              url: `https://picsum.photos/seed/${seed}/800/600`,
              order: i,
            })),
          },
        },
      });
    }
    console.log(`Seeded ${DUMMY_PROPERTIES.length} dummy properties.`);
  }

  await seedFlagshipProject();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
