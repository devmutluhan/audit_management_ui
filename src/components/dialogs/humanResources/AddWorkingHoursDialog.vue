<template>
    <DialogContent title="general.addWorkingHours" :dialogClose="dialogClose" titleIcon="mdi-airplane"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="12" sm="6" md="3">
                    <DateInput v-model="commandModel.startDate" label="form.startDate" />
                </v-col>
                <v-col cols="12" sm="6" md="3" class="pt-12">
                    <TextField v-model="commandModel.time" type="time" />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <TextField v-model="commandModel.duration" type="number" label="list.duration" />
                </v-col>
                <v-col cols="12" sm="6" md="3" class="pt-12">
                    <TextField v-model="commandModel.duration" type="number" />
                </v-col>
            </v-row>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="12">
                    <TextArea v-model="commandModel.description" label="form.description" />
                </v-col>
            </v-row>
            <v-row class="d-flex align-center">
                <v-col cols="12" class="py-1">
                    <SwitchInput v-model="commandModel.skipApprovalProcess" label="form.skipApprovalProcess" />
                </v-col>
                <v-col cols="12" class="py-1">
                    <SwitchInput v-model="commandModel.sendEmailToEmployee" label="form.sendEmailToEmployee" />
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';

const commandModel = ref({} as any)
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const buttons = [
    {
        type: 'close',
        click: props.dialogClose,
    },
    {
        type: 'save',
        click: () => { }
    }
]

</script>