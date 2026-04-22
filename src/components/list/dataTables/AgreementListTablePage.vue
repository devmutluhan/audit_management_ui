<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @rowDoubleClicked="(item) => { router.push({ name: 'agreement-detail', params: { id: item.id } }) }"
        @page-change="emits('page-change', $event)">
        <template v-slot:agreementCode="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'agreement-detail', params: { id: data.id } }">
                {{ data.agreementCode }}
            </router-link>
        </template>
        <template v-slot:status="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.status)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.status)?.title}}
            </v-chip>
        </template>
        <!--&& hasClaimOrModules(['ManageAgreement']) -->
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

import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { offerListCustomerColumnFilter, mountComponentForFilter, documentStatusColumnFilter, agreementCodeColumnFilter, agreementListManagerColumnFilter, agreementListPartnerColumnFilter, offerListEmployeeColumnFilter, offerTotalAmountColumnFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { formatterPriceForCurrencyName, getChipColor } from "@/core/helpers/generalUtils";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { catchError } from "@/core/helpers/generalResponse";
import type { AgreementListDto } from "@/models/entities/crm/CrmAgreementDtos";
import { useAgreementStore } from "@/stores/crmStores/agreementStore";
import { titleColumnFilter } from "@/core/data/readyFilterColumnObject";
import router from "@/router";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'cancelAgreement']);

const props = defineProps<{
    tableData: PaginatedList<AgreementListDto>;
    loading: boolean;
}>();


const cancelFunc = (data: AgreementListDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    const reason = menuItems.value[0].confirmModalValue?.descriptionField ?? '';
    useAgreementStore().cancelAgreement(data.id, reason).then(() => {
        emits('cancelAgreement', data.id);
    }).catch((error) => {
        return catchError(error, () => { cancelFunc(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.cancel",
        confirmModalValue: {
            text: "general.cancelDescription",
            title: 'general.toCancel',
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: cancelFunc
        }
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    agreementCodeColumnFilter,
    titleColumnFilter,
    offerListCustomerColumnFilter,
    offerListEmployeeColumnFilter,
    {
        columnName: 'list.subTotal',
        columnLabel: "subTotal",
        valueFormatter: (value: AgreementListDto) => {
            return formatterPriceForCurrencyName(value.subTotal, value.defaultCurrency.code)
        },
        columnWidth: 175
    },
    offerTotalAmountColumnFilter,
    documentStatusColumnFilter,
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