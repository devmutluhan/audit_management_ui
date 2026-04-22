<template>
    <DialogContent title="general.updateRepresentative" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addRepresentativeForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="form.fullName" v-model="commandModel.fullName" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.email" v-model="commandModel.email" isRequired />
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
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { AddCustomerRepresentativeCommand } from '@/models/entities/customer/CustomerCommads';
import { useRoute } from 'vue-router';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { catchError } from '@/core/helpers/generalResponse';

const commandModel = ref(new AddCustomerRepresentativeCommand())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    updateItem: {
        type: null as any,
        required: true
    }
});
const route = useRoute();
const addRepresentativeForm = ref(null as any);

const updateCustomerRepresentative = () => {
    addRepresentativeForm.value.validate().then((res: any) => {
        commandModel.value.customerId = route.params.id.toString();
        if (res.valid) {
            buttons.value[1].loading = true;
            useCustomerCommandStore().updateCustomerRepresentative(commandModel.value, props.updateItem.id).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => { updateCustomerRepresentative() })
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

onMounted(() => {
    commandModel.value = JSON.parse(JSON.stringify(props.updateItem));
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: updateCustomerRepresentative,
        loading: false
    }
])

</script>