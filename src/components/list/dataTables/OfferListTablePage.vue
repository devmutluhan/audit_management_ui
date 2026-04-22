<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @rowDoubleClicked="(item) => { router.push({ name: 'offer-detail', params: { id: item.id } }) }"
        @page-change="emits('page-change', $event)">
        <template v-slot:offerCode="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'offer-detail', params: { id: data.id } }">
                {{ data.offerCode }}
            </router-link>
        </template>
        <template v-slot:status="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.status)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.status)?.title}}
            </v-chip>
        </template>
        <!--&& hasClaimOrModules(['ManageOffer']) -->
        <template v-slot:actions="{ row: data }" v-if="menuItems">
            <GeneralDropdown v-if="filterMenuItems(data.status).length > 0" :data="data"
                :menuItems="filterMenuItems(data.status)">
            </GeneralDropdown>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";

import { offerListCustomerColumnFilter, offerListEmployeeColumnFilter, documentNumberColumnFilter, mountComponentForFilter, documentStatusColumnFilter, offerDocumentDateColumnFilter, offerTotalAmountColumnFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import type { OfferListDto } from "@/models/entities/crm/CrmOfferDtos";
import { formatterPriceForCurrencyName, getChipColor } from "@/core/helpers/generalUtils";
import { formatterDate } from "@/core/helpers/dateUtils";
import { useOfferStore } from "@/stores/crmStores/offerStore";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { catchError } from "@/core/helpers/generalResponse";
import router from "@/router";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'deleteOffer']);

const props = defineProps<{
    tableData: PaginatedList<OfferListDto>;
    loading: boolean;
}>();


const deleteFunc = (data: OfferListDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useOfferStore().deleteOffer(data.id).then(() => {
        emits('deleteOffer', data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc
        },

    },
]);


onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    documentNumberColumnFilter,
    offerListCustomerColumnFilter,
    offerListEmployeeColumnFilter,
    offerDocumentDateColumnFilter,
    {
        columnName: 'general.expirationDate',
        columnLabel: "expirationDate",
        valueFormatter: (value: OfferListDto) => {
            return formatterDate(value.expirationDate)
        },
        columnWidth: 175
    },
    {
        columnName: 'list.convertedServices',
        columnLabel: "convertedServiceStatus",
        columnWidth: 175
    },
    documentStatusColumnFilter,
    {
        columnName: 'list.subTotal',
        columnLabel: "subTotal",
        valueFormatter: (value: OfferListDto) => {
            return formatterPriceForCurrencyName(value.subTotal, value.defaultCurrency.code)
        },
        columnWidth: 175
    },
    offerTotalAmountColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        // visible: hasClaimOrModules(['ManageOffer'])
    },
]);

const filterMenuItems = (status: ApprovementStatusEnum): (GeneralDropdownType[]) => {
    if (ApprovementStatusEnum.Draft == status)
        return menuItems.value
    else if (ApprovementStatusEnum.Waiting == status)
        return menuItems.value.filter((x: any) => x.id !== 1)
    else if (ApprovementStatusEnum.SendBack == status)
        return menuItems.value.filter((x: any) => x.id !== 1)
    else if (ApprovementStatusEnum.Approved == status)
        return menuItems.value.filter((x: any) => x.id !== 1)
    else if (ApprovementStatusEnum.Rejected == status)
        return menuItems.value.filter((x: any) => x.id !== 1)
    else if (ApprovementStatusEnum.Cancelled == status)
        return menuItems.value.filter((x: any) => x.id !== 1)
    else
        return menuItems.value
}


</script>