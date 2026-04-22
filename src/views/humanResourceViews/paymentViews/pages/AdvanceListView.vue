<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <v-dialog width="800">
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.addAdvance" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <SelectEmployeeDialog :dialogClose="() => { isActive.value = false }" type="advance"
                                @createItem="isChange(activeFilters)" />
                        </template>
                    </v-dialog>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <AdvanceListTablePage :loading="loading" :tableData="advanceList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import AdvanceListTablePage from "@/components/list/dataTables/AdvanceListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { usePaymentStore } from "@/stores/humanResourcesStores/paymentStore";
import SelectEmployeeDialog from "@/components/dialogs/humanResources/SelectEmployeeDialog.vue";
import type { AdvanceListDto } from "@/models/entities/humanResource/PaymentModels";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { advanceList, loading } = storeToRefs(usePaymentStore());

advanceList.value = {} as PaginatedList<AdvanceListDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    usePaymentStore().getAdvanceList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});


</script>
