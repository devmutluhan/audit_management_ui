<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start" color="transparent">
            <v-col cols="auto" class="pr-0">
                <v-card color="warning" border="false">
                    <v-card-text class="d-flex pa-2 align-center justify-center">
                        <v-icon color="white" size="20">mdi-calendar-edit</v-icon>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.myTimeSheet') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="fill-height">
            </FullCalendar>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-timeSheet' }">
                    {{ $t('list.viewAll') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
        <VDialogContent v-model="updateTimesheetEventDialog">
            <UpdateTimesheetEventDialog :selectedItem="selectedEvent" @createItem="createOrUpdateTimesheet"
                @deleteItem="deleteTimeSheet" :calendarOptions="calendarOptions" :weekId="timeSheetWeek.id"
                :dialogClose="() => { updateTimesheetEventDialog = false }" />
        </VDialogContent>
        <VDialogContent v-model="addTimesheetEventDialog">
            <AddTimesheetEventDialog :selectedHours="selectedHours" :calendarOptions="calendarOptions"
                @createItem="createOrUpdateTimesheet" :dialogClose="() => { addTimesheetEventDialog = false }" />
        </VDialogContent>
    </v-card>
</template>

<script lang="ts" setup>


import { ref, watch, type Ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import listPlugin from "@fullcalendar/list";
import UpdateTimesheetEventDialog from "@/components/dialogs/humanResources/UpdateTimesheetEventDialog.vue"
import { defaultCalendarOptions } from "@/core/data/events";
import { storeToRefs } from "pinia";
import { useTimesheetStore } from "@/stores/crmStores/timeSheetStore";
import { TimesheetOffType } from "@/models/custom/EnumTypes";
import { LunchBreakDto, NonWorkingDaysDto, TimesheetDaysDto, TimeSheetDto } from "@/models/entities/crm/CrmTimeSheetModels";
import { combineDateTime, formatterInputDate } from "@/core/helpers/dateUtils";
import { returnLunchBreakHoursForCalendar, returnNonWorkingDaysForCalendar, returnRealDataEnteredForCalendar, returnWorkingHoursAlertForCalendar } from "@/core/helpers/timesheetUtils";
import AddTimesheetEventDialog from "@/components/dialogs/humanResources/AddTimesheetEventDialog.vue";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const calendarRef: Ref<null | typeof FullCalendar> = ref(null);
const { timeSheetWeek } = storeToRefs(useTimesheetStore());
const addTimesheetEventDialog = ref(false);
const updateTimesheetEventDialog = ref(false);
const startDateWeek = ref(0 as any)
const selectedEvent = ref(new TimeSheetDto())
const calendarOptions = ref({} as any);
const selectedHours = ref({ start: '', end: '' });

const clickEvent = (arg: any) => {
    if (arg.event.extendedProps.clickable) {
        if (arg.event.extendedProps.itemValue.id) {
            selectedEvent.value = arg.event.extendedProps.itemValue;
            updateTimesheetEventDialog.value = true;
        } else {
            const itemValue = arg.event.extendedProps.itemValue;
            selectedHours.value = {
                start: itemValue.startDate,
                end: itemValue.endDate
            };
            addTimesheetEventDialog.value = true
        }
    }
}

calendarOptions.value = {
    ...defaultCalendarOptions.value,
    plugins: [listPlugin],
    initialView: 'listWeek',
    headerToolbar: {
        start: "",
        center: "title",
        end: "prev,next",
    },
    views: {
        listDay: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
        }
    },
    eventClick: (arg: any) => { clickEvent(arg) },
    datesSet: (arg: any) => { onDatesSet(arg) }
}


const onDatesSet = (arg: any) => {
    startDateWeek.value = formatterInputDate(arg.start);
    useTimesheetStore().getTimesheet({ startDateOfWeek: startDateWeek.value });
}

const setEventCalendar = () => {
    let timeSheets = new Array<TimeSheetDto>();
    let nonWorkings = new Array<NonWorkingDaysDto>();
    let lunchBreaks = new Array<LunchBreakDto>();
    timeSheetWeek.value.timesheetDays.forEach((a: TimesheetDaysDto) => {
        nonWorkings = nonWorkings.concat(a.nonWorkingDays.filter((a) => a.dayType !== TimesheetOffType.NonWorkingDay))
        timeSheets = timeSheets.concat(a.timesheets);
        lunchBreaks.push({
            breakStart: combineDateTime(a.date, a.lunchBreakStart),
            breakEnd: combineDateTime(a.date, a.lunchBreakEnd),
            workEnd: combineDateTime(a.date, a.workEnd),
            workStart: combineDateTime(a.date, a.workStart),
            isWeekend: a.nonWorkingDays.some((b) => b.dayType == TimesheetOffType.NonWorkingDay)
        });
    })

    calendarOptions.value.events = [] as any;
    let results = [] as any;

    // Gerçek datalar
    results = results.concat(returnRealDataEnteredForCalendar(timeSheets));

    // Tatil, İzinler ve Hafta sonu
    results = results.concat(returnNonWorkingDaysForCalendar(nonWorkings));

    // Öğle Saatleri
    results = results.concat(returnLunchBreakHoursForCalendar(lunchBreaks));

    // Günü geçmiş girilmesi zorunlu ancak veri girilmemiş saatleri döner
    results = results.concat(returnWorkingHoursAlertForCalendar(lunchBreaks, timeSheets))

    calendarOptions.value.events = results;
}


watch(() => timeSheetWeek.value, () => {
    if (timeSheetWeek.value) {
        setEventCalendar();
    }
})
const deleteTimeSheet = () => {
    timeSheetWeek.value.timesheetDays.forEach((a) => {
        const index = a.timesheets.findIndex((b) => b.id == selectedEvent.value.id);
        if (index != -1) {
            timeSheetWeek.value.enteredWorkingHours -= a.timesheets[index].workHours;
            timeSheetWeek.value.totalOvertimeHours -= a.timesheets[index].overtimeHours;
            timeSheetWeek.value.remainingWorkingHours += a.timesheets[index].workHours;

            a.timesheets.splice(index, 1);
        }
    });
    setEventCalendar();
}

// TODO: istek atmadan dialogdan veri alınıp takvime eklenebilir.
const createOrUpdateTimesheet = () => {
    useTimesheetStore().getTimesheet({ startDateOfWeek: startDateWeek.value }).then((res) => {
        setEventCalendar();
    }).catch((error) => {
        return catchError(error, () => { createOrUpdateTimesheet })
    })
}
</script>

<style lang="scss">
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

/* Uyarı */
.fc .event-type-missing-data {
    background-color: var(--fc-event-missing-data-bg);
    border-left: 4px solid var(--fc-event-missing-data-border);
    color: var(--fc-event-body-text-color);
}

/* Uyarı ikonunu dot yerine göster */
.fc .event-type-missing-data .fc-list-event-dot {
    border: none;
    width: auto;
    height: auto;
    background: none;
    font-size: 14px;
}

.fc .event-type-missing-data .fc-list-event-dot::before {
    content: "⚠️";
    display: inline-block;
}

.fc .lunch-break .fc-list-event-dot {
    border: none;
    width: auto;
    height: auto;
    background: none;
    font-size: 14px;
}

.fc .lunch-break .fc-list-event-dot::before {
    content: "🍽️";
    display: inline-block;
}

.fc .fc-list-event-dot {
    display: inline;
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
    --fc-lunch-break-bg: #ebeaea;
    --fc-working-hours-bg: #E3F2FD;
    --fc-working-hours-border: #64B5F6;
    --fc-day-off-public-bg: #F5F5DC;
    --fc-day-off-nonworking-bg: #F0F0F0;
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
    --fc-event-missing-data-bg: #FFF4E5;
    --fc-event-missing-data-border: #FF9800;
}

:root[data-bs-theme="dark"] {
    --fc-lunch-break-bg: #1f0606;
    --fc-working-hours-bg: #1565C0;
    --fc-working-hours-border: #64B5F6;
    --fc-day-off-public-bg: #8D8C7A;
    --fc-day-off-nonworking-bg: #37474F;
    --fc-day-off-nonworking-text: #FFFFFF;
    --fc-day-off-employeeleave-bg: #81C784;
    --fc-event-body-text-color: #ffffff;
    --fc-event-project-bg: #034274;
    --fc-event-project-border: #4FC3F7;
    --fc-event-marketing-bg: #2e1040;
    --fc-event-marketing-border: #BA68C8;
    --fc-event-worktravel-bg: #5d4d27;
    --fc-event-worktravel-border: #FFD54F;
    --fc-event-training-bg: #0d3a10;
    --fc-event-training-border: #81C784;
    --fc-event-office-bg: #542f57;
    --fc-event-office-border: #90A4AE;
    --fc-event-meeting-bg: #BF360C;
    --fc-event-meeting-border: #FF8A65;
    --fc-event-other-bg: #113e3a;
    --fc-event-other-border: #B0BEC5;
    --fc-event-missing-data-bg: #32221e;
    --fc-event-missing-data-border: #FFB74D;
}
</style>