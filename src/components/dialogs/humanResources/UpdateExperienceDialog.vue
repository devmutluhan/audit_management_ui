<template>
    <DialogContent title="general.updatePosition" :dialogClose="dialogClose" titleIcon="mdi-pencil" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="updateExperienceForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="updateExperienceCommand.companyBranchId"
                            label="form.companyBranch" :items="companyBranchList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="updateExperienceCommand.departmentId" label="form.department"
                            :items="departmentList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <EmployeeSelectInput justId @selectValue="updateExperienceCommand.managerId = $event"
                            label="form.manager" :selectItems="[selectManager]"
                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="updateExperienceCommand.employmentType"
                            label="form.employmentType" :items="employementTypes" item-title="title" item-value="value"
                            isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <MultipleAutocompleteInput v-model="updateExperienceCommand.positionIds" label="form.position"
                            :items="positionList" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="updateExperienceCommand.defaultPositionId"
                            label="form.positionTitle" :items="selectedPositions"
                            :disabled="selectedPositions.length == 0" item-title="name" item-value="id" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { EmployeeStatusTypeEnum, EmploymentTypeEnum } from '@/models/custom/EnumTypes';
import { UpdateEmployeeExperienceCommand } from '@/models/entities/humanResource/EmployeeCommands';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { useRoute } from 'vue-router';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { catchError } from '@/core/helpers/generalResponse';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { watch } from 'vue';
import type { LookupDto } from '@/models/ApiResult';

const route = useRoute();

const managementDtoStore = useManagementDtoStore();
const updateExperienceCommand = ref(new UpdateEmployeeExperienceCommand());
const employementTypes = enumToArray(EmploymentTypeEnum);
const selectedPositions = ref(new Array<any>());

const { departmentList, companyBranchList, positionList } = storeToRefs(managementDtoStore);
const selectManager = ref(null as any);

managementDtoStore.getDepartmentList({ pageSize: 1000, pageNumber: 1 });
managementDtoStore.getCompanyBranchList({ pageSize: 1000, pageNumber: 1 });

managementDtoStore.getPositionList({ pageSize: 1000, pageNumber: 1 }).finally(() => {
    selectedPositions.value = positionList.value.filter((x: LookupDto) => {
        if (updateExperienceCommand.value.positionIds?.includes(x.id))
            return x;
    });
});

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    }
});

const updateExperienceForm = ref(null as any);

const updateExperience = () => {
    updateExperienceForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useEmployeeCommandStore().updateEmployeeExperience(route.params.id.toString(), props.selectedItem.id, updateExperienceCommand.value).then((res: any) => {
                props.dialogClose();
                useEmployeeDtoStore().getEmployeeExperience(route.params.id.toString());
            }).catch((error) => {
                return catchError(error, () => updateExperience())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
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
        click: updateExperience,
        loading: false
    }
]);

watch(() => updateExperienceCommand.value.positionIds, (value) => {
    selectedPositions.value = positionList.value.filter((x: LookupDto) => {
        if (value?.includes(x.id)) {
            return x;
        }
    });
    if (!value?.includes(updateExperienceCommand.value.defaultPositionId ?? '')) {
        updateExperienceCommand.value.defaultPositionId = null
    }
})

onMounted(() => {
    if (props.selectedItem) {
        selectManager.value = props.selectedItem.manager;
        updateExperienceCommand.value = {
            companyBranchId: props.selectedItem.companyBranch?.id ?? null,
            departmentId: props.selectedItem.department?.id ?? null,
            defaultPositionId: props.selectedItem.positions?.find((x: any) => x.isDefault)?.id ?? null,
            positionIds: props.selectedItem.positions?.map((x) => x.id) ?? null,
            managerId: props.selectedItem.manager?.id ?? null,
            employmentType: props.selectedItem.employmentType ?? EmploymentTypeEnum.Fulltime
        }
    }
})
</script>