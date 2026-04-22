<template>
    <DialogContent title="list.viewRiskFormAnswers" :dialogClose="dialogClose" titleIcon="mdi-eye">
        <template v-slot:dialogBody>
            <v-row v-if="riskFormDetail.customerRiskForm.questions.length > 0">
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" align="start">
                            <p class="text-h5 font-weight-bold text-buttonChipColor">
                                {{ riskFormDetail.customerRiskForm.title }}
                            </p>
                            <p class="text-body-1 font-weight-bold">
                                {{enumToArray(RiskFormType).find((a) => a.value ==
                                    riskFormDetail.customerRiskForm.riskFormType)?.title}}
                            </p>
                            <p>
                                <span class="text-body-1 font-weight-bold">{{ $t('form.description') }} :
                                </span>
                                <span class="text-body-1">
                                    {{ riskFormDetail.customerRiskForm.description }}
                                </span>
                            </p>
                            <p>
                                <span class="text-body-1 font-weight-bold">
                                    {{ $t('form.riskStatus') }} :
                                </span>
                                <span class="text-body-1">
                                    <v-chip :color="riskChipColor">
                                        {{customerRiskTypes.find((a) => a.value ==
                                            riskFormDetail.customerRiskStatus)?.title}}
                                    </v-chip>
                                </span>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" v-for="(question, index) in riskFormDetail.customerRiskForm.questions"
                            :key="index">
                            <v-card class="d-flex align-top" v-if="getRiskFormQuestion(question.id)">
                                <v-card-text class="text-left">
                                    <v-col cols="12" class="text-h6 font-weight-bold">
                                        {{ index + 1 + '. ' + question.question }}
                                    </v-col>
                                    <v-col cols="12">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-col cols="12" class="py-0">
                                                <v-radio-group readonly hide-details
                                                    :model-value="getRiskFormQuestion(question.id).value">
                                                    <v-radio color="success"
                                                        v-for="(option, i) in question.optionValues" :key="i"
                                                        :label="option.option" :value="option.value"></v-radio>
                                                </v-radio-group>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-divider></v-divider>
                                    <v-col cols="12 pa-2">
                                        <p class="text-body-1 ma-0">
                                            <span class="font-weight-bold">{{ $t('form.description') }} :</span>
                                            {{ getRiskFormQuestion(question.id).answerText == '' ? '--' :
                                                getRiskFormQuestion(question.id).answerText }}
                                        </p>
                                    </v-col>
                                </v-card-text>
                                <v-col cols="12" class="position-absolute" align="right">
                                    <v-icon size="40" :disabled="!getRiskFormQuestion(question.id).documentPaths[0]"
                                        @click="previewFile(getRiskFormQuestion(question.id).documentPaths[0])"
                                        :color="getRiskFormQuestion(question.id).documentPaths[0] ? 'info' : 'grey'">
                                        mdi-file-eye-outline
                                    </v-icon>
                                </v-col>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <NoDataCard />
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { CustomerRiskLevel, RiskFormType } from '@/models/custom/EnumTypes';
import { computed, onMounted, ref } from 'vue';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { catchError } from '@/core/helpers/generalResponse';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { AnswerQuestionCommand, OfferRiskAnswersDto } from '@/models/entities/crm/CrmRiskFormModels';
import NoDataCard from '@/components/list/cards/NoDataCard.vue';
import { getFileUrl } from '@/core/helpers/assets';

const customerRiskTypes = ref(enumToArray(CustomerRiskLevel));
const riskFormDetail = ref(new OfferRiskAnswersDto())

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    offerId: {
        type: String,
        required: true
    }
});

onMounted(() => {
    getRiskFormAnswers();
});

const riskChipColor = computed(() => {
    return riskFormDetail.value.customerRiskStatus == CustomerRiskLevel.Low ? 'success' :
        riskFormDetail.value.customerRiskStatus == CustomerRiskLevel.Mid ? 'info' :
            riskFormDetail.value.customerRiskStatus == CustomerRiskLevel.High ? 'error' : ''
})

const getRiskFormAnswers = () => {
    useOfferStore().getOfferRiskAnswers(props.offerId).then((res) => {
        if (res) {
            riskFormDetail.value = res;
        } else {

        }
    }).catch((error) => {
        return catchError(error, () => { getRiskFormAnswers() })
    })
}

const getRiskFormQuestion = (questionId: string) => {
    const index = riskFormDetail.value.riskFormAnswers.findIndex((a) => a.questionId == questionId);
    if (index != -1)
        return riskFormDetail.value.riskFormAnswers[index];
    else
        return new AnswerQuestionCommand()
}

const previewFile = (item) => {
    if (!item)
        return;
    const url = getFileUrl(item);
    if (!url)
        return;

    window.open(url, '_blank');
};

</script>