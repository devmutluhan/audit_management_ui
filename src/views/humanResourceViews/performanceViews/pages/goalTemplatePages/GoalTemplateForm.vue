<!-- <template>
    <v-container fluid class="h-100">
        <v-form ref="goalTemplateFormRef" @submit.prevent="saveTemplate">
            <v-row>
                <v-col cols="12" md="9">

                    <v-card class="mb-6" rounded="lg">
                        <v-card-text class="pa-6">
                            <v-row class="d-flex align-center mb-4">
                                <v-avatar color="primary" variant="tonal" class="mr-4">
                                    <v-icon>mdi-file-document-edit</v-icon>
                                </v-avatar>
                                <v-col>
                                    <h2 class="text-h6 font-weight-bold">{{ $t('form.goalTemplateDetail') }}</h2>
                                    <div class="text-body-1 text-grey"> {{ $t('form.goalTemplateDetailDesc') }}</div>
                                </v-col>
                            </v-row>


                            <v-row>
                                <v-col cols="12">
                                    <TextField v-model="command.templateName" label="form.templateName" isRequired
                                        placeholder="form.sampleGoalTemplateName" variant="outlined"
                                        density="comfortable" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-h6 font-weight-bold text-grey-darken-2">
                            {{ $t('form.objectives') }}
                            <v-chip size="small" class="ml-2" color="primary" variant="flat">
                                {{ command.objectives.length }} {{ ' ' + $t('enums.Piece') }}
                            </v-chip>
                        </h3>
                    </div>

                    <v-card v-if="command.objectives.length === 0" class="text-center pa-10 border-dashed " flat>
                        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-target-variant</v-icon>
                        <h3 class="text-h6 text-grey">
                            {{ $t('form.noObjectivesAdded') }}
                        </h3>
                        <p class="text-body-2 text-grey mb-4">
                            {{ $t('form.addObjectiveDesc') }}
                        </p>
                        <div v-if="objectiveListError" class="text-error font-weight-bold">
                            * {{ $t('statusCode.atLeastOneObjectiveRequired') }}
                        </div>
                    </v-card>

                    <v-expansion-panels v-model="expansionValue" v-else variant="accordion" class="mb-6">
                        <v-expansion-panel v-for="(objective, oIndex) in command.objectives"
                            :class="{ 'border-error': objectiveHasError(objective) }" eager :key="oIndex" rounded="lg"
                            elevation="0" class="border" :value="oIndex">
                            <v-expansion-panel-title class="py-3">
                                <template v-slot:default="{ expanded }">
                                    <v-row no-gutters align="center">
                                        <v-col cols="auto" class="mr-3">
                                            <v-avatar color="blue-grey-lighten-5" text-color="primary" size="32"
                                                class="font-weight-bold">
                                                {{ oIndex + 1 }}
                                            </v-avatar>
                                        </v-col>
                                        <v-col class="text-truncate mr-2">
                                            <span class="text-body-1 font-weight-bold text-primary">
                                                {{ objective.title || $t('form.newObjective') }}
                                            </span>
                                        </v-col>
                                        <v-col cols="auto" class="mr-3">
                                            <v-chip size="small" :color="objective.defaultWeight ? 'blue' : 'grey'"
                                                variant="tonal">
                                                %{{ objective.defaultWeight || 0 }}
                                            </v-chip>
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn icon="mdi-delete" color="error" variant="text" size="small"
                                                @click.stop="removeObjective(oIndex)"></v-btn>
                                        </v-col>
                                    </v-row>
                                </template>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text class="pt-4">
                                <v-row>
                                    <v-col cols="12" md="8">
                                        <TextField v-model="objective.title" label="form.objectiveTitle"
                                            placeholder="form.objectivePlaceholderDescription" isRequired
                                            density="compact" />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <TextField v-model="objective.defaultWeight" label="form.weight" isNumber
                                            suffix="%" isRequired :max="100" density="compact" placeholder="100" />
                                    </v-col>
                                </v-row>

                                <div v-if="command.structureType === GoalTypeEnum.OKR" class="mt-4">
                                    <div class="d-flex align-center mb-2">
                                        <span class="text-subtitle-2 text-grey-darken-1">
                                            {{ $t('form.keyResults') }}
                                        </span>
                                        <v-divider class="mx-3"></v-divider>
                                        <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus"
                                            @click="addKeyResult(objective)">
                                            KR {{ ' ' + $t('menu.create') }}
                                        </v-btn>
                                    </div>
                                    <div class="text-error"
                                        v-if="objectiveListErrorKeyResult && objective.keyResults.length == 0">
                                        {{ $t('form.objectiveListErrorKeyResult') }}
                                    </div>

                                    <v-slide-y-transition group>
                                        <div v-for="(kr, kIndex) in objective.keyResults" :key="kIndex" class="mb-2">
                                            <v-card variant="outlined" class="pa-3 border-dashed pb-6">
                                                <v-row align="center" dense>
                                                    <v-col cols="12" md="4">
                                                        <TextField v-model="kr.description" label="form.krDescription"
                                                            isRequired hide-details density="compact" />
                                                    </v-col>
                                                    <v-col cols="6" md="2">
                                                        <SingleSelectInput v-model="kr.metricType"
                                                            :items="metricTypeOptions" label="form.metricType"
                                                            density="compact" hide-details
                                                            @update:model-value="(val) => onMetricTypeChange(val, kr)" />
                                                    </v-col>

                                                    <template v-if="kr.metricType === KeyResultMetricTypeEnum.Boolean">
                                                        <v-col cols="6" md="4">
                                                            <v-chip size="small" color="red"
                                                                class="w-100 justify-center">{{
                                                                    $t('enums.Boolean') }}</v-chip>
                                                        </v-col>
                                                    </template>
                                                    <template v-else>
                                                        <v-col cols="6" md="2">
                                                            <TextField v-model="kr.startValue" :label="$t('form.start')"
                                                                isNumber isRequired
                                                                :suffix="kr.metricType === KeyResultMetricTypeEnum.Currency ? 'TL' : kr.metricType === KeyResultMetricTypeEnum.Percentage ? '%' : ''"
                                                                density="compact" hide-details />
                                                        </v-col>
                                                        <v-col cols="6" md="2">
                                                            <TextField v-model="kr.targetValue"
                                                                :label="$t('form.objective')" isNumber isRequired
                                                                :suffix="kr.metricType === KeyResultMetricTypeEnum.Currency ? 'TL' : kr.metricType === KeyResultMetricTypeEnum.Percentage ? '%' : ''"
                                                                density="compact" hide-details />
                                                        </v-col>
                                                    </template>

                                                    <v-col cols="6" md="1">
                                                        <TextField v-model="kr.contributionWeight"
                                                            :label="$t('form.shortWeight')" isNumber density="compact"
                                                            hide-details />
                                                    </v-col>
                                                    <v-col cols="auto">
                                                        <v-btn icon="mdi-delete" size="x-small" color="red"
                                                            variant="text"
                                                            @click="removeKeyResult(objective, kIndex)"></v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </div>
                                    </v-slide-y-transition>
                                </div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <v-col cols="12" align="right">
                        <v-btn @click="addObjective()" height="40">
                            + {{ $t('form.addNewObjective') }}
                        </v-btn>
                    </v-col>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="position-sticky" style="top: 20px; z-index: 2;">

                        <v-card class="mb-4" border>
                            <v-card-title class="text-subtitle-2 font-weight-bold py-3">
                                <v-icon size="small" class="mr-2">mdi-cog</v-icon>
                                {{ $t('form.structureType') }} & {{ $t('form.settings') }}
                            </v-card-title>
                            <v-card-text class="pt-4">
                                <v-btn-toggle v-if="!isUpdated" v-model="command.structureType" color="primary"
                                    mandatory class="d-flex w-100 mb-4" density="compact"
                                    @update:model-value="onStructureTypeChange">
                                    <v-btn :value="GoalTypeEnum.KPI" class="flex-grow-1">KPI</v-btn>
                                    <v-btn :value="GoalTypeEnum.OKR" class="flex-grow-1">OKR</v-btn>
                                </v-btn-toggle>
                                <v-chip v-else color="indigo">
                                    {{enumToArray(GoalTypeEnum).find((a) => a.value == goalType)?.title}}
                                </v-chip>
                                <span v-if="command.structureType == GoalTypeEnum.KPI">
                                    <v-divider class="mb-4"></v-divider>

                                    <div class="text-caption font-weight-bold mb-2 text-grey-darken-1">
                                        {{ $t('form.globalLimits') }}
                                    </div>
                                    <v-row dense class="mb-2">
                                        <v-col cols="6">
                                            <TextField v-model="minMaxValue.kpiMinVal" label="form.minVal"
                                                placeholder="0" isNumber isRequired density="compact" variant="outlined"
                                                @update:model-value="syncMinMaxToObjectives" />
                                        </v-col>
                                        <v-col cols="6">
                                            <TextField v-model="minMaxValue.kpiMaxVal" label="form.maxVal"
                                                placeholder="100" isNumber isRequired density="compact"
                                                variant="outlined" @update:model-value="syncMinMaxToObjectives" />
                                        </v-col>
                                    </v-row>
                                </span>
                            </v-card-text>
                        </v-card>

                        <v-card border :color="totalObjectiveWeight === 100 ? 'success' : 'warning'" variant="tonal">
                            <v-card-text>
                                <div class="d-flex justify-space-between mb-2">
                                    <span class="font-weight-bold">{{ $t('form.totalWeight') }}</span>
                                    <span class="font-weight-black text-h6">%{{ totalObjectiveWeight }}</span>
                                </div>
                                <v-progress-linear :model-value="totalObjectiveWeight" height="8" rounded
                                    :color="totalObjectiveWeight > 100 ? 'error' : (totalObjectiveWeight === 100 ? 'white' : 'white')"
                                    :class="totalObjectiveWeight === 100 ? 'opacity-100' : 'opacity-70'"></v-progress-linear>
                                <div class="text-caption mt-2 font-weight-medium d-flex align-center">
                                    <span v-if="totalObjectiveWeight < 100">%{{ 100 - totalObjectiveWeight }} {{
                                        $t('form.moreThan')
                                        }}</span>
                                    <span v-else-if="totalObjectiveWeight > 100">%{{ totalObjectiveWeight - 100 }} {{
                                        $t('form.mostThan') }}
                                    </span>
                                    <span v-else>{{ $t('form.mustBe100') }}</span>
                                    <v-tooltip class="ml-4" location="top" :text="$t('form.distributeWeightsEqually')">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-if="command.objectives.length > 0" v-bind="props"
                                                icon="mdi-scale-balance" variant="text" density="compact" size="small"
                                                @click="distributeWeightsEqually"></v-btn>
                                        </template>
                                    </v-tooltip>
                                </div>
                            </v-card-text>
                        </v-card>

                        <v-btn block size="large" color="primary" class="mt-4 text-none font-weight-bold" elevation="3"
                            type="submit" :loading="loading" height="50">
                            {{ $t('general.save') }}
                            <template v-slot:append>
                                <v-icon>mdi-content-save-check</v-icon>
                            </template>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, type PropType, onMounted, watch } from 'vue';
import type { VForm } from 'vuetify/components';
import { useI18n } from 'vue-i18n';

import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';

import { ObjectiveCommand, KeyResultCommand, MinMaxModel, CreateGoalTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { GoalTypeEnum, KeyResultMetricTypeEnum } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { useRoute } from 'vue-router';

const emits = defineEmits(['clickSubmit'])

const objectiveListErrorKeyResult = ref(false);
const objectiveHasError = (objective: ObjectiveCommand) => {
    if (props.command.structureType == GoalTypeEnum.OKR && objectiveListErrorKeyResult.value)
        return objective.keyResults.length === 0 || objective.keyResults.some((a) => !a.description || !a.startValue || !a.targetValue);
};

const props = defineProps({
    command: {
        type: Object as PropType<CreateGoalTemplateCommand>,
        required: true
    },
    loading: {
        type: Boolean,
        required: true,
        default: false
    },
    minMax: {
        type: Object as PropType<MinMaxModel>,
        required: false
    },
    goalType: {
        type: Number,
        required: false
    }
})

const t = useI18n().t
const expansionValue = ref(0)
const minMaxValue = ref(new MinMaxModel());
const goalTemplateFormRef = ref<VForm | null>(null);
const objectiveListError = ref(false);

const metricTypeOptions = enumToArray(KeyResultMetricTypeEnum);

// --- Computed Properties ---
const totalObjectiveWeight = computed(() => {
    return props.command.objectives.reduce((sum, obj) => sum + (Number(obj.defaultWeight) || 0), 0);
});

// --- Methods ---
const onStructureTypeChange = () => {
    props.command.objectives = new Array<ObjectiveCommand>()
    minMaxValue.value = new MinMaxModel();
};

const syncMinMaxToObjectives = () => {
    if (props.command.structureType === GoalTypeEnum.KPI) {
        props.command.objectives.forEach(obj => {
            obj.kpiMinVal = minMaxValue.value.kpiMinVal;
            obj.kpiMaxVal = minMaxValue.value.kpiMaxVal;
        });
    }
};

const onMetricTypeChange = (type: KeyResultMetricTypeEnum, kr: KeyResultCommand) => {
    if (type === KeyResultMetricTypeEnum.Boolean) {
        kr.startValue = 0; kr.targetValue = 1;
    } else {
        kr.startValue = null; kr.targetValue = null;
    }
};

const addObjective = () => {
    const newObject = new ObjectiveCommand();
    newObject.type = props.command.structureType;
    newObject.kpiMaxVal = minMaxValue.value.kpiMaxVal;
    newObject.kpiMinVal = minMaxValue.value.kpiMinVal;
    props.command.objectives.push(newObject);

    expansionValue.value = props.command.objectives.length - 1;
    objectiveListError.value = false;
};

const removeObjective = (index: number) => {
    props.command.objectives.splice(index, 1);
};

const addKeyResult = (objective: ObjectiveCommand) => {
    objective.keyResults.push(new KeyResultCommand());
};

const removeKeyResult = (objective: ObjectiveCommand, index: number) => {
    objective.keyResults.splice(index, 1);
};

const calculateTotalKRWeight = (objective: ObjectiveCommand): number => {
    return objective.keyResults.reduce((sum, kr) => sum + (Number(kr.contributionWeight) || 0), 0);
};

const validateLogic = (): boolean => {
    if (props.command.objectives.length === 0) {
        objectiveListError.value = true;
        return false;
    }
    objectiveListError.value = false;

    for (let i = 0; i < props.command.objectives.length; i++) {
        const objective = props.command.objectives[i];
        if (!objective.title || !objective.defaultWeight) {
            expansionValue.value = i;
            objectiveListErrorKeyResult.value = true
            return false;
        }
        if (props.command.structureType === GoalTypeEnum.OKR) {
            const hasInvalidComp = objective.keyResults.some(c => !c.description || !c.startValue || !c.targetValue);
            const totalKRWeight = calculateTotalKRWeight(objective);
            if (objective.keyResults.length == 0 || hasInvalidComp) {
                expansionValue.value = i;
                objectiveListErrorKeyResult.value = true;
                return false;
            }
            if (totalKRWeight > 0 && totalKRWeight !== 100) {
                ErrorStatusResult[400]({ title: 'statusCode.generalErrorTitle', message: t('statusCode.TotalWeightKeyResultError', { number: i + 1 }) });
                return false;
            }
        }
    }

    if (totalObjectiveWeight.value !== 100) {
        ErrorStatusResult[400]({ title: 'statusCode.generalErrorTitle', message: t('statusCode.GeneralTotalWeightError', { value: totalObjectiveWeight.value }) })
        return false;
    }

    return true;
};

const saveTemplate = async () => {
    if (!goalTemplateFormRef.value) return;
    const { valid } = await goalTemplateFormRef.value.validate();
    const isLogicValid = validateLogic();

    if (valid && isLogicValid) {
        const payload = JSON.parse(JSON.stringify(props.command))
        payload.objectives.forEach(obj => {
            if (payload.structureType === GoalTypeEnum.KPI) {
                obj.kpiMinVal = minMaxValue.value.kpiMinVal;
                obj.kpiMaxVal = minMaxValue.value.kpiMaxVal;
                if (obj.defaultWeight) obj.defaultWeight = obj.defaultWeight / 100;
            }
            if (payload.structureType === GoalTypeEnum.OKR) {
                obj.defaultWeight = 1
                obj.keyResults.forEach(kr => {
                    if (kr.contributionWeight) kr.contributionWeight = kr.contributionWeight / 100;
                });
            }
        });

        emits('clickSubmit', payload)
    }
};

const distributeWeightsEqually = () => {
    const objectives = props.command.objectives;
    const count = objectives.length;

    if (count === 0) return;

    const baseWeight = Math.floor(100 / count);

    let remainder = 100 % count;

    objectives.forEach((obj) => {
        let weight = baseWeight;

        if (remainder > 0) {
            weight += 1;
            remainder--;
        }

        obj.defaultWeight = weight;
    });
};

const isUpdated = ref(false);
const route = useRoute();
onMounted(() => {
    if (route.name == 'goal-template-update') {
        isUpdated.value = true
    }
    if (props.goalType !== undefined)
        props.command.structureType = props.goalType;
})

watch(() => props.goalType, () => {
    if (props.goalType !== undefined)
        props.command.structureType = props.goalType;
})
watch(() => props.minMax, () => {
    if (props.minMax) {
        minMaxValue.value.kpiMaxVal = props.minMax.kpiMaxVal;
        minMaxValue.value.kpiMinVal = props.minMax.kpiMinVal ?? 0;
    }
}, { deep: true })
</script>

<style scoped>
.border-error {
    border-color: rgb(var(--v-theme-error)) !important;
}
</style> -->