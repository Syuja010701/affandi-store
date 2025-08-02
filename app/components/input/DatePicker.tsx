import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { CalendarIcon } from "flowbite-react";
import clsx from "clsx";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  className,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={clsx(
            "block w-full rounded-lg border p-2.5 text-sm",
            "bg-gray-50 text-gray-900",
            "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
            "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
            "dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500",
            className
          )}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalendarIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
