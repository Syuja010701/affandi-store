/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ReportDaily` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ReportDaily` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaksi` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `JenisProduk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `JenisProduk` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `KategoriUmur` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `KategoriUmur` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `ReportDaily` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Transaksi` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "hargaSatuan" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalHarga" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "JenisProduk" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KategoriUmur" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "barcode" SET DATA TYPE TEXT,
ALTER COLUMN "nama" SET DATA TYPE TEXT,
ALTER COLUMN "ukuran" SET DATA TYPE TEXT,
ALTER COLUMN "hargaJual" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "hargaBeli" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ReportDaily" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "total_uang_transaction" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_uang_kasir" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "hargaSatuan" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_jenisId_fkey" FOREIGN KEY ("jenisId") REFERENCES "JenisProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriUmur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
