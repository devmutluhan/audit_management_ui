<template>
    <v-card :border="false">
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <SingleSelectInput v-model="selectedRiskFormType" :disabled="isUpdate" :items="riskFormTypes"
                        hide-details label="form.formType" @update:modelValue="selectedFormTypeVersion()">
                    </SingleSelectInput>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <SingleSelectInput v-model="formTypeVersionId" :readonly="true" :disabled="isUpdate" hide-details
                        :items="getRiskFormVersions" itemTitle="title" itemValue="id" label="form.formVersion"
                        @update:modelValue="changeFormVersion()">
                    </SingleSelectInput>
                </v-col>
                <v-col cols="12" class="text-rejectButtonColor" v-if="isUpdate">
                    ** {{riskFormTypes.find((a) => a.value == selectedRiskFormType)?.title + ' '}}
                    {{ isThereForm ? $t('form.updateRiskFormDescription') : $t('form.createRiskFormDescription') }}
                    <br> <br>
                    <span v-if="isThereForm">
                        -- {{ $t('form.updateRiskFormSubDescription') }}
                    </span>
                </v-col>
                <v-col cols="12" class="text-rejectButtonColor" v-if="isPastVersion">
                    ** {{ $t('form.isPastVersionDesc') }}
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="12" md="4" class="d-flex align-end justify-end"
                    v-if="!isUpdate && !isPastVersion && isThereForm">
                    <v-btn class="mr-4" size="x-large" color="editButtonColor" @click="isUpdate = true">
                        {{ $t('general.update') }}
                    </v-btn>
                    <v-btn v-if="getRiskFormVersions.length > 1 && !isPastVersion" size="x-large"
                        color="deleteButtonColor" @click="deleteRiskForm()">
                        {{ $t('general.delete') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-form ref="createRiskFormRef">
                <v-row>
                    <v-col cols="12" v-if="isUpdate">
                        <v-card>
                            <v-card-text>
                                <TextField v-model="command.title" label="form.title" isRequired>
                                </TextField>
                                <TextArea v-model="command.description" label="form.description"></TextArea>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-if="isUpdate" align="center">
                        <v-icon color="confirmButtonColor" size="24">mdi-arrow-down-bold-box</v-icon>
                    </v-col>
                    <v-col cols="12" align="center" v-if="!isThereForm && !isUpdate">
                        <v-card @click="isUpdate = true" height="250" width="250"
                            class="d-flex align-center justify-center">
                            <span class="text-h5 text-cancelButtonColor text-uppercase">
                                {{riskFormTypes.find((a) => a.value == selectedRiskFormType)?.title + ' ' +
                                    $t('general.create')}}
                                <v-icon color="cancelButtonColor" size="30">
                                    mdi-plus-circle-outline
                                </v-icon>
                            </span>
                        </v-card>
                    </v-col>
                    <v-col cols="12" v-for="(question, index) in command.questions" :key="index" align="center">
                        <v-card>
                            <v-card-text>
                                <v-row class="d-flex justify-end">
                                    <v-col cols="12" class="py-2">
                                        <TextArea v-model="question.question" :rows="2" :readonly="!isUpdate" isRequired
                                            label="form.question">
                                        </TextArea>
                                    </v-col>
                                    <v-col cols="12" sm="11" class="py-2" v-for="(option, i) in question.optionValues"
                                        :key="i">
                                        <v-row>
                                            <v-col cols="9" sm="11" class="py-1">
                                                <TextField v-model="question.optionValues[i]" isRequired
                                                    :readonly="!isUpdate" placeholder="form.option">
                                                </TextField>
                                            </v-col>
                                            <v-col cols="1" class="py-1" v-if="isUpdate">
                                                <Tooltip descriptionText="form.delete" location="bottom">
                                                    <template v-slot:activatorItem>
                                                        <v-btn @click="question.optionValues.splice(i, 1)"
                                                            icon="mdi-close" variant="text" color="headerTextColor">
                                                        </v-btn>
                                                    </template>
                                                </Tooltip>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="11" v-if="isUpdate">
                                        <v-card color="cardToolbar"
                                            @click="command.questions[index].optionValues.push('');">
                                            <v-card-text class="d-flex align-center text-body-1">
                                                <v-icon color="headerTextColor mr-4">mdi-plus-circle-outline</v-icon>
                                                {{ $t('form.addOption') }}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0" v-if="isUpdate">
                                        <v-divider></v-divider>
                                    </v-col>
                                    <v-col cols="12" class="py-2" v-if="isUpdate">
                                        <v-row class="d-flex align-center">
                                            <v-spacer></v-spacer>
                                            <v-col cols="auto" class="px-0">
                                                <Tooltip descriptionText="form.copyQuestion" location="bottom">
                                                    <template v-slot:activatorItem>
                                                        <v-btn icon="mdi-content-duplicate" variant="text"
                                                            color="headerTextColor"
                                                            @click="command.questions.push(JSON.parse(JSON.stringify({ ...question })))"></v-btn>
                                                    </template>
                                                </Tooltip>
                                            </v-col>
                                            <v-col cols="auto">
                                                <Tooltip descriptionText="form.deleteQuestion" location="bottom">
                                                    <template v-slot:activatorItem>
                                                        <v-btn icon="mdi-delete" variant="text" color="headerTextColor"
                                                            @click="command.questions.splice(index, 1)"></v-btn>
                                                    </template>
                                                </Tooltip>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                        <v-icon v-if="isUpdate" color="editButtonColor" size="24">mdi-arrow-down-bold-box</v-icon>
                    </v-col>
                </v-row>
            </v-form>
            <v-row v-if="isUpdate">
                <v-col>
                    <v-card color="cardToolbar" @click="command.questions.push(new QuestionCommand())">
                        <v-card-text class="text-h6 d-flex align-center">
                            <v-icon color="headerTextColor mr-4">mdi-plus-circle-outline</v-icon>
                            {{ $t('form.addQuestion') }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="isUpdate" class="d-flex justify-center">
                <v-col cols="5" sm="3" md="2">
                    <v-btn size="x-large" @click="isUpdate = false; resetHandle()" block color="cancelButtonColor">
                        {{ $t('general.reset') }}
                    </v-btn>
                </v-col>
                <v-col cols="5" sm="3" md="2">
                    <v-btn size="x-large" :loading="loading" @click="createRiskForm()" block color="approveButtonColor">
                        {{ $t('general.save') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
</template>

<script setup lang="ts">
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import Tooltip from '@/components/formInput/Tooltip.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { QuestionCommand, CreateRiskFormCommand, RiskFormDetailDto, UpdateRiskFormCommand } from '@/models/entities/crm/CrmRiskFormModels';
import { enumToArray } from '@/core/helpers/enumToArray';
import { RiskFormType } from '@/models/custom/EnumTypes';
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { storeToRefs } from 'pinia';
import { catchError } from '@/core/helpers/generalResponse';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import i18n from '@/core/plugins/i18n';
import { ConfirmModalType } from '@/models/types';
const t = i18n.global.t;

const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType())

const { riskFormList, riskFormDetail } = storeToRefs(useCrmDefinitionStore())
const selectedRiskFormType = ref(RiskFormType.Devam);
const formTypeVersionId = ref('');
const isUpdate = ref(false);
const isPastVersion = ref(false);
const isThereForm = ref(false);
const loading = ref(false);
const riskFormTypes = ref(enumToArray(RiskFormType));
const createRiskFormRef = ref(null as any);

const command = ref(new CreateRiskFormCommand());

onMounted(() => {
    useCrmDefinitionStore().getRiskFormList();
})

const getRiskFormVersions = computed(() => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    if (index != -1)
        return riskFormList.value[index].versions
    else
        return []
})

watch(() => riskFormList.value, () => {
    selectedFormTypeVersion();
})

watch(() => riskFormDetail.value, (newValue: RiskFormDetailDto) => {
    if (!newValue) return;
    command.value.description = newValue.description;
    command.value.title = newValue.title;
    command.value.riskFormType = newValue.riskFormType;
    newValue.questions.forEach((a) => {
        const question = new QuestionCommand();
        question.question = a.question;
        question.optionValues = a.optionValues.map((a) => a.option);
        command.value.questions.push(question);
    });
})

const selectedFormTypeVersion = () => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    isPastVersion.value = false;
    if (index != -1) {
        isThereForm.value = true;
        formTypeVersionId.value = riskFormList.value[index].versions
            .reduce((max, item) => item.version > max.version ? item : max).id;
        useCrmDefinitionStore().getRiskForm(formTypeVersionId.value);
    } else {
        formTypeVersionId.value = ''
        command.value = new CreateRiskFormCommand();
        isThereForm.value = false;
    }
}

const changeFormVersion = () => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    if (index != -1) {
        const isLastVersionId = riskFormList.value[index].versions
            .reduce((max, item) => item.version > max.version ? item : max).id;
        if (isLastVersionId == formTypeVersionId.value)
            isPastVersion.value = false
        else
            isPastVersion.value = true

    }
    else
        isPastVersion.value = false
}

const createRiskForm = () => {
    const doesNotOptionIndex = command.value.questions.findIndex((a) => a.optionValues.length <= 1 || !a.optionValues.some((b) => b != ''));

    if (command.value.questions.length == 0) {
        ErrorStatusResult[400]({ title: t('general.required'), message: t('statusCode.QuestionAddRequired') })
        return
    }
    if (doesNotOptionIndex != -1) {
        ErrorStatusResult[400]({ title: t('general.required'), message: doesNotOptionIndex + 1 + '. ' + t('statusCode.OptionAddRequired') })
        return
    }
    createRiskFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            command.value.riskFormType = selectedRiskFormType.value;
            loading.value = true;
            if (!isThereForm.value) {
                useCrmDefinitionStore().createRiskForm(command.value).then(() => {
                    useCrmDefinitionStore().getRiskFormList();
                    isThereForm.value = true;
                    command.value = new CreateRiskFormCommand();
                    isUpdate.value = false;
                }).catch((error) => {
                    return catchError(error, () => { createRiskForm() })
                }).finally(() => {
                    loading.value = false;
                });
            } else {
                const updateCommand = { id: formTypeVersionId.value, ...command.value } as UpdateRiskFormCommand;
                useCrmDefinitionStore().updateRiskForm(formTypeVersionId.value, updateCommand).then(() => {
                    useCrmDefinitionStore().getRiskFormList();
                    command.value = new CreateRiskFormCommand();
                    isThereForm.value = true;
                    isUpdate.value = false;
                }).catch((error) => {
                    return catchError(error, () => { createRiskForm() })
                }).finally(() => {
                    loading.value = false;
                });
            }
        }
    })
}
const resetHandle = () => {
    if (isThereForm.value && formTypeVersionId.value) {
        command.value = new CreateRiskFormCommand();
        command.value.description = riskFormDetail.value.description;
        command.value.title = riskFormDetail.value.title;
        command.value.riskFormType = riskFormDetail.value.riskFormType;
        riskFormDetail.value.questions.forEach((a) => {
            const question = new QuestionCommand();
            question.question = a.question;
            question.optionValues = a.optionValues.map((a) => a.option);
            command.value.questions.push(question);
        });
    } else {
        command.value = new CreateRiskFormCommand();
        command.value.riskFormType = selectedRiskFormType.value;
    }

    if (createRiskFormRef.value) {
        createRiskFormRef.value.resetValidation();
    }
};

const deleteRiskForm = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.delete',
        text: getRiskFormVersions.value.find((a) => a.id == formTypeVersionId.value)?.title + ' ' + t('form.deleteRiskFormDescription'),
        action: () => {
            confirmModalValue.value.buttonLoading = true
            useCrmDefinitionStore().deleteRiskForm(formTypeVersionId.value).then(() => {
                confirmDialog.value = false;
                const index = getRiskFormVersions.value.findIndex((a) => a.id == formTypeVersionId.value);
                const secondIndex = riskFormList.value.find((a) => a.riskFormType == selectedRiskFormType.value)?.versions.findIndex((b) => b.id == formTypeVersionId.value);
                if (index != -1)
                    getRiskFormVersions.value.splice(index, 1);
                if (secondIndex != -1 && secondIndex)
                    riskFormList.value.find((a) => a.riskFormType == selectedRiskFormType.value)?.versions.splice(secondIndex, 1)

                selectedFormTypeVersion();
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}
</script>
