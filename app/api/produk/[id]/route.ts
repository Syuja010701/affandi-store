// GET one, PUT, DELETE
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const parseId = async (params: Promise<{ id: string }>) => {
  const id = Number((await params).id);
  if (isNaN(id)) throw new Error("Invalid id");
  return id;
};

// Ambil 1 produk lengkap dengan varian
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const item = await prisma.product.findUnique({
      where: { id },
      include: {
        jenis: true,
        kategoriUmur: true,
        variants: true,
      },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
}

// Update produk + varian (update, tambah, hapus)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const body = await req.json();

    const {
      barcode,
      nama,
      jenisId,
      kategoriId,
      hargaJual,
      hargaBeli,
      variants,
    } = body;

    // Update produk
    await prisma.product.update({
      where: { id },
      data: {
        ...(barcode && { barcode }),
        ...(nama && { nama }),
        ...(jenisId && { jenisId: Number(jenisId) }),
        ...(kategoriId && { kategoriId: Number(kategoriId) }),
        ...(hargaJual !== undefined && { hargaJual: Number(hargaJual) }),
        ...(hargaBeli !== undefined && { hargaBeli: Number(hargaBeli) }),
      },
    });

    if (Array.isArray(variants)) {
      // 1️⃣ Ambil semua variant id dari DB
      const existingVariants = await prisma.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      const existingIds = existingVariants.map((v) => v.id);

      // 2️⃣ Ambil semua variant id dari request
      const sentIds = variants.filter((v) => v.id).map((v) => v.id);

      // 3️⃣ Cari id yang dihapus (ada di DB tapi tidak di request)
      const idsToDelete = existingIds.filter((dbId) => !sentIds.includes(dbId));

      // 4️⃣ Hapus varian yang hilang
      if (idsToDelete.length > 0) {
        await prisma.productVariant.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // 5️⃣ Update atau tambah varian baru
      for (const variant of variants) {
        if (variant.id) {
          // Update
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              ...(variant.ukuran && { ukuran: variant.ukuran }),
              ...(variant.stok !== undefined && { stok: Number(variant.stok) }),
            },
          });
        } else {
          // Tambah baru
          await prisma.productVariant.create({
            data: {
              productId: id,
              ukuran: variant.ukuran,
              stok: Number(variant.stok ?? 0),
            },
          });
        }
      }
    }

    // Ambil ulang produk lengkap
    const result = await prisma.product.findUnique({
      where: { id },
      include: {
        jenis: true,
        kategoriUmur: true,
        variants: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /product error:", error);
    return NextResponse.json({ error: "update failed" }, { status: 400 });
  }
}

// Hapus produk + otomatis hapus variannya (cascade)
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    await prisma.$transaction([
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /product error:", error);
    return NextResponse.json({ error: "delete failed" }, { status: 400 });
  }
}
