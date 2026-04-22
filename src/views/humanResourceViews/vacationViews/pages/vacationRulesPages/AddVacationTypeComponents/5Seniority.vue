<template>
    <v-card>
        <v-card-text>
            <v-col cols="12" class="text-h6 font-weight-bold">
                {{ $t('form.seniority') }}
            </v-col>
            <v-col cols="12" class="text-body-1">
                {{ $t('form.seniorityDesc') }}
            </v-col>
            <v-col cols="12" md="7">
                <v-table :theme="themeMode">
                    <thead>
                        <tr>
                            <th class="text-left">
                                {{ $t('form.seniority') }}
                            </th>
                            <th class="text-left">
                                {{ $t('form.additionalDays') }}
                            </th>
                            <th class="text-left">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in commandModel.seniorities" :key="index">
                            <td>{{ item.year }}</td>
                            <td>{{ item.additionalDays }}</td>
                            <td>
                                <GeneralDropdown :menuItems="menuItems" :data="item" />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col cols="12" md="7">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="outlined">
                            {{ $t('general.addVacationSeniority') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddVacationSeniorityDialog :dialogClose="() => { isActive.value = false }"
                            @create-item="addSeniority($event)" />
                    </template>
                </VDialogContent>
            </v-col>
            <v-col cols="12" md="7">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <v-btn @click="emit('clickBack')" color="cancelButtonColor">
                            {{ $t('general.back') }}</v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn @click="emit('clickNext')">{{ $t('general.next') }}</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { CreateLeaveTypeCommand, SeniortyDto } from '@/models/entities/humanResource/LeavePolicyCommands';
import { ref, watch, type PropType } from 'vue';
import {
    themeMode,
} from "@/layouts/default-layout/config/helper";
import GeneralDropdown from '@/components/dropdown/GeneralDropdown.vue';
import type { GeneralDropdownType } from '@/models/types';
import AddVacationSeniorityDialog from '@/components/dialogs/humanResources/AddVacationSeniorityDialog.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const emit = defineEmits(['formValidate', 'clickNext', 'clickBack'])
const prop = defineProps({
    commandModel: {
        type: Object as PropType<CreateLeaveTypeCommand>,
        required: true
    },
    activeStep: {
        type: Number,
        required: true
    }
})

const seniorityForm = ref(null as any)

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.delete",
        action: (data) => { deleteSeniorty(data) }
    }
]);

const addSeniority = (item: SeniortyDto) => {
    const index = prop.commandModel.seniorities.findIndex((a) => a.year == item.year && a.additionalDays == item.additionalDays);
    if (index == -1) {
        prop.commandModel.seniorities.push(item)
    }
}

const deleteSeniorty = (item: SeniortyDto) => {
    const index = prop.commandModel.seniorities.findIndex((a) => a.year == item.year && a.additionalDays == item.additionalDays);
    if (index != -1) {
        prop.commandModel.seniorities.splice(index, 1)
    }
}

// watch(() => seniorityForm.value, () => {
//     emit('formValidate', seniorityForm.value)
// })


watch(() => prop.activeStep, () => {
    if (prop.activeStep == 5)
        emit('formValidate', seniorityForm.value)
})
</script>