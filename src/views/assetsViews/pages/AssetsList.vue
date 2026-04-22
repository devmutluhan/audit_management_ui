<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent v-if="hasClaimOrModules(['ManageAsset'])">
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.createProduct" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <CreateAssetsDialog :dialogClose="() => { isActive.value = false }"
                                @create-item="assetsList.items?.unshift($event); assetsList.totalCount += 1" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <AssetsListTablePage :tableData="assetsList" @deleteAssets="deleteAssets($event)" :loading="loading"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import AssetsListTablePage from "@/components/list/dataTables/AssetsListTablePage.vue";
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useAssetsStore } from "@/stores/assetsStores/assetsStore";
import type { AssetsDto } from "@/models/entities/assets/AssetsModels";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import CreateAssetsDialog from "@/components/dialogs/assets/CreateAssetsDialog.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { assetsList, loading } = storeToRefs(useAssetsStore());
assetsList.value = {} as PaginatedList<AssetsDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useAssetsStore().getAssetsList(listQuery.value);
}
isChange()

const deleteAssets = (id: number) => {
    if (assetsList.value.items)
        assetsList.value.items = assetsList.value.items?.filter((x: any) => x.id !== id);
};

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>