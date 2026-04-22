interface DateType {
    year: string
    month: string
    date: string
    hours: string
    minutes: string
}

import i18n from '@/core/plugins/i18n';
const t = i18n.global.t;

// Date verisini parçalıyor.
const datePartialResult = (date: any): DateType => {
    if (!date) {
        return {} as DateType
    }
    // Eğer string geliyorsa Date objesine çevir
    const dateObj = new Date(date);

    return {
        date: String(dateObj.getDate()).padStart(2, '0'),
        month: String(dateObj.getMonth() + 1).padStart(2, '0'),
        year: String(dateObj.getFullYear()),
        hours: String(dateObj.getHours()).padStart(2, '0'),
        minutes: String(dateObj.getMinutes()).padStart(2, '0'),
    } as DateType
}

// Gönderilen date(DD-MM-YYYY) ve time(HH:mm) birleştiriliyor.
// Örnek: "01-10-2023" ve "14:30" -> "2023-10-01T14:30:00"
export const combineDateTime = (date: string, time: string): string => {
    let slot = ''
    if (time.length < 5) {
        slot = ':00'
    }
    const combined = `${date}T${time}${slot}`;

    return combined;
}

// Tarihi 'DD.MM.YYYY' formatında döndürür. Gösterim için kullanılır.
// Örnek: "2023-10-01T00:00:00" -> "01.10.2023"
export const formatterDate = (date: any): string => {
    const dayObject = datePartialResult(date);

    if (dayObject.date)
        return `${dayObject.date}.${dayObject.month}.${dayObject.year}`;
    else
        return '--'
}

// Tarihi 'HH:mm:00' formatında döndürür. Gösterim veya input için kullanılır.
// Örnek: "2023-10-01T00:00:00" -> "00:00:00"
export const getDateTime = (date: string): string => {
    const dayObject = datePartialResult(date);

    return `${dayObject.hours}:${dayObject.minutes}:00`
}

// Tarihi 'YYYY-MM-DD' formatında döndürür. Input için kullanılır.
// Örnek: "2023-10-01T00:00:00" -> "2023-10-01"
export const formatterInputDate = (date: string): string => {
    const dayObject = datePartialResult(date);
    return `${dayObject.year}-${dayObject.month}-${dayObject.date}`
}

// Tarihi 'YYYY-MM-DDTHH:mm:00' formatında döndürür. Input için kullanılır.
// Örnek: "2023-10-01T00:00:00" -> "2023-10-01T00:00:00"
export const formatterInputDateTime = (date: string): string => {
    const dayObject = datePartialResult(date);
    return `${dayObject.year}-${dayObject.month}-${dayObject.date}T${dayObject.hours}:${dayObject.minutes}:00`
}

// Tarihi 'DD.MM.YYYY / HH:mm' formatında döndürür. Gösterim için kullanılır.
// Örnek: "2023-10-01T00:00:00" -> "01.10.2023 / 00:00"
export const formatterDateFromHours = (date: any): string => {
    const dayObject = datePartialResult(date);
    if (dayObject.date)
        return `${dayObject.date}.${dayObject.month}.${dayObject.year} / ${dayObject.hours}:${dayObject.minutes}`;
    else
        return '--'
}

// "YYYY-MM-DD formatlı tarihi DD-stringMonth olarak döner"
// örnek "1995-10-23. tarihi 23 Ekim olarak döner"
export const formatDateMonths = (dateString: string): string => {
    const aylar = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const date = new Date(dateString);
    const gun = date.getDate();
    const ay = date.getMonth();

    return `${gun} ${t('enums.' + aylar[ay])}`;
}