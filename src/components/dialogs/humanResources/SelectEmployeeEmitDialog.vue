<template>
    <DialogContent title="general.selectEmployee" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="selecteEmployeeForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" v-if="!isDisabledSwitch">
                        <SwitchInput v-model="isAllUpdate" :disabled="isDisabledSwitch"
                            label="general.allUpdateEmployees">
                        </SwitchInput>
                    </v-col>
                    <v-col cols="12">
                        <EmployeeSelectInput @selectValue="selectedEmployee = $event" :clearSelected="isClearSelected"
                            :disabledItem="(a) => { return notSelectableEmployeeIds ? notSelectableEmployeeIds.includes(a.id) ? { value: true, description: '' } : { value: false, description: '' } : { value: false, description: '' } }"
                            isRequired :items="initialEmployeeList" :employeeStatusFilter="null">
                        </EmployeeSelectInput>
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { EmployeeListDto } from '@/models/entities/humanResource/EmployeeDtos';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';

const selectedEmployee = ref(new EmployeeListDto());
const isAllUpdate = ref(false);
const isDisabledSwitch = ref(false);
const isClearSelected = ref(false);

const emit = defineEmits(['createItem']);
const selecteEmployeeForm = ref(null as any);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    initialEmployeeList: {
        type: Array<EmployeeListDto>,
        required: true
    },
    selectedNotManagerIds: {
        type: Array<String>,
        required: false
    },
    selectedEmployeeIds: {
        type: Array<String>,
        required: false
    }
});

onMounted(() => {
    if (!props.selectedNotManagerIds || props.selectedNotManagerIds.length == 0 || props.selectedEmployeeIds?.length == props.selectedNotManagerIds?.length) {
        isDisabledSwitch.value = true;
    } else {
        isDisabledSwitch.value = false;
    }
})

watch(() => isAllUpdate.value, () => {
    selectedEmployee.value = new EmployeeListDto();
    isClearSelected.value = !isClearSelected.value
})

const notSelectableEmployeeIds = computed(() => {
    if (isAllUpdate.value) {
        return props.selectedEmployeeIds
    } else {
        return props.selectedNotManagerIds
    }
})

const selectEmployee = () => {
    selecteEmployeeForm.value.validate().then((res: any) => {
        if (res.valid) {
            emit('createItem', { selectedEmployee: selectedEmployee.value, employeeIds: notSelectableEmployeeIds.value })
            props.dialogClose();
            selectedEmployee.value = new EmployeeListDto();
            isClearSelected.value = !isClearSelected.value
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: selectEmployee,
        loading: false
    }
])
</script>
