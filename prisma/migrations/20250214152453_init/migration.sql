-- CreateTable
CREATE TABLE
    "User" (
        "id" SERIAL NOT NULL,
        "username" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

-- TABLE: products
CREATE TABLE
    "Product" (
        "id" SERIAL NOT NULL,
        "barcode" VARCHAR(255) UNIQUE NOT NULL,
        "nama" VARCHAR(255) NOT NULL,
        "jenisId" INTEGER NOT NULL,
        "kategoriId" INTEGER NOT NULL,
        "ukuran" VARCHAR(50) NOT NULL,
        "hargaJual" DECIMAL(12, 2) NOT NULL,
        "hargaBeli" DECIMAL(12, 2) NOT NULL,
        "stok" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
    );

CREATE TABLE
    "JenisProduk" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "JenisProduk_pkey" PRIMARY KEY ("id")
    );

CREATE TABLE
    "KategoriUmur" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "KategoriUmur_pkey" PRIMARY KEY ("id")
    );

-- TABLE: transaksi_item
CREATE TABLE
    "Transaksi" (
        "id" SERIAL NOT NULL,
        "productId" INTEGER NOT NULL,
        "jumlah" INTEGER NOT NULL,
        "hargaSatuan" DECIMAL(12, 2) NOT NULL,
        "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
    );

CREATE TABLE
    "Expense" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "jumlah" INTEGER NOT NULL,
        "hargaSatuan" DECIMAL(12, 2) NOT NULL,
        "totalHarga" DECIMAL(12, 2) NOT NULL,
        "keterangan" TEXT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
    );

CREATE TABLE
    "ReportDaily" (
        "id" SERIAL NOT NULL,
        "total_item_transaction" INTEGER NOT NULL,
        "total_uang_transaction" DECIMAL(12, 2) NOT NULL,
        "total_uang_kasir" DECIMAL(12, 2) NOT NULL,
        "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "ReportDaily_pkey" PRIMARY KEY ("id")
    );

ALTER TABLE "Transaksi"
ADD COLUMN "diskon" DECIMAL NOT NULL DEFAULT 0;