<template>
    <v-card>
        <v-card-text>
            <v-col cols="12" class="text-h6 font-weight-bold">
                {{ $t('form.transfer') }}
            </v-col>
            <v-col cols="12" class="text-body-1">
                {{ $t('form.transferDesc') }}
            </v-col>
            <v-form ref="transferForm">
                <v-col cols="12" md="7" class="text-body-1">
                    <v-radio-group v-model="commandModel.carryoverLimitation">
                        <v-radio class="my-3" :value="CarryoverLimitationType.BalanceReset">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.BalanceReset') }}</span> <br>
                                    {{ $t('form.balanceResetDesc') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="CarryoverLimitationType.UnlimitedCarryover">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.UnlimitedCarryover') }}</span> <br>
                                    {{ $t('form.unlimitedCarryoverDesc') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="CarryoverLimitationType.LimitedBalance">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.LimitedBalance') }}</span> <br>
                                    {{ $t('form.limitedBalanceDesc') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="CarryoverLimitationType.LimitedCarryover">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.LimitedCarryover') }}</span> <br>
                                    {{ $t('form.limitedCarryoverDesc') }}
                                </p>
                            </template>
                        </v-radio>
                        <v-radio class="my-3" :value="CarryoverLimitationType.LimitedCarryoverWithDeadline">
                            <template #label>
                                <p class="ma-0">
                                    <span class="font-weight-bold">{{ $t('enums.LimitedCarryoverWithDeadline') }}</span>
                                    <br>
                                    {{ $t('form.limitedCarryoverWithDeadlineDesc') }}
                                </p>
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" md="7" v-if="commandModel.carryoverLimitation == CarryoverLimitationType.LimitedBalance ||
                    commandModel.carryoverLimitation == CarryoverLimitationType.LimitedCarryover ||
                    commandModel.carryoverLimitation == CarryoverLimitationType.LimitedCarryoverWithDeadline">
                    <TextField v-model="commandModel.carryoverLimitDays" label="form.carryoverLimitDays" :max="365"
                        isNumber isRequired />
                </v-col>
                <v-col cols="12" md="7"
                    v-if="commandModel.carryoverLimitation == CarryoverLimitationType.LimitedCarryoverWithDeadline">
                    <TextField v-model="commandModel.carryoverLimitDeadLine" label="form.carryoverLimitDeadLine"
                        :max="52" isNumber isRequired />
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
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { ref, watch, type PropType } from 'vue';
import { CarryoverLimitationType } from '@/models/custom/EnumTypes';

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

const transferForm = ref(null as any)

watch(() => transferForm.value, () => {
    emit('formValidate', transferForm.value)
})

watch(() => prop.activeStep, () => {
    if (prop.activeStep == 4)
        emit('formValidate', transferForm.value)
})
</script>