<template>
    <DialogContent :title="isUpdated ? 'general.updateEvaluationTemplate' : 'general.createEvaluationTemplate'"
        :buttons="buttons" :dialogClose="dialogClose" :titleIcon="isUpdated ? 'mdi-pencil' : 'mdi-plus'">
        <template v-slot:dialogBody>
            <v-form ref="createEvaluationTempForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.title" label="list.title" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model.number="weights.competencyWeight" label="form.competencyWeight" isNumber
                            suffix="%" :max="100" density="compact" placeholder="100" />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.hasGoal" label="form.hasGoal" />
                    </v-col>
                    <v-col cols="12" v-if="commandModel.hasGoal">
                        <v-row class="d-flex align-center">
                            <v-col cols="12">
                                <TextField v-model="commandModel.defaultGoalTitle" isRequired label="list.goalTitle" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <SingleAutocompleteInput v-model="commandModel.goalType" isRequired
                                    label="list.goalType" :items="enumToArray(GoalTypeEnum)" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <TextField v-model.number="weights.goalWeight" label="form.goalWeight" isNumber
                                    suffix="%" isRequired :max="100" density="compact" placeholder="100" />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { GoalTypeEnum } from '@/models/custom/EnumTypes';
import { CreateOrUpdateEvaluationTemplateCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import type { EvaluationTemplateDto } from '@/models/entities/humanResource/PerformanceDtos';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';

const commandModel = ref(new CreateOrUpdateEvaluationTemplateCommand());
const weights = ref({ goalWeight: null as any, competencyWeight: null as any })
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<EvaluationTemplateDto>,
        required: false
    }
});

const createEvaluationTempForm = ref(null as any);
const createEvaluationFunc = () => {
    createEvaluationTempForm.value.validate().then((res: any) => {
        if (res.valid) {
            const totalWeight = weights.value.goalWeight + weights.value.competencyWeight
            if (totalWeight !== 100) {
                ErrorStatusResult[400]({ message: 'statusCode.GeneralTotalWeightError' })
                return
            }
            buttons.value[1].loading = true;
            commandModel.value.competencyWeight = weights.value.competencyWeight / 100;
            commandModel.value.goalWeight = weights.value.goalWeight / 100;
            if (isUpdated.value && props.selectedItem) {
                usePerformanceCommandStore().updateEvaluationTemplate(props.selectedItem.id, commandModel.value).then((response) => {
                    props.dialogClose();
                    if (props.selectedItem) {
                        props.selectedItem.title = commandModel.value.title
                        props.selectedItem.goalWeight = commandModel.value.goalWeight
                        props.selectedItem.competencyWeight = commandModel.value.competencyWeight
                        props.selectedItem.hasGoal = commandModel.value.hasGoal
                        props.selectedItem.defaultGoalTitle = commandModel.value.hasGoal ? commandModel.value.defaultGoalTitle : null
                        props.selectedItem.goalType = commandModel.value.hasGoal ? commandModel.value.goalType : null
                    }
                }).catch((error) => {
                    return catchError(error, () => createEvaluationFunc())
                }).finally(() => {
                    buttons.value[1].loading = false;
                });
            } else {
                usePerformanceCommandStore().createEvaluationTemplate(commandModel.value).then((response) => {
                    props.dialogClose();
                    emit('createItem', {
                        id: response.data,
                        title: commandModel.value.title,
                        goalWeight: commandModel.value.goalWeight,
                        competencyWeight: commandModel.value.competencyWeight,
                        hasGoal: commandModel.value.hasGoal,
                        defaultGoalTitle: commandModel.value.defaultGoalTitle,
                        goalType: commandModel.value.goalType,
                        isPassive: false,
                    } as EvaluationTemplateDto);
                }).catch((error) => {
                    return catchError(error, () => createEvaluationFunc())
                }).finally(() => {
                    buttons.value[1].loading = false;
                });
            }
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createEvaluationFunc,
        loading: false
    }
])

const isUpdated = ref(false);
onMounted(() => {
    if (props.selectedItem) {
        isUpdated.value = true
        commandModel.value.title = props.selectedItem.title
        commandModel.value.defaultGoalTitle = props.selectedItem.defaultGoalTitle
        commandModel.value.goalType = props.selectedItem.goalType
        commandModel.value.hasGoal = props.selectedItem.hasGoal
        weights.value.goalWeight = props.selectedItem.goalWeight * 100
        weights.value.competencyWeight = props.selectedItem.competencyWeight * 100
    }
})

</script>