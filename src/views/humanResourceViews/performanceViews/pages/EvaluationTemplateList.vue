<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton v-if="hasClaimOrModules(['ManagePerformance'])"
                                title="general.createEvaluationTemplate" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <CreateEvaluationTemplateDialog :dialogClose="() => { isActive.value = false }"
                                @create-item="evaluationTempList.items?.unshift($event); evaluationTempList.totalCount += 1" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <EvaluationTemplateListTablePage :tableData="evaluationTempList" :loading="loading"
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
import type { EvaluationTemplateDto } from "@/models/entities/humanResource/PerformanceDtos";
import EvaluationTemplateListTablePage from "@/components/list/dataTables/EvaluationTemplateListTablePage.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import CreateEvaluationTemplateDialog from "@/components/dialogs/humanResources/CreateEvaluationTemplateDialog.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { evaluationTempList, loading } = storeToRefs(usePerformanceDtoStore());
evaluationTempList.value = {} as PaginatedList<EvaluationTemplateDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    usePerformanceDtoStore().getEvaluationTemplateList(listQuery.value);
}
isChange()

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>