<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <v-dialog width="800">
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.addExpense" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <SelectEmployeeDialog :dialogClose="() => { isActive.value = false }" type="expense"
                                @createItem="isChange(activeFilters)" />
                        </template>
                    </v-dialog>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <ExpenseListTablePage :loading="loading" :tableData="expenseList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ExpenseListTablePage from "@/components/list/dataTables/ExpenseListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import type { ExpenseListDto } from "@/models/entities/humanResource/ExpenseDtos";
import SelectEmployeeDialog from "@/components/dialogs/humanResources/SelectEmployeeDialog.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { expenseList, loading } = storeToRefs(useExpenseStore());

expenseList.value = {} as PaginatedList<ExpenseListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    useExpenseStore().getExpenseList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});


</script>
