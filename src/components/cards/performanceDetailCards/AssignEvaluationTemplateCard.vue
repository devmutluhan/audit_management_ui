<template>
    <v-row class="d-flex align-center">
        <v-col cols="12" class="text-body-1">
            <p class="text-primary" v-if="selectedEmployeeIds?.length != 0">
                * {{
                    $t('list.selectedEmployeesForEvaluationDesc', {
                        count: selectedEmployeeIds?.length
                    })
                }}
            </p>
        </v-col>
        <v-col cols="12">
            <v-row class="d-flex align-center">
                <v-col>
                    <SingleAutocompleteInput v-model="selectedTemplate" label="form.evaluationTemplate" isRequired
                        :items="evaluationTempList.items ?? []" item-title="title" isReturnObject
                        appendIcon="mdi-plus-circle" placeholder="form.selectEvaluationTemplate"
                        @appendIcon="addEvaluationTemplateDialog = true" />
                </v-col>
                <v-col cols="auto">
                    <VDialogContent v-model="addEvaluationTemplateDialog">
                        <CreateEvaluationTemplateDialog :dialogClose="() => { addEvaluationTemplateDialog = false }"
                            @create-item="createEvaluation($event)" />
                    </VDialogContent>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" v-if="selectedTemplate.id">
            <p class="text-h6">{{ $t('form.templatePreview') }}</p>
            <v-card class="border-dashed">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="pb-0" v-if="selectedTemplate.goalWeight > 0">
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.goalWeight') }}</span>
                                <span>% {{ selectedTemplate.goalWeight * 100 }}</span>
                            </p>
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.goalType') }}</span>
                                <span>{{enumToArray(GoalTypeEnum).find((a) => a.value ==
                                    selectedTemplate.goalType)?.title}}</span>
                            </p>
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.title') }}</span>
                                <span>{{ selectedTemplate.defaultGoalTitle }}</span>
                            </p>
                        </v-col>
                        <v-col cols="12" class="pb-0" v-else>
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.goal') }}</span>
                                <span class="text-rowTextColor"> {{ $t('list.exclude') }}</span>
                            </p>
                        </v-col>
                        <v-col cols="12" class="py-0 my-0">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" class="pt-0" v-if="selectedTemplate.competencyWeight > 0">
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.competencyWeight') }}</span>
                                <span>% {{ selectedTemplate.competencyWeight * 100 }}</span>
                            </p>
                        </v-col>
                        <v-col cols="12" class="pt-0" v-else>
                            <p class="d-flex justify-space-between text-body-1 mb-0">
                                <span class="font-weight-bold">{{ $t('form.competency') }}</span>
                                <span class="text-rowTextColor"> {{ $t('list.exclude') }}</span>
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import type { EvaluationTemplateDto } from '@/models/entities/humanResource/PerformanceDtos';
import { enumToArray } from '@/core/helpers/enumToArray';
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import CreateEvaluationTemplateDialog from "@/components/dialogs/humanResources/CreateEvaluationTemplateDialog.vue";
import { GoalTypeEnum } from '@/models/custom/EnumTypes';

const { evaluationTempList } = storeToRefs(usePerformanceDtoStore());
usePerformanceDtoStore().getEvaluationTemplateList({ pageNumber: 1, pageSize: 1000, isPassive: false })
const emit = defineEmits(['update:selectedTemplate']);
const addEvaluationTemplateDialog = ref(false)
const props = defineProps({
    selectedEmployeeIds: {
        type: Array<String>,
        required: false
    },
    selectedTemplate: {
        type: Object as PropType<EvaluationTemplateDto>,
        required: true
    }
});

const createEvaluation = (event: EvaluationTemplateDto) => {
    if (!evaluationTempList.value.items)
        evaluationTempList.value.items = []
    evaluationTempList.value.items.unshift(event);
    evaluationTempList.value.totalCount += 1
    selectedTemplate.value = event;
}

const selectedTemplate = computed({
    get() {
        return props.selectedTemplate;
    },
    set(newValue: EvaluationTemplateDto) {
        emit('update:selectedTemplate', newValue);
    }
});

</script>