<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row>
                <v-col cols="12" align="end">
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.requestVacation" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <AddVacationDialog :employeeId="userInfo.employeeId"
                                :dialogClose="() => { isActive.value = false }"
                                @createdItem="getEmployeeVacation($event)" />
                        </template>
                    </VDialogContent>
                </v-col>
            </v-row>
            <v-row class="fill-height">
                <v-col cols="12">
                    <VacationListTablePageToProfile :loading="loading" :tableData="employeeLeaveList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import VacationListTablePageToProfile from "@/components/list/dataTables/VacationListTablePageToProfile.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import type { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import { userInfo } from '@/core/helpers/localStorageManagement';
import AddVacationDialog from "@/components/dialogs/humanResources/AddVacationDialog.vue";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { employeeLeaveList, loading } = storeToRefs(useLeaveStore());
employeeLeaveList.value = {} as PaginatedList<EmployeeLeaveListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;
initListQuery.value.employeeId = userInfo.value.employeeId;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    useLeaveStore().getLeaveForEmployee(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});

const getEmployeeVacation = (item: EmployeeLeaveListDto) => {
    if (item.id) {
        employeeLeaveList.value.items?.unshift(item);
        employeeLeaveList.value.totalCount += 1
    }
}

</script>