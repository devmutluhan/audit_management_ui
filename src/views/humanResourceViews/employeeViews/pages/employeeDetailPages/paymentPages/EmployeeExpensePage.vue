<template>
    <v-row class="fill-height">
        <v-col>
            <Datatable :data="expenseList.items ?? []" :loading="loading" :header="tableHeader"
                :enable-items-per-page-dropdown="false" :checkbox-enabled="false">
                <template v-slot:actions="{ row: data }">
                    <GeneralDropdown :menuItems="filterMenuItems(data)" :routeId="data.id" :data="data">
                    </GeneralDropdown>
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
                <PreviewSpendingDialog :dialogClose="() => { previewDialog = false }" :selectedItem="selectedItem" />
            </VDialogContent>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref } from "vue";
import PreviewSpendingDialog from "@/components/dialogs/humanResources/PreviewExpenseDialog.vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { getChipColor } from "@/core/helpers/generalUtils";
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import { ExpenseListDto } from "@/models/entities/humanResource/ExpenseDtos";
import { catchError } from "@/core/helpers/generalResponse";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const route = useRoute()
const previewDialog = ref(false);

const { expenseList } = storeToRefs(useExpenseStore())
const loading = ref(false)
const getEmployeeExpense = () => {
    loading.value = true
    useExpenseStore().getExpenseList({ employeeId: route.params.id.toString(), pageNumber: 1, pageSize: 1000 }).catch((error) => {
        return catchError(error, () => { getEmployeeExpense() })
    }).finally(() => {
        loading.value = false
    })
}
getEmployeeExpense();

const tableHeader = ref([
    {
        columnName: "form.isPaidStatus",
        columnLabel: "isPaid",
        columnWidth: 175,
        filterEnabled: false,
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

const selectedItem = ref(new ExpenseListDto());

const deleteFunc = (data: ExpenseListDto) => {
    const findIndex = menuItems.value.findIndex((a) => a.id == 2);
    const confirmModal = menuItems.value[findIndex].confirmModalValue;
    if (findIndex != -1) {
        confirmModal ? confirmModal.buttonLoading = true : null;
        useExpenseStore().deleteExpense(data.id).then(() => {
            if (expenseList.value.items) {
                expenseList.value.items = expenseList.value.items.filter((a: ExpenseListDto) => a.id != data.id);
            }
        }).catch((error) => {
            return catchError(error, () => deleteFunc(data))
        }).finally(() => {
            confirmModal ? confirmModal.buttonLoading = false : null;
        });
    }
}

const sendApproveFunc = (data: ExpenseListDto) => {
    useExpenseStore().sendExpense(data.id).then((res: any) => {
        if (expenseList.value.items) {
            const index = expenseList.value.items.findIndex((a) => a.id == data.id);
            if (index != -1) {
                expenseList.value.items[index].approvementStatus = res.data.status
            }
        }
    }).catch((error) => {
        return catchError(error, () => sendApproveFunc(data))
    })
}
const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.detailView",
        action: (data) => {
            selectedItem.value = data;
            previewDialog.value = true;
        },
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
                        if (expenseList.value.items) {
                            const index = expenseList.value.items.findIndex((a) => a.id == data.id);
                            if (index != -1) {
                                expenseList.value.items[index].approvementStatus = ApprovementStatusEnum.Cancelled;
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
    }
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