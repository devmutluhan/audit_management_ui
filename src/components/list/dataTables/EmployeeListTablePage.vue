<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @rowDoubleClicked="(item) => { router.push({ name: 'employee-detail', params: { id: item.id } }) }"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:avatar="{ row: data }">
            <router-link :to="{ name: 'employee-detail', params: { id: data.id } }">
                <ImageCard :first-value="data.firstName" :second-value="data.lastName" color="red"
                    :avatarText="data.avatarUrl" :rounded="isMobileDevice() ? 'lg' : 'circle'" />
            </router-link>
        </template>
        <template v-slot:fullName="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'employee-detail', params: { id: data.id } }">
                {{ data.firstName + ' ' + data.lastName }}
            </router-link>
        </template>
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="menuItems" :routeId="data.id" :data="data"></GeneralDropdown>
        </template>
    </Datatable>

    <VDialogContent v-model="addExpenseDialog">
        <AddExpenseDialog :employeeId="selectedEmployee.id" :dialogClose="() => { addExpenseDialog = false }" />
    </VDialogContent>
    <VDialogContent v-model="addVacationDialog">
        <AddVacationDialog :employeeId="selectedEmployee.id" :dialogClose="() => { addVacationDialog = false }" />
    </VDialogContent>
    <VDialogContent v-model="addAdvanceDialog">
        <AddAdvanceDialog :employeeId="selectedEmployee.id" :dialogClose="() => { addAdvanceDialog = false }" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { EmployeeListDto } from "@/models/entities/humanResource/EmployeeDtos";
import type { PaginatedList } from "@/models/ApiResult";
import { employeeDepartmentColumnFilter, employeeFullNameColumnFilter, employeePositionColumnFilter, mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import AddExpenseDialog from "@/components/dialogs/humanResources/AddExpenseDialog.vue";
import AddVacationDialog from "@/components/dialogs/humanResources/AddVacationDialog.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import router from "@/router";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { isMobileDevice } from "@/assets/ts/_utils";
import AddAdvanceDialog from "@/components/dialogs/humanResources/AddAdvanceDialog.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change'])

const props = defineProps<{
    tableData: PaginatedList<EmployeeListDto>;
    loading: boolean;
}>();

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatar",
        columnWidth: 30
    },
    employeeFullNameColumnFilter,
    employeePositionColumnFilter,
    employeeDepartmentColumnFilter,
    {
        columnName: 'general.phoneNumber',
        columnLabel: "workPhone",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'general.email',
        columnLabel: "workEmail",
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

const addExpenseDialog = ref(false);
const addVacationDialog = ref(false);
const addAdvanceDialog = ref(false);
const selectedEmployee = ref(new EmployeeListDto());

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.detailView",
        to: "employee-detail",
        isVisible: true,
    },
    {
        title: "general.addVacation",
        action: (item: EmployeeListDto) => {
            selectedEmployee.value = item;
            addVacationDialog.value = true;
        },
        isVisible: hasClaimOrModules(['ManageLeave']),
    },
    {
        title: "general.addPermission",
        action: (item: EmployeeListDto) => {
            selectedEmployee.value = item;
            addExpenseDialog.value = true;
        },
        isVisible: hasClaimOrModules(['ManagePayment'])
    },
    {
        title: "general.addAdvance",
        action: (item: EmployeeListDto) => {
            selectedEmployee.value = item;
            addAdvanceDialog.value = true;
        },
        isVisible: hasClaimOrModules(['ManagePayment'])
    },
]);

</script>