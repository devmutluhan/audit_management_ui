<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col cols="12">
                    <ExpenseApprovalRequestListTablePage :tableData="expenseApprovalRequestList" :loading="loading"
                        @approveExpense="approveExpense"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ExpenseApprovalRequestListTablePage from "@/components/list/dataTables/ExpenseApprovalRequestListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import type { ExpenseApprovalRequestList } from "@/models/entities/humanResource/ExpenseDtos";

const { expenseApprovalRequestList, loading } = storeToRefs(useExpenseStore());
expenseApprovalRequestList.value = {} as PaginatedList<ExpenseApprovalRequestList>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;
initListQuery.value.includePastApprovals = false;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    initListQuery.value.includePastApprovals = false;
    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useExpenseStore().getExpenseApprovalRequestList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});


const approveExpense = (id: string) => {
    if (expenseApprovalRequestList.value.items) {
        const index = expenseApprovalRequestList.value.items.findIndex((a) => a.id == id)
        if (index != -1)
            expenseApprovalRequestList.value.items.splice(index, 1)
    }
};


</script>