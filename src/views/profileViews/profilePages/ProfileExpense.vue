<template>

    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row>
                <v-col cols="12" align="end">
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.requestExpense" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <AddExpenseDialog :employeeId="userInfo.employeeId"
                                :dialogClose="() => { isActive.value = false }" @createdItem="getEmployeeExpense()" />
                        </template>
                    </VDialogContent>
                </v-col>
            </v-row>
            <v-row class="fill-height">
                <v-col cols="12">
                    <ExpenseListTablePageToProfile :loading="loading" :tableData="expenseList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import { userInfo } from "@/core/helpers/localStorageManagement";
import AddExpenseDialog from "@/components/dialogs/humanResources/AddExpenseDialog.vue";
import ExpenseListTablePageToProfile from "@/components/list/dataTables/ExpenseListTablePageToProfile.vue";
import type { PaginatedList } from "@/models/ApiResult";
import type { ExpenseListDto } from "@/models/entities/humanResource/ExpenseDtos";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { expenseList } = storeToRefs(useExpenseStore());
expenseList.value = {} as PaginatedList<ExpenseListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;
initListQuery.value.employeeId = userInfo.value.employeeId;

const loading = ref(false)
const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    loading.value = true
    useExpenseStore().getExpenseList(listQuery.value).finally(() => {
        loading.value = false
    })
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});

const getEmployeeExpense = () => {
    loading.value = true
    useExpenseStore().getExpenseList({ employeeId: userInfo.value.employeeId, pageNumber: 1, pageSize: 1000 }).then((res) => {
        isChange(activeFilters.value);
    }).catch((error) => {
        return catchError(error, () => { getEmployeeExpense() })
    }).finally(() => {
        loading.value = false
    })
}

</script>