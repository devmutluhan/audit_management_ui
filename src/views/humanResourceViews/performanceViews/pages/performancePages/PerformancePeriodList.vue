<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton v-if="hasClaimOrModules(['ManagePerformance'])"
                                title="general.createPerformancePeriod" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <CreatePerformancePeriodDialog :dialogClose="() => { isActive.value = false }" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <PerformancePeriodListTablePage :tableData="periodList"
                        @deletePerformance="deletePerformancePeriod($event)" :loading="loading"
                        @update-dialog="selectedItem = $event; updateDialog = true"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { usePerformanceDtoStore } from "@/stores/humanResourcesStores/performanceDtoStore";
import { PeriodDto } from "@/models/entities/humanResource/PerformanceDtos";
import PerformancePeriodListTablePage from "@/components/list/dataTables/PerformancePeriodListTablePage.vue";
import CreatePerformancePeriodDialog from "@/components/dialogs/humanResources/CreatePerformancePeriodDialog.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { periodList, loading } = storeToRefs(usePerformanceDtoStore());
periodList.value = {} as PaginatedList<PeriodDto>;
const updateDialog = ref(false);
const selectedItem = ref(new PeriodDto())

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    usePerformanceDtoStore().getPeriodList(listQuery.value);
}
isChange()

const deletePerformancePeriod = (id: number) => {
    if (periodList.value.items)
        periodList.value.items = periodList.value.items?.filter((x: any) => x.id !== id);
};

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>