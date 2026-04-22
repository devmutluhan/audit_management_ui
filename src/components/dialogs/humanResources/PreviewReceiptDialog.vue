<template>
    <DialogContent title="general.receiptDetail" :dialogClose="dialogClose" titleIcon="mdi-airplane"
        :buttons="filterButtons">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <v-card color="cardToolbar" height="150px" v-if="selectedItem.fileUrl" @click="previewFile">
                                <v-card-text class="fill-height d-flex justify-center align-center">
                                    <v-row class="d-flex justify-center">
                                        <v-col cols="12" align="center" class="py-1">
                                            <v-icon size="40" color="primary">mdi-file-check</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <v-card color="cardToolbar" height="150px" v-else>
                                <v-card-text class="fill-height d-flex justify-center align-center">
                                    <v-row class="d-flex justify-center">
                                        <v-col cols="12" align="center" class="py-1">
                                            <v-icon size="40">mdi-file-alert-outline</v-icon>
                                        </v-col>
                                        <v-col cols="12" align="center" class="py-1">
                                            {{ $t('list.noDocument') }}
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.status') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0 font-weight-bold"
                            :class="'text-' + getChipColorReceipt(selectedItem.approvementStatus)">
                            {{enumToArray(ReceiptApprovementStatusEnum).find((a) => a.value ==
                                selectedItem.approvementStatus)?.title}}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.category') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ selectedItem.category.title ?? selectedItem.category }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('list.taxRate') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            % {{ selectedItem.vatRate }}
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
                            {{ formatterDateFromHours(selectedItem.createdAt ?? selectedItem.date) }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('list.description') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ selectedItem.description }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.amount') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0 font-weight-bold text-priceTextColor">
                            {{ formatterPriceForCurrencyName(selectedItem.amount) }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-dialog v-model="previewFileDialog">
                <PreviewFileDialog :dialogClose="() => { previewFileDialog = false }" :previewUrl="previewUrl">
                </PreviewFileDialog>
            </v-dialog>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { ExpenseReceiptDetailDto } from '@/models/entities/humanResource/ExpenseDtos';
import { ReceiptApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { getFileUrl } from '@/core/helpers/assets';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { catchError } from '@/core/helpers/generalResponse';
import PreviewFileDialog from '@/components/dialogs/humanResources/PreviewFileDialog.vue';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';

const previewFileDialog = ref(false);
const emit = defineEmits(['status']);

const previewUrl = ref('')

const previewFile = () => {
    const url = getFileUrl(props.selectedItem.fileUrl);
    if (!url) return;

    previewUrl.value = url;
    previewFileDialog.value = true;
};

const commandModel = ref(new Array<string>())
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    expenseId: {
        type: String,
        required: true
    },
    selectedItem: {
        type: Object as PropType<ExpenseReceiptDetailDto>,
        required: true
    },
    isView: {
        type: Boolean,
        required: false,
        default: false
    }
});

const rejectReceipt = () => {
    commandModel.value.push(props.selectedItem.id);
    buttons.value[1].loading = true
    useExpenseStore().rejectReceipt(props.expenseId, commandModel.value).then((res) => {
        emit('status', ReceiptApprovementStatusEnum.Rejected)
        props.dialogClose()
    }).catch((error) => {
        return catchError(error, () => { rejectReceipt() })
    }).finally(() => {
        buttons.value[1].loading = false
        commandModel.value = new Array<string>()
    })
}

const approveReceipt = () => {
    commandModel.value.push(props.selectedItem.id);
    buttons.value[2].loading = true
    useExpenseStore().approveReceipt(props.expenseId, commandModel.value).then((res) => {
        emit('status', ReceiptApprovementStatusEnum.Approved)
        props.dialogClose()
    }).catch((error) => {
        return catchError(error, () => { rejectReceipt() })
    }).finally(() => {
        buttons.value[2].loading = false
        commandModel.value = new Array<string>()
    })
}

const buttons = ref([
    {
        click: props.dialogClose,
        type: 'close',
    },
    {
        type: 'reject',
        click: rejectReceipt,
        loading: false
    },
    {
        type: 'approve',
        click: approveReceipt,
        loading: false
    }
])

const filterButtons = computed(() => {
    if (props.isView) {
        return buttons.value.filter((a) => a.type == 'close');
    } else {
        return buttons.value;
    }
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

</script>