<template>
    <v-row>
        <v-col cols="12">
            <TimeSheetEmployeeInfoCard :timeSheetWeek="timeSheetWeek" :isChangeValues="isChangeValues" />
        </v-col>
        <v-col cols="12">
            <v-card height="70vh">
                <v-card-text class="fill-height overflow-auto">
                    <FullCalendar style="min-width: 500px;" class="fill-height" ref="calendarRef"
                        :options="calendarOptions">
                    </FullCalendar>
                </v-card-text>
            </v-card>
        </v-col>
        <VDialogContent v-model="addTimesheetEventDialog">
            <AddTimesheetEventDialog :selectedHours="selectedHours" :calendarOptions="calendarOptions"
                @createItem="createOrUpdateTimesheet" :dialogClose="() => { addTimesheetEventDialog = false }" />
        </VDialogContent>
        <VDialogContent v-model="updateTimesheetEventDialog">
            <UpdateTimesheetEventDialog :selectedItem="selectedEvent" @createItem="createOrUpdateTimesheet"
                @deleteItem="deleteTimeSheet" :weekId="timeSheetWeek.id" :calendarOptions="calendarOptions"
                :dialogClose="() => { updateTimesheetEventDialog = false }" />
        </VDialogContent>
    </v-row>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import moment from "moment";
import TimeSheetEmployeeInfoCard from "@/components/cards/employeeDetailCards/TimeSheetEmployeeInfoCard.vue"
import AddTimesheetEventDialog from "@/components/dialogs/humanResources/AddTimesheetEventDialog.vue"
import UpdateTimesheetEventDialog from "@/components/dialogs/humanResources/UpdateTimesheetEventDialog.vue"
import { storeToRefs } from "pinia";
import { useTimesheetStore } from "@/stores/crmStores/timeSheetStore";
import { defaultCalendarOptions } from "@/core/data/events";
import { LunchBreakDto, NonWorkingDaysDto, TimesheetDaysDto, TimeSheetDto } from "@/models/entities/crm/CrmTimeSheetModels";
import { TimesheetOffType } from "@/models/custom/EnumTypes";
import { catchError } from "@/core/helpers/generalResponse";
import { combineDateTime, formatterInputDate } from "@/core/helpers/dateUtils";
import { returnNonWorkingDaysForCalendar, returnRealDataEnteredForCalendar, returnLunchBreakHoursForCalendar, returnWorkingHoursForCalendar } from "@/core/helpers/timesheetUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const { timeSheetWeek } = storeToRefs(useTimesheetStore());
const isChangeValues = ref(false)
const calendarRef: Ref<null | typeof FullCalendar> = ref(null);
const addTimesheetEventDialog = ref(false);
const updateTimesheetEventDialog = ref(false);
const selectedHours = ref({ start: '', end: '' });
const selectedEvent = ref(new TimeSheetDto())
const calendarOptions = ref({} as any);
const startDateWeek = ref('' as any)

calendarOptions.value = {
    ...defaultCalendarOptions.value,
    eventClick: (arg: any) => { clickEvent(arg) },
    datesSet: (arg: any) => { onDatesSet(arg) },
    select: (arg: any) => { selectEvent(arg) },
    selectAllow: (selectInfo: any) => {
        if (hasTwoDays(selectInfo) && hasOverlap(selectInfo)) {
            return true
        } else {
            return false
        }
    },
    dateClick(arg: any) { touchDateHours(arg) },
}

// Çakışma kontrolü
const hasOverlap = (selectInfo: any) => {
    const selectionStart = selectInfo.start.getTime()
    const selectionEnd = selectInfo.end.getTime()
    return !calendarOptions.value.events.some(event => {
        const eventStart = new Date(event.start).getTime()
        const eventEnd = new Date(event.end).getTime();

        if (event.notDataEntered)
            return selectionStart < eventEnd && selectionEnd > eventStart
        else
            return false
    })
}

// Aynı gün içinde seçim yapılabilir kontrolü
const hasTwoDays = (selectInfo: any) => {
    // Başlangıç ve bitiş tarihinin günü aynı mı kontrol ediliyor
    const start = selectInfo.start;
    const end = selectInfo.end;

    // Aynı gün içinde kalıyorsa true döner, aksi halde false
    return start.getDate() === end.getDate() &&
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear();
}

const selectEvent = (arg: any) => {
    selectedHours.value = arg
    addTimesheetEventDialog.value = true;
}

const clickEvent = (arg: any) => {
    if (arg.event.extendedProps.clickable) {
        selectedEvent.value = arg.event.extendedProps.itemValue;
        updateTimesheetEventDialog.value = true;
    }
}

const touchDateHours = (arg: any) => {
    if ((arg.view.type == 'timeGridWeek' || arg.view.type == 'timeGridDay')) {
        const [hours, minutes, seconds] = calendarOptions.value.slotDuration.split(':').map(Number);
        // Todo: moment kaldırılacak.
        const start = moment(arg.date);
        const end = moment(arg.date).add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds');

        // Çakışma kontrolü
        const isOverlappingWithBlocked = calendarOptions.value.events.some(event => {
            if (!event.notDataEntered) return false;

            const eventStart = moment(event.start);
            const eventEnd = moment(event.end);

            // Çakışma varsa true döner
            return start.isBefore(eventEnd) && end.isAfter(eventStart);
        });

        if (isOverlappingWithBlocked) {
            return;
        }

        // Eğer çakışma yoksa dialog aç
        selectedHours.value = {
            start: start.format('YYYY-MM-DDTHH:mm'),
            end: end.format('YYYY-MM-DDTHH:mm')
        };
        addTimesheetEventDialog.value = true;
    }
}

const onDatesSet = (arg: any) => {
    if (arg.view.type == 'timeGridWeek') {
        startDateWeek.value = formatterInputDate(arg.start);
        useTimesheetStore().getTimesheet({ startDateOfWeek: startDateWeek.value });
    }
}

// TODO: istek atmadan dialogdan veri alınıp takvime eklenebilir.
const createOrUpdateTimesheet = () => {
    useTimesheetStore().getTimesheet({ startDateOfWeek: startDateWeek.value }).then((res) => {
        setEventCalendar();
    }).catch((error) => {
        return catchError(error, () => { createOrUpdateTimesheet })
    })
}

const deleteTimeSheet = () => {
    timeSheetWeek.value.timesheetDays.forEach((a) => {
        if (a.timesheets.some((b) => b.id == selectedEvent.value.id)) {
            const index = a.timesheets.findIndex((b) => b.id == selectedEvent.value.id);
            timeSheetWeek.value.enteredWorkingHours -= a.timesheets[index].workHours;
            timeSheetWeek.value.totalOvertimeHours -= a.timesheets[index].overtimeHours;
            timeSheetWeek.value.remainingWorkingHours += a.timesheets[index].workHours;

            a.timesheets.splice(index, 1);
        }
    });
    setEventCalendar();
}

const setEventCalendar = () => {
    let timeSheets = new Array<TimeSheetDto>();
    let nonWorkings = new Array<NonWorkingDaysDto>();
    let lunchBreaks = new Array<LunchBreakDto>();
    timeSheetWeek.value.timesheetDays.forEach((a: TimesheetDaysDto) => {
        nonWorkings = nonWorkings.concat(a.nonWorkingDays)
        timeSheets = timeSheets.concat(a.timesheets);
        lunchBreaks.push({
            breakStart: combineDateTime(a.date, a.lunchBreakStart),
            breakEnd: combineDateTime(a.date, a.lunchBreakEnd),
            workEnd: combineDateTime(a.date, a.workEnd),
            workStart: combineDateTime(a.date, a.workStart),
            isWeekend: a.nonWorkingDays.some((b) => b.dayType == TimesheetOffType.NonWorkingDay)
        } as LunchBreakDto);
    });
    calendarOptions.value.events = [] as any;
    let results = [] as any;

    // Gerçek datalar
    results = results.concat(returnRealDataEnteredForCalendar(timeSheets));

    // Tatil, İzinler ve hafta sonu
    results = results.concat(returnNonWorkingDaysForCalendar(nonWorkings));

    // Öğle saatleri
    results = results.concat(returnLunchBreakHoursForCalendar(lunchBreaks))

    // Çalışma saatleri
    results = results.concat(returnWorkingHoursForCalendar(lunchBreaks))

    calendarOptions.value.events = results;
}


watch(() => timeSheetWeek.value, () => {
    if (timeSheetWeek.value) {
        setEventCalendar();
    }
})

</script>

<style lang="scss">
.fc .fc-button {
    padding: 0.75rem 1.25rem;
    box-shadow: none !important;
    border: 0 !important;
    border-radius: 0.475rem;
    vertical-align: middle;
    font-weight: 500;
    text-transform: capitalize;
}

/* Öğle Arası */
.fc .lunch-break {
    background-color: var(--fc-lunch-break-bg);
    opacity: 0.8;
}

/* Çalışma Saatleri */
.fc .working-hours {
    background-color: var(--fc-working-hours-bg);
    border-top: 2px dashed var(--fc-working-hours-border);
    border-bottom: 2px dashed var(--fc-working-hours-border);
    opacity: 0.2;
}

/* Özel Tatil Günleri */
.fc .day-off-PublicHoliday {
    background-color: var(--fc-day-off-public-bg);
    color: var(--fc-event-body-text-color);
    opacity: 1;
}

/* Mesai Dışı Saatler */
.fc .day-off-NonWorkingDay {
    background-color: var(--fc-day-off-nonworking-bg);
    color: var(--fc-day-off-nonworking-text);
    opacity: 0.3;
}

/* Personel İzinli Gün */
.fc .day-off-EmployeeLeave {
    background-color: var(--fc-day-off-employeeleave-bg);
    color: var(--fc-event-body-text-color);
    opacity: 1;
}

/* Projede görev almış */
.fc .event-type-Project {
    background-color: var(--fc-event-project-bg);
    border-left: 4px solid var(--fc-event-project-border);
    color: var(--fc-event-body-text-color);
}

/* Pazarlama işleminde görev almış */
.fc .event-type-Marketing {
    background-color: var(--fc-event-marketing-bg);
    border-left: 4px solid var(--fc-event-marketing-border);
    color: var(--fc-event-body-text-color);
}

/* İş Seyahati işleminde görev almış */
.fc .event-type-WorkTravel {
    background-color: var(--fc-event-worktravel-bg);
    border-left: 4px solid var(--fc-event-worktravel-border);
    color: var(--fc-event-body-text-color);
}

/* Eğitim almış */
.fc .event-type-Training {
    background-color: var(--fc-event-training-bg);
    border-left: 4px solid var(--fc-event-training-border);
    color: var(--fc-event-body-text-color);
}

/* Ofiste görev almış */
.fc .event-type-Office {
    background-color: var(--fc-event-office-bg);
    border-left: 4px solid var(--fc-event-office-border);
    color: var(--fc-event-body-text-color);
}

/* Toplantıda görev almış */
.fc .event-type-Meeting {
    background-color: var(--fc-event-meeting-bg);
    border-left: 4px solid var(--fc-event-meeting-border);
    color: var(--fc-event-body-text-color);
}

/* Diğer işlerde görev almış */
.fc .event-type-Other {
    background-color: var(--fc-event-other-bg);
    border-left: 4px solid var(--fc-event-other-border);
    color: var(--fc-event-body-text-color);
}

.fc .fc-event-main {
    color: var(--fc-event-body-text-color) !important;
}

.fc .fc-event-title {
    position: sticky;
    top: 0;
    background-color: inherit;
    z-index: 10;
    padding: 2px 4px;
}

.fc .fc-event-time {
    color: var(--fc-event-body-text-color) !important;
}

:root[data-bs-theme="light"] {
    --fc-lunch-break-bg: #FFCDD2;
    --fc-working-hours-bg: #E3F2FD;
    --fc-working-hours-border: #64B5F6;
    --fc-day-off-public-bg: #F5F5DC;
    --fc-day-off-nonworking-bg: #ddd9d9;
    --fc-day-off-nonworking-text: #1A1A1A;
    --fc-day-off-employeeleave-bg: #D0F0C0;
    --fc-event-body-text-color: #1A1A1A;
    --fc-event-project-bg: #E1F5FE;
    --fc-event-project-border: #0288D1;
    --fc-event-marketing-bg: #F3E5F5;
    --fc-event-marketing-border: #8E24AA;
    --fc-event-worktravel-bg: #FFF9C4;
    --fc-event-worktravel-border: #F9A825;
    --fc-event-training-bg: #E8F5E9;
    --fc-event-training-border: #388E3C;
    --fc-event-office-bg: #ECEFF1;
    --fc-event-office-border: #455A64;
    --fc-event-meeting-bg: #FBE9E7;
    --fc-event-meeting-border: #E64A19;
    --fc-event-other-bg: #ECEFF1;
    --fc-event-other-border: #607D8B;
}

:root[data-bs-theme="dark"] {
    --fc-lunch-break-bg: #EF9A9A;
    --fc-working-hours-bg: #1565C0;
    --fc-working-hours-border: #64B5F6;
    --fc-day-off-public-bg: #8D8C7A;
    --fc-day-off-nonworking-bg: #37474F;
    --fc-day-off-nonworking-text: #FFFFFF;
    --fc-day-off-employeeleave-bg: #81C784;
    --fc-event-body-text-color: #ffffff;
    --fc-event-project-bg: #01579B;
    --fc-event-project-border: #4FC3F7;
    --fc-event-marketing-bg: #6A1B9A;
    --fc-event-marketing-border: #BA68C8;
    --fc-event-worktravel-bg: #FBC02D;
    --fc-event-worktravel-border: #FFD54F;
    --fc-event-training-bg: #2E7D32;
    --fc-event-training-border: #81C784;
    --fc-event-office-bg: #37474F;
    --fc-event-office-border: #90A4AE;
    --fc-event-meeting-bg: #BF360C;
    --fc-event-meeting-border: #FF8A65;
    --fc-event-other-bg: #718e9c;
    --fc-event-other-border: #B0BEC5;
}
</style>