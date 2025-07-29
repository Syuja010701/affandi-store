"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useProductStore } from "../stores/produkStore";
import { useJenisProdukStore } from "../stores/jenisProdukStore";
import { useKategoriUmurStore } from "../stores/kategoriUmurStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseSelect from "../components/input/BaseSelect"; // buat select jenis & kategori
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
  const [jenisFilter, setJenisFilter] = useState(""); // string id jenis
  const [kategoriFilter, setKategoriFilter] = useState(""); // string id kategori

  /* form fields */
  const [nama, setNama] = useState("");
  const [jenisId, setJenisId] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [stok, setStok] = useState("");

  /* initial fetch */
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchKategori();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchProduk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* filter */
  const filtered = items
    .filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()))
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
    setUkuran("");
    setHargaJual("");
    setHargaBeli("");
    setStok("");
    setOpen(false);
  };

  /* open modal untuk tambah */
  const handleAdd = () => {
    resetForm();
    setTitleModal("Tambah Produk Baru");
    setOpen(true);
  };

  /* open modal untuk edit */
  const handleEdit = (row: any) => {
    setId(row.id);
    setNama(row.nama);
    setJenisId(String(row.jenisId));
    setKategoriId(String(row.kategoriId));
    setUkuran(row.ukuran);
    setHargaJual(String(row.hargaJual));
    setHargaBeli(String(row.hargaBeli));
    setStok(String(row.stok));
    setTitleModal(`Edit Produk ${row.nama}`);
    setOpen(true);
  };

  /* simpan (add / update) */
  const handleSave = async () => {
    const payload = {
      nama,
      jenisId: Number(jenisId),
      kategoriId: Number(kategoriId),
      ukuran,
      hargaJual: Number(hargaJual),
      hargaBeli: Number(hargaBeli),
      stok: Number(stok),
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

  /* ------------------ kolom tabel ------------------ */
  const columns = [
    { key: "nama", header: "Nama" },
    { key: "jenis", header: "Jenis" },
    { key: "kategoriUmur", header: "Kategori Umur" },
    { key: "ukuran", header: "Ukuran" },
    { key: "hargaJual", header: "Harga Jual" },
    { key: "stok", header: "Stok" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((p) => ({
    ...p,
    jenis: p.jenis?.name ?? "-",
    kategoriUmur: p.kategoriUmur?.name ?? "-",
    hargaJual: `Rp${Number(p.hargaJual).toLocaleString()}`,
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
              id="search"
              placeholder="Cari nama produk"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <BaseSelect
              value={jenisFilter}
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

          {/* Modal Add / Edit */}
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
                placeholder="Masukkan nama produk"
                onChange={(e) => setNama(e.target.value)}
              />
              <BaseSelect
                label="Jenis Barang"
                value={jenisId}
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
              <BaseInput
                label="Ukuran"
                placeholder="Masukkan ukuran"
                value={ukuran}
                onChange={(e) => setUkuran(e.target.value)}
              />
              <BaseInputCurrency
                label="Harga Jual"
                value={hargaJual}
                onChange={(raw) => setHargaJual(raw)}
              />

              {/* Harga Beli */}
              <BaseInputCurrency
                label="Harga Beli"
                value={hargaBeli}
                onChange={(raw) => setHargaBeli(raw)}
              />
              <BaseInput
                label="Stok"
                type="number"
                placeholder="Masukkan jumlah stock"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
              />
            </div>
          </BaseModal>
        </>
      )}
    </>
  );
}
