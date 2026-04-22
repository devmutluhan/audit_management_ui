<template>
    <Datatable :data="tableData.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="false"
        :checkbox-enabled="false" @rowDoubleClicked="(item) => preview(item)" :loading="loading">
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="filterMenuItems(data)" :routeId="data.id" :data="data"></GeneralDropdown>
        </template>
        <template v-slot:isPaid="{ row: data }">
            <span :class="data.isPaid ? 'text-priceTextColor' : 'text-error'">
                {{ data.isPaid ? $t('list.isPaid') : $t('list.notPaid') }}
            </span>
        </template>
        <template v-slot:approvementStatus="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.approvementStatus)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.approvementStatus)?.title}}
            </v-chip>
        </template>
    </Datatable>
    <VDialogContent v-model="previewDialog">
        <template v-slot:default>
            <PreviewExpenseDialog :dialogClose="() => { previewDialog = false }" :selectedItem="selectedItem" />
        </template>
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { getChipColor } from "@/core/helpers/generalUtils";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { catchError } from '@/core/helpers/generalResponse';
import PreviewExpenseDialog from '@/components/dialogs/humanResources/PreviewExpenseDialog.vue';
import { ExpenseListDto } from '@/models/entities/humanResource/ExpenseDtos';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change'])

const props = defineProps<{
    tableData: PaginatedList<ExpenseListDto>;
    loading: boolean;
}>();

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});

const tableHeader = ref([
    {
        columnName: "form.isPaidStatus",
        columnLabel: "isPaid",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: "list.creator",
        columnLabel: "creator.fullName",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.createdAt",
        columnLabel: "createdAt",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: ExpenseListDto) => {
            return formatterDateFromHours(value.createdAt);
        }
    },
    {
        columnName: "form.approvementStatus",
        columnLabel: "approvementStatus",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

const filterMenuItems = (item: ExpenseListDto): GeneralDropdownType[] => {
    if (item.approvementStatus == ApprovementStatusEnum.Draft) {
        return menuItems.value.filter((a) => a.id != 4);
    } else if (item.approvementStatus == ApprovementStatusEnum.Waiting || item.approvementStatus == ApprovementStatusEnum.Cancelled || item.approvementStatus == ApprovementStatusEnum.Rejected) {
        return menuItems.value.filter((a) => a.id == 1);
    } else if (item.approvementStatus == ApprovementStatusEnum.Approved || item.approvementStatus == ApprovementStatusEnum.SendBack) {
        return menuItems.value.filter((a) => a.id == 1 || a.id == 4)
    } else {
        return menuItems.value
    }
}


const previewDialog = ref(false);
const selectedItem = ref(new ExpenseListDto())
const preview = (item: ExpenseListDto) => {
    selectedItem.value = item;
    previewDialog.value = true;
}

const deleteFunc = (data: ExpenseListDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useExpenseStore().deleteExpense(data.id).then(() => {
        if (props.tableData.items) {
            props.tableData.items = props.tableData.items.filter((a: ExpenseListDto) => a.id != data.id);
        }
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data))
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const sendApproveFunc = (data: ExpenseListDto) => {
    useExpenseStore().sendExpense(data.id).then((res: any) => {
        if (props.tableData.items) {
            const index = props.tableData.items.findIndex((a) => a.id == data.id);
            if (index != -1) {
                props.tableData.items[index].approvementStatus = res.data.status
            }
        }
    }).catch((error) => {
        return catchError(error, () => sendApproveFunc(data))
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.preview",
        action: preview,
    },
    {
        id: 2,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
    {
        id: 3,
        title: "general.sendForApproval",
        action: sendApproveFunc,
    },
    {
        id: 4,
        title: "general.toCancel",
        confirmModalValue: {
            text: "general.cancelDescription",
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: (data) => {
                const findIndex = menuItems.value.findIndex((a) => a.id == 4);
                if (findIndex != -1) {
                    const confirmModal = menuItems.value[findIndex].confirmModalValue;
                    const reason = confirmModal ? confirmModal.descriptionField : '';
                    confirmModal ? confirmModal.buttonLoading = true : ''
                    useExpenseStore().cancelExpense(data.id, reason ?? '').then(() => {
                        if (props.tableData.items) {
                            const index = props.tableData.items.findIndex((a) => a.id == data.id);
                            if (index != -1) {
                                props.tableData.items[index].approvementStatus = ApprovementStatusEnum.Cancelled;
                            }
                        }
                    }).catch((error) => {
                        return catchError(error, () => { confirmModal ? confirmModal.action : '' })
                    }).finally(() => {
                        confirmModal ? confirmModal.buttonLoading = false : ''
                    });
                }
            },
        },
    },
]);

</script>