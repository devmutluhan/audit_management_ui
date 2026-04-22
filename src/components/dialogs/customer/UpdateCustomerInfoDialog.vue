<template>
    <DialogContent title="general.updateCustomer" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="updateCustomerForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.name" label="form.customerName" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <CustomerSelectInput @selectValue="commandModel.parentId = $event;" label="form.parentCustomer"
                            justId :selectItems="[customerDetail.parent]"
                            :disabledItem="(a) => a.id == customerDetail.id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SwitchInput v-model="commandModel.keyClient" label="form.keyClient" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.termTime" label="form.termTime" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.taxNumber" label="form.taxNumber" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="commandModel.taxOfficeId" label="form.taxOffice"
                            :items="taxOfficeList" itemValue="id" itemTitle="name" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="commandModel.customerTypeId" label="form.customerType"
                            :items="customerTypes" itemValue="id" itemTitle="name" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="commandModel.sectorId" label="form.sector"
                            :items="customerSectors" itemValue="id" itemTitle="name" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import SingleAutocompleteInput from "@/components/formInput/generalInputs/SingleAutocompleteInput.vue";
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SwitchInput from "@/components/formInput/generalInputs/SwitchInput.vue";
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';
import { useCustomerDtoStore } from '@/stores/customerStores/customerDtoStore';
import { UpdateCustomerCommand } from '@/models/entities/customer/CustomerCommads';
import { useCustomerCommandStore } from '@/stores/customerStores/customerCommandStore';
import { useRoute } from 'vue-router';
import CustomerSelectInput from "@/components/formInput/readyInput/CustomerSelectInput.vue";
import { catchError } from '@/core/helpers/generalResponse';

const { taxOfficeList } = storeToRefs(useTaxStore());
const { customerTypes, customerSectors, customerDetail } = storeToRefs(useCustomerDtoStore());
useTaxStore().getTaxOfficeList();
useCustomerDtoStore().getCustomerTypes();
useCustomerDtoStore().getCustomerSectors();

const commandModel = ref(new UpdateCustomerCommand())

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

onMounted(() => {
    commandModel.value.name = customerDetail.value.name;
    commandModel.value.parentId = customerDetail.value.parent?.id;
    commandModel.value.keyClient = customerDetail.value.keyClient;
    commandModel.value.termTime = customerDetail.value.termTime;
    commandModel.value.taxNumber = customerDetail.value.taxNumber;
    commandModel.value.taxOfficeId = customerDetail.value.taxOffice?.id;
    commandModel.value.customerTypeId = customerDetail.value.type?.id;
    commandModel.value.sectorId = customerDetail.value.sector?.id;
    commandModel.value.logoFileId = null;
});

const updateCustomerForm = ref(null as any);
const route = useRoute();
const addCustomerReferral = () => {
    updateCustomerForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            const customerId = route.params.id.toString();
            useCustomerCommandStore().updateCustomer(customerId, commandModel.value).then(() => {
                props.dialogClose();
                useCustomerDtoStore().getCustomerDetail(customerId);
                emit('createItem', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => { addCustomerReferral() })
            }).finally(() => {
                buttons.value[1].loading = false;
            })
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