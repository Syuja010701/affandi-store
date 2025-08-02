"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useExpenseStore } from "../stores/expenseStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";
import BaseInputCurrency from "../components/input/BaseInputCurrency";
import { formatDateToYMD, formatTanggalIndonesia } from "@/lib/formatDate";
import { formatRupiah } from "@/lib/currency";
import DatePicker from "../components/input/DatePicker";
import BaseTextarea from "../components/input/BaseTextArea";

export default function ProductPage() {
  const {
    expenses,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading: loadingExpense,
  } = useExpenseStore();

  /* ------------------ state ------------------ */
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState<number | null>(null);

  /* form fields */
  const [name, setName] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [hargaSatuan, setHargaSatuan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [date, setDate] = useState("");

  /* initial fetch */
  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* filter */
  const filtered = expenses.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* reset form */
  const resetForm = () => {
    setId(null);
    setName("");

    setHargaSatuan("");
    setKeterangan("");
    setDate("");
    setOpen(false);
  };

  /* open modal untuk tambah */
  const handleAdd = () => {
    resetForm();
    setTitleModal("Tambah Expense Baru");
    setOpen(true);
  };

  /* open modal untuk edit */
  const handleEdit = (row: any) => {
    setId(row.id);
    setName(row.name);

    setHargaSatuan(String(row.hargaSatuan));
    setKeterangan(String(row.keterangan));
    setTitleModal(`Edit Expense ${row.name}`);
    setDate(formatDateToYMD(new Date(row.date)));
    setOpen(true);
  };

  /* simpan (add / update) */
  const handleSave = async () => {
    const payload = {
      name,
      jumlah: Number(jumlah),
      totalHarga: Number(hargaSatuan) * Number(jumlah),
      hargaSatuan: Number(hargaSatuan),
      keterangan: String(keterangan),
      date,
    };

    if (id) {
      await updateExpense(id, payload);
    } else {
      await addExpense(payload);
    }
    resetForm();
    await fetchExpenses();
  };

  /* hapus */
  const handleRemove = (id: number) => {
    if (confirm("Hapus Expense ini?")) deleteExpense(id);
  };

  /* ------------------ kolom tabel ------------------ */
  const columns = [
    { key: "name", header: "Nama" },
    { key: "jumlah", header: "Jumlah" },
    { key: "hargaSatuan", header: "Harga Satuan" },
    { key: "totalHarga", header: "Total Harga" },
    { key: "date", header: "Tanggal" },
    { key: "keterangan", header: "Keterangan" },
    { key: "action", header: "Action" },
  ];
  const data = filtered.map((p) => ({
    ...p,
    hargaSatuan: `Rp ${formatRupiah(p.hargaSatuan ?? 0)}`,
    totalHarga: `Rp ${formatRupiah(p.totalHarga)}`,
    date: formatTanggalIndonesia(p.date ?? ""),
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
      </div>
    ),
  }));

  /* ------------------ render ------------------ */
  return (
    <>
      <TitleContent
        title="Expenses"
        contentButton="Tambah Expense Baru"
        onClick={handleAdd}
      />

      {loadingExpense ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <FilterLayout>
            <BaseInput
              type="search"
              id="search"
              placeholder="Cari name Expense"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FilterLayout>

          <BaseTable columns={columns} data={data} />

          {/* Modal Add / Edit */}
          <BaseModal
            open={open}
            onClose={() => setOpen(false)}
            title={titleModal}
            size="lg"
            primaryAction={{
              label: loadingExpense ? "Loading..." : "Simpan",
              onClick: handleSave,
              disableButton:
                loadingExpense || !name.trim() || !jumlah || !hargaSatuan,
            }}
            secondaryAction={{
              label: "Batal",
              disableButton: loadingExpense,
              onClick: () => setOpen(false),
            }}
          >
            <div className="grid gap-4">
              <BaseInput
                label="Nama"
                value={name}
                placeholder="Masukkan name Expense"
                onChange={(e) => setName(e.target.value)}
              />

              <BaseInput
                label="Jumlah"
                type="number"
                placeholder="Masukkan jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
              />

              <BaseInputCurrency
                label="Harga Satuan"
                id="hargaSatuan"
                value={hargaSatuan}
                onChange={(raw) => setHargaSatuan(raw)}
              />

              <BaseInput
                label="Harga Total"
                value={
                  !hargaSatuan || !jumlah
                    ? "Rp 0"
                    : `Rp ${formatRupiah(
                        Number(hargaSatuan.replace(/\D/g, "")) * jumlah
                      )}`
                }
                readOnly
              />

              <DatePicker
                id="filter-date"
                placeholder="Pilih Tanggal"
                mode="single"
                label="Tanggal"
                defaultDate={undefined}
                onChange={(_dates, currentDateString) =>
                  setDate(currentDateString || "")
                }
              />

              <BaseTextarea
                label="Catatan"
                placeholder="Tulis catatan di sini..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                helperText="maksimal 250 karakter"
              />
            </div>
          </BaseModal>
        </>
      )}
    </>
  );
}
