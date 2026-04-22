<template>
    <v-row fluid class="pa-0">
        <v-col cols="12" md="8">
            <ProjectInfoDetailCard :projectDetail="projectDetail" :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12" md="4">
            <ProjectEmployeesCard :projectDetail="projectDetail" :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12">
            <ProjectContentInfoDetailCard :projectDetail="projectDetail" />
        </v-col>
        <v-col cols="12"
            v-if="projectDetail.manageProject && projectDetail.requestApproval.status == ApprovementStatusEnum.Approved">
            <v-row class="d-flex justify-center">
                <v-col cols="auto">
                    <v-btn color="error" size="x-large" @click="emit('endToProject')">
                        {{ $t('general.endToProject') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ProjectContentInfoDetailCard from '@/components/cards/offerCards/ProjectContentInfoDetailCard.vue';
import ProjectInfoDetailCard from '@/components/cards/offerCards/ProjectInfoDetailCard.vue';
import ProjectEmployeesCard from '@/components/cards/offerCards/ProjectEmployeesCard.vue';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import type { PropType } from 'vue';
import type { ProjectDetailDto } from '@/models/entities/crm/CrmProjectDtos';

const emit = defineEmits(['endToProject'])

const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true
    },
    isUpdated: {
        type: Boolean,
        required: true
    }
});

</script>