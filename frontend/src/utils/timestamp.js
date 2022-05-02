export function timestampNextDay() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(today.getHours() + 9);
  today.setMinutes(today.getMinutes() + (10 - (today.getMinutes() % 10)));
  return today.toISOString().substring(0, 16); // yyyy-mm-ddThh:mm 형식으로 반환
}

export function timestamp1YearLater() {
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  return today.toISOString().substring(0, 10);
}
