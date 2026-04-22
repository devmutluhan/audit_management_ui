<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="6">
                <ProjectCostSummaryForEmployeeCard :projectCostList="projectCostList" />
            </v-col>
            <v-col cols="12" md="6">
                <ProjectCostSummaryForPositionCard :projectCostList="projectCostList" />
            </v-col>
            <v-col cols="12" md="6">
                <ProjectTimeDistributionCard :projectCostList="projectCostList" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { ProjectDetailDto } from '@/models/entities/crm/CrmProjectDtos';
import { useProjectStore } from '@/stores/crmStores/projectStore';
import { storeToRefs } from 'pinia';
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import ProjectCostSummaryForEmployeeCard from '@/components/cards/offerCards/ProjectCostSummaryForEmployeeCard.vue';
import ProjectCostSummaryForPositionCard from '@/components/cards/offerCards/ProjectCostSummaryForPositionCard.vue';
import ProjectTimeDistributionCard from '@/components/cards/offerCards/ProjectTimeDistributionCard.vue';

const route = useRoute();
const projectStore = useProjectStore();
const { projectCostList } = storeToRefs(projectStore);

projectStore.getProjectCostSummary(route.params.id.toString());

const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true
    }
});

</script>