<template>
    <v-row class="d-flex justify-center">
        <v-col cols="12" md="6">
            <CustomerInformation />
        </v-col>
        <v-col cols="12" md="6">
            <OfferInformation />
        </v-col>
        <v-col cols="12">
            <OfferContent />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import CustomerInformation from "@/components/wizards/offerCreateWizardSteps/CustomerInformation.vue";
import OfferInformation from "@/components/wizards/offerCreateWizardSteps/OfferInformation.vue";
import OfferCustomerInformation from "@/components/wizards/offerCreateWizardSteps/OfferCustomerInformation.vue";
import RiskFormAnswers from "@/components/wizards/offerCreateWizardSteps/RiskFormAnswers.vue";
import OfferContent from "@/components/wizards/offerCreateWizardSteps/OfferContent.vue";
import OfferPrewiew from "@/components/wizards/offerCreateWizardSteps/OfferPrewiew.vue";

import { useOfferStore } from '@/stores/crmStores/offerStore';
import { storeToRefs } from 'pinia';
import { CreateOfferRequest } from "@/models/entities/crm/CrmOfferCommands";
import i18n from "@/core/plugins/i18n";
const t = i18n.global.t;
const { createOfferCommand } = storeToRefs(useOfferStore());

const setOfferInfoSessionStorage = () => {
    sessionStorage.setItem('create-offer-info', JSON.stringify(createOfferCommand.value));
}

const getOfferInfoSessionStorage = () => {
    let getCreateOfferCommand = sessionStorage.getItem('create-offer-info');
    if (getCreateOfferCommand)
        createOfferCommand.value = JSON.parse(getCreateOfferCommand)
    else
        createOfferCommand.value = new CreateOfferRequest();

}

onMounted(() => {
    getOfferInfoSessionStorage();
});

const activeStep = ref(3);

const steps = [
    {
        id: 1,
        title: t('form.generalInformation'),
        component: OfferCustomerInformation,
    },
    {
        id: 2,
        title: t('form.poll'),
        component: RiskFormAnswers,
    },
    {
        id: 3,
        title: t('form.offerContent'),
        component: OfferContent,
    },
    {
        id: 4,
        title: t('form.preview'),
        component: OfferPrewiew,
    }
];

</script>