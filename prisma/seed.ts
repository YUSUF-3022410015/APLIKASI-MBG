import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sppg = await prisma.sppgUnit.create({
    data: {
      name: "SPPG Kecamatan Cimahi",
      address: "Jl. Cimahi No. 1",
      phone: "022-12345678",
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
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/nasi-goreng",
      dateServed: new Date(),
    },
  });

  await prisma.distribution.create({
    data: {
      menuId: menu.id,
      schoolId: sekolah.id,
      totalPortion: 450,
      status: "DISIAPKAN",
    },
  });

  await prisma.distribution.create({
    data: {
      menuId: menu.id,
      schoolId: sekolah2.id,
      totalPortion: 600,
      status: "DISIAPKAN",
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
