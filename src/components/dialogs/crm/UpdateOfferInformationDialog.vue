<template>
    <DialogContent title="general.updateOffer" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateOfferForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="8">
                        <SingleSelectInput v-model="commandModel.customerRepresentativeId" itemTitle="fullName"
                            :disabled="!customerDetail.id" itemValue="id"
                            :append-icon="hasClaimOrModules(['ManageCustomer']) ? 'mdi-plus-circle' : ''"
                            label="general.customerRepresentative" :items="customerDetail.representatives"
                            @appendIcon="addCustomerRepresentativeDialog = true">
                            <template v-slot:menuItem="{ item }">
                                <v-list-item @click="commandModel.customerRepresentativeId = item.id">
                                    {{ item.fullName }}
                                    <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                                </v-list-item>
                            </template>
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <TextField v-model="commandModel.termTime" label="form.termTime" isRequired isNumber />
                    </v-col>
                    <v-col cols="12" md="8">
                        <SingleSelectInput :items="customerDetail.addresses" itemTitle="city" itemValue="id"
                            :append-icon="hasClaimOrModules(['ManageCustomer']) ? 'mdi-plus-circle' : ''"
                            :disabled="!customerDetail.id" @appendIcon="addCustomerAddressDialog = true"
                            v-model="commandModel.customerAddressId" label="form.customerAddress">
                            <template v-slot:menuItem="{ item }">
                                <v-list-item @click="commandModel.customerAddressId = item.id">
                                    {{ item.city }}
                                    <v-list-item-subtitle>
                                        {{ item.street + '/' + item.countryName }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="12" md="4">
                        <TextField v-model="commandModel.exchangeRateAgreement" label="form.exchangeRateAgreement"
                            isNumber :disabled="selectedItem.defaultCurrency.code == 'TRY'">
                        </TextField>
                    </v-col>
                    <!-- <v-col cols="12" md="6">
                        <EmployeeSelectInput isRequired label="form.salesRepresentative"
                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                            :disabled="selectedItem.requestApproval.status == ApprovementStatusEnum.SendBack"
                            @selectValue="selectRepresentative = $event"
                            :selectItems="[selectedItem.salesRepresentative]" />
                    </v-col> -->
                    <v-col cols="12">
                        <DateInput v-model="commandModel.documentDate" label="form.offerDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="4" v-if="selectedItem.defaultCurrency.code != 'TRY'">
                        <TextField v-model="commandModel.exchangeRateAgreement" isNumber
                            label="form.exchangeRateAgreement">
                        </TextField>
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
            <VDialogContent v-model="addCustomerAddressDialog">
                <AddAddressDialog :customer-id="customerDetail.id"
                    :dialogClose="() => { addCustomerAddressDialog = false }"
                    @createItem="(event: any) => customerDetail.addresses.push(event)" />
            </VDialogContent>
            <VDialogContent v-model="addCustomerRepresentativeDialog">
                <AddRepresentativeDialog :customer-id="customerDetail.id"
                    :dialogClose="() => { addCustomerRepresentativeDialog = false }"
                    @createItem="(event: any) => customerDetail.representatives.push(event)" />
            </VDialogContent>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import AddAddressDialog from '@/components/dialogs/customer/AddAddressDialog.vue';
import AddRepresentativeDialog from '@/components/dialogs/customer/AddRepresentativeDialog.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useCustomerDtoStore } from '@/stores/customerStores/customerDtoStore';
// import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { storeToRefs } from 'pinia';
// import { ApprovementStatusEnum, EmployeeStatusTypeEnum } from "@/models/custom/EnumTypes";
import { ref, nextTick, onMounted, type PropType } from 'vue';
import { UpdateOfferInfoCommand } from '@/models/entities/crm/CrmOfferCommands';
import type { OfferDetailDto } from '@/models/entities/crm/CrmOfferDtos';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import VDialogContent from '../VDialogContent.vue';

const route = useRoute();
const commandModel = ref(new UpdateOfferInfoCommand())
const updateOfferForm = ref(null as any)

// const selectRepresentative = ref({ id: '', firstName: '', lastName: '' })
const { offerDetail } = storeToRefs(useOfferStore());
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<OfferDetailDto>,
        required: true
    },
});

const { customerDetail } = storeToRefs(useCustomerDtoStore());

const addCustomerAddressDialog = ref(false);
const addCustomerRepresentativeDialog = ref(false);

onMounted(() => {
    nextTick(() => {
        if (props.selectedItem.customer.id) {
            useCustomerDtoStore().getCustomerDetail(props.selectedItem.customer.id);
            commandModel.value.customerAddressId = props.selectedItem.address?.id ?? null;
            commandModel.value.customerRepresentativeId = props.selectedItem.representative?.id ?? null;
            commandModel.value.description = props.selectedItem.description;
            commandModel.value.documentDate = props.selectedItem.documentDate;
            commandModel.value.isExpenseIncluded = props.selectedItem.isExpenseIncluded;
            commandModel.value.salesRepresentativeId = props.selectedItem.salesRepresentative.id;
            commandModel.value.termTime = props.selectedItem.termTime;
        }
    })
})

const updateOffer = () => {
    updateOfferForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            // commandModel.value.salesRepresentativeId = selectRepresentative.value.id;
            useOfferStore().updateOffer(commandModel.value, route.params.id.toString()).then((response: any) => {
                props.dialogClose();
                offerDetail.value.address = customerDetail.value.addresses.find((a) => a.id == commandModel.value.customerAddressId) ?? null
                offerDetail.value.representative = customerDetail.value.representatives.find((a) => a.id == commandModel.value.customerRepresentativeId) ?? null
                offerDetail.value.description = commandModel.value.description
                offerDetail.value.documentDate = commandModel.value.documentDate
                offerDetail.value.isExpenseIncluded = commandModel.value.isExpenseIncluded
                offerDetail.value.termTime = commandModel.value.termTime
                // offerDetail.value.salesRepresentative = selectRepresentative.value;
            }).catch((error) => {
                return catchError(error, () => updateOffer())
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
        click: () => { updateOffer() },
        loading: false
    }
]);

</script>