<template>
    <DialogContent title="general.requestSpending" :dialogClose="dialogClose" titleIcon="mdi-cash"
        :buttons="filterButtons">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center" v-if="selectedItem">
                <v-col cols="11">
                    <v-row v-if="selectedItem.employee">
                        <v-col cols="auto pr-0 pr-md-4 hidden-xs">
                            <ImageCard :first-value="selectedItem.employee.firstName"
                                :avatar-text="selectedItem.employee.avatarUrl" size="60"
                                :second-value="selectedItem.employee.lastName" fontSize="20px" />
                        </v-col>
                        <v-col cols="12" sm="9">
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-card color="cardToolbar">
                                        <v-card-text class="text-h5">
                                            <span class="text-primary font-weight-bold">
                                                {{ selectedItem.employee.fullName }}
                                            </span>
                                            {{ $t('list.requestForExpense') }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="auto">
                                    <v-chip class="font-weight-bold"
                                        :color="getChipColor(selectedItem.approvementStatus)">
                                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            selectedItem.approvementStatus)?.title}}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.description') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ expenseDetail.description }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.isPaidStatus') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0"
                                    :class="expenseDetail.isPaid ? 'text-priceTextColor' : 'text-error'">
                                    {{ expenseDetail.isPaid ? $t('list.paid') : $t('list.notPaid') }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.createdAt') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ formatterDateFromHours(expenseDetail.createdAt) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.totalAmount') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0 text-priceTextColor">
                                    {{ formatterPriceForCurrencyName(totalAmount) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center">
                        <v-col class="text-h6 font-weight-bold">
                            {{ $t('form.receipt') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-icon size="18" @click="addReceiptDialog = true" color="addButtonColor"
                            v-if="selectedItem.approvementStatus == ApprovementStatusEnum.Draft || selectedItem.approvementStatus == ApprovementStatusEnum.SendBack">
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-row>
                    <v-row v-if="expenseDetail.receipts">
                        <v-col cols="12" v-if="expenseDetail.receipts.length > 0">
                            <v-row v-for="(item, index) in expenseDetail.receipts" :key="index"
                                class="d-flex align-center text-pre-wrap">
                                <v-col cols="auto" class="py-0 pr-0">
                                    <v-icon v-if="item.fileUrl">mdi-file-check-outline</v-icon>
                                    <v-icon v-else>mdi-file-alert-outline</v-icon>
                                </v-col>
                                <v-col class="py-0" style="color:blue; cursor:pointer"
                                    @click="selectedReceipt = item; receiptDetailDialog = true">
                                    {{ item.category.title }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="pa-0" align="end" class="text-priceTextColor">
                                    <span class="font-weight-bold"
                                        :class="'text-' + getChipColorReceipt(item.approvementStatus)">
                                        {{enumToArray(ReceiptApprovementStatusEnum).find((a) => a.value ==
                                            item.approvementStatus)?.title}}
                                    </span>
                                    <br>
                                    {{ formatterPriceForCurrencyName(item.amount) }}
                                </v-col>
                                <v-col cols="auto" class="px-0"
                                    v-if="item.approvementStatus != ReceiptApprovementStatusEnum.Approved && (selectedItem.approvementStatus == ApprovementStatusEnum.Draft || selectedItem.approvementStatus == ApprovementStatusEnum.SendBack)">
                                    <GeneralDropdown :menuItems="menuItems" :data="item"></GeneralDropdown>
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" v-else>
                            <v-alert>
                                {{ $t('general.noData') }}
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12"
                    v-if="expenseDetail.requestApproval && expenseDetail.requestApproval.approvalSteps.length > 0">
                    <v-row v-if="expenseDetail.requestApproval?.status != ApprovementStatusEnum.Draft">
                        <v-col cols="12" class="text-center text-primary font-weight-bold pb-0">
                            {{ $t('form.approvalProcess') }}
                        </v-col>
                        <v-col cols="12">
                            <PreviewExpenseApprovalProcessesTimeline :requestApproval="expenseDetail.requestApproval" />
                        </v-col>
                    </v-row>
                </v-col>
                <VDialogContent v-model="receiptDetailDialog">
                    <PreviewReceiptDialog :dialogClose="() => { receiptDetailDialog = false }"
                        @status="selectedReceipt.approvementStatus = $event" :selectedItem="selectedReceipt"
                        :expenseId="expenseDetail.id" :isView="true" />
                </VDialogContent>
                <VDialogContent v-model="receiptUpdateDialog">
                    <UpdateReceiptDialog :dialogClose="() => { receiptUpdateDialog = false }"
                        @selected-file="selectedFile = $event" :selectedItem="selectedReceipt"
                        :expenseId="expenseDetail.id" @update="updateReceipt" />
                </VDialogContent>
                <VDialogContent v-model="addReceiptDialog">
                    <AddReceiptDialog :dialogClose="() => { addReceiptDialog = false }" @addItem="createReceipt"
                        @selected-file="selectedFile = $event" />
                </VDialogContent>
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import PreviewExpenseApprovalProcessesTimeline from "@/components/dialogs/humanResources/PreviewExpenseApprovalProcessesTimeline.vue";
import PreviewReceiptDialog from '@/components/dialogs/humanResources/PreviewReceiptDialog.vue';
import { ExpenseListDto, ExpenseReceiptDetailDto } from '@/models/entities/humanResource/ExpenseDtos';
import { ApprovementStatusEnum, ReceiptApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import { storeToRefs } from 'pinia';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { catchError } from '@/core/helpers/generalResponse';
import UpdateReceiptDialog from './UpdateReceiptDialog.vue';
import { ExpenseCategoryDto, ExpenseReceiptCommand } from '@/models/entities/humanResource/ExpenseCommands';
import { ConfirmModalType, type GeneralDropdownType } from '@/models/types';
import AddReceiptDialog from './AddReceiptDialog.vue';
import VDialogContent from '../VDialogContent.vue';
import { GeneralFileResponse } from '@/models/ApiResult';

const receiptDetailDialog = ref(false);
const receiptUpdateDialog = ref(false);
const addReceiptDialog = ref(false);
const confirmDialog = ref(false);
const selectedFile = ref(new GeneralFileResponse())
const { expenseDetail, expenseCategoryList } = storeToRefs(useExpenseStore());
const selectedReceipt = ref(new ExpenseReceiptDetailDto())
const totalAmount = ref(0 as any)

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<ExpenseListDto> as any,
        required: true
    }
});

onMounted(() => {
    getExpenseDetail();
})

const getExpenseDetail = () => {
    useExpenseStore().getExpenseDetail(props.selectedItem.id).then((res) => {
        totalAmount.value = res.receipts.map((a) => a.amount).reduce((a, b) => a + b, 0);
    }).catch((error) => {
        return catchError(error, () => { getExpenseDetail() })
    })
}

const getChipColorReceipt = (status: Number) => {
    if (ReceiptApprovementStatusEnum.Created == status)
        return 'warning'
    else if (ReceiptApprovementStatusEnum.Rejected == status)
        return 'error'
    else if (ReceiptApprovementStatusEnum.Approved == status)
        return 'success'
    else
        return 'red'
}


const sendApproveFunc = () => {
    buttons.value[1].loading = true
    useExpenseStore().sendExpense(props.selectedItem.id).then((res: any) => {
        props.selectedItem.approvementStatus = res.data.status
        props.dialogClose();
    }).catch((error) => {
        return catchError(error, () => sendApproveFunc())
    }).finally(() => {
        buttons.value[1].loading = true
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'sendApprove',
        click: () => sendApproveFunc(),
        loading: false
    },
    {
        type: 'cancel',
        click: () => toCancelFunc(),
        loading: false
    }
]);

const confirmModalValue = ref(new ConfirmModalType());

const toCancelFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        text: "general.cancelDescription",
        buttonLoading: false,
        isDescriptionField: true,
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ?? '';
            confirmModalValue.value.buttonLoading = true
            useExpenseStore().cancelExpense(props.selectedItem.id, reason).then(() => {
                props.selectedItem.approvementStatus = ApprovementStatusEnum.Cancelled;
                confirmDialog.value = true;
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false
            });
        }
    }
}

const filterButtons = computed(() => {
    const receipts = expenseDetail.value?.receipts
    const status = props.selectedItem.approvementStatus;
    if ((status == ApprovementStatusEnum.Draft || status == ApprovementStatusEnum.SendBack || status == ApprovementStatusEnum.Approved) && receipts) {
        if (receipts.some((a) => a.approvementStatus == ReceiptApprovementStatusEnum.Rejected)) {
            return buttons.value.filter((a) => a.type == 'close');
        } else {
            if (status == ApprovementStatusEnum.SendBack || status == ApprovementStatusEnum.Approved)
                return buttons.value;
            else
                return buttons.value.filter((a) => a.type != 'cancel')
        }
    } else {
        return buttons.value.filter((a) => a.type == 'close');
    }
})

const updateReceipt = (updateItem: { id: string, command: ExpenseReceiptCommand }) => {
    const index = expenseDetail.value.receipts.findIndex((a) => a.id == updateItem.id);
    if (index != -1) {
        if (selectedFile.value.fileId)
            updateItem.command.fileId = selectedFile.value.fileId;

        expenseDetail.value.receipts[index] = {
            id: updateItem.id,
            amount: updateItem.command.amount ?? 0,
            currency: updateItem.command.currencyCode ?? 'TRY',
            description: updateItem.command.description,
            date: updateItem.command.date,
            fileId: selectedFile.value.fileId,
            fileUrl: selectedFile.value.url,
            approvementStatus: ReceiptApprovementStatusEnum.Created,
            category: expenseCategoryList.value.find((a) => a.id == updateItem.command.expenseCategoryId) ?? new ExpenseCategoryDto(),
            vatRate: updateItem.command.vatRate ?? 0,
            createdAt: '',
            updatedAt: ''
        }
    }
}

const createReceipt = (command: ExpenseReceiptCommand) => {
    if (selectedFile.value.fileId)
        command.fileId = selectedFile.value.fileId;

    useExpenseStore().addReceipt(props.selectedItem.id, command).then((res) => {
        expenseDetail.value.receipts.unshift({
            id: res.data,
            amount: command.amount ?? 0,
            currency: command.currencyCode ?? 'TRY',
            description: command.description,
            date: command.date,
            fileUrl: selectedFile.value.url,
            fileId: selectedFile.value.fileId,
            approvementStatus: ReceiptApprovementStatusEnum.Created,
            category: expenseCategoryList.value.find((a) => a.id == command.expenseCategoryId) ?? new ExpenseCategoryDto(),
            vatRate: command.vatRate ?? 0,
            createdAt: '',
            updatedAt: ''
        })
    }).catch((error) => {
        return catchError(error, () => { createReceipt(command) })
    });
}

const deleteFunc = (data: ExpenseReceiptDetailDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useExpenseStore().deleteReceipt(props.selectedItem.id, data.id).then((res) => {
        const index = expenseDetail.value.receipts.findIndex((a) => a.id == data.id);
        if (index != -1) {
            expenseDetail.value.receipts.splice(index, 1)
        }
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (data) => {
            selectedReceipt.value = data;
            receiptUpdateDialog.value = true
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            title: 'general.delete',
            buttonLoading: false,
            action: deleteFunc
        }
    }
]);
</script>