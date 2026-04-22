<template>
    <CompetencyTemplateForm :loading="loading" :command="command" @clickSubmit="saveTemplate">
    </CompetencyTemplateForm>
</template>

<script setup lang="ts">
import { CompetencyGroupCommand, CompetencyItemCommand, UpdateCompetencyTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { onMounted, ref } from 'vue';
import { catchError } from '@/core/helpers/generalResponse';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { useRoute, useRouter } from 'vue-router';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import CompetencyTemplateForm from './CompetencyTemplateForm.vue';
import { RaterRelationTypeEnum } from '@/models/custom/EnumTypes';

const command = ref(new UpdateCompetencyTemplateCommand());
const router = useRouter()
const route = useRoute()
const loading = ref(false);

onMounted(() => {
    getCompetencyTemplateDetail();
});

const getCompetencyTemplateDetail = () => {
    loading.value = true;
    usePerformanceDtoStore().getCompetencyTemplateDetail(route.params.id.toString()).then((res) => {
        command.value.templateName = res.title;
        command.value.description = res.description;
        res.groups.forEach((a) => {
            let competencies = new Array<CompetencyItemCommand>();
            a.competencies.forEach((b) => {
                let competency = {
                    id: b.id,
                    description: b.description,
                    name: b.name,
                    minScore: b.minScore,
                    maxScore: b.maxScore,
                } as CompetencyItemCommand
                competencies.push(competency);
            })

            let group = {
                id: a.id,
                groupName: a.groupName,
                relationType: a.relationType,
                competencies: competencies
            } as CompetencyGroupCommand

            command.value.groups.push(group)
        })
    }).catch((error) => {
        return catchError(error, () => { getCompetencyTemplateDetail() })
    }).finally(() => {
        loading.value = false;
    });
}

const saveTemplate = (payload: UpdateCompetencyTemplateCommand) => {
    loading.value = true;
    usePerformanceCommandStore().updateCompetencyTemplate(route.params.id.toString(), payload).then((res) => {
        router.push({ name: 'competency-template-detail', params: { id: route.params.id.toString() } })
    }).catch((error) => {
        return catchError(error, () => { saveTemplate(payload) })
    }).finally(() => {
        loading.value = false;
    });
}
</script>
