"use client";
import { forwardRef } from "react";
import BaseInput from "./BaseInput";
import { formatRupiah } from "@/lib/currency";

interface Props {
  label?: string;
  value: string;
  id:string;
  disabled?: boolean;
  onChange?: (raw: string, numeric: number | null) => void;
}

const BaseInputCurrency = forwardRef<HTMLInputElement, Props>(
  ({ label, value,id, onChange = () => void 0, disabled = false }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      
      // Perbolehkan kosong
      if (raw === "") {
        onChange("", null);
        return;
      }

      // Hanya ambil angka
      const numeric = Number(raw.replace(/[^0-9]/g, ""));
      
      // Validasi apakah hasilnya NaN
      if (isNaN(numeric)) {
        onChange("", null);
      } else {
        onChange(String(numeric), numeric);
      }
    };

    // Handle display value saat kosong
    const display = value ? formatRupiah(value) : "";

    return (
      <BaseInput
        ref={ref}
        id={id}
        label={label}
        disabled={disabled}
        value={display}
        onChange={handleChange}
        onFocus={(e) => {
          // Kosongkan input saat fokus jika valuenya 0
          e.target.value = value === "0" ? "" : value;
        }}
        onBlur={(e) => {
          // Tampilkan format rupiah saat blur
          e.target.value = display;
        }}
        type="text"
        inputMode="numeric"
        placeholder="0"
      />
    );
  }
);

BaseInputCurrency.displayName = "BaseInputCurrency";
export default BaseInputCurrency;