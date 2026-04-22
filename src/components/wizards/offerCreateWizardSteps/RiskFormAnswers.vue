<template>
    <v-row class="fill-height">
        <v-col cols="12" align="center" v-if="!loading">
            <v-row v-if="!isError && createOfferCommand.questions.length > 0">
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" align="start">
                            <p class="text-h5 font-weight-bold text-buttonChipColor">{{ riskFormDetail.title }}</p>
                            <p class="text-body-1 font-weight-bold">
                                {{enumToArray(RiskFormType).find((a) => a.value == riskFormDetail.riskFormType)?.title}}
                            </p>
                            <p>
                                <span class="text-body-1 font-weight-bold">{{ $t('form.description') }} : </span>
                                <span class="text-body-1">{{ riskFormDetail.description }}</span>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" v-for="(question, index) in createOfferCommand.questions" :key="index">
                            <v-card>
                                <v-card-text class="text-left">
                                    <v-col cols="12" class="text-h6 font-weight-bold">
                                        {{ index + 1 + '. ' + question.question }}
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-col cols="12" sm="9" class="py-0">
                                                <v-radio-group v-model="question.value">
                                                    <v-radio color="success"
                                                        v-for="(option, i) in question.optionValues" :key="i"
                                                        :label="option.option" :value="option.value"></v-radio>
                                                </v-radio-group>
                                            </v-col>
                                            <v-col cols="12" sm="3">
                                                <FileCardInput :fileCategory="FileCategoryEnum.ProfilePicture"
                                                    @fileList="fileUploaded($event, index)">
                                                    <template v-slot:component>
                                                        <v-card height="120">
                                                            <v-card-text class="text-cancelButtonColor fill-height">
                                                                <v-col cols="12" class="pb-0" align="center">
                                                                    <v-icon size="40"
                                                                        :color="question.documentPaths.length > 0 ? 'toolbarButton' : 'cancelButtonColor'">
                                                                        {{ question.documentPaths.length > 0 ?
                                                                            'mdi-upload' :
                                                                            'mdi-upload-outline' }}
                                                                    </v-icon>
                                                                </v-col>
                                                                <v-col cols="12" class="pt-0" align="center">
                                                                    {{ $t('form.uploadDocument') }}
                                                                </v-col>
                                                            </v-card-text>
                                                        </v-card>
                                                    </template>
                                                </FileCardInput>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <TextArea v-model="question.answerText" :rows="2"
                                            label="form.description"></TextArea>
                                    </v-col>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex align-center">
                        <v-col cols="auto" class="text-h6 font-weight-bold">
                            {{ $t('form.riskStatus') }} :
                        </v-col>
                        <v-col cols="auto">
                            <v-radio-group v-model="riskFormCommand.customerRiskStatus" inline hide-details>
                                <v-radio :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.Low)?.title"
                                    :value="CustomerRiskLevel.Low" color="success"></v-radio>
                                <v-radio :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.Mid)?.title"
                                    :value="CustomerRiskLevel.Mid" color="info"></v-radio>
                                <v-radio
                                    :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.High)?.title"
                                    :value="CustomerRiskLevel.High" color="error"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-alert type="info" color="alertIconColor" variant="outlined">
                        {{ $t('general.noData') }}
                    </v-alert>
                </v-col>
            </v-row>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="6" md="3" lg="2">
                    <GeneralButton color="cancelButtonColor" prependIcon="mdi-arrow-left-circle-outline"
                        title="general.back" @click="emit('clickBack')" variant="outlined" size="x-large" block>
                    </GeneralButton>
                </v-col>
                <v-col cols="6" md="3" lg="2" v-if="!isError">
                    <GeneralButton appendIcon="mdi-arrow-right-circle-outline" title="general.next" @click="clickNext()"
                        size="x-large" block>
                    </GeneralButton>
                </v-col>
                <v-col cols="6" md="3" lg="2" v-else>
                    <v-btn color="rejectButtonColor" size="x-large"
                        @click="router.push({ name: 'crm-risk-form-definition' })">
                        {{ $t('form.addRiskForm') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" v-else>
            <Loading></Loading>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { CustomerRiskLevel, FileCategoryEnum, RiskFormType } from '@/models/custom/EnumTypes';
import { onMounted, ref, watch } from 'vue';
import FileCardInput from "@/components/formInput/generalInputs/FileCardInput.vue";
import { storeToRefs } from 'pinia';
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { AnswerCommandDto, AnswerQuestionCommand, DetailQuestionDto, RiskFormAnswersCommand, RiskFormDetailDto } from '@/models/entities/crm/CrmRiskFormModels';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { catchError } from '@/core/helpers/generalResponse';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { enumToArray } from '@/core/helpers/enumToArray';
import { useRouter } from 'vue-router';
import GeneralButton from '@/components/formInput/generalInputs/GeneralButton.vue';
import type { GeneralFileResponse } from '@/models/ApiResult';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const router = useRouter();
const emit = defineEmits(['clickNext', 'clickBack']);
const { createOfferCommand } = storeToRefs(useOfferStore());

const customerRiskTypes = ref(enumToArray(CustomerRiskLevel))
const riskFormCommand = ref(new RiskFormAnswersCommand());
const riskFormDetail = ref(new RiskFormDetailDto());
const loading = ref(false);
const isError = ref(false);

const props = defineProps({
    activeStep: {
        type: Number,
        required: false
    },
});

onMounted(() => {
    getCustomerRiskForm();
    if (createOfferCommand.value.riskFormAnswers?.riskFormId) {
        riskFormCommand.value.customerRiskStatus = createOfferCommand.value.riskFormAnswers.customerRiskStatus;
    }
});

watch(() => props.activeStep, () => {
    if (props.activeStep == 2) {
        if (!createOfferCommand.value.riskFormAnswers?.riskFormId)
            getCustomerRiskForm();

    }
})

const getCustomerRiskForm = () => {
    loading.value = true;
    useCrmDefinitionStore().getRiskFormFromCustomerId(createOfferCommand.value.customerId, createOfferCommand.value.salesRepresentativeId).then((res) => {
        if (res) {
            createOfferCommand.value.isRiskForm = true;
            isError.value = false;
            riskFormDetail.value = res;
            const mapIds = res.questions.map((a) => a.id);
            const isChange = createOfferCommand.value.questions.some((b) => !mapIds.includes(b.id));
            riskFormCommand.value.riskFormId = res.id;
            if (isChange || createOfferCommand.value.questions.length == 0) {
                riskFormCommand.value.customerRiskStatus = null;
                createOfferCommand.value.questions = res.questions.map((a: DetailQuestionDto) => {
                    return {
                        id: a.id,
                        question: a.question,
                        optionValues: a.optionValues,
                        documentPaths: [],
                        answerText: "",
                        value: null
                    } as AnswerCommandDto
                });
            }
        } else {
            createOfferCommand.value.isRiskForm = false;
            emit('clickNext');
        }
    }).catch((error) => {
        isError.value = true;
        return catchError(error, () => { getCustomerRiskForm() })
    }).finally(() => {
        loading.value = false
    })
}

const fileUploaded = (files: Array<GeneralFileResponse>, index: number) => {
    const file = files[0];
    // todo: fileUrl
    createOfferCommand.value.questions[index].documentPaths.push(file.fileId);
}

const clickNext = () => {
    if (createOfferCommand.value.questions.some((a) => a.value == null)) {
        ErrorStatusResult[400]({ title: 'general.required', message: 'form.questionsAnswerRequired' });
    } else if (riskFormCommand.value.customerRiskStatus === null) {
        ErrorStatusResult[400]({ title: 'general.required', message: 'form.riskStatusRequired' })
    } else {
        riskFormCommand.value.answers = createOfferCommand.value.questions.map((a) => {
            return {
                questionId: a.id,
                documentPaths: a.documentPaths,
                answerText: a.answerText,
                value: a.value
            } as AnswerQuestionCommand
        });
        createOfferCommand.value.riskFormAnswers = riskFormCommand.value;
        emit('clickNext');
    }
}

</script>