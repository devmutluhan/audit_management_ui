<template>
    <Datatable :data="employeeSalaries" :header="tableHeader" :enable-items-per-page-dropdown="true" :loading="loading">
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="menuItems" :data="data"></GeneralDropdown>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref } from "vue";

import { useEmployeeDtoStore } from "@/stores/humanResourcesStores/employeeDtoStore";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";
import { formatterDate } from "@/core/helpers/dateUtils";
import { useEmployeeCommandStore } from "@/stores/humanResourcesStores/employeeCommandStore";
import { PayPeriodTypeEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { catchError } from "@/core/helpers/generalResponse";
import type { EmployeeSalaryDto } from "@/models/entities/humanResource/EmployeeDtos";
const payPeriods = enumToArray(PayPeriodTypeEnum);
import i18n from "@/core/plugins/i18n";
const t = i18n.global.t;

const route = useRoute();
const { employeeSalaries, loading } = storeToRefs(useEmployeeDtoStore());

const tableHeader = ref([
    {
        columnName: "form.effectiveOn",
        columnLabel: "effectiveOn",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return formatterDate(value.effectiveOn)
        },
    },
    {
        columnName: "form.amount",
        columnLabel: "amount",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return formatterPriceForCurrencyName(value.amount, value.currency);
        },
    },
    {
        columnName: "form.isMinimumWage",
        columnLabel: "isMinimumWage",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return value.isMinimumWage ? t('general.yes') : t('general.no')
        }
    },
    {
        columnName: "list.grossOrNet",
        columnLabel: "isGross",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return value.isGross ? t('list.gross') : t('list.net')
        }
    },
    {
        columnName: "form.payPeriod",
        columnLabel: "payPeriod",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return payPeriods.find((x: any) => x.value == value.payPeriod)?.title ?? ''
        }
    },
    {
        columnName: "form.createdAt",
        columnLabel: "createdAt",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeSalaryDto) => {
            return formatterDate(value.createdAt)
        },
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

useEmployeeDtoStore().getEmployeeSalaries(route.params.id.toString());

const deleteEmployeeSalary = (salary: any) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useEmployeeCommandStore().deleteEmployeeSalary(route.params.id.toString(), salary.id).then(() => {
        employeeSalaries.value.splice(employeeSalaries.value.findIndex((x: any) => x.id == salary.id), 1)
    }).catch((error) => {
        return catchError(error, () => deleteEmployeeSalary(salary))
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteEmployeeSalary,
        },
    },
]);

</script>