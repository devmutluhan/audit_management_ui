<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @rowDoubleClicked="(item) => preview(item)"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:avatarUrl="{ row: data }">
            <ImageCard :first-value="data.employee.firstName" :second-value="data.employee.lastName" color="red"
                :avatarText="data.employee.avatarUrl" rounded="circle" />
        </template>
        <template v-slot:amount="{ row: data }">
            <p class="ma-0">
                {{ getExpenseAmount(data) }}
            </p>
        </template>
        <template v-slot:isPaid="{ row: data }">
            <p :class="data.isPaid ? 'text-green' : 'text-red'" class="ma-0">
                {{ data.isPaid ? $t('list.isPaid') :
                    $t('list.notPaid') }}</p>
        </template>
        <!--&& hasClaimOrModules(['ManageOffer']) -->
        <template v-slot:actions="{ row: data }" v-if="menuItems">
            <GeneralDropdown :data="data" :menuItems="menuItems">
            </GeneralDropdown>
        </template>
    </Datatable>

    <VDialogContent v-model="previewDialog">
        <PreviewSpendingDialogForApprovalRequest :dialogClose="() => { previewDialog = false }"
            :selectedItem="selectedItem" @expense="emits('approveExpense', $event)" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ImageCard from '@/components/cards/ImageCard.vue';
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";

import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { ExpenseApprovalRequestList } from "@/models/entities/humanResource/ExpenseDtos";
import PreviewSpendingDialogForApprovalRequest from "@/components/dialogs/humanResources/PreviewExpenseDialogForApprovalRequest.vue";
import { formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'approveExpense']);

const props = defineProps<{
    tableData: PaginatedList<ExpenseApprovalRequestList>;
    loading: boolean;
}>();

const previewDialog = ref(false);
const selectedItem = ref(new ExpenseApprovalRequestList());

const getExpenseAmount = (data: ExpenseApprovalRequestList): string => {
    let result = 0
    if (data.receipts) {
        result = data.receipts.map((a) => a.amount).reduce((a, b) => a + b, 0);
    }
    return formatterPriceForCurrencyName(result)
}

const preview = (item) => {
    selectedItem.value = item;
    previewDialog.value = true;
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.detailView",
        action: preview
    }
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatarUrl",
        columnWidth: 30
    },
    {
        columnName: 'list.requester',
        columnLabel: "employee.fullName",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.startDate',
        columnLabel: "startDate",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: ExpenseApprovalRequestList) => {
            return formatterDateFromHours(value.createdAt)
        },
    },
    {
        columnName: 'list.amount',
        columnLabel: "amount",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.status',
        columnLabel: "isPaid",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
]);

</script>