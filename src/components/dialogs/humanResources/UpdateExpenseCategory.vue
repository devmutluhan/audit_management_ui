<template>
    <DialogContent title="general.updateExpenseCategory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateExpenseCategoryForm">
                <v-row>
                    <v-col cols="12">
                        <TextField v-model="commandModel.title" label="form.title" hideDetails />
                    </v-col>
                    <v-col cols="12">
                        <TextField v-model="commandModel.description" label="form.description" hideDetails />
                    </v-col>
                    <v-col cols="6">
                        <SwitchInput v-model="commandModel.isDefault" label="form.isDefault" />
                    </v-col>
                    <v-col cols="6">
                        <SwitchInput v-model="commandModel.isEnabled" label="form.isEnabled" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import type { UpdateExpenseCategoryCommand } from '@/models/entities/humanResource/ExpenseCommands';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';
import { catchError } from '@/core/helpers/generalResponse';

const commandModel = ref({} as UpdateExpenseCategoryCommand);
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    }
});

const updateExpenseCategoryForm = ref(null as any);
const updateExpenseCategory = () => {
    updateExpenseCategoryForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.id = props.selectedItem.id;
            useExpenseStore().updateExpenseCategory(commandModel.value).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => { updateExpenseCategory() })
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: updateExpenseCategory,
        loading: false
    }
])

onMounted(() => {
    commandModel.value.description = props.selectedItem.description
    commandModel.value.title = props.selectedItem.title
    commandModel.value.isDefault = props.selectedItem.isDefault
    commandModel.value.isEnabled = props.selectedItem.isEnabled
})

</script>