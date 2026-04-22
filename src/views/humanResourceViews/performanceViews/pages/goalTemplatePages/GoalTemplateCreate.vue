<!-- <template>
    <GoalTemplateForm :loading="loading" :command="command" @clickSubmit="saveTemplate"></GoalTemplateForm>
</template>

<script setup lang="ts">
import { CreateGoalTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import GoalTemplateForm from './GoalTemplateForm.vue';
import { ref } from 'vue';
import { catchError } from '@/core/helpers/generalResponse';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { useRouter } from 'vue-router';

const command = ref(new CreateGoalTemplateCommand());
const router = useRouter()
const loading = ref(false);

const saveTemplate = (payload: CreateGoalTemplateCommand) => {
    loading.value = true;

    usePerformanceCommandStore().createGoalTemplate(payload).then((res) => {
        router.push({ name: 'goal-template-detail', params: { id: res.data } })
    }).catch((error) => {
        return catchError(error, () => { saveTemplate(payload) })
    }).finally(() => {
        loading.value = false;
    });
}
</script> -->
