<template>
    <DialogContent title="general.updatePerformancePeriod" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updatePerformanceFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.title" label="list.title" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="commandModel.startDate" label="form.startDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="commandModel.endDate" label="form.endDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="commandModel.goalSettingDueDate" label="form.goalSettingDueDate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="commandModel.evaluationStartDate" label="form.evaluationStartDate" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script lang="ts" setup>
import { onMounted, type PropType, ref } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import { catchError } from "@/core/helpers/generalResponse";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import DialogContent from "@/components/dialogs/DialogContent.vue";
import { UpdatePeriodCommand } from "@/models/entities/humanResource/PerformanceCommands";
import { usePerformanceCommandStore } from "@/stores/humanResourcesStores/performanceCommandStore";
import type { ApiResult } from "@/models/ApiResult";
import type { PeriodDto } from "@/models/entities/humanResource/PerformanceDtos";
import { formatterInputDate } from "@/core/helpers/dateUtils";

const commandModel = ref(new UpdatePeriodCommand());
const updatePerformanceFormRef = ref(null as any);

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    performance: {
        type: Object as PropType<PeriodDto>,
        required: true,
    }
});

onMounted(() => {
    commandModel.value.startDate = formatterInputDate(props.performance.startDate)
    commandModel.value.endDate = formatterInputDate(props.performance.endDate)
    commandModel.value.title = props.performance.title
    commandModel.value.evaluationStartDate = formatterInputDate(props.performance.evaluationStartDate)
    commandModel.value.goalSettingDueDate = formatterInputDate(props.performance.goalSettingDueDate)
})

const updatePerformance = () => {
    const promiseValidate = updatePerformanceFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            usePerformanceCommandStore().updatePeriod(props.performance.id, commandModel.value).then((res: ApiResult<string>) => {
                props.performance.startDate = commandModel.value.startDate;
                props.performance.endDate = commandModel.value.endDate;
                props.performance.title = commandModel.value.title;
                props.performance.evaluationStartDate = commandModel.value.evaluationStartDate;
                props.performance.goalSettingDueDate = commandModel.value.goalSettingDueDate;
                emit('createItem', commandModel.value)
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updatePerformance())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: updatePerformance,
        loading: false
    }
])
</script>