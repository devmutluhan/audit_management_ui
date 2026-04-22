<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @rowDoubleClicked="(item) => preview(item)"
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
            <GeneralDropdown :menuItems="filterMenuItems(data)" :data="data"></GeneralDropdown>
        </template>
    </Datatable>

    <VDialogContent v-model="updateVacationDialog">
        <UpdateVacationDialog :employeeId="selectedVacation.employeeId"
            :dialogClose="() => { updateVacationDialog = false }" :selectedItemId="selectedVacation.id"
            @updated="emits('page-change', 1)" />
    </VDialogContent>
    <VDialogContent v-model="previewVacationDialog">
        <PreviewEmployeeVacation :dialogClose="() => { previewVacationDialog = false }" :leave="selectedVacation" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import UpdateVacationDialog from '@/components/dialogs/humanResources/UpdateVacationDialog.vue';
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import ImageCard from "@/components/cards/ImageCard.vue";
import PreviewEmployeeVacation from "@/components/dialogs/humanResources/PreviewEmployeeVacation.vue";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { getChipColor } from "@/core/helpers/generalUtils";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { useLeaveStore } from '@/stores/humanResourcesStores/leaveStore';
import { catchError } from '@/core/helpers/generalResponse';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const emits = defineEmits(['on-items-per-page-change', 'page-change'])

const props = defineProps<{
    tableData: PaginatedList<EmployeeLeaveListDto>;
    loading: boolean;
}>();

const tableHeader = ref([
    {
        columnName: 'list.requester',
        columnLabel: "employee.fullName",
        sortEnabled: true,
        columnWidth: 175,
    },
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
    {
        columnName: 'form.status',
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});

const filterMenuItems = (item: EmployeeLeaveListDto): (GeneralDropdownType[]) => {
    if (item.status == ApprovementStatusEnum.Draft || item.status == ApprovementStatusEnum.SendBack) {
        return menuItems.value
    } else {
        return menuItems.value.filter((a) => a.id == 1)
    }
}

const updateVacationDialog = ref(false)
const previewVacationDialog = ref(false);
const selectedVacation = ref(new EmployeeLeaveListDto());

const preview = (item: EmployeeLeaveListDto) => {
    selectedVacation.value = item;
    previewVacationDialog.value = true;
}

// const update = (item: EmployeeLeaveListDto) => {
//     selectedVacation.value = item;
//     updateVacationDialog.value = true;
// }

// const sendApprove = (item: EmployeeLeaveListDto) => {
//     useLeaveStore().sendApproveLeave(item.id).then((res) => {
//         if (props.tableData.items) {
//             const index = props.tableData.items?.findIndex((a) => a.id == item.id);
//             if (index != -1) {
//                 props.tableData.items[index].status = ApprovementStatusEnum.Waiting;
//             }
//         }
//     }).catch((error) => {
//         return catchError(error, () => { sendApprove(item) })
//     })
// }

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.preview",
        action: preview,
    },
    // {
    //     id: 2,
    //     title: "general.update",
    //     action: update,
    // },
    // {
    //     id: 3,
    //     title: "general.sendForApproval",
    //     action: sendApprove,
    // }
]);

</script>