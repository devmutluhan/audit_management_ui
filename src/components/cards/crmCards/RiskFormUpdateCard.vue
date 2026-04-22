<template>
    <v-container fluid>
        <v-row class="d-flex align-center">
            <v-col cols="12" class="pb-0">
                <v-btn variant="text" color="primary" class="font-weight-bold" prepend-icon="mdi-arrow-left"
                    @click="emits('currentStep', 1)">
                    {{ isUpdateMode ? $t('form.updateRiskForm') : $t('form.createRiskForm') }}
                </v-btn>
            </v-col>
            <v-col cols="12" class="ml-4 pt-0 mb-4">
                <p class="text-disabled text-error font-weight-bold mb-0">
                    ** {{riskFormTypes.find((a) => a.value == createCommand.riskFormType)?.title + ' '}}
                    {{ isUpdateMode ? $t('form.updateRiskFormDescription') : $t('form.createRiskFormDescription') }}
                </p>
            </v-col>
        </v-row>

        <v-form ref="updateOrCreateFormRef" v-model="valid" @submit.prevent="submitForm">
            <v-card rounded="xl" class="mb-6">
                <v-card-item class="bg-cardToolbar py-6">
                    <template v-slot:prepend>
                        <v-avatar class="mr-4" color="primary" variant="tonal" rounded="lg">
                            <v-icon icon="mdi-file-document-edit-outline" color="primary"></v-icon>
                        </v-avatar>
                    </template>
                    <v-card-title class="text-h6 font-weight-bold">{{ $t('form.generalInformation') }}</v-card-title>
                </v-card-item>
                <v-card-text class="pa-6">
                    <v-row class="d-flex align-center">
                        <v-col cols="12" md="8">
                            <TextField v-model="createCommand.title" isRequired label="form.title"></TextField>
                        </v-col>
                        <v-col cols="12" md="4">
                            <SingleSelectInput v-model="createCommand.riskFormType" :items="riskFormTypes" hide-details
                                label="form.formType" isRequired disabled>
                            </SingleSelectInput>
                        </v-col>
                        <v-col cols="12">
                            <TextArea v-model="createCommand.description" label="form.description"
                                placeholder="form.descriptionInfoForm"></TextArea>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <div class="d-flex align-center justify-space-between mb-4 mt-2 px-2">
                <h3 class="text-h6 font-weight-bold text-grey-darken-3">{{ $t('form.questionsAndOptions') }}</h3>
                <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="addQuestion">
                    {{ $t('form.addQuestion') }}
                </v-btn>
            </div>

            <template v-for="(question, qIndex) in createCommand.questions" :key="qIndex">
                <v-card rounded="xl" border class="mb-4 position-relative">
                    <div class="position-absolute" style="top: 10px; right: 10px; z-index: 1;">
                        <v-btn variant="text" icon color="error" @click="removeQuestion(qIndex)"
                            v-if="createCommand.questions.length > 1">
                            <v-icon>mdi-delete</v-icon>
                            <v-tooltip activator="parent" location="top">{{ $t('form.deleteQuestion') }}</v-tooltip>
                        </v-btn>
                    </div>

                    <v-card-text class="pa-6">
                        <v-row>
                            <v-col cols="12">
                                <TextField v-model="question.question" label="form.question" isRequired>
                                </TextField>
                            </v-col>

                            <v-col cols="12">
                                <v-card variant="flat" color="cardToolbar" rounded="lg" class="pa-4 border-dashed">
                                    <div class="text-subtitle-2 text-medium-emphasis mb-2">{{ $t('form.options') }}
                                    </div>

                                    <v-row dense>
                                        <v-col cols="12" md="6" v-for="(opt, oIndex) in question.optionValues"
                                            :key="oIndex">
                                            <v-row class="d-flex align-center">
                                                <v-col>
                                                    <TextField v-model="question.optionValues[oIndex]"
                                                        placeholder="form.option" isRequired>
                                                    </TextField>
                                                </v-col>
                                                <v-col cols="auto" class="pl-0">
                                                    <v-btn icon="mdi-close" size="x-small" variant="text" color="grey"
                                                        @click="removeOption(qIndex, oIndex)"
                                                        :disabled="question.optionValues.length <= 1"></v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="12" md="6" class="d-flex align-center">
                                            <v-btn variant="text" color="primary" prepend-icon="mdi-plus-circle-outline"
                                                size="small" @click="addOption(qIndex)">
                                                {{ $t('form.addOption') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <div v-if="qIndex == createCommand.questions.length - 1"
                        class="d-flex align-center justify-end font-weight-bold mb-4 mt-2 px-2">
                        <v-btn color="primary" variant="text" prepend-icon="mdi-plus" @click="addQuestion">
                            {{ $t('form.addQuestion') }}
                        </v-btn>
                    </div>
                </v-card>
            </template>

            <v-card rounded="xl" class="mt-6">
                <v-card-actions class="pa-4 d-flex justify-end">
                    <v-btn size="large" variant="text" color="grey-darken-1" class="mr-2"
                        @click="emits('currentStep', 1)">
                        {{ $t('general.cancel') }}
                    </v-btn>
                    <v-btn type="submit" size="large" color="success" prepend-icon="mdi-content-save-outline"
                        :loading="loading" min-width="150" variant="elevated">
                        {{ isUpdateMode ? $t('general.update') : $t('general.save') }}
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { storeToRefs } from 'pinia';
import { RiskFormType } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { CreateRiskFormCommand, RiskFormDetailDto, UpdateRiskFormCommand } from '@/models/entities/crm/CrmRiskFormModels';
import { catchError } from '@/core/helpers/generalResponse';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';

const emits = defineEmits(['currentStep', 'createItem']);
const { riskFormDetail } = storeToRefs(useCrmDefinitionStore());

const updateOrCreateFormRef = ref<any>(null);
const valid = ref(false);
const loading = ref(false);
const riskFormTypes = ref(enumToArray(RiskFormType));

const createCommand = ref(new CreateRiskFormCommand())
const isUpdateMode = computed(() => !!riskFormDetail.value?.id);

const props = defineProps({
    selectedFormType: {
        type: Number,
        required: true
    }
})

onMounted(() => {
    initializeForm()
})

const initializeForm = () => {
    if (isUpdateMode.value && riskFormDetail.value.id) {
        createCommand.value = {
            title: riskFormDetail.value.title,
            riskFormType: riskFormDetail.value.riskFormType,
            description: riskFormDetail.value.description,
            questions: riskFormDetail.value.questions.map((q: any) => ({
                question: q.question,
                optionValues: q.optionValues.map((opt: any) => opt.option)
            }))
        };
    } else {
        riskFormDetail.value = new RiskFormDetailDto();
        createCommand.value.riskFormType = props.selectedFormType;
        addQuestion();
    }
}

const submitForm = async () => {
    const { valid } = await updateOrCreateFormRef.value.validate();
    if (!valid) return;

    loading.value = true;

    if (isUpdateMode.value && riskFormDetail.value.id) {
        const updateCommand = { id: riskFormDetail.value.id, ...createCommand.value } as UpdateRiskFormCommand;
        useCrmDefinitionStore().updateRiskForm(riskFormDetail.value.id, updateCommand).then(() => {
            emits('currentStep', 1);
            useCrmDefinitionStore().getRiskFormList();
        }).catch((error) => {
            return catchError(error, () => { submitForm() })
        }).finally(() => {
            loading.value = false;
        });
    } else {
        useCrmDefinitionStore().createRiskForm(createCommand.value).then(() => {
            emits('currentStep', 1);
            useCrmDefinitionStore().getRiskFormList();
        }).catch((error) => {
            return catchError(error, () => { submitForm() })
        }).finally(() => {
            loading.value = false;
        });
    }
}

const addQuestion = () => {
    createCommand.value.questions.push({
        question: '',
        optionValues: ['', '']
    });
};

const removeQuestion = (index: number) => {
    createCommand.value.questions.splice(index, 1);
};

const addOption = (qIndex: number) => {
    createCommand.value.questions[qIndex].optionValues.push('');
};

const removeOption = (qIndex: number, oIndex: number) => {
    createCommand.value.questions[qIndex].optionValues.splice(oIndex, 1);
};
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
}
</style>