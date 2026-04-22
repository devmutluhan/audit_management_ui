<template>
    <DialogContent title="general.createExpenseCategory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createExpenseCategoryRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="createExpenseCategoryCommand.title" label="form.title" hideDetails
                            isRequired />
                    </v-col>

                    <v-col cols="12">
                        <TextArea v-model="createExpenseCategoryCommand.description" label="form.description" isRequired
                            hideDetails @keyup.enter="createExpenseCategory()" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import type { ApiResult } from '@/models/ApiResult';
import { CreateExpenseCategoryCommand } from '@/models/entities/humanResource/ExpenseCommands';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { storeToRefs } from 'pinia';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';

const emit = defineEmits(['createItem']);
const createExpenseCategoryCommand = ref(new CreateExpenseCategoryCommand());

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createExpenseCategoryRef = ref(null as any);
const expenseStore = useExpenseStore();
const { expenseCategoryList } = storeToRefs(expenseStore);

const createExpenseCategory = () => {
    createExpenseCategoryRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            expenseStore.createExpenseCategory(createExpenseCategoryCommand.value).then((res: ApiResult<string>) => {
                expenseCategoryList.value.push({
                    id: res.data,
                    title: createExpenseCategoryCommand.value.title,
                    description: createExpenseCategoryCommand.value.description,
                    isDefault: false,
                    isEnabled: false,
                })
                createExpenseCategoryCommand.value = new CreateExpenseCategoryCommand();
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => { createExpenseCategory() })
            }).finally(() => {
                buttons.value[1].loading = false
            })
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createExpenseCategory,
        loading: false
    }
])

</script>