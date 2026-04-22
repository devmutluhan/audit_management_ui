<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.projectEmployees') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"
                v-if="projectDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-account-check-outline"
                            class="text-capitalize">
                            {{ $t('general.addEmployee') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddProjectEmployeeDialog :dialog-close="() => { isActive.value = false }"
                            :projectEmployees="projectEmployees" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text style="height:241px; overflow:auto">
            <v-row class="d-flex align-center" v-if="projectEmployees.length > 0">
                <v-col cols="12" v-for="(employee, index) in projectEmployees" :key="index">
                    <v-row class="d-flex align-center">
                        <v-col cols="auto">
                            <ImageCard :first-value="employee.firstName" :second-value="employee.lastName"
                                :avatar-text="employee.avatarUrl" />
                        </v-col>
                        <v-col cols="4" class="px-1">
                            <p class="mb-1 font-weight-medium text-blue-accent-3">
                                {{ employee.firstName + ' ' + employee.lastName }}
                            </p>
                            <p class="mb-0 font-weight-medium text-truncate" v-if="employee.positionName">
                                {{ employee.positionName }}
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" class="px-1">
                            <v-chip :color="employee.isPassive ? 'error' : 'success'">{{ employee.isPassive ?
                                $t('general.passive') : $t('general.isActive') }}</v-chip>
                        </v-col>
                        <v-col cols="auto"
                            v-if="projectDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                            <GeneralDropdown :menuItems="filterMenuItems(employee)" :data="employee" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class="py-6">
                    {{ $t('general.noProjectEmployee') }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { ref, type PropType } from 'vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from '@/models/types';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import AddProjectEmployeeDialog from '@/components/dialogs/crm/AddProjectEmployeeDialog.vue';
import { useProjectStore } from '@/stores/crmStores/projectStore';
import { ProjectDetailDto, ProjectEmployeeDto } from '@/models/entities/crm/CrmProjectDtos';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const { projectEmployees } = storeToRefs(useProjectStore());
const route = useRoute();
useProjectStore().getProjectEmployees(route.params.id.toString());

const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true,
        default: new ProjectDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

const manageActivationEmployee = (item: ProjectEmployeeDto) => {
    useProjectStore().manageActivationProjectEmployee(route.params.id.toString(), item.id).then((res) => {
        const index = projectEmployees.value.findIndex((a) => a.id == item.id)
        if (index != -1) {
            projectEmployees.value[index].isPassive = !projectEmployees.value[index].isPassive
        }
    }).catch((error) => {
        return catchError(error, () => { manageActivationEmployee(item) });
    })
}

const deleteProjectEmployee = (item: ProjectEmployeeDto) => {
    useProjectStore().deleteProjectEmployee(route.params.id.toString(), item.id).then((res) => {
        const index = projectEmployees.value.findIndex((a) => a.id == item.id)
        if (index != -1) {
            projectEmployees.value.splice(index, 1)
        }
    }).catch((error) => {
        return catchError(error, () => { deleteProjectEmployee(item) });
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: 'general.setPassive',
        action: manageActivationEmployee
    },
    {
        id: 2,
        title: 'general.setActive',
        action: manageActivationEmployee
    },
    {
        id: 3,
        title: 'general.delete',
        action: deleteProjectEmployee
    }
])

const filterMenuItems = (item: ProjectEmployeeDto) => {
    if (item.isPassive) {
        return menuItems.value.filter((a) => a.id != 1)
    } else {
        return menuItems.value.filter((a) => a.id != 2)
    }
}

</script>