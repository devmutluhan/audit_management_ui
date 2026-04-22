<template>
    <DialogContent title="general.addRepresentative" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addRepresentativeForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="form.fullName" v-model="commandModel.fullName" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.email" v-model="commandModel.email" isRequired isEmail />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.phoneNumber" isPhoneNumber v-model="commandModel.phoneNumber" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.position" v-model="commandModel.position" />
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
import { AddCustomerRepresentativeCommand } from '@/models/entities/customer/CustomerCommads';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
const commandModel = ref(new AddCustomerRepresentativeCommand())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    customerId: {
        type: String,
        required: true
    }
});
const addRepresentativeForm = ref(null as any);

const addCustomerRepresentative = () => {
    addRepresentativeForm.value.validate().then((res: any) => {
        if (res.valid) {
            commandModel.value.customerId = props.customerId
            buttons.value[1].loading = true;
            useCustomerCommandStore().addCustomerRepresentative(commandModel.value).then((response: any) => {
                props.dialogClose();
                emit('createItem', {
                    id: response.data,
                    ...commandModel.value
                });
            }).catch((error) => {
                return catchError(error, () => { addCustomerRepresentative() })
            }).finally(() => {
                buttons.value[1].loading = false;
            });
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
        click: addCustomerRepresentative,
        loading: false
    }
])

</script>