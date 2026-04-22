<template>
    <DialogContent title="general.addExpense" :dialogClose="dialogClose" titleIcon="mdi-account-cash-outline"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="createExpenseRef">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" class="pb-0">
                        <v-label class="pt-0 font-weight-bold field-label-text">
                            {{ $t('form.receipt') }}
                        </v-label>
                    </v-col>
                    <v-col cols="12">
                        <v-row v-if="commandModel.receipts.length > 0">
                            <v-col cols="12" class="py-1" v-for="(item, index) in commandModel.receipts" :key="index">
                                <v-card color="cardToolbar">
                                    <v-card-text>
                                        <v-row class="d-flex align-center">
                                            <v-col class="text-body-1">
                                                {{expenseCategoryList.find((x: ExpenseCategoryDto) => x.id ==
                                                    item.expenseCategoryId)?.title}}
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="auto">
                                                {{ formatterPriceForCurrencyName(item.amount ? item.amount : 0) }}
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-icon color="deleteButtonColor"
                                                    @click="deleteReceipt(index)">mdi-close</v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <AddButtonCard v-model="commandModel.receipts" title="form.addReceipt"
                                    :validationRef="createExpenseRef" :component="AddReceiptDialog"
                                    :addItemFunc="addReceipt" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="auto">
                                {{ $t('form.totalAmount') }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                {{formatterPriceForCurrencyName(commandModel.receipts.reduce((acc: number, item:
                                    ExpenseReceiptCommand) =>
                                    Number(acc) + Number(item.amount), 0))}}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.message"
                            placeholder="form.whyExpenseMade" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" class="py-1">
                        <SwitchInput v-model="commandModel.approve" label="form.skipApprovalProcess" />
                    </v-col>
                    <v-col cols="12" class="py-1">
                        <SwitchInput v-model="commandModel.notifyUser" label="form.sendEmailToEmployee" />
                    </v-col>
                    <v-col cols="12" class="py-1">
                        <SwitchInput v-model="commandModel.isPaid" label="form.isPaid" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import AddReceiptDialog from '@/components/dialogs/humanResources/AddReceiptDialog.vue';
import { CreateExpenseCommand, ExpenseCategoryDto, ExpenseReceiptCommand } from '@/models/entities/humanResource/ExpenseCommands';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import { storeToRefs } from 'pinia';
import { catchError } from '@/core/helpers/generalResponse';

const emit = defineEmits(['createdItem']);
const commandModel = ref(new CreateExpenseCommand())
const createExpenseRef = ref(null as any);
const isClicked = ref(false);
const { expenseCategoryList } = storeToRefs(useExpenseStore())

const addReceipt = (receipt: ExpenseReceiptCommand) => {
    commandModel.value.receipts.push(receipt);
}

const clickSubmit = () => {
    const promiseValidate = createExpenseRef.value.validate();
    promiseValidate.then((res: any) => {
        if (!res.valid && commandModel.value.receipts.length == 0)
            isClicked.value = true;
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.employeeId = props.employeeId
            useExpenseStore().createExpense(commandModel.value).then(() => {
                props.dialogClose();
                emit('createdItem', commandModel.value);
                commandModel.value = new CreateExpenseCommand();
            }).catch((error) => {
                return catchError(error, () => clickSubmit())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

const validateReceipts = computed(() => {
    return isClicked.value && commandModel.value.receipts.length == 0;
})

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    employeeId: {
        required: true,
        type: null as any
    }
});

const buttons = ref([
    {
        type: 'close',
        click: props.dialogClose,
    },
    {
        type: 'save',
        click: clickSubmit,
        loading: false,
    }
])

const deleteReceipt = (index: number) => {
    commandModel.value.receipts.splice(index, 1);
}

</script>