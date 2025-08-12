import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  // Hapus data lama biar bersih
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.jenisProduk.deleteMany();
  await prisma.kategoriUmur.deleteMany();
  await prisma.user.deleteMany();

  // Jenis Produk
  await prisma.jenisProduk.createMany({
    data: [
      { name: "SEPATU" },
      { name: "KOPER" },
      { name: "TAS" },
    ],
  });

  // Kategori Umur
  await prisma.kategoriUmur.createMany({
    data: [
      { name: "ANAK ANAK" },
      { name: "DEWASA" },
      { name: "REMAJA" },
    ],
  });

  // Product + Variants
  await prisma.product.create({
    data: {
      barcode: "PRD123456",
      nama: "Sepatu Anak Merah",
      jenisId: 1, // SEPATU
      kategoriId: 1, // ANAK ANAK
      hargaJual: 250000,
      hargaBeli: 150000,
      variants: {
        create: [
          { ukuran: "30", stok: 5 },
          { ukuran: "31", stok: 8 },
          { ukuran: "32", stok: 3 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      barcode: "P09833497NUT",
      nama: "Koper Hitam",
      jenisId: 2, // KOPER
      kategoriId: 2, // DEWASA
      hargaJual: 1000000,
      hargaBeli: 700000,
      variants: {
        create: [
          { ukuran: "Sedang", stok: 10 },
          { ukuran: "Besar", stok: 5 },
        ],
      },
    },
  });

  // User admin
  await prisma.user.create({
    data: {
      username: "admin",
      name: "Administrator",
      password: hashedPassword,
    },
  });

  console.log("✅ Seed berhasil dijalankan!");
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
