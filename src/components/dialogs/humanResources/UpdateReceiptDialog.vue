<template>
    <DialogContent title="general.updateReceipt" :dialogClose="dialogClose" titleIcon="mdi-pencil" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="updateReceiptRef">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" md="8">
                        <FileInput :files="commandModel.fileId ? [commandModel.fileId] : []"
                            @response="selectedFile = $event[0]" label="form.selectFile" isNumber
                            :file-category="FileCategoryEnum.Receipt">
                        </FileInput>
                    </v-col>
                    <v-col cols="12" md="4">
                        <SingleAutocompleteInput v-model="commandModel.currencyCode" label="form.currencyCode"
                            isRequired item-title="code" item-value="code" :items="currencies" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="commandModel.expenseCategoryId" isRequired
                            :items="expenseCategoryList" label="form.category" item-title="title" item-value="id" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.amount" isNumber isRequired label="form.amount" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" sm="6">
                        <DateInput v-model="commandModel.date" isRequired label="form.receiptDate" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="commandModel.vatRate" :items="vatRates" item-title="text"
                            item-value="value" isRequired label="form.taxRate" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { ExpenseReceiptDetailDto } from '@/models/entities/humanResource/ExpenseDtos';
import FileInput from '@/components/formInput/generalInputs/FileInput.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { ExpenseReceiptCommand } from '@/models/entities/humanResource/ExpenseCommands';
import { storeToRefs } from 'pinia';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { formatterInputDate } from '@/core/helpers/dateUtils';
import { GeneralFileResponse } from '@/models/ApiResult';

const emit = defineEmits(['update', 'selectedFile']);

const { currencies } = storeToRefs(useGeneralStore())
const selectedFile = ref(new GeneralFileResponse())
const { expenseCategoryList } = storeToRefs(useExpenseStore());
useExpenseStore().getExpenseCategoryList({ pageSize: 1000, pageNumber: 1 });
useGeneralStore().getCurrencies();
const commandModel = ref(new ExpenseReceiptCommand())

onMounted(() => {
    if (props.selectedItem) {
        commandModel.value.amount = props.selectedItem.amount;
        commandModel.value.currencyCode = props.selectedItem.currency;
        commandModel.value.description = props.selectedItem.description;
        commandModel.value.expenseCategoryId = props.selectedItem.category.id;
        commandModel.value.fileId = props.selectedItem.fileId;
        commandModel.value.vatRate = props.selectedItem.vatRate;
        commandModel.value.date = formatterInputDate(props.selectedItem.date);
    }
})

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
    }
});
const updateReceiptRef = ref(null as any);

const updateReceipt = () => {
    const promiseValidate = updateReceiptRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true
            if (selectedFile.value.fileId) {
                commandModel.value.fileId = selectedFile.value.fileId;
            }
            useExpenseStore().updateReceipt(props.expenseId, props.selectedItem.id, commandModel.value).then((res) => {
                emit('update', {
                    command: commandModel.value,
                    id: props.selectedItem.id
                });
                emit('selectedFile', selectedFile.value)
                props.dialogClose();
                commandModel.value = new ExpenseReceiptCommand();
            }).catch((error) => {
                return catchError(error, () => { updateReceipt() })
            }).finally(() => {
                buttons.value[1].loading = false
            })
        }
    })
}

const buttons = ref([
    {
        click: props.dialogClose,
        type: 'close',
    },
    {
        type: 'edit',
        click: updateReceipt,
        loading: false
    }
])


const vatRates = ref([
    { text: '0%', value: 0 },
    { text: '1%', value: 1 },
    { text: '5%', value: 5 },
    { text: '6%', value: 6 },
    { text: '8%', value: 8 },
    { text: '10%', value: 10 },
    { text: '13%', value: 13 },
    { text: '18%', value: 18 },
    { text: '20%', value: 20 },
    { text: '24%', value: 24 }
]);
</script>