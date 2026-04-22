<template>
    <DialogContent title="general.updateFamily" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="addFamilyForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <SingleAutocompleteInput label="list.maritalStatus" :items="enumToArray(MaritalStatusTypeEnum)"
                            item-title="title" item-value="value" v-model="commandModel.maritalStatus" />
                    </v-col>
                    <v-col cols="12" md="8">
                        <TextField label="list.childrenStatus" isNumber
                            v-model.number="commandModel.numberOfChildren" />
                    </v-col>
                    <v-col cols="12" md="4" v-if="commandModel.maritalStatus == MaritalStatusTypeEnum.Married">
                        <SwitchInput label="list.partnerWorkStatus" v-model="commandModel.partnerWorkStatus" />
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
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { UpdateMaritalDetailCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { catchError } from '@/core/helpers/generalResponse';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { MaritalStatusTypeEnum } from '@/models/custom/EnumTypes';

const route = useRoute()
const commandModel = ref(new UpdateMaritalDetailCommand())
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addFamilyForm = ref(null as any);
const addEmployeeFamily = () => {
    addFamilyForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;

            if (commandModel.value.maritalStatus != MaritalStatusTypeEnum.Married) {
                commandModel.value.partnerWorkStatus = false;
            }

            useEmployeeCommandStore().updateEmployeeMaritalDetail(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.maritalStatus = commandModel.value.maritalStatus
                employeeDetail.value.numberOfChildren = commandModel.value.numberOfChildren
                employeeDetail.value.partnerWorkStatus = commandModel.value.partnerWorkStatus
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addEmployeeFamily())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    commandModel.value.maritalStatus = employeeDetail.value.maritalStatus
    commandModel.value.numberOfChildren = employeeDetail.value.numberOfChildren
    commandModel.value.partnerWorkStatus = employeeDetail.value.partnerWorkStatus
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: () => addEmployeeFamily(),
        loading: false
    }
])


</script>