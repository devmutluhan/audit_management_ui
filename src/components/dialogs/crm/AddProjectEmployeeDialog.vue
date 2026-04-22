<template>
    <DialogContent title="general.addEmployee" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addProjectEmployeeForm">
                <v-row class="d-flex align-center" v-for="(item, index) in selectItems" :key="index">
                    <v-col cols="12" md="5">
                        <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                            :disabledItem="(a) => { return disabledEmployee(a) }"
                            @selectValue="$event ? item.employee = $event : item.employee = new EmployeeDropdownListDto()"
                            isRequired :clearable="false">
                        </EmployeeSelectInput>
                    </v-col>
                    <v-col cols="10" md="5">
                        <SingleSelectInput v-model="item.positionId" :items="item.employee?.positions ?? []"
                            item-title="name" item-value="id" :disabled="disablePositionInput(item)"
                            label="form.position" isRequired>
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="auto" align="end">
                        <v-btn color="error" @click="selectItems.splice(index, 1);" icon="mdi-delete" variant="text">
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="px-0">
                        <AddButtonCard v-model="selectItems" title="form.addNew" :validationRef="addProjectEmployeeForm"
                            :addItemFunc="addStepFunction" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { AddAgreementEmployeeCommand } from "@/models/entities/crm/CrmAgreementCommands";
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { onMounted } from 'vue';
import { EmployeeDropdownListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';
import { useProjectStore } from '@/stores/crmStores/projectStore';
import type { ProjectEmployeeDto } from '@/models/entities/crm/CrmProjectDtos';

const commandModel = ref(new Array<AddAgreementEmployeeCommand>())
const { projectEmployees } = storeToRefs(useProjectStore());

const selectItems = ref(Array<{ employee: EmployeeDropdownListDto, positionId: string }>())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    projectEmployees: {
        type: Array<ProjectEmployeeDto>,
        required: false
    }
});

const addProjectEmployeeForm = ref(null as any);
const route = useRoute()

const addProjectEmployee = () => {
    addProjectEmployeeForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value = selectItems.value.map((a) => {
                return {
                    employeeId: a.employee.id,
                    positionId: a.positionId
                }
            })
            useProjectStore().addProjectEmployee(route.params.id.toString(), commandModel.value).then((response: any) => {
                props.dialogClose();
                let result = selectItems.value.map((a) => {
                    return {
                        id: a.employee.id,
                        firstName: a.employee.firstName,
                        lastName: a.employee.lastName,
                        avatarUrl: a.employee.avatarUrl,
                        positionName: a.employee.positions[a.employee.positions.findIndex((b) => b.id == a.positionId)].name,
                        positionId: a.positionId,
                        isPassive: false
                    }
                })
                result = result.filter((a) => !projectEmployees.value.some((b) => b.id == a.id));
                if (result.length > 0)
                    projectEmployees.value = projectEmployees.value.concat(result);
            }).catch((error) => {
                return catchError(error, () => { addProjectEmployee() })
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    })
}

onMounted(() => {
    addStepFunction()
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: addProjectEmployee,
        loading: false
    }
])

const addStepFunction = () => {
    selectItems.value.push({
        employee: new EmployeeDropdownListDto(),
        positionId: ''
    });
}


const disablePositionInput = (item) => {
    if (item.employee) {
        if (item.employee.positions?.length > 0) {
            return false
        } else {
            return true
        }
    } else {
        return true
    }
}

const disabledEmployee = (item: EmployeeDropdownListDto): any => {
    if (!item.positions) {
        return { value: true, description: 'list.notPosition' }
    } else if (selectItems.value.some((b) => item.id == b.employee.id)) {
        return { value: true, description: 'list.isSelected' }
    } else if (props.projectEmployees && props.projectEmployees.some((a) => a.id == item.id)) {
        return { value: true, description: 'list.isAdded' }
    } else {
        return { value: false, description: '' }
    }
}

</script>