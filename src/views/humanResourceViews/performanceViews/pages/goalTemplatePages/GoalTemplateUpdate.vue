<!-- <template>
    <GoalTemplateForm :loading="loading" :command="command" :goalType="goalTypeEnum" :minMax="minMaxValue"
        @clickSubmit="saveTemplate">
    </GoalTemplateForm>
</template>

<script setup lang="ts">
import { KeyResultCommand, MinMaxModel, ObjectiveCommand, UpdateGoalTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import GoalTemplateForm from './GoalTemplateForm.vue';
import { onMounted, ref } from 'vue';
import { catchError } from '@/core/helpers/generalResponse';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { useRoute, useRouter } from 'vue-router';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import { GoalTypeEnum } from '@/models/custom/EnumTypes';

const command = ref(new UpdateGoalTemplateCommand() as any);
const router = useRouter()
const minMaxValue = ref(new MinMaxModel());
const route = useRoute()
const loading = ref(false);
const goalTypeEnum = ref(GoalTypeEnum.KPI);

onMounted(() => {
    getGoalTemplateDetail();
});

const getGoalTemplateDetail = () => {
    loading.value = true;
    usePerformanceDtoStore().getGoalTemplateDetail(route.params.id.toString()).then((res) => {
        command.value.templateName = res.templateName;
        goalTypeEnum.value = res.objectives[0].type;
        minMaxValue.value.kpiMaxVal = res.objectives[0].kpiMinScale;
        minMaxValue.value.kpiMaxVal = res.objectives[0].kpiMaxScale;
        res.objectives.forEach((a) => {
            let keyResults = new Array<KeyResultCommand>();
            if (a.type == GoalTypeEnum.OKR) {
                a.keyResults.forEach((b) => {
                    let keyResult = {
                        id: b.id,
                        description: b.description,
                        metricType: b.metricType,
                        startValue: b.startValue,
                        targetValue: b.targetValue,
                        contributionWeight: b.contributionWeight * 100
                    } as KeyResultCommand
                    keyResults.push(keyResult);
                })
            }

            let objective = {
                id: a.id,
                title: a.title,
                type: a.type,
                defaultWeight: a.defaultWeight * 100,
                kpiMinVal: a.kpiMinScale,
                kpiMaxVal: a.kpiMaxScale,
                keyResults: keyResults
            } as ObjectiveCommand
            command.value.objectives.push(objective)
        })
    }).catch((error) => {
        return catchError(error, () => { getGoalTemplateDetail() })
    }).finally(() => {
        loading.value = false;
    });
}

const saveTemplate = (payload: UpdateGoalTemplateCommand) => {
    loading.value = true;
    usePerformanceCommandStore().updateGoalTemplate(route.params.id.toString(), payload).then((res) => {
        router.push({ name: 'goal-template-detail', params: { id: route.params.id.toString() } })
    }).catch((error) => {
        return catchError(error, () => { saveTemplate(payload) })
    }).finally(() => {
        loading.value = false;
    });
}
</script> -->
