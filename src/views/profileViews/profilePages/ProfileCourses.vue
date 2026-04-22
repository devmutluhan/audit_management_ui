<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <Datatable :data="trainingAssignmentsList.items ?? []" :header="tableHeader" :loading="loading"
                :enable-items-per-page-dropdown="false" :checkbox-enabled="false">
                <template v-slot:status="{ row: data }">
                    <v-chip class="font-weight-bold" :color="getChipColor(data.status)">
                        {{enumToArray(TrainingStatusEnum).find((a) => a.value ==
                            data.status)?.title}}
                    </v-chip>
                </template>
                <template v-slot:rating="{ row: data }">
                    <span
                        :class="data.rating >= 1 && data.rating < 4 ? 'text-error' : data.rating >= 4 && data.rating < 7 ? 'text-warning' : 'text-success'">
                        {{ data.rating }}
                    </span>
                </template>
            </Datatable>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTrainingStore } from "@/stores/humanResourcesStores/trainingStore";
import { TrainingStatusEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import type { TrainingAssignmentsDto } from "@/models/entities/humanResource/TrainingModels";
import { formatterDate } from "@/core/helpers/dateUtils";

import { userInfo } from '@/core/helpers/localStorageManagement';

const employeeDetail = userInfo.value.employeeDetail;

const { trainingAssignmentsList, loading } = storeToRefs(useTrainingStore());
useTrainingStore().getTrainingAssignments({ pageSize: 1000, pageNumber: 1, employeeId: employeeDetail.id })

const tableHeader = ref([
    {
        columnName: "list.trainingName",
        columnLabel: "trainingName",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.completedDate",
        columnLabel: "completedDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: TrainingAssignmentsDto) => {
            return formatterDate(value.completedDate)
        }
    },
    {
        columnName: "list.description",
        columnLabel: "description",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "list.status",
        columnLabel: "status",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.rating",
        columnLabel: "rating",
        columnWidth: 175,
        filterEnabled: false,
    }
]);

const getChipColor = (status: TrainingStatusEnum) => {
    if (TrainingStatusEnum.CancelledTraining == status || TrainingStatusEnum.NotAttended == status)
        return 'error'
    else if (TrainingStatusEnum.CompletedTraining == status)
        return 'success'
    else
        return 'warning'
}


</script>