"use client";

import { useEffect, useMemo, useState } from "react";
import TitleContent from "../components/contents/title";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseSelect from "../components/input/BaseSelect";
import BaseModal from "../components/modal/baseModal";

import { useTransaksiStore } from "../stores/transaksiStore";
import { useProductStore } from "../stores/produkStore";
import { useJenisProdukStore } from "../stores/jenisProdukStore";
import { useKategoriUmurStore } from "../stores/kategoriUmurStore";
import { formatDateToYMD, formatTanggalIndonesia } from "@/lib/formatDate";
import { createRupiahHandler, formatRupiah } from "@/lib/currency";
import * as XLSX from "sheetjs-style";
import { Button } from "flowbite-react";
import DatePicker from "../components/input/DatePicker";

export default function TransaksiPage() {
  const {
    items,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    isLoading: loadingTrx,
  } = useTransaksiStore();

  const handleExportExcel = () => {
    const rows = filtered.map((t) => ({
      Produk: t.productVariant?.product?.nama ?? "-",
      Jenis: t.productVariant?.product?.jenis?.name ?? "-",
      Kategori: t.productVariant?.product?.kategoriUmur?.name ?? "-",
      Jumlah: t.jumlah,
      "Harga Satuan": t.hargaSatuan,
      Total: t.jumlah * Number(t.hargaSatuan) - (Number(t.diskon) ?? 0),
      Diskon: t.diskon ?? 0,
      Tanggal: formatTanggalIndonesia(t.date ?? "-"),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    const header = [
      "Produk",
      "Jenis",
      "Kategori",
      "Jumlah",
      "Harga Satuan",
      "Diskon",
      "Total",
      "Tanggal",
    ];
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A1" });

    ws["!cols"] = header.map(() => ({ wch: 18 }));

    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");

    XLSX.writeFile(
      wb,
      `Transaksi-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const { items: produkItems, fetchItems: fetchProduk } = useProductStore();
  const { items: jenisItems, fetchItems: fetchJenis } = useJenisProdukStore();
  const { items: kategoriItems, fetchItems: fetchKategori } =
    useKategoriUmurStore();

  /* ------------- state ------------- */
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState<number | null>(null);
  const [jenisFilter, setJenisFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  /* form fields */
  const [produkId, setProdukId] = useState("");
  const [produkVariantId, setProdukVariantId] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [hargaSatuan, setHargaSatuan] = useState("");
  const [diskon, setDiskon] = useState("");
  const [date, setDate] = useState("");

  /* initial fetch */
  useEffect(() => {
    fetchItems();
    fetchProduk();
    fetchJenis();
    fetchKategori();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* filter */
  const filtered = useMemo(() => {
    return items
      .filter((t) =>
        t.productVariant?.product?.nama
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((t) =>
        jenisFilter
          ? t.productVariant?.product?.jenisId === Number(jenisFilter)
          : true
      )
      .filter((t) =>
        kategoriFilter
          ? t.productVariant?.product?.kategoriId === Number(kategoriFilter)
          : true
      )
      .filter((t) => {
        if (!filterDate) return true;
        const recordDay = formatDateToYMD(new Date(t?.date ?? ""));
        return recordDay === filterDate;
      });
  }, [items, search, jenisFilter, kategoriFilter, filterDate]);

  /* reset form */
  const resetForm = () => {
    setId(null);
    setProdukId("");
    setJumlah(1);
    setHargaSatuan("");
    setDiskon("");
    setDate(formatDateToYMD(new Date()));
  };

  const handleAdd = () => {
    resetForm();
    setTitleModal("Tambah Transaksi Baru");
    setOpen(true);
  };

  const handleEdit = (row: any) => {
    setId(row.id);
    setProdukId(String(row.variantId));
    setJumlah(row.jumlah);
    setHargaSatuan(String(row.hargaSatuan));
    setDiskon(String(row.diskon ?? ""));
    setDate(formatDateToYMD(new Date(row.date)));
    setTitleModal(`Edit Transaksi #${row.id}`);
    setOpen(true);
  };

  const handleSave = async () => {
    const hs = Number(hargaSatuan.replace(/\D/g, ""));
    const disc = Number(diskon.replace(/\D/g, ""));

    if (!produkId || jumlah <= 0 || hs <= 0) {
      alert("Lengkapi semua field dengan benar!");
      return;
    }

    const payload = {
      variantId: Number(produkVariantId),
      jumlah,
      date,
      diskon: disc,
      hargaSatuan: hs,
    };

    if (id) {
      await updateItem(id, payload);
    } else {
      await addItem(payload);
    }
    resetForm();
    setOpen(false);
  };

  const handleRemove = async (id: number) => {
    if (confirm("Hapus transaksi ini?")) {
      await deleteItem(id);
      await fetchItems();
    }
  };

  /* ------------- kolom tabel ------------- */
  const columns = [
    { key: "produk", header: "Produk" },
    { key: "jenis", header: "Jenis" },
    { key: "kategori", header: "Kategori" },
    { key: "ukuran", header: "Ukuran" },
    { key: "jumlah", header: "Jumlah" },
    { key: "hargaSatuan", header: "Harga Satuan" },
    { key: "diskon", header: "Diskon" },
    { key: "total", header: "Total" },
    { key: "date", header: "Tanggal" },
    { key: "action", header: "Action" },
  ];

  const data = filtered.map((t) => ({
    ...t,
    produk: t.productVariant?.product?.nama ?? "-",
    jenis: t.productVariant?.product?.jenis?.name ?? "-",
    ukuran: t.productVariant?.ukuran ?? "-",
    kategori: t.productVariant?.product?.kategoriUmur?.name ?? "-",
    hargaSatuan: `Rp ${formatRupiah(t.hargaSatuan)}`,
    diskon: `Rp ${formatRupiah(t.diskon ?? 0)}`,
    total: `Rp ${formatRupiah(
      t.jumlah * Number(t.hargaSatuan) - (Number(t.diskon) ?? 0)
    )}`,
    date: formatTanggalIndonesia(t.date ?? ""),
    action: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(t)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(t.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    ),
  }));

  /* ------------- render ------------- */
  return (
    <>
      <TitleContent
        title="Transaksi Penjualan"
        contentButton="Tambah Transaksi"
        onClick={handleAdd}
      />
      <Button onClick={handleExportExcel} color="blue" className="mb-4">
        Export Excel
      </Button>

      {loadingTrx ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <FilterLayout>
            <BaseInput
              id="search"
              type="search"
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <DatePicker
              id="filter-date"
              placeholder="Pilih Tanggal"
              mode="single"
              defaultDate={undefined}
              onChange={(_dates, currentDateString) =>
                setFilterDate(currentDateString || "")
              }
            />

            <BaseSelect
              id="filterJenis"
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
              id="filterKategori"
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
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
              label: loadingTrx ? "Menyimpan..." : "Simpan",
              onClick: handleSave,
              disableButton:
                loadingTrx || !produkId || jumlah <= 0 || !hargaSatuan,
            }}
            secondaryAction={{
              label: "Batal",
              disableButton: loadingTrx,
              onClick: () => setOpen(false),
            }}
          >
            <div className="grid gap-4">
              <BaseSelect
                label="Produk"
                id="produk"
                value={produkId}
                onChange={(e) => {
                  setProdukId(e.target.value);
                  const v = produkItems.find(
                    (vr) => vr.id === Number(e.target.value)
                  );
                  setHargaSatuan(v ? String(v.hargaJual ?? 0) : "");
                }}
              >
                <option value="">Pilih Produk</option>
                {produkItems.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nama} - {v.jenis?.name} - {v.kategoriUmur?.name}
                  </option>
                ))}
              </BaseSelect>

              <BaseSelect
                label="Variant Produk"
                id="variant_produk"
                value={produkVariantId}
                onChange={(e) => {
                  setProdukVariantId(e.target.value);
                  const v = produkItems.find(
                    (vr) => vr.id === Number(e.target.value)
                  );
                  setHargaSatuan(v ? String(v.hargaJual ?? 0) : "");
                }}
              >
                <option value="">Variant Produk</option>
                {produkItems
                  .filter((v) => v.id === Number(produkId))
                  .flatMap((v) =>
                    v.variants?.map((vr) => (
                      <option key={vr.id} value={vr.id}>
                        {vr.ukuran} - {vr.stok}
                      </option>
                    ))
                  )}
                {produkItems.filter((v) => v.id === Number(produkId)).length ===
                  0 && <option value="">Pilih produk terlebih dahulu</option>}
              </BaseSelect>

              <DatePicker
                id="form-date"
                label="Tanggal"
                mode="single"
                defaultDate={new Date(date)}
                onChange={(_dates, currentDateString) =>
                  setDate(currentDateString || "")
                }
              />

              <BaseInput
                label="Jumlah"
                type="number"
                id="jumlah"
                min={1}
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
              />

              <BaseInput
                label="Harga Satuan"
                type="text"
                id="harga_satuan"
                value={formatRupiah(hargaSatuan)}
                onChange={createRupiahHandler((val: number) =>
                  setHargaSatuan(String(val))
                )}
              />

              <BaseInput
                label="Diskon"
                type="text"
                id="diskon"
                value={formatRupiah(diskon)}
                onChange={createRupiahHandler((val: number) =>
                  setDiskon(String(val))
                )}
              />

              <BaseInput
                label="Harga Total"
                id="harga_total"
                disabled
                value={
                  !hargaSatuan
                    ? "Rp 0"
                    : `Rp ${formatRupiah(
                        Number(hargaSatuan.replace(/\D/g, "")) * jumlah -
                          Number(diskon.replace(/\D/g, ""))
                      )}`
                }
              />
            </div>
          </BaseModal>
        </>
      )}
    </>
  );
}
