<template>
    <DialogContent title="general.addAdvance" :dialogClose="dialogClose" titleIcon="mdi-account-cash-outline"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="createAdvanceFormRef">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" md="8">
                        <TextField v-model="commandModel.amount" label="form.amount" isNumber />
                    </v-col>
                    <v-col cols="12" md="4">
                        <SingleAutocompleteInput v-model="commandModel.currencyCode" label="form.currencyCode"
                            isRequired item-title="code" item-value="code" :items="currencies" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.message"
                            placeholder="form.whyExpenseMade" />
                    </v-col>
                    <v-col cols="12">
                        <DateInput v-model="commandModel.startsAt" label="list.startsAt" />
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
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { CreateAdvanceCommand } from '@/models/entities/humanResource/PaymentModels';
import { usePaymentStore } from '@/stores/humanResourcesStores/paymentStore';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { storeToRefs } from 'pinia';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';

const emit = defineEmits(['createdItem']);
const commandModel = ref(new CreateAdvanceCommand())
const { currencies } = storeToRefs(useGeneralStore())
useGeneralStore().getCurrencies();
const createAdvanceFormRef = ref(null as any);

const clickSubmit = () => {
    const promiseValidate = createAdvanceFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.employeeId = props.employeeId
            usePaymentStore().createAdvance(commandModel.value).then(() => {
                props.dialogClose();
                emit('createdItem', commandModel.value);
                commandModel.value = new CreateAdvanceCommand();
            }).catch((error) => {
                return catchError(error, () => clickSubmit())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

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

</script>