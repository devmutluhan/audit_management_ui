<template>
    <CompetencyTemplateForm :loading="loading" :command="command" @clickSubmit="saveTemplate"></CompetencyTemplateForm>
</template>

<script setup lang="ts">
import { CreateCompetencyTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { ref } from 'vue';
import { catchError } from '@/core/helpers/generalResponse';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { useRouter } from 'vue-router';
import CompetencyTemplateForm from './CompetencyTemplateForm.vue';

const command = ref(new CreateCompetencyTemplateCommand());
const router = useRouter()
const loading = ref(false);

const saveTemplate = (payload: CreateCompetencyTemplateCommand) => {
    loading.value = true;

    usePerformanceCommandStore().createCompetencyTemplate(payload).then((res) => {
        router.push({ name: 'competency-template-detail', params: { id: res.data } })
    }).catch((error) => {
        return catchError(error, () => { saveTemplate(payload) })
    }).finally(() => {
        loading.value = false;
    });
}
</script>
