<template>
    <DialogContent title="general.updateBankAccount" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addBankAccountForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="list.bankName" v-model="commandModel.bankName" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.accountType" v-model="commandModel.accountType"
                            :items="enumToArray(AccountTypeEnum)" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.accountNumber" v-model="commandModel.accountNumber" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.iban" v-model="commandModel.iban" />
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
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { AccountTypeEnum } from '@/models/custom/EnumTypes';
import { UpdateEmployeeBankDetailCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';

const route = useRoute()
const commandModel = ref(new UpdateEmployeeBankDetailCommand())
const emit = defineEmits(['createItem']);

const { employeeDetail } = storeToRefs(useEmployeeDtoStore())

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addBankAccountForm = ref(null as any);
const addBankAccount = () => {
    addBankAccountForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().updateEmployeeBankDetail(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.accountNumber = commandModel.value.accountNumber
                employeeDetail.value.accountType = commandModel.value.accountType
                employeeDetail.value.iban = commandModel.value.iban
                employeeDetail.value.bankName = commandModel.value.bankName
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addBankAccount())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    commandModel.value.accountNumber = employeeDetail.value.accountNumber
    commandModel.value.accountType = employeeDetail.value.accountType
    commandModel.value.iban = employeeDetail.value.iban
    commandModel.value.bankName = employeeDetail.value.bankName
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: addBankAccount,
        loading: false
    }
])

</script>