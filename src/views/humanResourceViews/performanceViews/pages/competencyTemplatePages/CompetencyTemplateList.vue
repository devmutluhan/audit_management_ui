<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton v-if="hasClaimOrModules(['ManagePerformance'])"
                        title="general.createCompetencyTemplate" :to="{ name: 'competency-template-create' }">
                    </PageTitleCreateButton>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <CompetencyTemplateListTablePage :tableData="competencyTemplateDropdownList" :loading="loading"
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
import { usePerformanceDtoStore } from "@/stores/humanResourcesStores/performanceDtoStore";
import type { CompetencyTemplateDropdownDto } from "@/models/entities/humanResource/PerformanceDtos";
import CompetencyTemplateListTablePage from "@/components/list/dataTables/CompetencyTemplateListTablePage.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { competencyTemplateDropdownList, loading } = storeToRefs(usePerformanceDtoStore());
competencyTemplateDropdownList.value = {} as PaginatedList<CompetencyTemplateDropdownDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    usePerformanceDtoStore().getCompetencyTemplateDropdownList(listQuery.value);
}
isChange()

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>