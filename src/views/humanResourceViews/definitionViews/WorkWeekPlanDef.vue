<template>
    <v-card :border="false">
        <v-card-text>
            <v-row class="d-flex justify-center">
                <v-col cols="12" md="6" class="py-0">
                    <TextField v-model="workWeekPlanCommand.name" label="form.calendarName" />
                </v-col>
                <v-col cols="12" md="6" class="py-0">
                    <TextField v-model="workWeekPlanCommand.description" label="form.description" />
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center pl-4">
                <v-col cols="12" md="6" class="py-2">
                    <SwitchInput v-model="workWeekPlanCommand.fridayDouble" color="success"
                        :label="$t('form.includeSaturdayForVacation')" hide-details></SwitchInput>
                </v-col>
                <v-col cols="12" md="6" class="py-2">
                    <SwitchInput v-model="workWeekPlanCommand.fridayDoubleIfSingle" color="success"
                        :label="$t('form.includeSaturdayForFridayVacation')" hide-details></SwitchInput>
                </v-col>
            </v-row>
            <Loading v-if="loading" />
            <v-row v-else>
                <v-col cols="12" v-if="workWeekPlanCommand.workingDays.length > 0">
                    <v-expansion-panels v-model="activeDay" elevation="0" color="cardToolbar">
                        <v-expansion-panel v-for="(day, index) in workWeekDayEnums" :key="index" :value="day.value"
                            :style="activeDay == day.value ? { border: '1px solid purple' } : ''">
                            <template v-slot:title>
                                <v-row class="d-flex align-center">
                                    <v-col cols="auto" class="pa-0">
                                        <v-checkbox v-model="workWeekPlanCommand.workingDays[day.value].isWorking"
                                            hide-details color="primary"></v-checkbox>
                                    </v-col>
                                    <v-col>
                                        {{ day.title }}
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="auto" class="text-right">
                                        {{workWeekPlanCommand.workingDays.find((x: WorkingDay) => x.dayOfWeek ==
                                            day.value)?.shiftStart.slice(0, 5)}} -
                                        {{workWeekPlanCommand.workingDays.find((x: WorkingDay) => x.dayOfWeek ==
                                            day.value)?.shiftEnd.slice(0, 5)}}
                                    </v-col>
                                </v-row>
                            </template>
                            <template v-slot:text>
                                <v-col class="pb-0">
                                    <v-row class="d-flex align-center justify-center">
                                        <v-col cols="6" md="3">
                                            <SingleSelectInput :items="dateTimes"
                                                v-model="workWeekPlanCommand.workingDays[day.value].shiftStart"
                                                label="form.shiftStart" />
                                        </v-col>
                                        <v-col cols="6" md="3">
                                            <SingleSelectInput :items="dateTimes"
                                                v-model="workWeekPlanCommand.workingDays[day.value].shiftEnd"
                                                label="form.shiftEnd" />
                                        </v-col>
                                        <v-col cols="6" md="3">
                                            <SingleSelectInput :items="dateTimes"
                                                v-model="workWeekPlanCommand.workingDays[day.value].lunchStart"
                                                label="form.lunchStart" />
                                        </v-col>
                                        <v-col cols="6" md="3">
                                            <SingleSelectInput :items="dateTimes"
                                                v-model="workWeekPlanCommand.workingDays[day.value].lunchEnd"
                                                label="form.lunchEnd" />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </template>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
            <GeneralButton color="cancelButtonColor" prependIcon="mdi-lock-reset" title="general.reset"
                @click="equalDto" :disabled="changeCount() == 0" variant="outlined" size="x-large">
            </GeneralButton>
            <GeneralButton prependIcon="mdi-content-save-outline" title="general.save" @click="updateWorkWeekPlan"
                :loading="loading" size="x-large" :disabled="changeCount() == 0">
            </GeneralButton>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { UpdateWorkWeekPlanCommand, WorkingDay } from '@/models/entities/management/ManagementCommands';
import { WorkingDayDetail, WorkWeekPlanDto } from '@/models/entities/management/ManagementDtos';
import { ref } from 'vue';
import { WorkWeekDayEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from '@/core/helpers/enumToArray';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import { useManagementCommandStore } from '@/stores/managementStores/managementCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import GeneralButton from '@/components/formInput/generalInputs/GeneralButton.vue';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const workWeekPlanCommand = ref(new UpdateWorkWeekPlanCommand());
const workWeekDayEnums = enumToArray(WorkWeekDayEnum);
const managementDtoStore = useManagementDtoStore();
const workWeekPlanDto = ref(new WorkWeekPlanDto());
const activeDay = ref(11);
const loading = ref(false);

const getWorkWeekPlanFunc = () => {
    loading.value = true;
    managementDtoStore.getWorkWeekPlan().then((res: any) => {
        workWeekPlanDto.value = res;
        workWeekPlanDto.value.workingDayDetails.forEach((x) => {
            if (x.isWorking) {
                x.shiftStart = x.shiftStart.slice(0, 5)
                x.shiftEnd = x.shiftEnd.slice(0, 5)
                x.lunchStart = x.lunchStart.slice(0, 5)
                x.lunchEnd = x.lunchEnd.slice(0, 5)
            }
        })
        equalDto();
    }).catch((error) => {
        return catchError(error, () => { updateWorkWeekPlan() })
    }).finally(() => {
        loading.value = false;
    });
}
getWorkWeekPlanFunc();

const updateWorkWeekPlan = () => {
    loading.value = true;
    useManagementCommandStore().updateWorkWeekPlan(workWeekPlanCommand.value).then(() => {
        getWorkWeekPlanFunc();
    }).catch((error) => {
        return catchError(error, () => { updateWorkWeekPlan() })
    }).finally(() => {
        loading.value = false;
    });
}

const dateTimes = ref(
    Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2).toString().padStart(2, '0');
        const minute = (i % 2 === 0 ? '00' : '30');
        return `${hour}:${minute}`;
    })
);

const equalDto = () => {
    Object.entries(workWeekPlanDto.value).forEach(([key, value]) => {
        if (key == "workingDayDetails") {
            workWeekPlanDto.value.workingDayDetails.forEach((x: WorkingDayDetail) => {
                workWeekPlanCommand.value.workingDays[x.dayOfWeek] = JSON.parse(JSON.stringify(x));
            });
        }
        if (workWeekPlanCommand.value.hasOwnProperty(key)) {
            workWeekPlanCommand.value[key] = JSON.parse(JSON.stringify(value));
        }
    });
}

const changeCount = () => {
    let count = 0;
    if (workWeekPlanDto.value.id)
        Object.entries(workWeekPlanDto.value).forEach(([key, value]) => {
            if (key == "workingDayDetails") {
                workWeekPlanDto.value.workingDayDetails.forEach((x: WorkingDayDetail) => {
                    const workingDay = workWeekPlanCommand.value.workingDays[x.dayOfWeek];
                    Object.entries(x).forEach(([key, value]) => {
                        if (workingDay.hasOwnProperty(key) && workingDay[key] != value) {
                            count++;
                        }
                    });
                });
            }
            if (workWeekPlanCommand.value.hasOwnProperty(key) && workWeekPlanCommand.value[key] != value) {
                count++;
            }
        });
    return count;
}


</script>
