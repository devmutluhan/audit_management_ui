<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col> -->
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton v-bind="activatorProps"></PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <AddDepartmentDialog :dialogClose="() => { isActive.value = false }" @createItem="" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col>
                    <Datatable :isHeadRowFilter="true" :data="initTableData" :header="tableHeader"
                        :enable-items-per-page-dropdown="true" :loading="loading">
                        <template v-slot:leaveApprovalProcess="{ row: data }">
                            <v-icon :color="data.leaveApprovalProcessId ? 'success' : 'error'"> {{
                                data.leaveApprovalProcessId ? 'mdi-check' : 'mdi-close' }} </v-icon>
                        </template>
                        <template v-slot:expenseApprovalProcess="{ row: data }">
                            <v-icon :color="data.expenseApprovalProcessId ? 'success' : 'error'"> {{
                                data.expenseApprovalProcessId ? 'mdi-check' : 'mdi-close' }} </v-icon>
                        </template>
                        <template v-slot:advanceApprovalProcess="{ row: data }">
                            <v-icon :color="data.advanceApprovalProcessId ? 'success' : 'error'"> {{
                                data.advanceApprovalProcessId ? 'mdi-check' : 'mdi-close' }} </v-icon>
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <VDialogContent v-model="updateDialog">
        <UpdateDepartmentDialog :selectedItem="selectedItem" :dialogClose="() => { updateDialog = false }" />
    </VDialogContent>
</template>

<script lang="ts" setup>

import { ref, watch } from "vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { useManagementCommandStore } from "@/stores/managementStores/managementCommandStore";
import { useManagementDtoStore } from "@/stores/managementStores/managementDtoStore";
import { ActiveFiltersType, FilterItemsType, FilterItemTypeEnum, FilterOptionType, type GeneralDropdownType } from "@/models/types";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import { catchError } from "@/core/helpers/generalResponse";
import { storeToRefs } from "pinia";
import { clientFilter } from "@/core/helpers/generalUtils";
import { onMounted } from "vue";
import AddDepartmentDialog from "@/components/dialogs/humanResources/AddDepartmentDialog.vue";
import UpdateDepartmentDialog from "@/components/dialogs/humanResources/UpdateDepartmentDialog.vue";
import { DepartmentDto } from "@/models/entities/management/ManagementCommands";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { departmentList, loading } = storeToRefs(useManagementDtoStore())
useManagementDtoStore().getDepartmentList({ pageNumber: 1, pageSize: 10000 });

const selectedItem = ref(new DepartmentDto());
const updateDialog = ref(false);

const tableHeader = ref([
    {
        columnName: 'form.title',
        columnLabel: "name",
        sortEnabled: true,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "name",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                searchFunc(prop[0])
            },
        } as FilterOptionType,
    },
    {
        columnName: 'form.leaveApprovalProcess',
        columnLabel: "leaveApprovalProcess",
        sortEnabled: false,
    },
    {
        columnName: 'form.expenseApprovalProcess',
        columnLabel: "expenseApprovalProcess",
        sortEnabled: false,
    },
    {
        columnName: 'form.advanceApprovalProcessCard',
        columnLabel: "advanceApprovalProcess",
        sortEnabled: false,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
])

const initTableData = ref(new Array<DepartmentDto>())

onMounted(() => {
    initTableData.value = departmentList.value;
})

watch(() => departmentList.value.length, () => {
    initTableData.value = departmentList.value
})

const searchFunc = (filter: ActiveFiltersType) => {
    if (filter.field !== undefined || filter.value !== undefined) {
        initTableData.value = clientFilter(departmentList.value, filter.field, filter.value);
    } else {
        initTableData.value = departmentList.value
    }
}


const deleteFunc = (data: DepartmentDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useManagementCommandStore().deleteDepartment(data.id).then(() => {
        departmentList.value = departmentList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: any) => {
            selectedItem.value = item
            updateDialog.value = true
        },
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
]);
</script>