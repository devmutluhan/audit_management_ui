<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col cols="12">
                    <AdvanceApprovalRequestListTablePage :tableData="advanceApprovalRequestList" :loading="loading"
                        @approveAdvance="approveAdvance"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import AdvanceApprovalRequestListTablePage from "@/components/list/dataTables/AdvanceApprovalRequestListTablePage.vue";
import { usePaymentStore } from "@/stores/humanResourcesStores/paymentStore";
import type { AdvanceApprovalRequestListDto } from "@/models/entities/humanResource/PaymentModels";

const { advanceApprovalRequestList, loading } = storeToRefs(usePaymentStore());
advanceApprovalRequestList.value = {} as PaginatedList<AdvanceApprovalRequestListDto>;

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

    usePaymentStore().getAdvanceApprovalRequestList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});


const approveAdvance = (id: string) => {
    if (advanceApprovalRequestList.value.items) {
        const index = advanceApprovalRequestList.value.items.findIndex((a) => a.id == id)
        if (index != -1)
            advanceApprovalRequestList.value.items.splice(index, 1)
    }
};


</script>