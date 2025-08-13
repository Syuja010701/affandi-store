/*
  Warnings:

  - You are about to drop the column `productId` on the `Transaksi` table. All the data in the column will be lost.
  - Added the required column `variantId` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaksi" DROP CONSTRAINT "Transaksi_productId_fkey";

-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
