<template>
    <DialogContent title="general.addReferral" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addReferralForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="form.referralCompany" v-model="commandModel.referenceCompany" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.referralPartner" v-model="commandModel.referencePartner" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.phoneNumber" isPhoneNumber v-model="commandModel.phoneNumber" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.email" v-model="commandModel.email" isRequired isEmail />
                    </v-col>
                    <v-col cols="12" md="6">
                        <CountrySelectSingle @selectValue="selectedCountry = $event" isRequired :items="countryList" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.city" label="form.city" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextField v-model="commandModel.street" label="form.addressDetail" isRequired />
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
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { useRoute } from 'vue-router';
import { AddCustomerRefferalCommand } from '@/models/entities/customer/CustomerCommads';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { storeToRefs } from 'pinia';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { catchError } from '@/core/helpers/generalResponse';

const { countryList } = storeToRefs(useTaxStore())
useTaxStore().getCountryList()
const commandModel = ref(new AddCustomerRefferalCommand())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addReferralForm = ref(null as any);
const selectedCountry = ref(new CountryDto());
const route = useRoute();

const addCustomerReferral = () => {
    addReferralForm.value.validate().then((res: any) => {
        if (res.valid) {
            const customerId = route.params.id.toString();
            buttons.value[1].loading = true;
            if (selectedCountry.value.code)
                commandModel.value.countryCode = selectedCountry.value.code;
            useCustomerCommandStore().addCustomerRefferal(commandModel.value, customerId).then((response: any) => {
                props.dialogClose();
                emit('createItem', {
                    id: response.data,
                    countryName: selectedCountry.value.name,
                    ...commandModel.value
                });
            }).catch((error) => {
                return catchError(error, () => { addCustomerReferral() })
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
        click: addCustomerReferral,
        loading: false
    }
])

</script>