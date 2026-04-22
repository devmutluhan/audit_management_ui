<template>
    <DialogContent title="general.updateEmergencyContact" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addEmergencyContactForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="list.fullName" v-model="commandModel.emergencyPersonFullName" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.phoneNumber" isPhoneNumber v-model="commandModel.emergencyPersonPhone" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.degreeOfCloseness" v-model="commandModel.emergencyClosenessDegree" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { UpdateEmergencyPersonDetailCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { storeToRefs } from 'pinia';
const route = useRoute()
const commandModel = ref(new UpdateEmergencyPersonDetailCommand())
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addEmergencyContactForm = ref(null as any);
const addEmergencyContact = () => {
    addEmergencyContactForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().updateEmployeeEmergency(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.emergencyClosenessDegree = commandModel.value.emergencyClosenessDegree
                employeeDetail.value.emergencyPersonFullName = commandModel.value.emergencyPersonFullName
                employeeDetail.value.emergencyPersonPhone = commandModel.value.emergencyPersonPhone
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addEmergencyContact())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}


onMounted(() => {
    commandModel.value.emergencyClosenessDegree = employeeDetail.value.emergencyClosenessDegree
    commandModel.value.emergencyPersonFullName = employeeDetail.value.emergencyPersonFullName
    commandModel.value.emergencyPersonPhone = employeeDetail.value.emergencyPersonPhone
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: () => addEmergencyContact(),
        loading: false
    }
])

</script>