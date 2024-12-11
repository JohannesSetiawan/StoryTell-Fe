export function getDateInWIB(date: Date) {
    const newHour = date.getHours();
    date.setHours(newHour);
    return date;
}

export function commentDateToString(date: string) {
    const realDate = getDateInWIB(new Date(date))
    const year = String(realDate.getFullYear());
    let month = String(realDate.getMonth())
    const day = String(realDate.getDate())
    const hour = String(realDate.getHours())
    const minute = String(realDate.getMinutes()).padStart(2, '0');
    const seconds = String(realDate.getSeconds()).padStart(2, '0');
  
    if (month === "0") {
      month = "January";
    } else if (month === "1") {
      month = "February";
    } else if (month === "2") {
      month = "March";
    } else if (month === "3") {
      month = "April";
    } else if (month === "4") {
      month = "May";
    } else if (month === "5") {
      month = "June";
    } else if (month === "6") {
      month = "July";
    } else if (month === "7") {
      month = "August";
    } else if (month === "8") {
      month = "September";
    } else if (month === "9") {
      month = "October";
    } else if (month === "10") {
      month = "November";
    } else if (month === "11"){
      month = "Desember";
    }
  
    return `${day} ${month} ${year} ${hour}:${minute}:${seconds}`;
}

export function dateToString(datetime: string) {
  const date = datetime.split('T')[0].split('-')
  const time = datetime.split('T')[1].split('.')[0].split(':')
  const year = date[0];
  let month = date[1]
  const day = date[2]
  const hour = time[0]
  const minute = time[1].padStart(2, '0');
  const seconds = time[2].padStart(2, '0');

  if (month === "01") {
    month = "January";
  } else if (month === "02") {
    month = "February";
  } else if (month === "03") {
    month = "March";
  } else if (month === "04") {
    month = "April";
  } else if (month === "05") {
    month = "May";
  } else if (month === "06") {
    month = "June";
  } else if (month === "07") {
    month = "July";
  } else if (month === "08") {
    month = "August";
  } else if (month === "09") {
    month = "September";
  } else if (month === "10") {
    month = "October";
  } else if (month === "11") {
    month = "November";
  } else if (month === "12"){
    month = "Desember";
  }

  return `${day} ${month} ${year} ${hour}:${minute}:${seconds}`;
}