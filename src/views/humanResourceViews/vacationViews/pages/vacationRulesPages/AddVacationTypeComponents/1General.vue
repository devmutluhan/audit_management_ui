<template>
    <v-card>
        <v-card-text>
            <v-form ref="vacationGeneralForm">
                <v-col cols="12" class="text-h6 font-weight-bold">
                    {{ $t('form.general') }}
                </v-col>
                <v-col cols="12" md="6">
                    <TextField v-model="commandModel.name" label="form.name" isRequired />
                </v-col>
                <v-col cols="12" md="6">
                    <TextField v-model="commandModel.description" label="form.description" />
                </v-col>
            </v-form>
            <v-col cols="12" md="6">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <v-btn @click="router.push({ name: 'vacation-rules-list' })" color="cancelButtonColor">
                            {{ $t('general.cancel') }}</v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="emit('clickNext')">{{ $t('general.next') }}</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import type { CreateLeaveTypeCommand } from '@/models/entities/humanResource/LeavePolicyCommands';
import { watch } from 'vue';
import { ref, type PropType } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['formValidate', 'clickNext'])
const router = useRouter()
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

const vacationGeneralForm = ref(null as any);

watch(() => vacationGeneralForm.value, () => {
    emit('formValidate', vacationGeneralForm.value)
})

watch(() => prop.activeStep, () => {
    if (prop.activeStep == 1)
        emit('formValidate', vacationGeneralForm.value)
})

</script>