import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.sppgUnit.findFirst();
  if (existing) {
    console.log("Seed data already exists, skipping...");
    return;
  }

  const sppg = await prisma.sppgUnit.create({
    data: {
      name: "SPPG Kecamatan Cimahi",
      address: "Jl. Cimahi No. 1",
      phone: "022-12345678",
      isVerified: true,
    },
  });

  const sekolah = await prisma.school.create({
    data: {
      npsn: "12345678",
      name: "SDN Cimahi 1",
      address: "Jl. Cimahi No. 10",
      totalStudents: 450,
      sppgMitraId: sppg.id,
    },
  });

  const sekolah2 = await prisma.school.create({
    data: {
      npsn: "87654321",
      name: "SMPN Cimahi 2",
      address: "Jl. Cimahi No. 20",
      totalStudents: 600,
      sppgMitraId: sppg.id,
    },
  });

  const menu = await prisma.menu.create({
    data: {
      sppgId: sppg.id,
      title: "Nasi Goreng Sayur + Telur",
      description: "Menu sehat dengan sayuran segar dan protein telur",
      calories: 450,
      protein: 15.5,
      carbohydrate: 55.0,
      fat: 12.0,
      ingredients: ["Nasi", "Telur", "Wortel", "Buncis", "Minyak Zaitun"],
      imageUrls: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/nasi-goreng"],
      dateServed: new Date(),
    },
  });

  const menu2 = await prisma.menu.create({
    data: {
      sppgId: sppg.id,
      title: "Sayur Asem + Ayam Bakar",
      description: "Sayur asem segar dengan ayam bakar bumbu kecap",
      calories: 520,
      protein: 22.0,
      carbohydrate: 48.0,
      fat: 18.0,
      ingredients: ["Nasi", "Ayam", "Sayur Asem", "Kecap", "Bawang"],
      imageUrls: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/spaghetti-carbonara"],
      dateServed: new Date(),
    },
  });

  const menu3 = await prisma.menu.create({
    data: {
      sppgId: sppg.id,
      title: "Bubur Ayam + Telur Rebus",
      description: "Bubur ayam hangat dengan topping telur rebus dan kerupuk",
      calories: 380,
      protein: 18.0,
      carbohydrate: 42.0,
      fat: 10.0,
      ingredients: ["Beras", "Ayam", "Telur", "Daun Bawang", "Kerupuk"],
      imageUrls: ["https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables"],
      dateServed: new Date(),
    },
  });

  await prisma.distribution.createMany({
    data: [
      { menuId: menu.id, schoolId: sekolah.id, totalPortion: 450, status: "DISIAPKAN" },
      { menuId: menu.id, schoolId: sekolah2.id, totalPortion: 600, status: "DISIAPKAN" },
      { menuId: menu2.id, schoolId: sekolah.id, totalPortion: 450, status: "DIKIRIM" },
      { menuId: menu3.id, schoolId: sekolah2.id, totalPortion: 600, status: "DITERIMA", confirmedBy: null, confirmationTime: new Date() },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
