<template>
    <DialogContent title="general.addVacationSeniority" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addVacationSeniorityForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.year" label="form.seniortyYear" isNumber
                            description-text="form.seniortyYearDesc" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextField v-model="commandModel.additionalDays" description-text="form.additionalDaysDesc"
                            isNumber label="form.additionalDays" isRequired :max="365" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { SeniortyDto } from '@/models/entities/humanResource/LeavePolicyCommands';

const emit = defineEmits(['createItem']);

const commandModel = ref(new SeniortyDto())

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addVacationSeniorityForm = ref(null as any);
const createLeaveType = () => {
    addVacationSeniorityForm.value.validate().then((res: any) => {
        if (res.valid) {
            emit('createItem', commandModel.value)
            props.dialogClose();
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createLeaveType,
        loading: false
    }
])

</script>