<template>
    <Datatable :data="employeeExperience" :header="tableHeader" :enable-items-per-page-dropdown="false"
        :checkbox-enabled="false" :loading="loading">
        <template v-slot:manager="{ row: data }">
            {{ data.manager ? data.manager.firstName + ' ' + data.manager.lastName : '' }}
        </template>
        <template v-slot:positions="{ row: data }">
            {{data.positions ? data.positions.find((x: PositionDto) => x.isDefault)?.name : ''}}
        </template>
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="menuItems" :data="data" :routeId="data.id"></GeneralDropdown>
        </template>
    </Datatable>
    <VDialogContent v-model="updateDialog">
        <UpdateExperienceDialog :selectedItem="selectedItem" :dialogClose="() => { updateDialog = false }" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref } from "vue";
import { useEmployeeDtoStore } from "@/stores/humanResourcesStores/employeeDtoStore";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { enumToArray } from "@/core/helpers/enumToArray";
import { EmploymentTypeEnum } from "@/models/custom/EnumTypes";
import { formatterDate } from "@/core/helpers/dateUtils";
import { EmployeeExperienceDto, PositionDto } from "@/models/entities/humanResource/EmployeeDtos";
import { useEmployeeCommandStore } from "@/stores/humanResourcesStores/employeeCommandStore";
import { catchError } from "@/core/helpers/generalResponse";
import UpdateExperienceDialog from "@/components/dialogs/humanResources/UpdateExperienceDialog.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
const route = useRoute();
const { employeeExperience, loading } = storeToRefs(useEmployeeDtoStore());
useEmployeeDtoStore().getEmployeeExperience(route.params.id.toString());

const tableHeader = ref([
    {
        columnName: "form.startDate",
        columnLabel: "startDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: any) => {
            return value.startDate ? formatterDate(value.startDate) : '-'
        },
    },
    {
        columnName: "form.endDate",
        columnLabel: "endDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: any) => {
            return value.endDate ? formatterDate(value.endDate) : '-'
        },
    },
    {
        columnName: "form.employmentType",
        columnLabel: "employmentType",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: any) => {
            return enumToArray(EmploymentTypeEnum).find((x) => x.value === value.employmentType)?.title;
        },
    },
    {
        columnName: "list.manager",
        columnLabel: "manager",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.companyBranch",
        columnLabel: "companyBranch.name",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.department",
        columnLabel: "department.name",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.position",
        columnLabel: "positions",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

const updateDialog = ref(false);
const selectedItem = ref(new EmployeeExperienceDto());

const deleteEmployeeExperience = (item: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useEmployeeCommandStore().deleteEmployeeExperience(route.params.id.toString(), item.id).then(() => {
        employeeExperience.value = employeeExperience.value.filter((x: any) => x.id != item.id)
    }).catch((error) => {
        return catchError(error, () => deleteEmployeeExperience(item));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.edit",
        action: (item: EmployeeExperienceDto) => {
            updateDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteEmployeeExperience,
        },
    },
]);

</script>