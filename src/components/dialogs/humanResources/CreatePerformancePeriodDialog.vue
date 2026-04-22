<template>
    <DialogContent title="general.addPerformancePeriod" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createPerformanceFormRef">
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
import { ref } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import { catchError } from "@/core/helpers/generalResponse";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import DialogContent from "@/components/dialogs/DialogContent.vue";
import { CreatePeriodCommand } from "@/models/entities/humanResource/PerformanceCommands";
import { usePerformanceCommandStore } from "@/stores/humanResourcesStores/performanceCommandStore";
import { useRouter } from "vue-router";
import type { ApiResult } from "@/models/ApiResult";

const commandModel = ref(new CreatePeriodCommand());
const createPerformanceFormRef = ref(null as any);
const router = useRouter()
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createPerformance = () => {
    const promiseValidate = createPerformanceFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            usePerformanceCommandStore().createPeriod(commandModel.value).then((res: ApiResult<string>) => {
                router.push({ name: 'performance-detail', params: { id: res.data } })
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => createPerformance())
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
        click: createPerformance,
        loading: false
    }
])
</script>