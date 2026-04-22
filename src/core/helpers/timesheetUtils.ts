import type { LunchBreakDto, NonWorkingDaysDto, TimeSheetDto } from "@/models/entities/crm/CrmTimeSheetModels";
import { enumToArray } from "./enumToArray";
import { HolidayTypeEnum, TimesheetOffType, TimesheetTypeEnum } from "@/models/custom/EnumTypes";
import { combineDateTime, formatterInputDate, formatterInputDateTime, getDateTime } from "./dateUtils";
import i18n from "../plugins/i18n";
import moment from "moment";
import type { PublicHolidayDto } from "@/models/entities/humanResource/PublicHolidayModels";
import type { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
const { t } = i18n.global;

export class TimeSheetResultClass {
    start: string | null;
    end: string | null;
    title: string;
    className: string;
    itemValue: any;
    notDataEntered?: boolean;
    clickable?: boolean;
    display?: string | null;

    constructor() {
        this.start = null;
        this.end = null;
        this.title = '';
        this.className = '';
        this.itemValue = {} as any;
        this.notDataEntered = false;
        this.clickable = true;
        this.display = null;
    }
}

// Kullanıcının girdiği zaman çizelgelerini event olarak geri döner.
export const returnRealDataEnteredForCalendar = (timeSheets: TimeSheetDto[]): TimeSheetResultClass[] => {
    const defaultResult = timeSheets.map((timeSheet: TimeSheetDto) => {
        return {
            aTitle: 'Kullanıcı Verisi' + enumToArray(TimesheetTypeEnum).find((a) => a.value == timeSheet.sheetType)?.title,
            start: timeSheet.startDate,
            end: timeSheet.endDate,
            title: enumToArray(TimesheetTypeEnum).find((a) => a.value == timeSheet.sheetType)?.title ?? '',
            className: `event-type-${TimesheetTypeEnum[timeSheet.sheetType]} font-weight-bold text-body-1`,
            clickable: true,
            itemValue: timeSheet,
            notDataEntered: true,
            display: null
        }
    });
    const result = defaultResult.filter(a => a.start !== null && a.end !== null);
    return result
}

// Dashboard MyTimesheetCard için eksik girişleri event olarak geri döner.
export const returnWorkingHoursAlertForCalendar = (
    workingHours: LunchBreakDto[],
    timeSheets: TimeSheetDto[]
): TimeSheetResultClass[] => {
    const results: TimeSheetResultClass[] = [];
    const now = moment().startOf("day");

    const addEvent = (
        start: moment.Moment,
        end: moment.Moment,
        clickable: boolean = false,
        titleKey?: string | null,
        className?: string | null,
    ) => {
        results.push({
            start: start.toISOString(),
            end: end.toISOString(),
            title: titleKey ? t(titleKey) : t('form.missingEntry'),
            className: `${className ? className : 'event-type-missing-data'} font-weight-bold text-body-1`,
            itemValue: {
                startDate: start.format("YYYY-MM-DDTHH:mm"),
                endDate: end.format("YYYY-MM-DDTHH:mm"),
            },
            notDataEntered: false,
            clickable,
        });
    };

    workingHours.forEach((wh) => {
        if (wh.isWeekend) return; // Hafta sonunu atla

        const whDate = moment(wh.workStart).startOf("day");

        // Gelecek günleri atla (sadece geçmiş günler için kontrol yapıyoruz)
        // Bugünü dahil etmek istiyorsak, isAfter yapmamız lazım.
        if (whDate.isSameOrAfter(now)) return;

        const workStart = moment(wh.workStart);
        const workEnd = moment(wh.workEnd);
        const breakStart = moment(wh.breakStart);
        const breakEnd = moment(wh.breakEnd);

        // O gün için kullanıcının girdiği timesheet’leri bul
        const dayTimeSheets = timeSheets.filter((ts) =>
            moment(ts.startDate).isSame(whDate, "day")
        );

        // Eğer hiç timesheet yoksa => bütün mesaiyi eksik giriş kabul et
        if (dayTimeSheets.length === 0) {
            addEvent(workStart, breakStart, true);
            addEvent(breakEnd, workEnd, true);
            return;
        }

        // Eğer kullanıcı giriş yapmışsa → boş kalan saat aralıklarını kontrol et
        const expectedIntervals = [
            { start: workStart, end: breakStart },
            { start: breakEnd, end: workEnd },
        ];

        expectedIntervals.forEach(({ start, end }) => {
            let cursor = start.clone();

            // Kullanıcının timesheet'lerini zaman sırasına göre al
            const sortedSheets = dayTimeSheets
                .map((ts) => ({
                    start: moment(ts.startDate),
                    end: moment(ts.endDate),
                }))
                .sort((a, b) => a.start.valueOf() - b.start.valueOf());

            sortedSheets.forEach((ts) => {
                if (cursor.isBefore(ts.start)) {
                    const missingStart = cursor.clone();
                    const missingEnd = ts.start.clone();

                    // Öğle arası ile çakışma kontrolü
                    const overlapWithBreak =
                        (missingStart.isBefore(breakEnd) && missingEnd.isAfter(breakStart));

                    if (overlapWithBreak) {
                        // Eğer tamamen öğle arasında kalıyorsa → atla
                        if (missingStart.isSameOrAfter(breakStart) && missingEnd.isSameOrBefore(breakEnd)) {
                            // skip
                        } else {
                            // Kısmen çakışıyorsa → öğle arasını çıkar
                            if (missingStart.isBefore(breakStart)) {
                                addEvent(missingStart, breakStart, true);
                            }
                            if (missingEnd.isAfter(breakEnd)) {
                                addEvent(breakEnd, missingEnd, true);
                            }
                        }
                    } else {
                        // Öğle arasıyla çakışmıyorsa direkt ekle
                        addEvent(missingStart, missingEnd, true);
                    }
                }
                cursor = moment.max(cursor, ts.end);
            });

            // Kullanıcı girişlerinden sonra kalan boşluk
            if (cursor.isBefore(end)) {
                const missingStart = cursor.clone();
                const missingEnd = end.clone();

                const overlapWithBreak =
                    (missingStart.isBefore(breakEnd) && missingEnd.isAfter(breakStart));

                if (overlapWithBreak) {
                    if (missingStart.isBefore(breakStart)) {
                        addEvent(missingStart, breakStart, true);
                    }
                    if (missingEnd.isAfter(breakEnd)) {
                        addEvent(breakEnd, missingEnd, true);
                    }
                } else {
                    addEvent(missingStart, missingEnd, true);
                }
            }
        });
        addEvent(breakStart, breakEnd, false, 'form.lunchBreak', "lunch-break");
    });

    return results;
};



// Resmi Tatilleri, Kullanıcının izinlerini ve Hafta sonlarını event olarak geri döner.
export const returnNonWorkingDaysForCalendar = (nonWorkings: NonWorkingDaysDto[]): TimeSheetResultClass[] => {
    const defaultResult = nonWorkings.map((nonWork: NonWorkingDaysDto) => {
        return {
            aTitle: nonWork.dayType == TimesheetOffType.PublicHoliday ? 'Resmi Tatil' : nonWork.dayType == TimesheetOffType.EmployeeLeave ? 'Çalışan İzni' : nonWork.description,
            start: combineDateTime(nonWork.date, nonWork.start),
            end: combineDateTime(nonWork.date, nonWork.end),
            title: nonWork.dayType == TimesheetOffType.NonWorkingDay ? '' : nonWork.dayType == TimesheetOffType.EmployeeLeave ? t('form.leaveEmployee') : nonWork.description,
            className: `day-off-${TimesheetOffType[nonWork.dayType]} font-weight-bold text-body-1`,
            clickable: true,
            itemValue: nonWork,
            notDataEntered: false,
            display: "background",
        }
    });
    const result = defaultResult.filter(a => a.start !== null && a.end !== null);
    return result
}

// Öğle arası saatlerini event olarak geri döner.
export const returnLunchBreakHoursForCalendar = (lunchBreaks: LunchBreakDto[]): TimeSheetResultClass[] => {
    const defaultResult = lunchBreaks.map((lunchBreak) => {
        return {
            aTitle: 'Öğle Arası',
            start: !lunchBreak.isWeekend ? lunchBreak.breakStart : null,
            end: !lunchBreak.isWeekend ? lunchBreak.breakEnd : null,
            title: "",
            className: `lunch-break font-weight-bold text-body-1`,
            clickable: false,
            itemValue: lunchBreak,
            notDataEntered: true,
            display: "background",
        }
    })
    const result = defaultResult.filter(a => a.start !== null && a.end !== null);
    return result
}

// Mesai saatlerini event olarak geri döner.
export const returnWorkingHoursForCalendar = (workingHours: LunchBreakDto[]): TimeSheetResultClass[] => {
    const defaultResult = workingHours.map((workingHour) => {
        return {
            aTitle: 'Çalışma Saati',
            start: !workingHour.isWeekend ? workingHour.workStart : null,
            end: !workingHour.isWeekend ? workingHour.workEnd : null,
            title: "",
            className: `${workingHour.isWeekend ? 'day-off-' + TimesheetOffType[1] : 'working-hours'} font-weight-bold text-body-1`,
            clickable: false,
            itemValue: workingHour,
            notDataEntered: false,
            display: "background",
        }
    });
    const result = defaultResult.filter(a => a.start !== null && a.end !== null);
    return result
}


// HolidayList'i event olarak geri döner.
export const returnHolidayListForCalendar = (holidays: PublicHolidayDto[]): TimeSheetResultClass[] => {
    const resultEvents = holidays.map((item) => {
        if (item.endDate.includes('00:00:00')) {
            item.endDate = moment(item.endDate)
                .utc() // Zaman dilimini korumak için
                .set({ hour: 23, minute: 59, second: 0 })
                .format("YYYY-MM-DDTHH:mm:ssZ"); // +00:00 formatında döndürür
        }

        return {
            clickable: true,
            start: formatterInputDateTime(item.startDate),
            end: formatterInputDateTime(item.endDate),
            title: item.name,
            className: `event-type-${HolidayTypeEnum[item.holidayType]} fc-event-dot font-weight-bold text-body-1`,
            itemValue: item,
        }
    })

    return resultEvents;
}

// EmployeeLeaveListDto modelini kullanarak, kullanıcının kendi izin taleplerini event olarak geri döner.
export const returnEmployeeLeaveListForCalendar = (leaveList: EmployeeLeaveListDto[]): TimeSheetResultClass[] => {
    const resultEvents = leaveList.map((item) => {
        if (item.endDate.includes('00:00:00')) {
            item.endDate = moment(item.endDate)
                .utc() // Zaman dilimini korumak için
                .set({ hour: 23, minute: 59, second: 0 })
                .format("YYYY-MM-DDTHH:mm:ssZ"); // +00:00 formatında döndürür
        }

        return {
            clickable: true,
            start: formatterInputDateTime(item.startDate),
            end: formatterInputDateTime(item.endDate),
            title: item.leaveType.name,
            className: `day-off-EmployeeLeave font-weight-bold text-body-1`,
            itemValue: item,
        }
    })

    return resultEvents;
}

// EmployeeLeaveListDto modelini kullanarak, çalışan izin taleplerini event olarak geri döner.
export const returnEmployeeLeaveRequestList = (leaveRequestList: EmployeeLeaveListDto[]): TimeSheetResultClass[] => {
    const resultEvents = leaveRequestList.map((item) => {
        if (item.endDate.includes('00:00:00')) {
            item.endDate = moment(item.endDate)
                .utc() // Zaman dilimini korumak için
                .set({ hour: 23, minute: 59, second: 0 })
                .format("YYYY-MM-DDTHH:mm:ssZ");
        }

        return {
            clickable: true,
            start: formatterInputDateTime(item.startDate),
            end: formatterInputDateTime(item.endDate),
            title: item.employee.fullName + ' / ' + item.leaveType.name,
            className: `day-off-EmployeeRequestLeave font-weight-bold text-body-1`,
            itemValue: item,
        }
    })

    return resultEvents;
}

// Günlük timesheet girişleri ile ilgili uyarılar dönüyor.
export const dailyTimeSheetAlert = (
    workingHours: Array<LunchBreakDto>,
    timesheets: Array<TimeSheetResultClass>
) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");

    // Helper: belirli gün için timesheetleri getir
    const getDaySheets = (date: string) =>
        timesheets.filter(t => t.start?.startsWith(date));

    // ---------------------------
    // 1. Bugün kontrolü
    // ---------------------------
    let todayAlert = "";

    const todayWork = workingHours.find(
        wh => moment(wh.workStart).format("YYYY-MM-DD") === today
    );

    if (todayWork && !todayWork.isWeekend) {
        const todaySheets = getDaySheets(today);

        if (todaySheets.length === 0) {
            todayAlert = "Bugün için hiç timesheet girişi yapılmamış.";
        } else {
            const fourHoursAgo = moment().subtract(4, "hours");
            const hasEntryLast4Hours = todaySheets.some(t => {
                const end = moment(t.end);
                return end.isAfter(fourHoursAgo);
            });
            if (!hasEntryLast4Hours) {
                todayAlert = "Son 4 saatte timesheet girişi yapılmamış.";
            }
        }
    }
    console.log('todayAlert', todayAlert);

    // ---------------------------
    // 2. Dün ve önceki günler kontrolü
    // ---------------------------
    const previousDaysAlerts: string[] = [];

    for (const wh of workingHours) {
        const whDate = moment(wh.workStart).format("YYYY-MM-DD");
        const whDateMoment = moment(wh.workStart);

        if (wh.isWeekend) continue;
        if (whDateMoment.isBefore(now, "day") && whDate !== today) {
            const daySheets = getDaySheets(whDate);

            // Çalışma aralıklarını hesapla (break varsa ayır)
            let workIntervals: Array<[moment.Moment, moment.Moment]> = [];
            const start = moment(wh.workStart);
            const end = moment(wh.workEnd);

            if (wh.breakStart && wh.breakEnd) {
                workIntervals.push([start, moment(wh.breakStart)]);
                workIntervals.push([moment(wh.breakEnd), end]);
            } else {
                workIntervals.push([start, end]);
            }

            // Timesheet aralıklarını dönüştür
            const sheetIntervals = daySheets.map(t => [
                moment(t.start),
                moment(t.end)
            ] as [moment.Moment, moment.Moment]);

            let hasGap = false;

            // Çalışma aralıklarının boş kalan kısımlarını kontrol et
            for (const [wStart, wEnd] of workIntervals) {
                let cursor = wStart.clone();

                while (cursor.isBefore(wEnd)) {
                    const nextSheet = sheetIntervals.find(
                        ([s, e]) =>
                            (s.isSameOrBefore(cursor) && e.isAfter(cursor)) ||
                            s.isSame(cursor) ||
                            s.isAfter(cursor)
                    );

                    if (!nextSheet) {
                        hasGap = true;
                        break;
                    }

                    const [s, e] = nextSheet;

                    if (s.isAfter(cursor)) {
                        hasGap = true;
                        break;
                    }

                    cursor = moment.max(cursor, e);
                }

                if (hasGap) break;
            }

            if (hasGap) {
                previousDaysAlerts.push(
                    `${whDate} (${whDateMoment.format("dddd")}) günü için eksik data girişi var.`
                );
            }
        }
    }
    console.log('previousDaysAlerts', previousDaysAlerts);

    // ---------------------------
    // 3. Haftalık kontrol
    // ---------------------------
    const weekStart = moment().startOf("week").add(1, "day"); // Pazartesi
    const weekEnd = moment().endOf("week").add(1, "day");     // Pazar

    const hasAnyThisWeek = timesheets.some(t => {
        const d = moment(t.start);
        return d.isBetween(weekStart, weekEnd, undefined, "[]");
    });

    const weekAlert = !hasAnyThisWeek
        ? "Bu hafta hiç timesheet girişi yapılmamış."
        : "";

    return {
        todayAlert,
        previousDaysAlerts,
        weekAlert
    };
};
