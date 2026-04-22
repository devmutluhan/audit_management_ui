<template>
    <v-row class="d-flex justify-center">
        <v-col cols="12">
            <v-row>
                <v-col cols="auto">
                    <router-link class="text-h5 font-weight-bold text-black mb-3 mt-2 ma-0"
                        :to="{ name: 'vacation-rules-list' }">
                        <v-icon>mdi-chevron-left</v-icon>
                        {{ commandModel.name }}
                    </router-link>
                    <p class="text-h6 font-weight-bold text-primary"> {{ commandModel.description }}</p>
                </v-col>
                <!-- <v-spacer></v-spacer>
                <v-col cols="auto">
                    <v-btn @click="activeStep == 6 ? clickSubmit() : clickNext()" :loading="loading">
                        {{ activeStep == 6 ?
                            $t('general.save') : $t('general.next') }} </v-btn>
                </v-col> -->
            </v-row>
        </v-col>
        <v-col cols="12">
            <CreateHorizontalWizardStepper :isClicked="true" style="justify-self: start;" :steps="steps"
                :activeStep="activeStep" @activeStepValue="clickStep($event)" :isErrorValidate="!isErrorValidate" />
            <v-window class="fill-height mt-4" v-model="activeStep">
                <v-window-item class="fill-height" v-for="step in steps" :key="step.id" :value="step.id">
                    <component :is="step.component" @clickNext="activeStep == 6 ? clickSubmit() : clickNext()"
                        :commandModel="commandModel" :activeStep="activeStep" @clickBack="clickBack()"
                        @formValidate="formValidate = $event" :loading="loading" />
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref, watch, markRaw } from "vue";
import CreateHorizontalWizardStepper from "@/components/wizards/CreateHorizontalWizardStepper.vue";
import General from "./AddVacationTypeComponents/1General.vue";
import Accrual from "./AddVacationTypeComponents/2Accrual.vue";
import Request from "./AddVacationTypeComponents/6Request.vue";
import { CreateLeaveTypeCommand } from "@/models/entities/humanResource/LeavePolicyCommands";
import i18n from "@/core/plugins/i18n";
import AccrualFrequency from "./AddVacationTypeComponents/3AccrualFrequency.vue";
import Transfer from "./AddVacationTypeComponents/4Transfer.vue";
import Seniority from "./AddVacationTypeComponents/5Seniority.vue";
import { LimitationTypeEnum } from "@/models/custom/EnumTypes";
import { useLeavePolicyStore } from "@/stores/humanResourcesStores/leavePolicyStore";
import { storeToRefs } from "pinia";
import { catchError } from "@/core/helpers/generalResponse";
import { onMounted } from "vue";
import router from "@/router";
const t = i18n.global.t;

const filterSteps = () => {
    return initialSteps.value
        .filter((a) => a.id === 1 || a.id === 2 || a.id === 6)
        .map((a) => {
            return a;
        });
}

const { leavePolicy } = storeToRefs(useLeavePolicyStore())
const commandModel = ref(new CreateLeaveTypeCommand())

const activeStep = ref(1);
const isErrorValidate = ref(true)
const formValidate = ref(null as any);
const loading = ref(false)

onMounted(() => {
    steps.value = filterSteps()
})

const clickNext = () => {
    if (formValidate.value)
        formValidate.value.validate().then((res: any) => {
            isErrorValidate.value = res.valid
            if (res.valid) {
                if (steps.value.length < initialSteps.value.length) {
                    activeStep.value == 2 ? activeStep.value = 6 : activeStep.value++
                } else {
                    activeStep.value++
                }
            }
        })
    else {
        if (steps.value.length < initialSteps.value.length) {
            activeStep.value == 2 ? activeStep.value = 6 : activeStep.value++
        } else {
            activeStep.value++
        }
    }
}

const clickBack = () => {
    if (steps.value.length < initialSteps.value.length) {
        if (activeStep.value == 6)
            activeStep.value = 2
        else
            activeStep.value--
    } else {
        activeStep.value--
    }
}

const clickStep = (event: number) => {
    if (activeStep.value < event) {
        if (formValidate.value)
            formValidate.value.validate().then((res: any) => {
                isErrorValidate.value = res.valid
                if (res.valid) {
                    activeStep.value = event
                }
            })
        else
            activeStep.value = event
    } else {
        activeStep.value = event
    }
}

const clickSubmit = () => {
    formValidate.value.validate().then((res: any) => {
        isErrorValidate.value = res.valid
        if (res.valid) {
            loading.value = true
            useLeavePolicyStore().createLeaveType(leavePolicy.value.id, commandModel.value).then((res) => {
                useLeavePolicyStore().getLeavePolicy();
                router.push({ name: 'vacation-rules-list' })
            }).catch((error) => {
                return catchError(error, () => { clickSubmit() })
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

const steps = ref([] as any)
const initialSteps = ref([
    {
        id: 1,
        title: t('form.general'),
        component: markRaw(General),
    },
    {
        id: 2,
        title: t('form.entitlement'),
        component: markRaw(Accrual),
    },
    {
        id: 3,
        title: t('form.entitlementFrequency'),
        component: markRaw(AccrualFrequency),
    },
    {
        id: 4,
        title: t('form.transfer'),
        component: markRaw(Transfer),
    },
    {
        id: 5,
        title: t('form.seniority'),
        component: markRaw(Seniority),
    },
    {
        id: 6,
        title: t('form.request'),
        component: markRaw(Request),
    }
]);

watch(() => commandModel.value.limitation, (newValue) => {
    if (newValue == LimitationTypeEnum.LimitedToYear) {
        steps.value.splice(2, 1)
        steps.value.push(initialSteps.value[2])
        steps.value.push(initialSteps.value[3])
        steps.value.push(initialSteps.value[4])
        steps.value.push(initialSteps.value[5])
    } else {
        steps.value = filterSteps();
    }
})

</script>