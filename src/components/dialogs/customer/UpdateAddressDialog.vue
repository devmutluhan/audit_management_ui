<template>
    <DialogContent title="general.updateAddress" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addAddressForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <CountrySelectSingle :selectItem="commandModel.countryCode" :items="countryList"
                            @selectValue="selectedCountry = $event" isRequired />
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
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import CountrySelectSingle from '@/components/formInput/readyInput/CountrySelectSingle.vue';
import { AddCustomerAddressCommand } from '@/models/entities/customer/CustomerCommads';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { useRoute } from 'vue-router';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { storeToRefs } from 'pinia';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { catchError } from '@/core/helpers/generalResponse';

const commandModel = ref(new AddCustomerAddressCommand())
const emit = defineEmits(['createItem']);

const { countryList } = storeToRefs(useTaxStore());
useTaxStore().getCountryList();

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

const selectedCountry = ref(new CountryDto());
const addAddressForm = ref(null as any);
const route = useRoute();
const addCustomerAddress = () => {
    addAddressForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (selectedCountry.value.code)
                commandModel.value.countryCode = selectedCountry.value.code;
            commandModel.value['countryName'] = selectedCountry.value.name;
            useCustomerCommandStore().updateCustomerAddress(commandModel.value, route.params.id.toString(), props.updateItem.id).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => addCustomerAddress())
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
        click: addCustomerAddress,
        loading: false
    }
])

</script>