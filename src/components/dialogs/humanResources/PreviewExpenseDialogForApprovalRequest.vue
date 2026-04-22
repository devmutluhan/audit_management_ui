<template>
    <DialogContent title="general.requestSpending" :dialogClose="dialogClose" :buttons="filterButtons"
        titleIcon="mdi-cash">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
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
                                            {{ selectedItem.employee.fullName }} {{ $t('list.requestForExpense') }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="auto">
                                    <v-chip class="font-weight-bold" :color="getChipColor(selectedItem.status)">
                                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            selectedItem.status)?.title}}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.createdAt') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ formatterDateFromHours(selectedItem.createdAt) }}
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
                                <v-col class="text-right py-0">
                                    {{ formatterPriceForCurrencyName(totalAmount) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-h6 font-weight-bold">
                            {{ $t('form.receipt') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <Tooltip descriptionText="general.allRejected" location="bottom">
                                <template v-slot:activatorItem>
                                    <v-btn @click="allRejectedFunc" icon="mdi-close-box-multiple-outline" variant="text"
                                        color="rejectButtonColor">
                                    </v-btn>
                                </template>
                            </Tooltip>
                            <Tooltip descriptionText="general.allApproved" location="bottom">
                                <template v-slot:activatorItem>
                                    <v-btn @click="allApprovedFunc" icon="mdi-checkbox-multiple-marked-circle-outline"
                                        variant="text" color="approveButtonColor">
                                    </v-btn>
                                </template>
                            </Tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="selectedItem.receipts">
                        <v-col cols="12" v-if="selectedItem.receipts.length > 0">
                            <v-row v-for="(item, index) in selectedItem.receipts" :key="index"
                                class="d-flex align-center">
                                <v-col cols="auto" class="py-0 pr-0">
                                    <v-icon v-if="item.fileUrl">mdi-file-check-outline</v-icon>
                                    <v-icon v-else>mdi-file-alert-outline</v-icon>
                                </v-col>
                                <v-col class="py-0" style="color:blue; cursor:pointer"
                                    @click="selectedReceipt = item; receiptDetailDialog = true">
                                    {{ $t(item.category) }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="pa-0" align="end">
                                    <span class="font-weight-bold"
                                        :class="'text-' + getChipColorReceipt(item.approvementStatus)">
                                        {{enumToArray(ReceiptApprovementStatusEnum).find((a) => a.value ==
                                            item.approvementStatus)?.title}}
                                    </span>
                                    <br>
                                    {{ formatterPriceForCurrencyName(item.amount) }}
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
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
                <VDialogContent v-model="receiptDetailDialog">
                    <PreviewReceiptDialog :dialogClose="() => { receiptDetailDialog = false }"
                        @status="selectedReceipt.approvementStatus = $event" :selectedItem="selectedReceipt"
                        :expenseId="selectedItem.id" />
                </VDialogContent>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import PreviewReceiptDialog from '@/components/dialogs/humanResources/PreviewReceiptDialog.vue';
import { ExpenseApprovalRequestList, ExpenseReceiptApprovalRequestDto } from '@/models/entities/humanResource/ExpenseDtos';
import { ApprovementStatusEnum, ReceiptApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import Tooltip from '@/components/formInput/Tooltip.vue';
import { ConfirmModalType } from '@/models/types';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { catchError } from '@/core/helpers/generalResponse';
import VDialogContent from '../VDialogContent.vue';

const receiptDetailDialog = ref(false);
const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType());
const selectedReceipt = ref(new ExpenseReceiptApprovalRequestDto() as any);
const totalAmount = ref(0 as any);

const emit = defineEmits(['expense']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<ExpenseApprovalRequestList>,
        required: true
    }
});

onMounted(() => {
    nextTick(() => {
        if (props.selectedItem.receipts) {
            totalAmount.value = props.selectedItem.receipts.map((a) => a.amount).reduce((a, b) => a + b, 0);
        }
    })
})

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

const filterButtons = computed(() => {
    const receiptArray = props.selectedItem.receipts;
    const hasCreated = receiptArray.some(r => r.approvementStatus === ReceiptApprovementStatusEnum.Created);
    const hasApproved = receiptArray.some(r => r.approvementStatus === ReceiptApprovementStatusEnum.Approved);
    const hasRejected = receiptArray.some(r => r.approvementStatus === ReceiptApprovementStatusEnum.Rejected);

    const allApproved = receiptArray.every(r => r.approvementStatus === ReceiptApprovementStatusEnum.Approved);
    const allRejected = receiptArray.every(r => r.approvementStatus === ReceiptApprovementStatusEnum.Rejected);

    if (!hasCreated) {
        if (allApproved) {
            return buttons.value.filter((a) => a.type == 'close' || a.type == 'approve');
        } else if (allRejected) {
            return buttons.value.filter((a) => a.type == 'close' || a.type == 'reject');
        } else if (hasRejected && hasApproved) {
            return buttons.value.filter((a) => a.type == 'close' || a.type == 'sendBack');
        } else {
            return buttons.value.filter((a) => a.type == 'close');
        }
    } else {
        return buttons.value.filter((a) => a.type == 'close');
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'approve',
        click: () => approveFunc(),
        loading: false
    },
    {
        type: 'reject',
        click: () => rejectExpenseApproval(),
        loading: false
    },
    {
        type: 'sendBack',
        click: () => sendBackExpenseApproval(),
        loading: false
    }
]);

const approveFunc = () => {
    buttons.value[1].loading = true;
    useExpenseStore().approveExpense(props.selectedItem.id).then(() => {
        props.dialogClose();
        emit('expense', props.selectedItem.id);
    }).catch((error) => {
        return catchError(error, () => { approveFunc() })
    }).finally(() => {
        buttons.value[1].loading = false;
    });
}

const allApprovedFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.allApproved',
        text: "general.allApproveReceiptDescription",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            useExpenseStore().approveReceipt(props.selectedItem.id, props.selectedItem.receipts.map((a) => a.id)).then(() => {
                confirmDialog.value = false
                props.selectedItem.receipts.forEach((a) => {
                    a.approvementStatus = ReceiptApprovementStatusEnum.Approved
                })
            }).catch((error) => {
                return catchError(error, () => { allApprovedFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            });
        }
    }
}

const allRejectedFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.allRejected',
        text: "general.allRejectReceiptDescription",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            useExpenseStore().rejectReceipt(props.selectedItem.id, props.selectedItem.receipts.map((a) => a.id)).then(() => {
                confirmDialog.value = false;
                props.selectedItem.receipts.forEach((a) => {
                    a.approvementStatus = ReceiptApprovementStatusEnum.Rejected
                })
            }).catch((error) => {
                return catchError(error, () => { allRejectedFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            });
        }
    }
}

const rejectExpenseApproval = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.reject',
        isDescriptionField: true,
        text: "general.rejectDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            useExpenseStore().rejectExpense(props.selectedItem.id, reason).then(() => {
                confirmDialog.value = false;
                props.dialogClose();
                emit('expense', props.selectedItem.id);
            }).catch((error) => {
                return catchError(error, () => { rejectExpenseApproval() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

const sendBackExpenseApproval = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.sendBack',
        isDescriptionField: true,
        text: "general.sendbackDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            useExpenseStore().sendbackExpense(props.selectedItem.id, reason).then(() => {
                props.dialogClose();
                confirmDialog.value = false;
                emit('expense', props.selectedItem.id);
            }).catch((error) => {
                return catchError(error, () => { sendBackExpenseApproval() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

</script>