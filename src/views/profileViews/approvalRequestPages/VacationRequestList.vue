<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col cols="12">
                    <VacationApprovalRequestListTablePage :tableData="leaveApprovalRequestList" :loading="loading"
                        @approveLeave="approveLeave"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import VacationApprovalRequestListTablePage from "@/components/list/dataTables/VacationApprovalRequestListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import type { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";

const { leaveApprovalRequestList, loading } = storeToRefs(useLeaveStore());
leaveApprovalRequestList.value = {} as PaginatedList<EmployeeLeaveListDto>;

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

    useLeaveStore().getLeaveApprovalRequests(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});


const approveLeave = (id: string) => {
    if (leaveApprovalRequestList.value.items) {
        const index = leaveApprovalRequestList.value.items.findIndex((a) => a.id == id)
        if (index != -1)
            leaveApprovalRequestList.value.items?.splice(index, 1)
    }
};


</script>