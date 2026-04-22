<template>
    <DialogContent title="general.addAddress" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addAddressForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <CountrySelectSingle isRequired @selectValue="selectedCountry = $event" :items="countryList" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField isRequired label="form.city" v-model="commandModel.city" />
                    </v-col>
                    <v-col cols="12">
                        <TextField isRequired label="form.addressDetail" v-model="commandModel.street" />
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
import CountrySelectSingle from '@/components/formInput/readyInput/CountrySelectSingle.vue';
import { AddCustomerAddressCommand } from '@/models/entities/customer/CustomerCommads';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { catchError } from '@/core/helpers/generalResponse';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';

const { countryList } = storeToRefs(useTaxStore());
useTaxStore().getCountryList();

const commandModel = ref(new AddCustomerAddressCommand())
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

const selectedCountry = ref(new CountryDto());
const addAddressForm = ref(null as any);
const addCustomerAddress = () => {
    addAddressForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (selectedCountry.value.code)
                commandModel.value.countryCode = selectedCountry.value.code;
            useCustomerCommandStore().addCustomerAddress(commandModel.value, props.customerId).then((response: any) => {
                props.dialogClose();
                emit('createItem', {
                    id: response.data,
                    countryName: selectedCountry.value.name,
                    ...commandModel.value
                });
            }).catch((error) => {
                return catchError(error, () => addCustomerAddress())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: addCustomerAddress,
        loading: false
    }
])

</script>