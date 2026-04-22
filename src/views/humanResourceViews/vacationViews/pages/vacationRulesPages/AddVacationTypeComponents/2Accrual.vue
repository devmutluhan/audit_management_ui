<template>
    <v-card>
        <v-card-text>
            <v-form ref="vacationAccrualForm">
                <v-col cols="12" class="text-h6 font-weight-bold">
                    {{ $t('form.entitlement') }}
                </v-col>
                <v-col cols="12">
                    <SwitchInput v-model="commandModel.isPaid"
                        :label="commandModel.isPaid ? 'form.paid' : 'form.unPaid'" description-text="form.isPaidOrFree"
                        @update:model-value="commandModel.shouldAffectSeniority = false" />
                </v-col>
                <v-col cols="12" class="text-body-1" v-if="!commandModel.isPaid">
                    <p class="ma-0 font-weight-bold ">{{ $t('form.entitlementDate') }}</p>
                    <p>{{ $t('form.entitlementDateDescription') }}</p>
                    <v-checkbox v-model="commandModel.shouldAffectSeniority" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.postponementOfVestingDate') }}</span> <br>
                                {{ $t('form.postponementOfVestingDateDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                </v-col>
                <v-col cols="12" md="6">
                    <SingleSelectInput v-model="commandModel.limitation" label="form.limitType" isRequired
                        :items="enumToArray(LimitationTypeEnum)" item-value="value" item-title="title">
                    </SingleSelectInput>
                </v-col>
                <v-col cols="6" v-if="commandModel.limitation !== LimitationTypeEnum.NotLimited">
                    <TextField v-model="commandModel.dayLimit" label="form.day" :max="365" isNumber
                        :description-text="commandModel.limitation == LimitationTypeEnum.LimitedToYear ? 'form.vacationRuleDayDescription2' : 'form.vacationRuleDayDescription'"
                        :isRequired="commandModel.limitation !== LimitationTypeEnum.NotLimited" />
                </v-col>
                <v-col cols="12" v-if="commandModel.limitation === LimitationTypeEnum.LimitedToYear">
                    <v-checkbox v-model="commandModel.hasAgeException" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.ageException') }}</span> <br>
                                {{ $t('form.ageExceptionDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                </v-col>
                <v-col cols="6" v-if="commandModel.hasAgeException">
                    <TextField v-model="commandModel.ageExceptionMinimumDays" label="form.ageExceptionMinimumDays"
                        :max="365" isNumber />
                </v-col>
                <v-col cols="12 text-body-1" v-if="commandModel.limitation === LimitationTypeEnum.LimitedToYear">
                    <p class="font-weight-bold mb-0">{{ $t('form.overdrawn') }}</p>
                    <p>{{ $t('form.leaveRequestNotEligible') }}</p>
                    <v-radio-group v-model="commandModel.overdrawn">
                        <v-radio class="my-3" :value="OverdrawnTypeEnum.NoOverdrawn">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.NoOverdrawn') }}</span> <br>
                                    {{ $t('form.noOverdrawnDescription') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="OverdrawnTypeEnum.Unlimited">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.Unlimited') }}</span> <br>
                                    {{ $t('form.unlimitedDescription') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="OverdrawnTypeEnum.Limited">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.Limited') }}</span> <br>
                                    {{ $t('form.limitedDescription') }}
                                </p>
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12"
                    v-if="commandModel.limitation === LimitationTypeEnum.LimitedToYear && commandModel.overdrawn == OverdrawnTypeEnum.Limited">
                    <TextField v-model="commandModel.overdrawnLimit" label="form.ageExceptionMinimumDays" :max="365"
                        :isRequired="commandModel.overdrawn == OverdrawnTypeEnum.Limited" isNumber />
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-btn @click="emit('clickBack')" color="cancelButtonColor">
                                {{ $t('general.back') }}
                            </v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn @click="emit('clickNext')">{{ $t('general.next') }}</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import type { CreateLeaveTypeCommand } from '@/models/entities/humanResource/LeavePolicyCommands';
import { ref, watch, type PropType } from 'vue';
import { LimitationTypeEnum, OverdrawnTypeEnum } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';

const emit = defineEmits(['formValidate', 'clickNext', 'clickBack'])
const prop = defineProps({
    commandModel: {
        type: Object as PropType<CreateLeaveTypeCommand>,
        required: true
    },
    activeStep: {
        type: Number,
        required: true
    }
})

const vacationAccrualForm = ref(null as any)

watch(() => vacationAccrualForm.value, () => {
    emit('formValidate', vacationAccrualForm.value)
})

watch(() => prop.activeStep, () => {
    if (prop.activeStep == 2)
        emit('formValidate', vacationAccrualForm.value)
})

</script>