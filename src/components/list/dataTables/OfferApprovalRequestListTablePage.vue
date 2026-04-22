<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:offerCode="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'offer-detail', params: { id: data.id }, query: { isView: 'true' } }">
                {{ data.offerCode }}
            </router-link>
        </template>
        <!--&& hasClaimOrModules(['ManageOffer']) -->
        <template v-slot:actions="{ row: data }" v-if="menuItems">
            <GeneralDropdown :data="data" :menuItems="menuItems">
            </GeneralDropdown>
        </template>
    </Datatable>
    <VDialogContent v-model="approveDialog">
        <ApproveOfferRiskDialog :dialogClose="() => { approveDialog = false }" :selectedItem="selectedItem" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { OfferListDto } from "@/models/entities/crm/CrmOfferDtos";
import { formatterDate } from "@/core/helpers/dateUtils";
import { formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";
import { useOfferStore } from "@/stores/crmStores/offerStore";
import router from "@/router";
import { catchError } from "@/core/helpers/generalResponse";
import ApproveOfferRiskDialog from "@/components/dialogs/humanResources/ApproveOfferRiskDialog.vue";
import type { ApproveOfferCommand } from "@/models/entities/crm/CrmOfferCommands";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'approveOffer']);

const props = defineProps<{
    tableData: PaginatedList<OfferListDto>;
    loading: boolean;
}>();

const approveDialog = ref(false);
const approveFunc = (data: OfferListDto, command: ApproveOfferCommand) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useOfferStore().approveOffer(data.id, command).then(() => {
        emits('approveOffer', data.id);
    }).catch((error) => {
        return catchError(error, () => { approveFunc(data, command) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const rejectFunc = (data: OfferListDto) => {
    const reason = menuItems.value[2].confirmModalValue?.descriptionField ? menuItems.value[2].confirmModalValue?.descriptionField : ''
    menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = true : '';
    useOfferStore().rejectOffer(data.id, reason).then(() => {
        emits('approveOffer', data.id);
    }).catch((error) => {
        return catchError(error, () => { rejectFunc(data) })
    }).finally(() => {
        menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = false : '';
    });
}

const sendbackFunc = (data: OfferListDto) => {
    const reason = menuItems.value[3].confirmModalValue?.descriptionField ? menuItems.value[3].confirmModalValue?.descriptionField : ''
    menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = true : '';
    useOfferStore().sendbackOffer(data.id, reason).then(() => {
        emits('approveOffer', data.id);
    }).catch((error) => {
        return catchError(error, () => { sendbackFunc(data) })
    }).finally(() => {
        menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = false : '';
    });
}

const selectedItem = ref(new OfferListDto())
const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.detailView",
        action: (item) => {
            router.push({ name: 'offer-detail', params: { id: item.id }, query: { isView: 'true' } })
        }
    },
    {
        title: "general.approve",
        action: (item) => {
            if (item.isRiskApprover) {
                selectedItem.value = item;
                approveDialog.value = true;
            } else {
                approveFunc(item, { selectedRiskStatus: null })
            }
        }
    },
    {
        title: "general.reject",
        confirmModalValue: {
            title: 'general.reject',
            text: "general.rejectDescription",
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: rejectFunc
        },
    },
    {
        title: "general.sendBack",
        confirmModalValue: {
            title: 'general.sendback',
            text: "general.sendbackDescription",
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: sendbackFunc
        },
    },
]);


onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: 'form.documentNumber',
        columnLabel: "offerCode",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'form.customerName',
        columnLabel: "customer.name",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'form.salesRepresentative',
        columnLabel: "salesRepresentative",
        valueFormatter: (value) => {
            return value.salesRepresentative.firstName + ' ' + value.salesRepresentative.lastName
        },
        columnWidth: 175,
    },
    {
        columnName: 'general.expirationDate',
        columnLabel: "expirationDate",
        valueFormatter: (value: OfferListDto) => {
            return formatterDate(value.expirationDate)
        },
        columnWidth: 175
    },
    {
        columnName: 'form.totalAmount',
        columnLabel: "totalAmount",
        valueFormatter: (value: OfferListDto) => {
            return formatterPriceForCurrencyName(value.finalTotal, value.defaultCurrency.code)
        },
        columnWidth: 175
    },
    {
        columnName: 'list.subTotal',
        columnLabel: "subTotal",
        valueFormatter: (value: OfferListDto) => {
            return formatterPriceForCurrencyName(value.subTotal, value.defaultCurrency.code)
        },
        columnWidth: 175
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        // visible: hasClaimOrModules(['ManageOffer'])
    },
]);

</script>