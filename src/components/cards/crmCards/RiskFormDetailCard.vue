<template>
    <v-container fluid>
        <v-card rounded="xl" class="mb-6">
            <v-card-text>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6" md="5">
                        <SingleSelectInput v-model="selectedRiskFormType" :items="riskFormTypes" hide-details
                            label="form.formType" @update:modelValue="selectedFormTypeVersion()">
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="12" sm="6" md="5">
                        <SingleSelectInput v-model="formTypeVersionId" :readonly="true" hide-details
                            :items="getRiskFormVersions" itemTitle="title" itemValue="id" label="form.formVersion"
                            @update:modelValue="changeFormVersion()">
                        </SingleSelectInput>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <div v-if="riskFormDetailLoading" class="d-flex justify-center align-center py-10">
            <Loading></Loading>
        </div>

        <div v-else-if="riskFormDetail && riskFormDetail.id && formTypeVersionId">
            <v-card rounded="xl">
                <v-card-item class="bg-cardToolbar py-6">
                    <template v-slot:prepend>
                        <v-avatar class="mr-4" color="primary" variant="tonal" rounded="lg">
                            <v-icon icon="mdi-clipboard-text-outline" color="primary"></v-icon>
                        </v-avatar>
                    </template>
                    <template v-slot:append>
                        <v-btn v-if="!isPastVersion" @click="emits('currentStep', 2)" size="x-large"
                            color="editButtonColor" prepend-icon="mdi-update">
                            {{ $t('general.update') }}
                        </v-btn>
                    </template>
                    <v-card-title class="text-h5 font-weight-bold text-primary">
                        {{ riskFormDetail.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-body-1 mt-1">
                        {{ riskFormDetail.description }}
                    </v-card-subtitle>
                </v-card-item>

                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="12" v-for="question in sortedQuestions" :key="question.id">
                            <v-sheet border rounded="lg" class="pa-5 position-relative">
                                <v-avatar color="secondary" size="32" class="position-absolute elevation-2"
                                    style="top: -12px; left: -12px; border: 2px solid white;">
                                    <span class="text-subtitle-2 font-weight-bold text-white">
                                        {{ question.order }}
                                    </span>
                                </v-avatar>

                                <div class="ml-2">
                                    <div class="d-flex align-center mb-4">
                                        <h3 class="text-h6 font-weight-bold">
                                            {{ question.question }}
                                        </h3>
                                    </div>

                                    <v-row dense>
                                        <v-col cols="12" sm="6" md="4" v-for="opt in question.optionValues"
                                            :key="opt.value">
                                            <v-card flat variant="outlined"
                                                class="d-flex align-center px-4 py-3 rounded-lg fill-height"
                                                style="border-color: #e0e0e0;">
                                                <v-icon icon="mdi-radiobox-blank" color="grey-lighten-1" class="mr-3"
                                                    size="small"></v-icon>
                                                <div>
                                                    <div class="text-body-2 font-weight-bold text-toolbarButton">
                                                        {{ opt.option }}
                                                    </div>
                                                </div>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions class="bg-cardToolbar px-6 py-3">
                    <v-spacer></v-spacer>
                    <span class="text-body-1 text-disabled">
                        {{ $t('form.total') }} {{ sortedQuestions.length }} {{ $t('form.question') }}
                    </span>
                </v-card-actions>
            </v-card>
        </div>

        <v-card v-else rounded="xl" class="d-flex align-center justify-center pa-10 border-dashed" variant="flat">
            <div class="text-center">
                <v-icon icon="mdi-text-box-search-outline" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
                <div class="text-h6 text-grey">{{ $t('list.notFoundFormDetail') }}</div>
                <div class="text-body-2 text-rowTextColor" v-if="getRiskFormVersions.length > 0">
                    {{ $t('list.notFoundFormDetailDesc') }}
                </div>
                <div class="text-body-2 text-rowTextColor" v-else>
                    {{ $t('list.notFoundFormDetailDesc') }}
                    <u @click="emits('currentStep', 2)"
                        class="text-success text-body-1 font-weight-bold cursor-pointer">
                        {{ $t('list.clickToAdd') }}
                    </u>
                </div>
            </div>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { RiskFormType } from '@/models/custom/EnumTypes';
import { RiskFormDetailDto } from '@/models/entities/crm/CrmRiskFormModels';
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const { riskFormList, riskFormDetail } = storeToRefs(useCrmDefinitionStore());
const selectedRiskFormType = ref(RiskFormType.Devam);
const formTypeVersionId = ref('');
const isPastVersion = ref(false);
const riskFormTypes = ref(enumToArray(RiskFormType));
const emits = defineEmits(['currentStep', 'selectedFormType'])

useCrmDefinitionStore().getRiskFormList();

watch(() => riskFormList.value, () => {
    selectedFormTypeVersion();
})

const sortedQuestions = computed(() => {
    if (!riskFormDetail.value || !riskFormDetail.value.questions) return [];

    return [...riskFormDetail.value.questions].sort((a, b) => a.order - b.order);
});

const riskFormDetailLoading = ref(false)
const selectedFormTypeVersion = () => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    emits('selectedFormType', selectedRiskFormType.value);
    isPastVersion.value = false;
    if (index != -1) {
        formTypeVersionId.value = riskFormList.value[index].versions
            .reduce((max, item) => item.version > max.version ? item : max).id;

        riskFormDetailLoading.value = true;
        useCrmDefinitionStore().getRiskForm(formTypeVersionId.value).finally(() => {
            riskFormDetailLoading.value = false
        })
    } else {
        formTypeVersionId.value = ''
        riskFormDetail.value = new RiskFormDetailDto();
    }
}

const getRiskFormVersions = computed(() => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    if (index != -1)
        return riskFormList.value[index].versions
    else
        return []
})

const changeFormVersion = () => {
    const index = riskFormList.value.findIndex((a) => a.riskFormType == selectedRiskFormType.value);
    if (index != -1) {
        const isLastVersionId = riskFormList.value[index].versions
            .reduce((max, item) => item.version > max.version ? item : max).id;
        if (isLastVersionId == formTypeVersionId.value)
            isPastVersion.value = false
        else
            isPastVersion.value = true

        riskFormDetailLoading.value = true;
        useCrmDefinitionStore().getRiskForm(formTypeVersionId.value).finally(() => {
            riskFormDetailLoading.value = false
        })
    }
    else
        isPastVersion.value = false
}

</script>
