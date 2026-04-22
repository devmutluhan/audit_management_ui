<template>
    <v-card rounded="xl">
        <v-card-text>
            <v-form ref="appointmentsFormRef">
                <v-col>
                    <v-toolbar class="d-flex align-center" height="auto" color="transparent">
                        <v-col cols="12" class="pa-0">
                            <p class="text-h4 font-weight-bold ma-1">{{ $t('form.evaluatorConfiguration') }}</p>
                            <p class="text-subtitle-1 text-headerTextColor ma-1">
                                {{ $t('form.evaluatorConfigurationDesc') }}
                            </p>
                        </v-col>
                    </v-toolbar>
                </v-col>

                <v-col>
                    <v-card rounded="xl">
                        <v-toolbar class="d-flex align-center pa-2" height="auto" color="transparent">
                            <v-col class="text-h5 font-weight-bold">
                                <v-icon color="primary" class="mr-2" size="28">mdi-scale-balance</v-icon>
                                {{ $t('form.roleWeights') }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto" align="end">
                                <v-chip v-if="totalWeight != 100" :color="totalWeight == 100 ? 'success' : 'warning'"
                                    class="font-weight-bold" rounded="lg">
                                    {{ $t('list.remainder') }}: %{{ 100 - totalWeight }}
                                </v-chip>
                                <br v-if="totalWeight != 100">
                                <v-chip :color="totalWeight == 100 ? 'success' : 'error'" class="font-weight-bold"
                                    rounded="lg">
                                    {{ $t('form.total') }}: %{{ totalWeight }}
                                </v-chip>
                            </v-col>
                        </v-toolbar>
                        <v-card-text>
                            <v-col>
                                <v-row>
                                    <v-col v-for="(item, index) in templateWeights" :key="index">
                                        <TextField v-model.number="item.weight"
                                            :label="'enums.' + RaterRelationTypeEnum[item.relationType]"
                                            :isRequired="selectedRelationTypes.includes(item.relationType)" suffix="%"
                                            isNumber :disabled="!selectedRelationTypes.includes(item.relationType)">
                                        </TextField>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col>
                    <v-card rounded="xl">
                        <v-toolbar class="d-flex align-center pa-2" height="auto">
                            <v-col class="text-h5 font-weight-bold">
                                <v-icon color="primary" class="mr-2" size="28">mdi-account-group-outline</v-icon>
                                {{ $t('form.personBasedMatrix') }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <v-btn variant="outlined" prepend-icon="mdi-refresh">{{ $t('form.autoFill') }}</v-btn>
                            </v-col>
                        </v-toolbar>
                        <v-card-text style="height: auto; max-height: 600px;  overflow: auto;">
                            <Datatable :data="competencyEmployees" :header="tableHeader"
                                :enable-items-per-page-dropdown="true" :infiniteScroll="true"
                                :total="competencyEmployees.length">
                                <template v-slot:avatar="{ row: data }">
                                    <ImageCard :first-value="data.firstName" :second-value="data.lastName" color="red"
                                        :avatarText="data.avatarUrl" rounded="lg" />
                                </template>
                                <template v-slot:employee="{ row: data }">
                                    <p class="font-weight-bold ma-0">
                                        {{ data.firstName + ' ' + data.lastName }}
                                    </p>
                                </template>
                                <template v-slot:manager="{ row: data }">
                                    <EmployeeSelectInput
                                        :disabledItem="(a) => { return disabledEmployee(data, a.id, RaterRelationTypeEnum.Manager) }"
                                        @update-model-value="updateSelectedEmployee(data, $event, RaterRelationTypeEnum.Manager)"
                                        :items="initialEmployeeList" :isLabelVisible="false" multiple justAvatarChip
                                        :isRequired="selectedRelationTypes.includes(RaterRelationTypeEnum.Manager)"
                                        :disabled="!selectedRelationTypes.includes(RaterRelationTypeEnum.Manager)">
                                    </EmployeeSelectInput>
                                </template>
                                <template v-slot:subordinate="{ row: data }">
                                    <EmployeeSelectInput :items="initialEmployeeList" :isLabelVisible="false" multiple
                                        :disabledItem="(a) => { return disabledEmployee(data, a.id, RaterRelationTypeEnum.Subordinate) }"
                                        @update-model-value="updateSelectedEmployee(data, $event, RaterRelationTypeEnum.Subordinate)"
                                        justAvatarChip
                                        :isRequired="selectedRelationTypes.includes(RaterRelationTypeEnum.Subordinate)"
                                        :disabled="!selectedRelationTypes.includes(RaterRelationTypeEnum.Subordinate)">
                                    </EmployeeSelectInput>
                                </template>
                                <template v-slot:self="{ row: data }">
                                    <v-col cols="12" align="center">
                                        <v-checkbox-btn
                                            :model-value="data.raters.some((a) => a.relationType == RaterRelationTypeEnum.Self)"
                                            color="primary" density="compact" hide-details readonly></v-checkbox-btn>
                                    </v-col>
                                </template>
                                <template v-slot:peer="{ row: data }">
                                    <EmployeeSelectInput :items="initialEmployeeList" :isLabelVisible="false" multiple
                                        :disabledItem="(a) => { return disabledEmployee(data, a.id, RaterRelationTypeEnum.Peer) }"
                                        @update-model-value="updateSelectedEmployee(data, $event, RaterRelationTypeEnum.Peer)"
                                        justAvatarChip
                                        :isRequired="selectedRelationTypes.includes(RaterRelationTypeEnum.Peer)"
                                        :disabled="!selectedRelationTypes.includes(RaterRelationTypeEnum.Peer)">
                                    </EmployeeSelectInput>
                                </template>
                                <template v-slot:other="{ row: data }">
                                    <EmployeeSelectInput :items="initialEmployeeList" :isLabelVisible="false" multiple
                                        :disabledItem="(a) => { return disabledEmployee(data, a.id, RaterRelationTypeEnum.Other) }"
                                        @update-model-value="updateSelectedEmployee(data, $event, RaterRelationTypeEnum.Other)"
                                        justAvatarChip
                                        :isRequired="selectedRelationTypes.includes(RaterRelationTypeEnum.Other)"
                                        :disabled="!selectedRelationTypes.includes(RaterRelationTypeEnum.Other)">
                                    </EmployeeSelectInput>
                                </template>
                            </Datatable>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-form>

            <v-col cols="12">
                <v-row class="d-flex justify-center">
                    <v-col cols="6" md="3">
                        <v-btn @click="emits('currentStep', 2)" color="cancelButtonColor" size="x-large" block
                            :disabled="loading">
                            {{ $t('general.back') }}
                        </v-btn>
                    </v-col>
                    <v-col cols="6" md="3">
                        <v-btn @click="clickSubmit()" size="x-large" block :loading="loading">
                            {{ $t('general.continue') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import type { CompetencyWeightDefinitionCommand, PeriodReviewCompetencySectionCommand, RaterCommandDto } from '@/models/entities/humanResource/PerformanceCommands';
import type { ReviewSummaryDto } from '@/models/entities/humanResource/PerformanceDtos';
import ImageCard from "@/components/cards/ImageCard.vue";
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import { computed, onMounted, ref, type PropType } from 'vue';
import { RaterRelationTypeEnum } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';
import type { EmployeeListDto } from '@/models/entities/humanResource/EmployeeDtos';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';

const emits = defineEmits(['currentStep', 'createItem'])
const props = defineProps({
    periodCompetencyCommand: {
        type: Object as PropType<PeriodReviewCompetencySectionCommand>,
        required: true
    },
    periodReviewList: {
        type: Array<ReviewSummaryDto>,
        required: true
    },
    initialEmployeeList: {
        type: Array<EmployeeListDto>,
        required: true
    }
});

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "avatar",
        sortEnabled: true,
        columnWidth: 270
    },
    {
        columnName: 'list.employeeName',
        columnLabel: "employee",
        sortEnabled: true,
        columnWidth: 270
    },
    {
        columnName: 'enums.Manager',
        columnLabel: "manager",
        sortEnabled: true,
        columnWidth: 240,
    },
    {
        columnName: 'enums.Subordinate',
        columnLabel: "subordinate",
        sortEnabled: true,
        columnWidth: 240,
    },
    {
        columnName: 'enums.Self',
        columnLabel: "self",
        sortEnabled: true,
        columnWidth: 240
    },
    {
        columnName: 'enums.Peer',
        columnLabel: "peer",
        sortEnabled: true,
        columnWidth: 240
    },
    {
        columnName: 'enums.Other',
        columnLabel: "other",
        sortEnabled: true,
        columnWidth: 240
    }
]);

const templateWeights = ref(enumToArray(RaterRelationTypeEnum).map((a) => {
    return {
        relationType: a.value,
        weight: null
    } as CompetencyWeightDefinitionCommand
}))

const totalWeight = computed(() => {
    const selectedRelationTypes = props.periodCompetencyCommand.competencySection.groups.map((a) => a.relationType);
    const selectedTemplateWeight = templateWeights.value.filter((a) => selectedRelationTypes.includes(a.relationType));
    let result = 0
    selectedTemplateWeight.forEach((a) => a.weight ? result += Number(a.weight) : result += 0)
    return result
})

const selectedRelationTypes = computed(() => {
    return props.periodCompetencyCommand.competencySection.groups.map((a) => a.relationType);
})
const appointmentsFormRef = ref(null as any);
const competencyEmployees = ref(new Array<EmployeeListDto>() as any);

onMounted(() => {
    selectDefaultManager();
})

const selectDefaultManager = () => {
    competencyEmployees.value = props.periodCompetencyCommand.reviewees.map((a) => {
        let employee = props.initialEmployeeList.find((b) => b.id == a.revieweeId);
        // let managerId = props.periodReviewList.find((c) => c.reviewee.id == a.revieweeId)?.manager.id;
        let raters = new Array<RaterCommandDto>();
        if (selectedRelationTypes.value.includes(RaterRelationTypeEnum.Self) && employee) {
            raters.push({
                id: null,
                raterId: employee.id ?? '',
                relationType: RaterRelationTypeEnum.Self
            });
        }
        return {
            ...employee,
            raters: raters
        }
    })
}

const route = useRoute();
const loading = ref(false);

const clickSubmit = () => {
    appointmentsFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            loading.value = true;
            props.periodCompetencyCommand.competencySection.weights = JSON.parse(JSON.stringify(templateWeights.value.filter((a) => a.weight != null)))
            props.periodCompetencyCommand.competencySection.weights.forEach((a) => {
                a.weight = a.weight ? a.weight / 100 : 0
            });
            props.periodCompetencyCommand.reviewees = competencyEmployees.value.map((a) => {
                return {
                    revieweeId: a.id,
                    raters: a.raters
                }
            });
            usePerformanceCommandStore().periodReviewCompetencySection(route.params.id.toString(), props.periodCompetencyCommand).then((res) => {
                emits('createItem')
                emits('currentStep', 1)
            }).catch((error) => {
                return catchError(error, () => { clickSubmit() })
            }).finally(() => {
                loading.value = false;
            })
        }
    })
}

const updateSelectedEmployee = (data: any, event: Array<EmployeeListDto>, relationType: RaterRelationTypeEnum) => {
    data.raters = data.raters.filter((a) => a.relationType !== relationType);
    event.forEach((a) => {
        data.raters.push({
            id: null,
            raterId: a.id,
            relationType: relationType
        })
    })
}

const disabledEmployee = (data: any, selectedEmployeeId: string, relationType: RaterRelationTypeEnum) => {
    if (data.id == selectedEmployeeId) {
        return { value: true, description: 'enums.' + RaterRelationTypeEnum[RaterRelationTypeEnum.Self] }
    }
    if (data.raters.some((a) => a.raterId == selectedEmployeeId && a.relationType != relationType)) {
        const type = data.raters.find((a) => a.raterId == selectedEmployeeId).relationType
        return { value: true, description: 'enums.' + RaterRelationTypeEnum[type] }
    }
    return { value: false, description: '' }
}

</script>