<template>
    <v-col>
        <v-row>
            <v-col cols="12" class="pt-12">
                <v-row class="d-flex align-center">
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <!-- <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="flat" prepend-icon="mdi-plus">
                                    {{ $t('form.assignTraining') }}
                                </v-btn>
                            </template>

<template v-slot:default="{ isActive }">
                                <AddTrainingToEmployeeDialog :dialogClose="() => { isActive.value = false }"
                                    @create-item="trainingAssignmentsList.items?.unshift($event)" />
                            </template>
</VDialogContent> -->
                    </v-col>
                </v-row>
            </v-col>
            <!-- <VDialogContent v-model="updateDialog">
                <AddTrainingToEmployeeDialog :dialogClose="() => { updateDialog = false }" :selectedItem="selectedItem" />
            </VDialogContent> -->
        </v-row>
        <v-row style="height: 50vh;">
            <v-col class="fill-height">
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
                    <template v-slot:actions="{ row: data }">
                        <GeneralDropdown :menuItems="menuItems" :data="data"></GeneralDropdown>
                    </template>
                </Datatable>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref } from "vue";
import AddTrainingToEmployeeDialog from "@/components/dialogs/humanResources/AddTrainingToEmployeeDialog.vue"
import { storeToRefs } from "pinia";
import { useTrainingStore } from "@/stores/humanResourcesStores/trainingStore";
import { useRoute } from "vue-router";
import { TrainingStatusEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { TrainingAssignmentsDto } from "@/models/entities/humanResource/TrainingModels";
import { catchError } from "@/core/helpers/generalResponse";
import { formatterDate } from "@/core/helpers/dateUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const route = useRoute();
const updateDialog = ref(false);
const selectedItem = ref(new TrainingAssignmentsDto())
const { trainingAssignmentsList, loading } = storeToRefs(useTrainingStore());
useTrainingStore().getTrainingAssignments({ pageSize: 1000, pageNumber: 1, employeeId: route.params.id.toString() })

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
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

const deleteFunc = (item: TrainingAssignmentsDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useTrainingStore().deleteTrainingAssignments(item.trainingId, item.id).then((res) => {
        if (trainingAssignmentsList.value.items) {
            trainingAssignmentsList.value.items = trainingAssignmentsList.value.items.filter((a) => a.id != item.id);
        }
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(item) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    // {
    //     title: "general.update",
    //     action: (item: TrainingAssignmentsDto) => {
    //         selectedItem.value = item;
    //         updateDialog.value = true;
    //     }
    // },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
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