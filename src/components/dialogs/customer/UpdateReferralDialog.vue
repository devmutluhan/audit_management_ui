<template>
    <DialogContent title="general.updateReferral" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateReferralForm">
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
                        <CountrySelectSingle :selectItem="commandModel.countryCode"
                            @selectValue="selectedCountry = $event" isRequired :items="countryList" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.city" label="form.city" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.street" label="form.addressDetail" isRequired />
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
import CountrySelectSingle from '@/components/formInput/readyInput/CountrySelectSingle.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { useRoute } from 'vue-router';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { AddCustomerRefferalCommand } from '@/models/entities/customer/CustomerCommads';

import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';
import { catchError } from '@/core/helpers/generalResponse';

const { countryList } = storeToRefs(useTaxStore())
useTaxStore().getCountryList()
const commandModel = ref(new AddCustomerRefferalCommand())
const emit = defineEmits(['createItem']);
const selectedCountry = ref(new CountryDto());

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    updateItem: {
        type: Object as any,
        default: null
    }
});

const updateReferralForm = ref(null as any);
const route = useRoute();
const updateCustomerReferral = () => {
    updateReferralForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (selectedCountry.value.code)
                commandModel.value.countryCode = selectedCountry.value.code;
            commandModel.value['countryName'] = selectedCountry.value.name;
            useCustomerCommandStore().updateCustomerRefferal(commandModel.value, route.params.id.toString(), props.updateItem.id).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => { updateCustomerReferral() })
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
        click: updateCustomerReferral,
        loading: false
    }
])

</script>