<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton v-if="hasClaimOrModules(['ManageTraining'])"
                                title="general.createTraining" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <TrainingCreate :dialogClose="() => { isActive.value = false }" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <TrainingListTablePage :tableData="trainingList" @deleteTraining="deleteTraining($event)"
                        :loading="loading" @update-dialog="selectedItem = $event; updateDialog = true"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
            <VDialogContent v-model="updateDialog">
                <TrainingCreate :dialogClose="() => { updateDialog = false }" :selected-item="selectedItem" />
            </VDialogContent>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import TrainingListTablePage from "@/components/list/dataTables/TrainingListTablePage.vue";
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useTrainingStore } from "@/stores/humanResourcesStores/trainingStore";
import { GetTrainingDto } from "@/models/entities/humanResource/TrainingModels";
import TrainingCreate from "./TrainingCreate.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { trainingList, loading } = storeToRefs(useTrainingStore());
trainingList.value = {} as PaginatedList<GetTrainingDto>;
const updateDialog = ref(false);
const selectedItem = ref(new GetTrainingDto())

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useTrainingStore().getTrainingList(listQuery.value);
}
isChange()

const deleteTraining = (id: number) => {
    if (trainingList.value.items)
        trainingList.value.items = trainingList.value.items?.filter((x: any) => x.id !== id);
};

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>