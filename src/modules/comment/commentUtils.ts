export function getDateInWIB(date: Date) {
    const newHour = date.getHours();
    date.setHours(newHour);
    return date;
}

export function dateToString(date: string) {
    const realDate = getDateInWIB(new Date(date))
    const year = String(realDate.getFullYear());
    let month = String(realDate.getMonth())
    const day = String(realDate.getDate())
    const hour = String(realDate.getHours())
    const minute = String(realDate.getMinutes()).padStart(2, '0');
    const seconds = String(realDate.getSeconds()).padStart(2, '0');
  
    if (month === "0") {
      month = "Januari";
    } else if (month === "1") {
      month = "Februari";
    } else if (month === "2") {
      month = "Maret";
    } else if (month === "3") {
      month = "April";
    } else if (month === "4") {
      month = "Mei";
    } else if (month === "5") {
      month = "Juni";
    } else if (month === "6") {
      month = "Juli";
    } else if (month === "7") {
      month = "Agustus";
    } else if (month === "8") {
      month = "September";
    } else if (month === "9") {
      month = "Oktober";
    } else if (month === "10") {
      month = "November";
    } else if (month === "11"){
      month = "Desember";
    }
  
    return `${day} ${month} ${year} ${hour}:${minute}:${seconds}`;
}