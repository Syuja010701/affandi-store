export function generateBarcode(prefix = 'P') {
  const ts = Date.now().toString().slice(-8);      // 8 digit terakhir timestamp
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase(); // 3 random
  return `${prefix}${ts}${rnd}`;
}