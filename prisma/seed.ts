import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.jenisProduk.createMany({
    data: [
      {
        name: "SEPATU",
      },
      { name: "KOPER" },
      { name: "TAS" },
    ],
  });

 await prisma.kategoriUmur.createMany({
    data: [
      {
        name: "ANAK_ANAK",
      },
      {
        name: "DEWASA",
      },
      {
        name: "REMAJA",
      },
    ],
  });

  // Product
  await prisma.product.create({
    data: {
      barcode: "PRD123456",
      nama: "Sepatu Anak Merah",
      jenisId: 1,
      kategoriId: 1,
      ukuran: "31",
      hargaJual: 250000,
      hargaBeli: 150000,
      stok: 20,
    },
  });

  // User
  await prisma.user.create({
    data: {
      username: "admin",
      name: "Administrator",
      password: hashedPassword,
    },
  });

  console.log("✅ Seed berhasil dijalankan!");
  console.log("Seeding completed.");
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
