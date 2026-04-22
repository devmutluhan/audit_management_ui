<template>
    <v-card>
        <v-card-text>
            <v-form ref="requestForm">
                <v-col cols="12" class="text-h6 font-weight-bold">
                    {{ $t('form.request') }}
                </v-col>
                <v-col cols="12" md="7" v-if="commandModel.limitation === LimitationTypeEnum.LimitedToYear">
                    <TextField v-model="commandModel.leastDayCount" label="form.leastDayCount" :max="365" isNumber
                        description-text="form.leastDayCountDescription" />
                </v-col>
                <v-col cols="12" md="7" v-if="commandModel.limitation === LimitationTypeEnum.LimitedToYear">
                    <TextField v-model="commandModel.mostDayCount" label="form.mostDayCount" :max="365" isNumber
                        description-text="form.mostDayCountDescription" />
                </v-col>
                <v-col cols="12" md="7">
                    <SingleSelectInput v-model="commandModel.calculationType" label="form.calculationType"
                        description-text="form.calculationTypeDesc" isRequired :items="enumToArray(CalculationTypeEnum)"
                        item-value="value" item-title="title">
                    </SingleSelectInput>
                </v-col>
                <v-col cols="12" md="7">
                    <v-checkbox v-model="commandModel.isMessageRequired" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.isMessageRequired') }}</span> <br>
                                {{ $t('form.isMessageRequiredDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                </v-col>
                <v-col cols="12" md="7">
                    <v-checkbox v-model="commandModel.isSubstituteRequired" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.isSubstituteRequired') }}</span> <br>
                                {{ $t('form.isSubstituteRequiredDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                </v-col>
                <v-col cols="12" md="7">
                    <v-checkbox v-model="commandModel.hasWaitingPeriod"
                        @update:model-value="commandModel.waitingPeriod = 0" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.hasWaitingPeriod') }}</span> <br>
                                {{ $t('form.hasWaitingPeriodDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                    <v-row v-if="commandModel.hasWaitingPeriod" class="d-flex justify-center">
                        <v-col cols="6">
                            <TextField v-model="commandModel.waitingPeriod" label="list.duration" :max="12" isNumber
                                description-text="form.waitingPeriod" isRequired />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="7">
                    <v-checkbox v-model="commandModel.isShownInCalendar" color="success">
                        <template #label>
                            <p class="ma-0">
                                <span class="font-weight-bold">{{ $t('form.isShownInCalendar') }}</span> <br>
                                {{ $t('form.isShownInCalendarDescription') }}
                            </p>
                        </template>
                    </v-checkbox>
                </v-col>
            </v-form>
            <v-col cols="12" md="7">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <v-btn @click="emit('clickBack')" color="cancelButtonColor">
                            {{ $t('general.back') }}</v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="emit('clickNext')" :loading="loading">
                            {{ activeStep == 6 ? $t('general.save') : $t('general.next') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { CreateLeaveTypeCommand } from '@/models/entities/humanResource/LeavePolicyCommands';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { ref, watch, type PropType } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { CalculationTypeEnum, LimitationTypeEnum } from '@/models/custom/EnumTypes';

const emit = defineEmits(['formValidate', 'clickNext', 'clickBack', 'clickSubmit'])
const prop = defineProps({
    commandModel: {
        type: Object as PropType<CreateLeaveTypeCommand>,
        required: true
    },
    activeStep: {
        type: Number,
        required: true
    },
    loading: {
        type: Boolean,
        required: false
    }
})
const requestForm = ref(null as any);

watch(() => requestForm.value, () => {
    emit('formValidate', requestForm.value)
})

watch(() => prop.activeStep, () => {
    if (prop.activeStep == 6) {
        emit('formValidate', requestForm.value)
    }
})

</script>