"use client";

import { useEffect, useState } from "react";
import TitleContent from "../components/contents/title";
import { useReportDailyStore } from "../stores/reportDailyStore";
import BaseTable from "../components/table/BaseTable";
import FilterLayout from "../components/contents/filterLayout";
import BaseInput from "../components/input/BaseInput";
import BaseModal from "../components/modal/baseModal";
import BaseInputCurrency from "../components/input/BaseInputCurrency";
import { formatDateToYMD, formatTanggalIndonesia } from "@/lib/formatDate";
import { formatRupiah } from "@/lib/currency";
import DatePicker from "../components/input/DatePicker";

export default function ReportDailyPage() {
  const {
    reports,
    fetchReports,
    addReport,
    updateReport,
    deleteReport,
    isLoading: loadingExpense,
  } = useReportDailyStore();

  /* ------------------ state ------------------ */
  const [filterDate, setFilterDate] = useState("");
  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [id, setId] = useState<number | null>(null);

  /* form fields */
  const [total_item_transaction, set_total_item_transaction] = useState(0);
  const [total_uang_kasir, set_total_uang_kasir] = useState("");
  const [total_uang_transaction, set_uang_transaction] = useState("");
  const [date, setDate] = useState("");

  /* initial fetch */
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* filter */
  const filtered = reports.filter((t) => {
    if (!filterDate) return true;
    const recordDay = formatDateToYMD(new Date(t?.date ?? ""));
    return recordDay === filterDate;
  });

  /* reset form */
  const resetForm = () => {
    setId(null);
    set_total_item_transaction(0);
    set_total_uang_kasir("");
    set_uang_transaction("");
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
    set_total_uang_kasir(String(row.total_uang_kasir));
    set_uang_transaction(String(row.total_uang_transaction));
    set_total_item_transaction(row.total_item_transaction);
    setDate(row.date);
    setOpen(true);
  };

  /* simpan (add / update) */
  const handleSave = async () => {
    const payload = {
      total_item_transaction: Number(total_item_transaction),
      total_uang_kasir: Number(total_uang_kasir),
      total_uang_transaction: Number(total_uang_transaction),
      date,
    };

    if (id) {
      await updateReport(id, payload);
    } else {
      await addReport(payload);
    }
    resetForm();
    await fetchReports();
  };

  /* hapus */
  const handleRemove = (id: number) => {
    if (confirm("Hapus Report ini?")) deleteReport(id);
  };

  /* ------------------ kolom tabel ------------------ */
  const columns = [
    { key: "total_item_transaction", header: "Total Item Terjual" },
    { key: "total_uang_transaction", header: "Total Uang Tercatat" },
    { key: "total_uang_kasir", header: "Total Uang Kasir" },
    { key: "date", header: "Tanggal" },
    { key: "action", header: "Action" },
  ];
  const data = filtered.map((p) => ({
    total_item_transaction: p.total_item_transaction,
    total_uang_transaction: `Rp ${formatRupiah(p.total_uang_transaction ?? 0)}`,
    total_uang_kasir: `Rp ${formatRupiah(p.total_uang_kasir ?? 0)}`,

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
        title="Report Daily"
        contentButton="Tambah Report Baru"
        onClick={handleAdd}
      />

      {loadingExpense ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <FilterLayout>
            <DatePicker
              id="filter-date"
              placeholder="Pilih Tanggal"
              mode="single"
              defaultDate={undefined}
              onChange={(_dates, currentDateString) =>
                setFilterDate(currentDateString || "")
              }
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
                loadingExpense ||
                !total_uang_transaction ||
                !total_item_transaction ||
                !total_uang_kasir,
            }}
            secondaryAction={{
              label: "Batal",
              disableButton: loadingExpense,
              onClick: () => setOpen(false),
            }}
          >
            <div className="grid gap-4">
              <BaseInput
                label="Total Item Terjual"
                type="number"
                placeholder="Masukkan total_item_transaction"
                value={total_item_transaction}
                onChange={(e) =>
                  set_total_item_transaction(Number(e.target.value))
                }
              />
              <BaseInputCurrency
                label="Total Uang Tercatat"
                id="total_uang_tercatat"
                value={total_uang_transaction}
                onChange={(raw) => set_uang_transaction(raw)}
              />

              <BaseInputCurrency
                label="Total Uang Kasir"
                id="total_uang_kasir"
                value={total_uang_kasir}
                onChange={(raw) => set_total_uang_kasir(raw)}
              />

              <DatePicker
                id="filter-date"
                placeholder="Pilih Tanggal"
                mode="single"
                label="Tanggal"
                defaultDate={new Date(date)}
                onChange={(_dates, currentDateString) =>
                  setDate(currentDateString || "")
                }
              />
            </div>
          </BaseModal>
        </>
      )}
    </>
  );
}
