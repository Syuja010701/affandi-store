"use client";
import { forwardRef } from "react";
import BaseInput from "./BaseInput";
import { formatRupiah } from "@/lib/currency";

interface Props {
  label?: string;
  value: string;
  onChange: (raw: string, numeric: number) => void;
}

const BaseInputCurrency = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const numeric = raw === "" ? 0 : Number(raw.replace(/[^0-9]/g, ""));
      onChange(String(numeric), numeric);
    };

    const display = value ? formatRupiah(value) : "";

    return (
      <BaseInput
        ref={ref}
        label={label}
        value={display}
        onChange={handleChange}
        onFocus={(e) => (e.target.value = value)} // hilangkan titik saat fokus
        onBlur={(e) => (e.target.value = display)} // tampilkan titik saat blur
        type="text"
        inputMode="numeric"
        placeholder="0"
      />
    );
  }
);

BaseInputCurrency.displayName = "BaseInputCurrency";
export default BaseInputCurrency;