<template>
    <DialogContent :title="selectedItem?.id ? 'general.updateTraining' : 'general.addTraining'" :buttons="buttons"
        :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createTrainingFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.name" label="list.title" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.instructorName" label="list.instructorName" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.instructorCompany" label="list.instructorCompany" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.location" label="list.location" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="8" md="3">
                        <DateInput v-model="combineDatesCommand.startDate" label="form.startDate" />
                    </v-col>
                    <v-col cols="12" sm="4" md="3" class="pt-sm-12">
                        <TextField v-model="combineDatesCommand.startTime" type="time" />
                    </v-col>
                    <v-col cols="12" sm="8" md="3">
                        <DateInput v-model="combineDatesCommand.endDate" label="form.endDate" />
                    </v-col>
                    <v-col cols="12" sm="4" md="3" class="pt-sm-12">
                        <TextField v-model="combineDatesCommand.endTime" type="time" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script lang="ts" setup>
import { onMounted, type PropType, ref } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import TextArea from "@/components/formInput/generalInputs/TextArea.vue";
import { catchError } from "@/core/helpers/generalResponse";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import { CreateOrUpdateTrainingCommand, GetTrainingDto } from "@/models/entities/humanResource/TrainingModels";
import { useTrainingStore } from "@/stores/humanResourcesStores/trainingStore";
import DialogContent from "@/components/dialogs/DialogContent.vue";
import { storeToRefs } from "pinia";
import { CombineDatesModel } from "@/models/entities/humanResource/LeaveCommands";
import { combineDateTime, formatterInputDate, getDateTime } from "@/core/helpers/dateUtils";

const commandModel = ref(new CreateOrUpdateTrainingCommand());
const combineDatesCommand = ref(new CombineDatesModel());
const createTrainingFormRef = ref(null as any);
const { trainingList } = storeToRefs(useTrainingStore());

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: {} as PropType<GetTrainingDto>,
        required: false
    }
});

const createTraining = () => {
    const promiseValidate = createTrainingFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)

            useTrainingStore().createTraining(commandModel.value).then((res: any) => {
                trainingList.value.items?.unshift({
                    ...commandModel.value,
                    id: res.data
                });
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => createTraining())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

const updateTraining = () => {
    const promiseValidate = createTrainingFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid && props.selectedItem) {
            buttons.value[1].loading = true;
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)
            useTrainingStore().updateTraining(props.selectedItem.id, commandModel.value).then((res: any) => {
                if (trainingList.value.items) {
                    const index = trainingList.value.items?.findIndex((a) => a.id == props.selectedItem?.id);
                    if (index != -1)
                        trainingList.value.items[index] = {
                            ...commandModel.value,
                            id: props.selectedItem?.id ?? ''
                        }
                }
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updateTraining())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

onMounted(() => {
    combineDatesCommand.value.startDate = formatterInputDate(new Date().toString());
    combineDatesCommand.value.endDate = formatterInputDate(new Date().toString());
    if (props.selectedItem) {
        combineDatesCommand.value.startDate = formatterInputDate(props.selectedItem.startDate);
        combineDatesCommand.value.startTime = getDateTime(props.selectedItem.startDate);
        combineDatesCommand.value.endDate = formatterInputDate(props.selectedItem.endDate);
        combineDatesCommand.value.endTime = getDateTime(props.selectedItem.endDate);
        commandModel.value = {
            name: props.selectedItem.name,
            startDate: "",
            endDate: "",
            instructorName: props.selectedItem.instructorName,
            instructorCompany: props.selectedItem.instructorCompany,
            location: props.selectedItem.location,
            description: props.selectedItem.description,
        } as CreateOrUpdateTrainingCommand
    }
})


const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: props.selectedItem?.id ? updateTraining : createTraining,
        loading: false
    }
])
</script>