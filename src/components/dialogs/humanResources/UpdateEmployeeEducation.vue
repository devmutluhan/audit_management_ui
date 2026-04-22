<template>
    <DialogContent title="general.updateEducation" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addEducationForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.educationStatus"
                            :items="enumToArray(EducationStatusTypeEnum)" v-model="commandModel.educationStatus"
                            item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.educationLevel" :items="enumToArray(EducationLevel)"
                            v-model="commandModel.educationLevel" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.educationalInstitution" v-model="commandModel.educationalInstitution" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { EducationLevel, EducationStatusTypeEnum } from '@/models/custom/EnumTypes';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { UpdateEducationDetailCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import TextField from '@/components/formInput/generalInputs/TextField.vue';

const route = useRoute()
const commandModel = ref(new UpdateEducationDetailCommand())
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addEducationForm = ref(null as any);
const addEmployeeEducation = () => {
    addEducationForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().updateEmployeeEducationDetail(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.educationLevel = commandModel.value.educationLevel
                employeeDetail.value.educationStatus = commandModel.value.educationStatus
                employeeDetail.value.educationalInstitution = commandModel.value.educationalInstitution
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addEmployeeEducation())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    commandModel.value.educationLevel = employeeDetail.value.educationLevel
    commandModel.value.educationStatus = employeeDetail.value.educationStatus
    commandModel.value.educationalInstitution = employeeDetail.value.educationalInstitution
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: addEmployeeEducation,
        loading: false
    }
])

</script>