<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton v-if="hasClaimOrModules(['ManageEmployee'])" title="general.createEmplotee"
                        :to="{ name: 'employee-create' }">
                    </PageTitleCreateButton>
                </template>
            </PageTitleTeleport>
            <v-row class="d-flex align-center">
                <v-col cols="7" sm="5" md="3">
                    <SingleSelectInput v-model="initListQuery.isTerminated" :items="isPassiveFilterItems"
                        item-title="title" item-value="value" inputLabel="general.activeOrTerminated" clearable
                        hide-details @update:model-value="isChange(activeFilters)"
                        @click-clear="initListQuery.isTerminated = null; isChange(activeFilters)" />
                </v-col>
            </v-row>
            <v-row class="fill-height">
                <v-col cols="12">
                    <EmployeeListTablePage :loading="loading" :tableData="employeeList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import EmployeeListTablePage from "@/components/list/dataTables/EmployeeListTablePage.vue";
import { useEmployeeDtoStore } from "@/stores/humanResourcesStores/employeeDtoStore";
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { EmployeeListDto } from "@/models/entities/humanResource/EmployeeDtos";
import type { PaginatedList } from "@/models/ApiResult";
import SingleSelectInput from "@/components/formInput/generalInputs/SingleSelectInput.vue";
import i18n from "@/core/plugins/i18n";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
const t = i18n.global.t;

const { employeeList, loading } = storeToRefs(useEmployeeDtoStore());

employeeList.value = {} as PaginatedList<EmployeeListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.isTerminated = false;
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    useEmployeeDtoStore().getEmployeeList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});

const isPassiveFilterItems = ref([
    { title: t('general.activeEmployee'), value: false },
    { title: t('general.terminatedEmployee'), value: true }
]);


</script>