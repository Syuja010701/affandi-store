// format tetap pakai titik sebagai pemisah ribuan
export const formatRupiah = (value: number | string): string => {
  const number = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID').format(number);
};

// parse menghapus titik, bukan koma
export const parseRupiah = (str: string): number =>
  Number(str.replace(/[^0-9]/g, ''));

// handler tetap simple
export const createRupiahHandler =
  (setter: (val: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(parseRupiah(e.target.value));
  };