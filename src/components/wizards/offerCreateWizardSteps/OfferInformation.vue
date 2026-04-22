<template>
    <v-card class="fill-height">
        <v-toolbar class="d-flex align-center">
            <v-col cols="6">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerInformation') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="12" sm="8">
                    <EmployeeSelectInput isRequired label="form.salesRepresentative"
                        :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                        @selectValue="createOfferCommand.salesRepresentative = $event; createOfferCommand.salesRepresentativeId = $event.id; createOfferCommand.isRiskForm = true"
                        :selectItems="[createOfferCommand.salesRepresentative]" />
                </v-col>
                <v-col cols="12" sm="4">
                    <DateInput v-model="createOfferCommand.documentDate" label="form.offerDate" isRequired />
                </v-col>
                <v-col cols="12" :sm="createOfferCommand.currencyCode != 'TRY' ? 4 : 6">
                    <SingleSelectInput :items="currencies" item-title="code" item-value="code" isRequired
                        v-model="createOfferCommand.currencyCode" label="form.currency"
                        @update:model-value="updateOfferCurrecy" />
                </v-col>
                <v-col cols="12" sm="4" v-if="createOfferCommand.currencyCode != 'TRY'">
                    <TextField v-model="createOfferCommand.exchangeRateAgreement" isNumber
                        label="form.exchangeRateAgreement">
                    </TextField>
                </v-col>
                <v-col cols="12" :sm="createOfferCommand.currencyCode != 'TRY' ? 4 : 6">
                    <SwitchInput v-model="createOfferCommand.isExpenseIncluded" label="form.isExpenseIncluded" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <TextArea v-model="createOfferCommand.description" label="form.description" />
                </v-col>
            </v-row>
        </v-card-text>
        <ConfirmDialog v-model="confirmDialog" :modal="selectedConfirmValue" />
    </v-card>
</template>

<script setup lang="ts">
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { ref } from 'vue';
import { ConfirmModalType } from '@/models/types';
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const { createOfferCommand } = storeToRefs(useOfferStore())
const { currencies } = storeToRefs(useGeneralStore())
useGeneralStore().getCurrencies();
const confirmDialog = ref(false);
const selectedConfirmValue = ref(new ConfirmModalType());

const updateOfferCurrecy = () => {
    if (createOfferCommand.value.items && createOfferCommand.value.items.length > 0) {
        confirmDialog.value = true;
        selectedConfirmValue.value.text = 'general.deletedOfferItemWarning',
            selectedConfirmValue.value.action = () => {
                confirmDialog.value = false;
                createOfferCommand.value.items = new Array<OfferItemDto>()
            }
    }
}

</script>