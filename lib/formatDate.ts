export function formatTanggalIndonesia(dateString: string): string {
  const hari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const date = new Date(dateString);
  const hariNama = hari[date.getDay()];
  const tanggal = String(date.getDate()).padStart(2, "0");
  const bulan = String(date.getMonth() + 1).padStart(2, "0");
  const tahun = date.getFullYear();

  return `${hariNama}, ${tanggal}-${bulan}-${tahun}`;
}


export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // bulan dimulai dari 0
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}