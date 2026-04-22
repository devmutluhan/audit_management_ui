<template>
    <DialogContent title="general.updateTimesheetWeek" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="updateTimesheetForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" class="text-h6 font-weight-bold">
                        {{ $t('form.day') + ' : ' + formatterDate(combineDatesCommand.startDate) }}
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput :items="dateTimes" v-model="combineDatesCommand.startTime" type="time"
                            label="form.startTime" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput :items="dateTimes" v-model="combineDatesCommand.endTime" type="time"
                            label="form.endTime" />
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

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { TimeSheetDto, UpdateTimeSheetCommand } from '@/models/entities/crm/CrmTimeSheetModels';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useTimesheetStore } from '@/stores/crmStores/timeSheetStore';
import { catchError } from '@/core/helpers/generalResponse';
import { combineDateTime, formatterDate, getDateTime } from '@/core/helpers/dateUtils';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { CombineDatesModel } from '@/models/entities/humanResource/LeaveCommands';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';

const emit = defineEmits(['createItem', 'deleteItem']);

const commandModel = ref(new UpdateTimeSheetCommand())
const combineDatesCommand = ref(new CombineDatesModel());

const dateTimes = ref(
    Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2).toString().padStart(2, '0');
        const minute = (i % 2 === 0 ? '00' : '30');
        return `${hour}:${minute}`;
    })
);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<TimeSheetDto>,
        required: true
    },
    calendarOptions: {
        type: Object as PropType<any>,
        required: true
    },
    weekId: {
        type: String,
        required: true
    }
});

onMounted(() => {
    if (props.selectedItem) {
        combineDatesCommand.value.startDate = props.selectedItem.startDate;
        combineDatesCommand.value.startTime = getDateTime(props.selectedItem.startDate).slice(0, 5);
        combineDatesCommand.value.endTime = getDateTime(props.selectedItem.endDate).slice(0, 5);
        commandModel.value.description = props.selectedItem.description
        commandModel.value.timeSheetId = props.selectedItem.id
    }
})

const updateTimesheetForm = ref(null as any);
const updateTimesheet = () => {
    updateTimesheetForm.value.validate().then((res: any) => {
        if (res.valid) {
            combineDatesCommand.value.startDate = combineDatesCommand.value.startDate.slice(0, 10)
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.endTime)
            if (hasOverlap({ timeSheetId: commandModel.value.timeSheetId, start: commandModel.value.startDate, end: commandModel.value.endDate })) {
                buttons.value[2].loading = true;
                useTimesheetStore().updateTimesheetWeek(commandModel.value).then((res) => {
                    emit('createItem');
                    props.dialogClose();
                }).catch((error) => {
                    return catchError(error, () => { updateTimesheet() })
                }).finally(() => {
                    buttons.value[2].loading = false
                })
            } else {
                ErrorStatusResult[400]({ message: "list.hasOverlapTimesheet" })
            }
        }
    });
}

// Çakışma kontrolü
const hasOverlap = (selectInfo: any) => {
    const selectionStart = new Date(selectInfo.start).getTime();
    const selectionEnd = new Date(selectInfo.end).getTime();

    // Eğer çakışan ve engel olan bir event varsa false dön
    const hasBlockingOverlap = props.calendarOptions.events.some(event => {
        const eventStart = new Date(event.start).getTime();
        const eventEnd = new Date(event.end).getTime();

        const isOverlapping = selectionStart < eventEnd && selectionEnd > eventStart;

        return isOverlapping &&
            event.notDataEntered === true &&
            event.itemValue?.id !== selectInfo.timeSheetId;
    });

    return !hasBlockingOverlap;
}

const deleteTimesheet = () => {
    updateTimesheetForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useTimesheetStore().deleteTimesheetWeek(props.weekId, props.selectedItem.id).then((res) => {
                emit('deleteItem');
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => { deleteTimesheet() })
            }).finally(() => {
                buttons.value[1].loading = false
            })
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
        type: 'delete',
        click: deleteTimesheet,
        loading: false
    },
    {
        type: 'save',
        click: updateTimesheet,
        loading: false
    }
])
</script>