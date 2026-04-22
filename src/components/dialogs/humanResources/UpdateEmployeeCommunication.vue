<template>
    <DialogContent title="general.updateCommunication" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addCommunicationForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="form.workingEmail"
                            :disabled="employeeDetail.appUserState != EmployeeStatusTypeEnum.NoneEmployee"
                            descriptionText="statusCode.isLoggedInSystemEmailEdited" v-model="commandModel.workEmail"
                            isEmail />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.workingPhoneNumber" isPhoneNumber v-model="commandModel.workPhone" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.email" v-model="commandModel.personalEmail" isEmail />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="form.phoneNumber" isPhoneNumber v-model="commandModel.mobilePhone" />
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
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { UpdateEmployeeCommunicationCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { catchError } from '@/core/helpers/generalResponse';
import { useRoute } from 'vue-router';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new UpdateEmployeeCommunicationCommand());

const route = useRoute()
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addCommunicationForm = ref(null as any);
const addEmployeeCommunication = () => {
    addCommunicationForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().updateEmployeeCommunication(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.mobilePhone = commandModel.value.mobilePhone
                employeeDetail.value.personalEmail = commandModel.value.personalEmail
                employeeDetail.value.workEmail = commandModel.value.workEmail
                employeeDetail.value.workPhone = commandModel.value.workPhone
                props.dialogClose()
            }).catch((error) => {
                return catchError(error, () => addEmployeeCommunication());
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}


onMounted(() => {
    commandModel.value.mobilePhone = employeeDetail.value.mobilePhone;
    commandModel.value.personalEmail = employeeDetail.value.personalEmail;
    commandModel.value.workEmail = employeeDetail.value.workEmail;
    commandModel.value.workPhone = employeeDetail.value.workPhone;
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: addEmployeeCommunication,
        loading: false
    }
])

</script>