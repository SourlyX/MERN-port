/* -------------------- getToday -------------------- */
// 🧪 TEST: cambia esta fecha para simular días futuros. En prod: new Date()
export const getToday = () => {
  // return new Date("2026-02-02");
  return new Date();
};

export const getOrdinal = (day) => {
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (s[(v - 20) % 10] || s[v] || s[0]);
};