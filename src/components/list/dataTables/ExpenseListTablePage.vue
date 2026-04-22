<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @rowDoubleClicked="(item) => preview(item)" @page-change="emits('page-change', $event)">
        <template v-slot:avatarUrl="{ row: data }">
            <ImageCard :first-value="data.employee.firstName" :second-value="data.employee.lastName" color="red"
                :avatarText="data.employee.avatarUrl" rounded="circle" />
        </template>
        <template v-slot:isPaid="{ row: data }">
            <span :class="data.isPaid ? 'text-priceTextColor' : 'text-error'">
                {{ data.isPaid ? $t('list.isPaid') : $t('list.notPaid') }}
            </span>
        </template>
        <template v-slot:status="{ row: data }">
            <v-chip class="font-weight-bold" :color="getChipColor(data.approvementStatus)">
                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                    data.approvementStatus)?.title}}
            </v-chip>
        </template>
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="filterMenuItems(data)" :data="data"></GeneralDropdown>
        </template>
    </Datatable>

    <VDialogContent v-model="previewDialog">
        <PreviewSpendingDialog :dialogClose="() => { previewDialog = false }" :selectedItem="selectedItem" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import type { PaginatedList } from "@/models/ApiResult";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { getChipColor } from "@/core/helpers/generalUtils";
import { approvementStatusColumnFilter, employeeFullNameColumnFilterForExpense, mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { ExpenseListDto } from "@/models/entities/humanResource/ExpenseDtos";
import ImageCard from "@/components/cards/ImageCard.vue";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import PreviewSpendingDialog from "@/components/dialogs/humanResources/PreviewExpenseDialog.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import { catchError } from "@/core/helpers/generalResponse";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'sendApprove'])

const props = defineProps<{
    tableData: PaginatedList<ExpenseListDto>;
    loading: boolean;
}>();

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatarUrl",
        columnWidth: 30
    },
    employeeFullNameColumnFilterForExpense,
    {
        columnName: 'list.creator',
        columnLabel: "creator.fullName",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.isPaidStatus',
        columnLabel: "isPaid",
        sortEnabled: true,
        columnWidth: 175
    },
    approvementStatusColumnFilter,
    {
        columnName: 'form.createdAt',
        columnLabel: "createdAt",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: ExpenseListDto) => {
            return formatterDateFromHours(value.createdAt)
        },
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});

const selectedItem = ref(new ExpenseListDto())
const previewDialog = ref(false);
const preview = (item: ExpenseListDto) => {
    selectedItem.value = item;
    previewDialog.value = true;
}

const deleteFunc = (data: ExpenseListDto) => {
    const findIndex = menuItems.value.findIndex((a) => a.id == 2);
    const confirmModal = menuItems.value[findIndex].confirmModalValue;
    if (findIndex != -1) {
        confirmModal ? confirmModal.buttonLoading = true : null;
        useExpenseStore().deleteExpense(data.id).then(() => {
            if (props.tableData.items) {
                props.tableData.items = props.tableData.items.filter((a: ExpenseListDto) => a.id != data.id);
            }
        }).catch((error) => {
            return catchError(error, () => deleteFunc(data))
        }).finally(() => {
            confirmModal ? confirmModal.buttonLoading = false : null;
        });
    }
}

const sendApproveFunc = (data: ExpenseListDto) => {
    const findIndex = menuItems.value.findIndex((a) => a.id == 3);
    const confirmModal = menuItems.value[findIndex].confirmModalValue;
    if (findIndex != -1) {
        confirmModal ? confirmModal.buttonLoading = true : null;
        useExpenseStore().sendExpense(data.id).then((res: any) => {
            if (props.tableData.items) {
                const index = props.tableData.items.findIndex((a) => a.id == data.id);
                if (index != -1) {
                    props.tableData.items[index].approvementStatus = res.data.status
                }
            }
        }).catch((error) => {
            return catchError(error, () => sendApproveFunc(data))
        }).finally(() => {
            confirmModal ? confirmModal.buttonLoading = false : null;
        });
    }
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
</script>