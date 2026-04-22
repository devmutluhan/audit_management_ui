<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @rowDoubleClicked="(item) => { preview(item) }"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:avatarUrl="{ row: data }">
            <ImageCard :first-value="data.employee.firstName" :second-value="data.employee.lastName" color="red"
                :avatarText="data.employee.avatarUrl" rounded="circle" />
        </template>
        <template v-slot:status="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.status)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.status)?.title}}
            </v-chip>
        </template>
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="menuItems" :data="data"></GeneralDropdown>
        </template>
    </Datatable>

    <VDialogContent v-model="previewVacationDialog">
        <PreviewEmployeeVacation :dialogClose="() => { previewVacationDialog = false }" :leave="selectedVacation" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import type { PaginatedList } from "@/models/ApiResult";
import { approvementStatusColumnFilter, employeeFullNameColumnFilterForVacation, mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import ImageCard from "@/components/cards/ImageCard.vue";
import PreviewEmployeeVacation from "@/components/dialogs/humanResources/PreviewEmployeeVacation.vue";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { getChipColor } from "@/core/helpers/generalUtils";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change'])

const props = defineProps<{
    tableData: PaginatedList<EmployeeLeaveListDto>;
    loading: boolean;
}>();

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatarUrl",
        columnWidth: 30
    },
    employeeFullNameColumnFilterForVacation,
    {
        columnName: 'form.substitute',
        columnLabel: "replacementEmployee.fullName",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.vacationType',
        columnLabel: "leaveType.name",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.startDate',
        columnLabel: "startDate",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return formatterDateFromHours(value.startDate)
        },
    },
    {
        columnName: 'form.endDate',
        columnLabel: "endDate",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return formatterDateFromHours(value.endDate)
        },
    },
    {
        columnName: 'form.usedDays',
        columnLabel: "usedDays",
        sortEnabled: true,
        columnWidth: 175,
    },
    approvementStatusColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});


const previewVacationDialog = ref(false);
const selectedVacation = ref(new EmployeeLeaveListDto());
const preview = (item: EmployeeLeaveListDto) => {
    selectedVacation.value = item;
    previewVacationDialog.value = true;

}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.preview",
        action: preview,
    },
]);

</script>