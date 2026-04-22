<template>
    <DialogContent title="general.addPosition" :dialogClose="dialogClose" titleIcon="mdi-plus" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addPositionForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createExperienceCommand.companyBranchId"
                            label="form.companyBranch" :items="companyBranchList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createExperienceCommand.departmentId" label="form.department"
                            :items="departmentList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <MultipleAutocompleteInput v-model="createExperienceCommand.positionIds" label="form.position"
                            :items="positionList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createExperienceCommand.defaultPositionId"
                            :disabled="selectedPositions.length == 0" label="form.positionTitle"
                            :items="selectedPositions" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <EmployeeSelectInput justId @selectValue="createExperienceCommand.managerId = $event"
                            label="form.manager" :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createExperienceCommand.employmentType"
                            label="form.employmentType" :items="employementTypes" item-title="title" item-value="value"
                            isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="createExperienceCommand.startDate" :min="minDateValidate()" isRequired
                            label="form.startDate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="createExperienceCommand.endDate" label="form.endDate" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { EmployeeStatusTypeEnum, EmploymentTypeEnum } from '@/models/custom/EnumTypes';
import { CreateEmployeeExperienceCommand } from '@/models/entities/humanResource/EmployeeCommands';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { useRoute } from 'vue-router';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { catchError } from '@/core/helpers/generalResponse';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import type { LookupDto } from '@/models/ApiResult';

const route = useRoute();

const { employeeExperience } = storeToRefs(useEmployeeDtoStore())

const selectedPositions = ref([] as any)
const managementDtoStore = useManagementDtoStore();
const createExperienceCommand = ref(new CreateEmployeeExperienceCommand());
const employementTypes = enumToArray(EmploymentTypeEnum);
const { departmentList, companyBranchList, positionList } = storeToRefs(managementDtoStore);

managementDtoStore.getDepartmentList({ pageSize: 1000, pageNumber: 1 });
managementDtoStore.getCompanyBranchList({ pageSize: 1000, pageNumber: 1 });
managementDtoStore.getPositionList({ pageSize: 1000, pageNumber: 1 });

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});
const addPositionForm = ref(null as any);
const createPosition = () => {
    addPositionForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().createEmployeeExperience(route.params.id.toString(), createExperienceCommand.value).then((res: any) => {
                props.dialogClose();
                useEmployeeDtoStore().getEmployeeExperience(route.params.id.toString());
            }).catch((error) => {
                return catchError(error, () => createPosition())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const minDateValidate = () => {
    const lastExperience = employeeExperience.value[employeeExperience.value.length - 1];
    if (employeeExperience.value.length > 0) {
        return lastExperience.endDate ? lastExperience.endDate : lastExperience.startDate;
    } else {
        return ''
    }
}

watch(() => createExperienceCommand.value.positionIds, (value) => {
    selectedPositions.value = positionList.value.filter((x: LookupDto) => {
        if (value?.includes(x.id)) {
            return x;
        }
    });
    if (!value?.includes(createExperienceCommand.value.defaultPositionId ?? '')) {
        createExperienceCommand.value.defaultPositionId = null
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createPosition,
        loading: false
    }
]);

</script>