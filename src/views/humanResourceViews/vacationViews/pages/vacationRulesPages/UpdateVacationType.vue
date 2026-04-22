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
                    <v-btn :loading="loading" @click="activeStep == 6 ? clickSubmit() : clickNext()">
                        {{ activeStep == 6 ? $t('general.save') : $t('general.next') }}
                    </v-btn>
                </v-col> -->
            </v-row>
        </v-col>
        <v-col cols="12">
            <CreateHorizontalWizardStepper :isClicked="true" style="justify-self: start;" :steps="steps"
                :activeStep="activeStep" @activeStepValue="clickStep($event)" :isErrorValidate="!isErrorValidate" />
            <v-window class="fill-height mt-4" v-model="activeStep">
                <v-window-item class="fill-height" v-for="step in steps" :key="step.id" :value="step.id">
                    <component :is="step.component" @clickNext="clickNext()" :commandModel="commandModel"
                        @clickBack="activeStep != 1 ? activeStep-- : ''" @formValidate="formValidate = $event" />
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, markRaw } from "vue";
import CreateHorizontalWizardStepper from "@/components/wizards/CreateHorizontalWizardStepper.vue";
import General from "./AddVacationTypeComponents/1General.vue";
import Accrual from "./AddVacationTypeComponents/2Accrual.vue";
import Request from "./AddVacationTypeComponents/6Request.vue";
import { UpdateLeaveTypeCommand } from "@/models/entities/humanResource/LeavePolicyCommands";
import { storeToRefs } from "pinia";
import { useLeavePolicyStore } from "@/stores/humanResourcesStores/leavePolicyStore";
import { useRoute, useRouter } from "vue-router";
import i18n from "@/core/plugins/i18n";
import AccrualFrequency from "./AddVacationTypeComponents/3AccrualFrequency.vue";
import type { LeaveTypeDetailDto } from "@/models/entities/humanResource/LeavePolicyDtos";
import Transfer from "./AddVacationTypeComponents/4Transfer.vue";
import Seniority from "./AddVacationTypeComponents/5Seniority.vue";
import { LimitationTypeEnum } from "@/models/custom/EnumTypes";
import { catchError } from "@/core/helpers/generalResponse";
const t = i18n.global.t;

const route = useRoute();
const router = useRouter();
const { leavePolicy } = storeToRefs(useLeavePolicyStore());

watch(() => leavePolicy.value, () => {
    if (leavePolicy.value.id) {
        getLeaveTypeDetail()
    }
})

onMounted(() => {
    if (leavePolicy.value.id) {
        getLeaveTypeDetail()
    }
    steps.value = filterSteps()
});

const getLeaveTypeDetail = () => {
    useLeavePolicyStore().getLeaveTypeDetail(leavePolicy.value.id, route.params.id.toString()).then((res) => {
        responseMatch(res)
    }).catch((error) => {
        return catchError(error, () => { getLeaveTypeDetail() })
    })
}

const filterSteps = () => {
    return initialSteps.value
        .filter((a) => a.id === 1 || a.id === 2 || a.id === 6)
        .map((a) => {
            return a;
        });
}

const commandModel = ref(new UpdateLeaveTypeCommand())

const activeStep = ref(1);
const isErrorValidate = ref(true)
const formValidate = ref(null as any);

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
const loading = ref(false)
const clickStep = (event: number) => {
    if (formValidate.value)
        formValidate.value.validate().then((res: any) => {
            isErrorValidate.value = res.valid
            if (res.valid) {
                activeStep.value = event
            }
        })
    else
        activeStep.value = event
}

const clickSubmit = () => {
    loading.value = true
    useLeavePolicyStore().updateLeaveType(leavePolicy.value.id, route.params.id.toString(), commandModel.value).then((res) => {
        useLeavePolicyStore().getLeavePolicy();
        router.push({ name: 'vacation-rules-list' })
    }).catch((error) => {
        return catchError(error, () => { clickSubmit() })
    }).finally(() => {
        loading.value = false
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


const responseMatch = (res: LeaveTypeDetailDto) => {
    commandModel.value.accrualFrequency = res.accrualFrequency
    commandModel.value.accrualSchedule = res.accrualSchedule
    commandModel.value.accrualStartDate = res.accrualStartDate
    commandModel.value.ageExceptionMinimumDays = res.ageException.minimumDays
    commandModel.value.hasAgeException = res.ageException.status
    commandModel.value.calculationType = res.calculationType
    commandModel.value.carryoverLimitDays = res.carryoverLimit.days
    commandModel.value.carryoverLimitDeadLine = res.carryoverLimit.deadline
    commandModel.value.carryoverLimitation = res.carryoverLimitation
    commandModel.value.dayLimit = res.dayLimit
    commandModel.value.description = res.description
    commandModel.value.hasWaitingPeriod = res.waitingPeriod.status
    commandModel.value.waitingPeriod = res.waitingPeriod.months
    commandModel.value.isEnabled = res.isEnabled
    commandModel.value.isMessageRequired = res.isMessageRequired
    commandModel.value.isOverriddenHolidays = res.isOverriddenHolidays
    commandModel.value.isPaid = res.isPaid
    commandModel.value.isShownInCalendar = res.isPrimary
    commandModel.value.isSubstituteRequired = res.isSubstituteRequired
    commandModel.value.leastDayCount = res.leastDayCount
    commandModel.value.limitation = res.limitation
    commandModel.value.mostDayCount = res.mostDayCount
    commandModel.value.name = res.name
    commandModel.value.overdrawn = res.overdrawn
    commandModel.value.overdrawnLimit = res.overdrawnLimit
    commandModel.value.seniorities = res.seniority
    commandModel.value.shouldAffectSeniority = res.shouldAffectSeniority
    commandModel.value.id = res.id
}

</script>