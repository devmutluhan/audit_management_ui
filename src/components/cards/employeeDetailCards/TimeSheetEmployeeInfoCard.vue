<template>
    <v-card class="w-100" color="transparent">
        <v-card-text class="fill-height d-flex align-center">
            <v-row class="d-flex align-center">
                <v-col cols="12" sm="auto" class="py-1" align="start">
                    <ImageCard size="110" font-size="30px" :first-value="employeeDetail.firstName"
                        style="border: 3px solid green;" :second-value="employeeDetail.lastName"
                        :avatar-text="employeeDetail.avatarUrl" rounded="circle" />
                </v-col>
                <v-col cols="12" sm="9">
                    <v-row>
                        <v-col class="py-0  mb-2" cols="12">
                            <p class="ma-0 d-flex align-center">
                                <span class="text-h5 font-weight-bold mr-2">{{ employeeDetail.fullName }}</span>
                                <span class="text-body-1 font-weight-bold mr-2">
                                    ( {{ moment().week() - 1 + '. ' + $t('enums.Week') }} )
                                </span>
                                <span class="ma-0 text-error d-flex align-center" v-if="isChangeValues">
                                    <v-icon size="15" class="mr-2" color="error">mdi-information</v-icon>
                                    {{ $t('statusCode.refreshPage') }}
                                </span>
                            </p>
                        </v-col>
                        <v-col cols="9" class="py-0" sm="auto">
                            <p class="text-body-1 font-weight-bold ma-0">
                                <span>{{ $t('list.totalWorkingHours') + ': ' }}</span>
                                <span class="text-primary">
                                    {{ timeSheetWeek.totalWorkingHours + ' ' + $t('enums.Hour') }}
                                </span>
                            </p>
                            <p class="text-body-1 font-weight-bold ma-0">
                                <span>{{ $t('list.totalOvertimeHours') + ': ' }}</span>
                                <span class="text-primary">
                                    {{ timeSheetWeek.totalOvertimeHours + ' ' + $t('enums.Hour') }}
                                </span>
                            </p>
                            <p class="text-body-1 font-weight-bold ma-0">
                                <span>{{ $t('list.enteredWorkingHours') + ': ' }}</span>
                                <span class="text-primary">
                                    {{ timeSheetWeek.enteredWorkingHours + ' ' + $t('enums.Hour') }}
                                </span>
                            </p>
                            <p class="text-body-1 font-weight-bold ma-0">
                                <span>{{ $t('list.remainingWorkingHours') + ': ' }}</span>
                                <span class="text-primary">
                                    {{ timeSheetWeek.remainingWorkingHours + ' ' + $t('enums.Hour') }}
                                </span>
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="3" sm="auto">
                            <v-chip class="font-weight-bold" :color="getChipColor(timeSheetWeek.status)">
                                {{enumToArray(WeekStatusEnum).find((a) => a.value ==
                                    timeSheetWeek.status)?.title}}
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { userInfo } from "@/core/helpers/localStorageManagement";
import { enumToArray } from "@/core/helpers/enumToArray";
import moment from "moment";
import { WeekStatusEnum } from "@/models/custom/EnumTypes";
import ImageCard from "../ImageCard.vue";
import type { PropType } from 'vue';
import type { GetTimeSheetDto } from "@/models/entities/crm/CrmTimeSheetModels";

const employeeDetail = userInfo.value.employeeDetail;

const props = defineProps({
    timeSheetWeek: {
        type: Object as PropType<GetTimeSheetDto>,
        required: true
    },
    isChangeValues: {
        type: Boolean,
        required: false,
        default: false
    },
});

const getChipColor = (status: Number) => {
    if (WeekStatusEnum.Open == status)
        return 'warning'
    else if (WeekStatusEnum.Closed == status)
        return 'error'
    else if (WeekStatusEnum.OpenByManager == status)
        return 'success'
    else
        return 'red'
}

</script>