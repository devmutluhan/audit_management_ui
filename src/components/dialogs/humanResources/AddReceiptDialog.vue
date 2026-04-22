<template>
    <DialogContent title="general.addReceipt" :dialogClose="dialogClose" titleIcon="mdi-clipboard-file-outline"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addReceiptRef">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" md="8">
                        <FileInput @response="selectedFile = $event[0]" label="form.selectFile" isNumber
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
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { ExpenseReceiptCommand } from '@/models/entities/humanResource/ExpenseCommands';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import FileInput from '@/components/formInput/generalInputs/FileInput.vue';
import { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { GeneralFileResponse } from '@/models/ApiResult';

const emit = defineEmits(['addItem', 'selectedFile']);
const { currencies } = storeToRefs(useGeneralStore());
const commandModel = ref(new ExpenseReceiptCommand())
const selectedFile = ref(new GeneralFileResponse())
const addReceiptRef = ref(null as any);
const { expenseCategoryList } = storeToRefs(useExpenseStore())
useExpenseStore().getExpenseCategoryList({ pageSize: 1000, pageNumber: 1 })

const clickSubmit = () => {
    const promiseValidate = addReceiptRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            if (selectedFile.value.fileId)
                commandModel.value.fileId = selectedFile.value.fileId;

            emit('selectedFile', selectedFile.value);
            emit('addItem', commandModel.value);
            props.dialogClose();
            commandModel.value = new ExpenseReceiptCommand();
        }
    })
}

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const buttons = ref([
    {
        type: 'close',
        click: props.dialogClose,
    },
    {
        type: 'save',
        click: clickSubmit
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