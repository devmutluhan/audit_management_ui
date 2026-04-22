<template>
    <v-container fluid>
        <v-form ref="formRef" @submit.prevent="saveTemplate" v-if="!loading">
            <v-card class="mb-6" rounded="lg">
                <v-card-text class="pa-6">
                    <v-row class="d-flex align-center mb-4">
                        <v-avatar color="primary" variant="tonal" class="mr-4">
                            <v-icon>mdi-file-document-edit</v-icon>
                        </v-avatar>
                        <v-col>
                            <h2 class="text-h6 font-weight-bold">{{ $t('form.goalTemplateDetail') }}</h2>
                            <div class="text-body-1 text-grey"> {{ $t('form.competencyTemplateDetailDesc') }}</div>
                        </v-col>
                    </v-row>


                    <v-row class="d-flex align-center">
                        <v-col cols="12" md="6">
                            <TextField v-model="command.templateName" label="form.templateName" isRequired
                                placeholder="form.enterTemplateName" variant="outlined" density="comfortable" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <TextField v-model="command.description" label="form.description"
                                placeholder="form.enterDescription" />
                        </v-col>
                        <v-col cols="12" md="5">
                            <SingleSelectInput v-model="selectedMinMax" :items="minMaxArray" label="form.minMax"
                                isRequired />
                        </v-col>
                        <v-col cols="12" md="5" v-if="selectedMinMax == '3'">
                            <v-row class="d-flex align-center">
                                <v-col cols="6">
                                    <TextField v-model="minMaxCommand.min" label="form.minScore" placeholder="1"
                                        :is-number="true" isRequired />
                                </v-col>
                                <v-col cols="6">
                                    <TextField v-model="minMaxCommand.max" label="form.maxScore" placeholder="5"
                                        isRequired :min="minMaxCommand.min ?? 4" :is-number="true" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <div class="d-flex justify-space-between align-center mb-3">
                <h3 class="text-h6 font-weight-bold text-grey-darken-2">
                    {{ $t('form.competencyGroups') }}
                    <v-chip size="small" class="ml-2" color="primary" variant="flat">
                        {{ command.groups.length }} {{ ' ' + $t('enums.Piece') }}
                    </v-chip>
                </h3>
            </div>

            <v-card v-if="command.groups.length === 0" class="text-center pa-10 border-dashed" flat>
                <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-target-variant</v-icon>
                <h3 class="text-h6 text-grey">
                    {{ $t('form.noGroupsAdded') }}
                </h3>
                <p class="text-body-2 text-grey mb-4">
                    {{ $t('form.addGroupDesc') }}
                </p>
                <div v-if="groupListError" class="text-error font-weight-bold">
                    * {{ $t('statusCode.atLeastOneObjectiveRequired') }}
                </div>
            </v-card>

            <v-expansion-panels v-model="expansionValue" v-else variant="accordion" class="mb-6">
                <v-expansion-panel v-for="(group, oIndex) in command.groups" :key="oIndex"
                    :class="{ 'border-error': groupHasError(group) }" eager rounded="lg" elevation="0" class="border"
                    :value="oIndex">
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
                                        {{ group.groupName || $t('form.newGroup') }}
                                    </span>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn icon="mdi-delete" color="error" variant="text" size="small"
                                        @click.stop="removeGroup(oIndex)"></v-btn>
                                </v-col>
                            </v-row>
                        </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pt-4">
                        <v-row class="d-flex align-center">
                            <v-col cols="12" md="8">
                                <TextField v-model="group.groupName" label="form.groupName" isRequired
                                    placeholder="form.newGroup" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <SingleSelectInput v-model="group.relationType" :items="relationTypeOptions"
                                    label="form.relationType" isRequired />
                            </v-col>
                        </v-row>

                        <div class="mt-4">
                            <div class="d-flex align-center mb-2">
                                <span class="text-subtitle-2 text-grey-darken-1">
                                    {{ $t('form.competencies') }}
                                </span>
                                <v-divider class="mx-3"></v-divider>
                                <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-plus"
                                    @click="addCompetency(group)">
                                    {{ $t('form.addCompetency') }}
                                </v-btn>
                            </div>
                            <div v-if="noCompetencyError && group.competencies.length == 0" class="text-error">
                                {{ $t('form.noCompetencyError') }}
                            </div>
                            <v-slide-y-transition group>
                                <div v-for="(comp, kIndex) in group.competencies" :key="kIndex" class="mb-2">
                                    <v-card variant="outlined" class="pa-3 border-dashed pb-6">
                                        <v-row align="center" dense>
                                            <v-col cols="12" md="5">
                                                <TextField v-model="comp.name" label="form.competencyName"
                                                    :is-required="true" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <TextField v-model="comp.description" label="form.description" />
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-btn icon="mdi-delete" size="x-small" color="red" variant="text"
                                                    @click="removeCompetency(group, kIndex)"></v-btn>
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
                <v-btn @click="addGroup()" height="40" size="large">
                    + {{ $t('form.addGroup') }}
                </v-btn>
            </v-col>

            <v-row class="mt-6 d-flex justify-center" v-if="saveButtonVisible">
                <v-col cols="4">
                    <v-btn color="confirmButtonColor" block size="large" prepend-icon="mdi-content-save" type="submit"
                        :loading="loading">
                        {{ $t('general.save') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-col cols="12" v-else>
            <Loading></Loading>
        </v-col>
    </v-container>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue';
import type { VForm } from 'vuetify/components';

import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import {
    CompetencyGroupCommand,
    CompetencyItemCommand,
    CreateCompetencyTemplateCommand,
    MinMaxModel,
    UpdateCompetencyTemplateCommand
} from '@/models/entities/humanResource/PerformanceCommands';

import { enumToArray } from '@/core/helpers/enumToArray';
import { RaterRelationTypeEnum } from '@/models/custom/EnumTypes';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const formRef = ref<VForm | null>(null);
const minMaxCommand = ref(new MinMaxModel());
const minMaxArray = ref([
    {
        value: "1",
        title: "Min 1 Max 5"
    },
    {
        value: "2",
        title: "Min 1 Max 10"
    },
    {
        value: "3",
        title: "Özel"
    }
])
const selectedMinMax = ref('1')
const expansionValue = ref(0)
const groupListError = ref(false);
const noCompetencyError = ref(false);
const relationTypeOptions = enumToArray(RaterRelationTypeEnum);

const emits = defineEmits(['clickSubmit', 'update:isValidTemplate'])

const groupHasError = (group: CompetencyGroupCommand) => {
    if (noCompetencyError.value)
        return group.competencies.length === 0 || group.competencies.some((a) => !a.name);
};
const props = defineProps({
    command: {
        type: Object as PropType<CreateCompetencyTemplateCommand> as PropType<UpdateCompetencyTemplateCommand>,
        required: true
    },
    loading: {
        type: Boolean,
        required: true,
        default: false
    },
    saveButtonVisible: {
        type: Boolean,
        required: false,
        default: true
    },
    isValidTemplate: {
        type: String,
        required: false
    }
})

const isValidTemplate = computed({
    get() {
        return props.isValidTemplate ?? '';
    },
    set(newValue: string) {
        emits('update:isValidTemplate', newValue);
    }
});

const addGroup = () => {
    props.command.groups.push(new CompetencyGroupCommand());
    expansionValue.value = props.command.groups.length - 1;
    groupListError.value = false;
};

const removeGroup = (index: number) => {
    props.command.groups.splice(index, 1);
};

const addCompetency = (group: CompetencyGroupCommand) => {
    group.competencies.push(new CompetencyItemCommand());
    noCompetencyError.value = false
};

const removeCompetency = (group: CompetencyGroupCommand, index: number) => {
    group.competencies.splice(index, 1);
};

watch(() => props.isValidTemplate, () => {
    if (props.isValidTemplate) {
        saveTemplate()
    }
}, { deep: true })

const saveTemplate = async () => {
    minMaxCommand.value.min = selectedMinMax.value !== '3' ? 1 : minMaxCommand.value.min;
    minMaxCommand.value.max = selectedMinMax.value === '1' ? 5 : selectedMinMax.value === '2' ? 10 : minMaxCommand.value.max;

    if (props.command.groups.length === 0) {
        isValidTemplate.value = ''
        groupListError.value = true;
        return;
    } else {
        groupListError.value = false;
    }
    for (let i = 0; i < props.command.groups.length; i++) {
        const group = props.command.groups[i];
        group.competencies.forEach(element => {
            element.minScore = minMaxCommand.value.min
            element.maxScore = minMaxCommand.value.max
        });
        if (group.competencies.length === 0) {
            expansionValue.value = i;
            isValidTemplate.value = ''
            noCompetencyError.value = true
            return;
        }
    }
    if (formRef.value) {
        const { valid } = await formRef.value.validate();

        if (valid) {
            emits('clickSubmit', props.command);
        } else {
            isValidTemplate.value = ''
            for (let i = 0; i < props.command.groups.length; i++) {
                const group = props.command.groups[i];
                if (!group.groupName || !group.relationType) {
                    expansionValue.value = i;
                    noCompetencyError.value = true
                    break;
                }
                const hasInvalidComp = group.competencies.some(c => !c.name);
                if (hasInvalidComp) {
                    expansionValue.value = i;
                    noCompetencyError.value = true;
                    break;
                }
            }
        }
    }
};

</script>

<style scoped>
.border-error {
    border-color: rgb(var(--v-theme-error)) !important;
}
</style>