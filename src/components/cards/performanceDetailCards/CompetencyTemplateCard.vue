<template>
    <v-row>
        <v-col cols="12" md="3" class="pa-6">
            <v-row>
                <v-col cols="12">
                    <SingleAutocompleteInput v-model="selectedTemplate" label="form.uploadTemplate"
                        :items="competencyTemplateDropdownList.items ?? []" item-title="title" is-return-object
                        placeholder="form.selectCompetencyTemplate"
                        @update:model-value="getCompetencyTemplateDetail()" />
                </v-col>
                <v-col cols="12">
                    <v-alert color="info">
                        <span class="font-weight-bold">{{ $t('form.info') }}:</span>
                        {{ $t('form.selectTemplateInfo') }}
                    </v-alert>
                </v-col>
                <v-col cols="12">
                    <v-btn color="confirmButtonColor" block size="large" prepend-icon="mdi-content-save"
                        :loading="saveLoading" @click="isValidTemplate = 'saveTemplate'">
                        {{ $t('form.saveToTemplate') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" md="9">
            <CompetencyTemplateForm :loading="loading" :command="command" :saveButtonVisible="false"
                v-model:isValidTemplate="isValidTemplate"
                @clickSubmit="isValidTemplate == 'saveTemplate' ? saveTemplate() : isValidTemplate == 'continue' ? clickSubmit() : null">
            </CompetencyTemplateForm>
        </v-col>
        <v-col cols="12">
            <v-row class="d-flex justify-center">
                <v-col cols="6" md="3">
                    <v-btn @click="emits('currentStep', 1)" color="cancelButtonColor" size="x-large" block>
                        {{ $t('general.back') }}
                    </v-btn>
                </v-col>
                <v-col cols="6" md="3">
                    <v-btn @click="isValidTemplate = 'continue'" size="x-large" block>
                        {{ $t('general.continue') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { CompetencyGroupCommand, CompetencyItemCommand, CreateCompetencyTemplateCommand, PeriodReviewCompetencySectionCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { type PropType, ref } from 'vue';
import { catchError } from '@/core/helpers/generalResponse';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import CompetencyTemplateForm from "@/views/humanResourceViews/performanceViews/pages/competencyTemplatePages/CompetencyTemplateForm.vue";
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import { CompetencyTemplateDropdownDto, ReviewSummaryDto } from '@/models/entities/humanResource/PerformanceDtos';
import { PerformanceTemplateStatus } from '@/models/custom/EnumTypes';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';

const command = ref(new CreateCompetencyTemplateCommand());
const emits = defineEmits(['currentStep'])
const { competencyTemplateDropdownList } = storeToRefs(usePerformanceDtoStore())
usePerformanceDtoStore().getCompetencyTemplateDropdownList({ pageSize: 10000, pageNumber: 1, templateStatuses: [PerformanceTemplateStatus.Active] });
const isValidTemplate = ref('');

const props = defineProps({
    periodCompetencyCommand: {
        type: Object as PropType<PeriodReviewCompetencySectionCommand>,
        required: true
    },
    periodReviewList: {
        type: Array<ReviewSummaryDto>,
        required: true
    },
});

const selectedTemplate = ref(new CompetencyTemplateDropdownDto());
const loading = ref(false);
const saveLoading = ref(false);

const getCompetencyTemplateDetail = () => {
    loading.value = true;
    usePerformanceDtoStore().getCompetencyTemplateDetail(selectedTemplate.value.id).then((res) => {
        command.value = new CreateCompetencyTemplateCommand();
        command.value.templateName = res.title;
        command.value.description = res.description;
        res.groups.forEach((a) => {
            let competencies = new Array<CompetencyItemCommand>();
            a.competencies.forEach((b) => {
                let competency = {
                    id: null, // b.id
                    description: b.description,
                    name: b.name,
                    minScore: b.minScore,
                    maxScore: b.maxScore,
                } as CompetencyItemCommand
                competencies.push(competency);
            })

            let group = {
                id: null, // a.id
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

const saveTemplate = () => {
    saveLoading.value = true;
    usePerformanceCommandStore().createCompetencyTemplate(command.value).then((res) => {
        ErrorStatusResult[200]()
    }).catch((error) => {
        return catchError(error, () => { saveTemplate() })
    }).finally(() => {
        saveLoading.value = false;
        isValidTemplate.value = '';
    });
}

const clickSubmit = () => {
    const competencyReviewees = props.periodReviewList.filter((a) => a.competencyScoreWeight !== 0 && !a.competency)
    props.periodCompetencyCommand.reviewees = competencyReviewees.map((a) => {
        return {
            revieweeId: a.reviewee.id,
            raters: []
        }
    });
    props.periodCompetencyCommand.competencySection.title = command.value.templateName
    props.periodCompetencyCommand.competencySection.description = command.value.description
    props.periodCompetencyCommand.competencySection.groups = command.value.groups

    emits('currentStep', 3);
    isValidTemplate.value = '';
}

</script>
