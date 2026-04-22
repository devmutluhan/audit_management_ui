<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @rowDoubleClicked="(item) => { detailView(item) }" @page-change="emits('page-change', $event)">
        <template v-slot:avatarUrl="{ row: data }">
            <ImageCard :first-value="data.employee.firstName" :second-value="data.employee.lastName" color="red"
                :avatarText="data.employee.avatarUrl" rounded="circle" />
        </template>
        <!--&& hasClaimOrModules(['ManageOffer']) -->
        <template v-slot:actions="{ row: data }" v-if="menuItems">
            <GeneralDropdown :data="data" :menuItems="menuItems">
            </GeneralDropdown>
        </template>
    </Datatable>
    <VDialogContent v-model="previewVacationDialog">
        <PreviewEmployeeVacation :dialogClose="() => { previewVacationDialog = false }" :leave="selectedVacation"
            :isApprovalList="true" @leave="emits('approveLeave', $event)" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import PreviewEmployeeVacation from '@/components/dialogs/humanResources/PreviewEmployeeVacation.vue';
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ImageCard from '@/components/cards/ImageCard.vue';
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";

import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { catchError } from "@/core/helpers/generalResponse";
import { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'approveLeave']);

const props = defineProps<{
    tableData: PaginatedList<EmployeeLeaveListDto>;
    loading: boolean;
}>();

const previewVacationDialog = ref(false);
const selectedVacation = ref(new EmployeeLeaveListDto());

const approveFunc = (data: EmployeeLeaveListDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useLeaveStore().approveLeave(data.id).then(() => {
        emits('approveLeave', data.id);
    }).catch((error) => {
        return catchError(error, () => { approveFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const rejectFunc = (data: EmployeeLeaveListDto) => {
    const reason = menuItems.value[2].confirmModalValue?.descriptionField ? menuItems.value[2].confirmModalValue?.descriptionField : ''
    menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = true : '';
    useLeaveStore().rejectLeave(data.id, reason).then(() => {
        emits('approveLeave', data.id);
    }).catch((error) => {
        return catchError(error, () => { rejectFunc(data) })
    }).finally(() => {
        menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = false : '';
    });
}

const detailView = (item) => {
    selectedVacation.value = item;
    previewVacationDialog.value = true
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.detailView",
        action: detailView
    },
    {
        title: "general.approve",
        action: approveFunc
    },
    {
        title: "general.reject",
        confirmModalValue: {
            title: 'general.reject',
            text: "general.rejectDescription",
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: rejectFunc
        },
    }
]);


onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatarUrl",
        columnWidth: 30
    },
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
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
]);

</script>