export const formatRupiah = (value: number | string) => {
  const number = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID").format(number);
};

export const parseRupiah = (str: string) => {
  return Number(str.replace(/[^,\d]/g, "").replaceAll(",", ""));
};
