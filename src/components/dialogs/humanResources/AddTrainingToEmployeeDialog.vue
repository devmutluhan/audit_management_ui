<template>
    <DialogContent :title="selectedItem ? 'form.updateAssignment' : 'form.assignTraining'" :buttons="buttons"
        :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="assignTrainingToEmployeeForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.training" v-model="commandModel.trainingId" isRequired
                            :items="trainingList.items ?? []" item-title="name" item-value="id"></SingleSelectInput>
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.status" v-model="commandModel.status" isRequired
                            :items="enumToArray(TrainingStatusEnum)" item-title="title" item-value="value">
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="12">
                        <DateInput v-model="commandModel.completedDate" isRequired label="form.completedDate">
                        </DateInput>
                    </v-col>
                    <v-col cols="12">
                        <v-label class="mb-2 font-weight-bold">
                            {{ $t('form.rating') }}
                            <span style="color:red;" class="ml-1">
                                * </span>
                        </v-label>
                    </v-col>
                    <v-col cols="12" align="center">
                        <v-rating v-model="commandModel.rating" hover length="10">
                        </v-rating>
                        <p v-if="isErrorRating" class="text-error text-left">{{ $t('form.isRequired') }}</p>
                    </v-col>
                    <v-col cols="12">
                        <TextArea label="form.description" v-model="commandModel.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import { useTrainingStore } from '@/stores/humanResourcesStores/trainingStore';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import type { TrainingAssignmentsDto } from '@/models/entities/humanResource/TrainingModels';
import { enumToArray } from '@/core/helpers/enumToArray';
import { TrainingStatusEnum } from '@/models/custom/EnumTypes';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';

const { trainingList, trainingAssignmentsList } = storeToRefs(useTrainingStore());
useTrainingStore().getTrainingList({ pageSize: 1000, pageNumber: 1 })

const route = useRoute();
const commandModel = ref(null as any)
const isErrorRating = ref(false);
const emit = defineEmits(['createItem', 'updateItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<TrainingAssignmentsDto>,
        required: false
    },
    trainingId: {

    }
});

const assignTrainingToEmployeeForm = ref(null as any);
const assingTrainingToEmployee = () => {
    assignTrainingToEmployeeForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (commandModel.value.rating == 0) {
                isErrorRating.value = true;
                return;
            }
            isErrorRating.value = false;
            buttons.value[1].loading = true;
            commandModel.value.employeeId = route.params.id.toString();
            // useTrainingStore().createTrainingAssignments(commandModel.value).then((response: any) => {
            //     const findTraining = trainingList.value.items?.find((a) => a.id == commandModel.value.trainingId);
            //     emit('createItem', {
            //         trainingName: findTraining?.name ?? '',
            //         id: response.data,
            //         ...commandModel.value,
            //     })
            //     props.dialogClose();
            // }).catch((error) => {
            //     return catchError(error, () => assingTrainingToEmployee())
            // }).finally(() => {
            //     buttons.value[1].loading = false;
            // });
        }
    });
}

const updateAssignment = () => {
    assignTrainingToEmployeeForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (props.selectedItem) {
                if (commandModel.value.rating == 0) {
                    isErrorRating.value = true;
                    return;
                }
                isErrorRating.value = false;
                buttons.value[1].loading = true;
                commandModel.value.employeeId = route.params.id.toString();

                useTrainingStore().updateTrainingAssignments(props.selectedItem.id, commandModel.value).then((response: any) => {
                    const findTraining = trainingList.value.items?.find((a) => a.id == commandModel.value.trainingId);
                    if (trainingAssignmentsList.value.items) {
                        const index = trainingAssignmentsList.value.items.findIndex((a) => a.id == props.selectedItem?.id);
                        if (index != -1) {
                            trainingAssignmentsList.value.items[index] = {
                                id: props.selectedItem?.id ?? '',
                                trainingName: findTraining?.name ?? '',
                                ...commandModel.value,
                            }
                        }
                    }
                    props.dialogClose();
                }).catch((error) => {
                    return catchError(error, () => updateAssignment())
                }).finally(() => {
                    buttons.value[1].loading = false;
                });
            }
        }
    });
}

onMounted(() => {
    if (props.selectedItem) {
        commandModel.value.completedDate = props.selectedItem.completedDate
        commandModel.value.description = props.selectedItem.description
        // commandModel.value.employeeId = props.selectedItem.employeeId
        commandModel.value.rating = props.selectedItem.rating
        commandModel.value.status = props.selectedItem.status
        commandModel.value.trainingId = props.selectedItem.trainingId
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: props.selectedItem ? updateAssignment : assingTrainingToEmployee,
        loading: false
    }
])
</script>