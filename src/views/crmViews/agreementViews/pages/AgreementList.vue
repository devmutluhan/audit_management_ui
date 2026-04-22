<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col cols="12">
                    <AgreementListTablePage :tableData="agreementList" :loading="loading"
                        @cancelAgreement="cancelAgreement"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import AgreementListTablePage from "@/components/list/dataTables/AgreementListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import type { PaginatedList } from "@/models/ApiResult";
import { useAgreementStore } from "@/stores/crmStores/agreementStore";
import type { AgreementListDto } from "@/models/entities/crm/CrmAgreementDtos";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";

const { agreementList, loading } = storeToRefs(useAgreementStore());
agreementList.value = {} as PaginatedList<AgreementListDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useAgreementStore().getAgreementList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

const cancelAgreement = (item: AgreementListDto) => {
    if (agreementList.value.items) {
        const index = agreementList.value.items.findIndex((a) => { a.id == item.id })
        if (index != -1)
            agreementList.value.items[index].status = ApprovementStatusEnum.Cancelled;
    }
}


</script>