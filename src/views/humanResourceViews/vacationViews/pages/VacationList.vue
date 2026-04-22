<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <v-dialog width="800">
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.addVacation" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <SelectEmployeeDialog :dialogClose="() => { isActive.value = false }" type="vacation"
                                @createItem="getEmployeeVacation($event)" />
                        </template>
                    </v-dialog>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <VacationListTablePage :loading="loading" :tableData="employeeLeaveList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import VacationListTablePage from "@/components/list/dataTables/VacationListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import type { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import SelectEmployeeDialog from "@/components/dialogs/humanResources/SelectEmployeeDialog.vue"
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { employeeLeaveList, loading } = storeToRefs(useLeaveStore());
employeeLeaveList.value = {} as PaginatedList<EmployeeLeaveListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

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