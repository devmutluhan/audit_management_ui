<template>
    <v-row class="d-flex justify-center">
        <v-col cols="12 my-6">
            <CreateHorizontalWizardStepper :steps="steps" :activeStep="activeStep" />
        </v-col>
        <v-col cols="12">
            <v-window class="fill-height" v-model="activeStep">
                <v-window-item class="fill-height" v-for="step in steps" :key="step.id" :value="step.id">
                    <component :is="step.component" :activeStep="activeStep" @clickNext="clickNext()"
                        @clickBack="clickBack()" />
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { markRaw, onMounted, ref } from "vue";
import CreateHorizontalWizardStepper from "@/components/wizards/CreateHorizontalWizardStepper.vue";
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
import router from "@/router";
import { userInfo } from "@/core/helpers/localStorageManagement";
const t = i18n.global.t;
const { createOfferCommand } = storeToRefs(useOfferStore());
createOfferCommand.value = new CreateOfferRequest();

const setOfferInfoSessionStorage = () => {
    sessionStorage.setItem('create-offer-info', JSON.stringify(createOfferCommand.value));
}

const getOfferInfoSessionStorage = () => {
    let getCreateOfferCommand = sessionStorage.getItem('create-offer-info');
    if (getCreateOfferCommand)
        createOfferCommand.value = JSON.parse(getCreateOfferCommand);
    else
        createOfferCommand.value = new CreateOfferRequest();
}

onMounted(() => {
    getOfferInfoSessionStorage();
    if (!createOfferCommand.value.salesRepresentativeId) {
        if (userInfo.value.employeeDetail.id) {
            createOfferCommand.value.salesRepresentativeId = userInfo.value.employeeId;
            createOfferCommand.value.salesRepresentative = {
                appUserState: userInfo.value.employeeDetail.appUserState,
                avatarUrl: userInfo.value.employeeDetail.avatarUrl,
                firstName: userInfo.value.employeeDetail.firstName,
                lastName: userInfo.value.employeeDetail.lastName,
                position: userInfo.value.employeeDetail.currentExperience.position,
                positions: [],
                workEmail: userInfo.value.employeeDetail.workEmail,
                id: userInfo.value.employeeId,
                isTerminated: false
            }
        }
    }
});

const activeStep = ref(1);

const steps = ref([
    {
        id: 1,
        title: t('form.generalInformation'),
        component: markRaw(OfferCustomerInformation),
    },
    {
        id: 2,
        title: t('form.riskForm'),
        component: markRaw(RiskFormAnswers),
    },
    {
        id: 3,
        title: t('form.offerContent'),
        component: markRaw(OfferContent),
    },
    {
        id: 4,
        title: t('form.preview'),
        component: markRaw(OfferPrewiew),
    }
]);

const clickNext = () => {
    if (!createOfferCommand.value.isRiskForm) {
        if (activeStep.value == 1 || activeStep.value == 2) {
            activeStep.value = 3
        } else {
            activeStep.value++
        }
    } else {
        activeStep.value++
    }
    setOfferInfoSessionStorage();
}

const clickBack = () => {
    if (activeStep.value == 1) {
        router.push({ name: 'offer-list' })
        return
    }

    if (!createOfferCommand.value.isRiskForm) {
        if (activeStep.value == 3) {
            activeStep.value = 1
        } else {
            activeStep.value--
        }
    } else {
        activeStep.value--
    }
}

</script>