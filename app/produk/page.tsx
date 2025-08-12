"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useProductStore } from "../stores/produkStore";
import { useJenisProdukStore } from "../stores/jenisProdukStore";
import { useKategoriUmurStore } from "../stores/kategoriUmurStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseSelect from "../components/input/BaseSelect";
import BaseModal from "../components/modal/baseModal";
import BaseInputCurrency from "../components/input/BaseInputCurrency";
import Link from "next/link";

export default function ProductPage() {
  const {
    items,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    isLoading: loadingProduct,
  } = useProductStore();

  const { items: jenisItems, fetchItems: fetchProduk } = useJenisProdukStore();
  const { items: kategoriItems, fetchItems: fetchKategori } =
    useKategoriUmurStore();

  /* ------------------ state ------------------ */
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState<number | null>(null);
  const [jenisFilter, setJenisFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  /* form fields */
  const [nama, setNama] = useState("");
  const [jenisId, setJenisId] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  type Variant = { ukuran: string; stok: number };
  const [variants, setVariants] = useState<Variant[]>([]);

  /* initial fetch */
  useEffect(() => {
    fetchItems();
    fetchKategori();
    fetchProduk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* filter */
  const filtered = items
    .filter((p) => p.nama?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (jenisFilter ? p.jenisId === Number(jenisFilter) : true))
    .filter((p) =>
      kategoriFilter ? p.kategoriId === Number(kategoriFilter) : true
    );

  /* reset form */
  const resetForm = () => {
    setId(null);
    setNama("");
    setJenisId("");
    setKategoriId("");
    setHargaJual("");
    setHargaBeli("");
    setVariants([]);
    setOpen(false);
  };

  /* open modal tambah */
  const handleAdd = () => {
    resetForm();
    setTitleModal("Tambah Produk Baru");
    setOpen(true);
  };

  /* open modal edit */
  const handleEdit = (row: any) => {
    setId(row.id);
    setNama(row.nama);
    setJenisId(String(row.jenisId));
    setKategoriId(String(row.kategoriId));
    setHargaJual(String(row.hargaJual));
    setHargaBeli(String(row.hargaBeli));
    setVariants(
      row.variants?.map((v: any) => ({
        id: v.id,
        ukuran: v.ukuran,
        stok: v.stok,
      })) || []
    );
    setTitleModal(`Edit Produk ${row.nama}`);
    setOpen(true);
  };

  /* tambah varian ke form */
  const addVariantRow = () => {
    setVariants([...variants, { ukuran: "", stok: 0 }]);
  };

  /* update varian */
  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updated = [...variants];
    if (field === "stok") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setVariants(updated);
  };
  /* simpan */
  const handleSave = async () => {
    const payload = {
      nama,
      jenisId: Number(jenisId),
      kategoriId: Number(kategoriId),
      hargaJual: Number(hargaJual),
      hargaBeli: Number(hargaBeli),
      variants,
    };

    if (id) {
      await updateItem(id, payload);
    } else {
      await addItem(payload);
    }
    resetForm();
    await fetchItems();
  };

  /* hapus */
  const handleRemove = (id: number) => {
    if (confirm("Hapus produk ini?")) deleteItem(id);
  };

  /* ------------------ tabel ------------------ */
  const columns = [
    { key: "nama", header: "Nama" },
    { key: "jenis", header: "Jenis" },
    { key: "kategoriUmur", header: "Kategori Umur" },
    { key: "varian", header: "Ukuran & Stok" },
    { key: "hargaJual", header: "Harga Jual" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((p) => ({
    ...p,
    jenis: p.jenis?.name ?? "-",
    kategoriUmur: p.kategoriUmur?.name ?? "-",
    hargaJual: `Rp${Number(p.hargaJual).toLocaleString()}`,
    varian: p.variants?.map((v) => `${v.ukuran} (${v.stok})`).join(", ") || "-",
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(p)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(p.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
        <Link target="_blank" href={`/produk/print/${p.id}`}>
          Print
        </Link>
      </div>
    ),
  }));

  /* ------------------ render ------------------ */
  return (
    <>
      <TitleContent
        title="Produk"
        contentButton="Tambah Produk Baru"
        onClick={handleAdd}
      />

      {loadingProduct ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <FilterLayout>
            <BaseInput
              type="search"
              placeholder="Cari nama produk"
              id="searchProduk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <BaseSelect
              value={jenisFilter}
              id="jenisFilter"
              onChange={(e) => setJenisFilter(e.target.value)}
            >
              <option value="">Semua Jenis</option>
              {jenisItems.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </BaseSelect>
            <BaseSelect
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              id="kategoriFilter"
            >
              <option value="">Semua Kategori Umur</option>
              {kategoriItems.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </BaseSelect>
          </FilterLayout>

          <BaseTable columns={columns} data={data} />

          <BaseModal
            open={open}
            onClose={() => setOpen(false)}
            title={titleModal}
            size="lg"
            primaryAction={{
              label: loadingProduct ? "Loading..." : "Simpan",
              onClick: handleSave,
              disableButton:
                loadingProduct || !nama.trim() || !jenisId || !kategoriId,
            }}
            secondaryAction={{
              label: "Batal",
              disableButton: loadingProduct,
              onClick: () => setOpen(false),
            }}
          >
            <div className="grid gap-4">
              <BaseInput
                label="Nama Produk"
                value={nama}
                id="namaProduk"
                onChange={(e) => setNama(e.target.value)}
              />
              <BaseSelect
                label="Jenis Barang"
                value={jenisId}
                id="jenisId"
                onChange={(e) => setJenisId(e.target.value)}
              >
                <option value="">Pilih Jenis Barang</option>
                {jenisItems.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </BaseSelect>
              <BaseSelect
                label="Kategori Umur"
                id="kategoriId"
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
              >
                <option value="">Pilih Kategori Umur</option>
                {kategoriItems.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </BaseSelect>
              <BaseInputCurrency
                id="hargaJual"
                label="Harga Jual"
                value={hargaJual}
                onChange={(raw) => setHargaJual(raw)}
              />
              <BaseInputCurrency
                id="hargaBeli"
                label="Harga Beli"
                value={hargaBeli}
                onChange={(raw) => setHargaBeli(raw)}
              />

              {/* Varian ukuran & stok */}
              <div className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Varian</h4>
                  <button
                    type="button"
                    className="text-sm text-blue-600"
                    onClick={addVariantRow}
                  >
                    + Tambah Varian
                  </button>
                </div>
                {variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                    <BaseInput
                      placeholder="Ukuran"
                      label="Ukuran"
                      value={v.ukuran}
                      id={`ukuran-${idx}`}
                      onChange={(e) =>
                        updateVariant(idx, "ukuran", e.target.value)
                      }
                    />
                    <BaseInput
                      type="number"
                      placeholder="Stok"
                      label="Stok"
                      id={`stok-${idx}`}
                      value={v.stok}
                      onChange={(e) =>
                        updateVariant(idx, "stok", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:underline self-end"
                      onClick={() => {
                        const updated = [...variants];
                        updated.splice(idx, 1);
                        setVariants(updated);
                      }}
                    >
                      Hapus Varian
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </BaseModal>
        </>
      )}
    </>
  );
}
