<template>
    <v-row>
        <v-col cols="12">
            <v-card height="70vh">
                <v-card-text class="fill-height overflow-auto">
                    <FullCalendar style="min-width: 500px;" class="fill-height" ref="calendarRef"
                        :options="calendarOptions">
                    </FullCalendar>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import { storeToRefs } from "pinia";
import { defaultCalendarOptions } from "@/core/data/events";
import i18n from "@/core/plugins/i18n";
import { useHolidayCalenderStore } from "@/stores/humanResourcesStores/holidayCalenderStore";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import { returnEmployeeLeaveRequestList, returnHolidayListForCalendar } from "@/core/helpers/timesheetUtils";

const t = i18n.global.t;
const { holidayList } = storeToRefs(useHolidayCalenderStore());
const { employeeLeaveList } = storeToRefs(useLeaveStore());
const calendarRef: Ref<null | typeof FullCalendar> = ref(null);
const calendarOptions = ref({} as any);
const startYear = ref('' as any)

calendarOptions.value = {
    ...defaultCalendarOptions.value,
    headerToolbar: {
        left: `prev,next today`,
        center: "title",
        right: "dayGridMonth",
    },
    initialView: 'dayGridMonth',
    views: {
        dayGridMonth: { buttonText: t('enums.Month') },
    },
    datesSet: (arg: any) => {
        startYear.value = arg.start.getFullYear().toString();
    },
}

watch(() => startYear.value, (newValue, oldValue) => {
    if (startYear.value && newValue != oldValue) {
        useHolidayCalenderStore().getPublicHoliday({ year: startYear.value });
        useLeaveStore().getLeaveForEmployee({ pageSize: 1000, pageNumber: 1, includePastApprovals: false });
    }
})

const setEventCalendar = () => {
    let resultEvents = new Array<any>();

    if (holidayList.value.publicHolidays) {
        resultEvents = resultEvents.concat(returnHolidayListForCalendar(holidayList.value.publicHolidays))
    }

    if (employeeLeaveList.value.items) {
        resultEvents = resultEvents.concat(returnEmployeeLeaveRequestList(employeeLeaveList.value.items))
    }

    calendarOptions.value.events = resultEvents;
}

watch(() => holidayList.value.publicHolidays, () => {
    if (holidayList.value.publicHolidays) {
        setEventCalendar();
    }
})

watch(() => employeeLeaveList.value.items, () => {
    if (employeeLeaveList.value.items) {
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

/* Personellerin izinleri */
.fc .day-off-EmployeeRequestLeave {
    background-color: var(--fc-day-off-leaverequest-bg);
    color: var(--fc-event-body-text-color);
    opacity: 1;
}

/* Bütün gün 1 günlük tatiller */
.fc .event-type-FullDay {
    background-color: var(--fc-event-fullday-bg);
    border-left: 4px solid var(--fc-event-fullday-border);
    color: var(--fc-event-body-text-color);
}

/*  Birden fazla gün tatiller */
.fc .event-type-MultipleDays {
    background-color: var(--fc-event-multipledays-bg);
    border-left: 4px solid var(--fc-event-multipledays-border);
    color: var(--fc-event-body-text-color);
}

/* Yarım gün tatiller */
.fc .event-type-HalfDay {
    background-color: var(--fc-event-halfday-bg);
    border-left: 4px solid var(--fc-event-halfday-border);
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
    --fc-day-off-leaverequest-bg: #F5F5DC;
    --fc-day-off-myLeave-bg: #D0F0C0;
    --fc-event-body-text-color: #1A1A1A;
    --fc-event-fullday-bg: #E1F5FE;
    --fc-event-fullday-border: #0288D1;
    --fc-event-multipledays-bg: #F3E5F5;
    --fc-event-multipledays-border: #8E24AA;
    --fc-event-halfday-bg: #FFF9C4;
    --fc-event-halfday-border: #F9A825;
}

:root[data-bs-theme="dark"] {
    --fc-lunch-break-bg: #EF9A9A;
    --fc-day-off-leaverequest-bg: #8D8C7A;
    --fc-day-off-myLeave-bg: #81C784;
    --fc-event-body-text-color: #ffffff;
    --fc-event-fullday-bg: #01579B;
    --fc-event-fullday-border: #4FC3F7;
    --fc-event-multipledays-bg: #6A1B9A;
    --fc-event-multipledays-border: #BA68C8;
    --fc-event-halfday-bg: #FBC02D;
    --fc-event-halfday-border: #FFD54F;
}
</style>