<template>
    <v-card>
        <v-card-text>
            <v-form ref="vacationAccrualForm">
                <v-col cols="12" class="text-h6 font-weight-bold">
                    {{ $t('form.entitlementFrequency') }}
                </v-col>
                <v-col cols="12" md="7">
                    <SingleSelectInput v-model="commandModel.accrualFrequency" label="form.entitlementFrequency"
                        description-text="form.entitlementFrequencyDesc" isRequired
                        @update:model-value="commandModel.accrualFrequency == AccrualFrequencyType.Monthly ? commandModel.accrualStartDate = AccrualStartDateType.CustomDate : ''"
                        :items="enumToArray(AccrualFrequencyType)" item-value="value" item-title="title">
                    </SingleSelectInput>
                    <p class="ma-0 mt-n6">{{
                        commandModel.calculationType == AccrualFrequencyType.Daily ? $t('form.accrualDailyDesc') :
                            commandModel.calculationType == AccrualFrequencyType.Monthly ? $t('form.accrualMonthlyDesc') :
                                commandModel.calculationType == AccrualFrequencyType.Yearly ? $t('form.accrualYearlyDesc') : ''
                    }}
                    </p>
                </v-col>
                <v-col cols="12" md="7">
                    <SingleSelectInput v-model="commandModel.accrualSchedule" label="form.accrualSchedule"
                        description-text="form.accrualScheduleDesc" isRequired :items="enumToArray(AccrualScheduleType)"
                        item-value="value" item-title="title">
                    </SingleSelectInput>
                </v-col>
                <v-col cols="12" md="7" class="text-body-1">
                    <p class="ma-0 mb-2  font-weight-bold">
                        {{ $t('form.accrualStartDate') }}
                    </p>
                    <p class="ma-0">
                        {{ $t('form.accrualStartDateDesc') }}
                    </p>
                </v-col>
                <v-col cols="12" md="7" class="text-body-1">
                    <v-radio-group v-model="commandModel.accrualStartDate">
                        <v-radio class="my-3" :value="AccrualStartDateType.FirstDayOfTheYear"
                            :disabled="commandModel.accrualFrequency == AccrualFrequencyType.Monthly">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.FirstDayOfTheYear') }}</span> <br>
                                    {{ $t('form.firstDayOfTheYearDesc') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="AccrualStartDateType.CustomDate">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.CustomDate') }}</span> <br>
                                    {{ $t('form.customDateDesc') }}
                                </p>
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" md="7">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-btn @click="emit('clickBack')" color="cancelButtonColor">
                                {{ $t('general.back') }}</v-btn>
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
import type { CreateLeaveTypeCommand } from '@/models/entities/humanResource/LeavePolicyCommands';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { watch, type PropType } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { AccrualFrequencyType, AccrualScheduleType, AccrualStartDateType } from '@/models/custom/EnumTypes';

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

watch(() => prop.activeStep, () => {
    if (prop.activeStep == 3) {
        // emit('formValidate', vacationAccrualForm.value)
    }
})
</script>