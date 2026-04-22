<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @rowDoubleClicked="(item) => { router.push({ name: 'project-detail', params: { id: item.id } }) }"
        @page-change="emits('page-change', $event)">
        <template v-slot:projectCode="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'project-detail', params: { id: data.id } }">
                {{ data.projectCode }}
            </router-link>
        </template>
        <template v-slot:status="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.status)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.status)?.title}}
            </v-chip>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { onMounted, ref } from "vue";

import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { offerListCustomerColumnFilter, mountComponentForFilter, documentStatusColumnFilter, projectCodeColumnFilter, agreementListManagerColumnFilter, agreementListPartnerColumnFilter, offerListEmployeeColumnFilter, offerTotalAmountColumnFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { formatterPriceForCurrencyName, getChipColor } from "@/core/helpers/generalUtils";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { titleColumnFilter } from "@/core/data/readyFilterColumnObject";
import router from "@/router";
import type { ProjectListDto } from "@/models/entities/crm/CrmProjectDtos";

const emits = defineEmits(['on-items-per-page-change', 'page-change']);

const props = defineProps<{
    tableData: PaginatedList<ProjectListDto>;
    loading: boolean;
}>();

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    projectCodeColumnFilter,
    titleColumnFilter,
    offerListCustomerColumnFilter,
    offerListEmployeeColumnFilter,
    agreementListManagerColumnFilter,
    agreementListPartnerColumnFilter,
    {
        columnName: 'list.subTotal',
        columnLabel: "subTotal",
        valueFormatter: (value: ProjectListDto) => {
            return formatterPriceForCurrencyName(value.subTotal, value.defaultCurrency.code)
        },
        columnWidth: 175
    },
    offerTotalAmountColumnFilter,
    documentStatusColumnFilter,
]);


</script>