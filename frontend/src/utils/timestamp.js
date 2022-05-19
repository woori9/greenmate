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

export function diff2hour(start, now) {
  if (
    start.getMonth() - now.getMonth() >= 0 &&
    start.getDay() - now.getDay() > 0
  )
    return true;
  const diff = (start.getTime() - now.getTime()) / (1000 * 60); // 분 단위로 계산
  if (diff > 120) {
    return true;
  }
  return false;
}
