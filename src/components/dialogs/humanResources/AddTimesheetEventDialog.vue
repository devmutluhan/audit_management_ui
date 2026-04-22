<template>
    <DialogContent title="general.addTimesheet" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addTimesheetForm">
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
                    <v-col cols="12" :md="hasClaimOrModules(['CRM']) ? '6' : '12'">
                        <SingleAutocompleteInput v-model="commandModel.type" :items="timeSheetTypes"
                            label="form.timesheetType" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6" v-if="hasClaimOrModules(['CRM'])">
                        <SingleAutocompleteInput v-model="selectedProject" :items="employeeRelatedProjects"
                            item-title="title" label="form.project" isReturnObject
                            :isRequired="commandModel.type == TimesheetTypeEnum.Project"
                            :disabled="commandModel.type !== TimesheetTypeEnum.Project">
                            <template v-slot:menuItem="{ item }">
                                <v-list-item link class="py-0 px-4" @click="selectedProject = item">
                                    <v-row>
                                        <v-col>
                                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ $t('enums.Customer') }} : {{ item.customer.name }}
                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                            </template>
                            <template v-slot:chipItem="{ item }">
                                <v-chip size="40" class="pa-6" color="buttonChipColor">
                                    <template v-slot:default>
                                        <p class="text-body-1 ma-0">
                                            <span class="font-weight-bold">{{ item.title }} </span>
                                            <br>
                                            <span>
                                                {{ $t('enums.Customer') }} : {{ item.customer.name }}
                                            </span>
                                        </p>
                                    </template>
                                </v-chip>
                            </template>
                        </SingleAutocompleteInput>
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
import { computed, onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { CreateTimeSheetCommand } from '@/models/entities/crm/CrmTimeSheetModels';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { TimesheetTypeEnum } from '@/models/custom/EnumTypes';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useTimesheetStore } from '@/stores/crmStores/timeSheetStore';
import { catchError } from '@/core/helpers/generalResponse';
import { combineDateTime, formatterDate, formatterInputDateTime, getDateTime } from '@/core/helpers/dateUtils';
import { storeToRefs } from 'pinia';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { CombineDatesModel } from '@/models/entities/humanResource/LeaveCommands';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { hasClaimOrModules } from '@/core/helpers/localStorageManagement';

const emit = defineEmits(['createItem']);
const { employeeRelatedProjects } = storeToRefs(useEmployeeDtoStore());

const commandModel = ref(new CreateTimeSheetCommand());
const combineDatesCommand = ref(new CombineDatesModel());

const selectedProject = ref(null as any);

const timeSheetTypes = computed(() => {
    if (hasClaimOrModules(['CRM'])) {
        return enumToArray(TimesheetTypeEnum)
    } else {
        return enumToArray(TimesheetTypeEnum).filter((a) => a.value != TimesheetTypeEnum.Project);
    }
})

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedHours: {
        type: null as any,
        required: false
    },
    calendarOptions: {
        type: Object as PropType<any>,
        required: true
    },
});

const dateTimes = ref(
    Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2).toString().padStart(2, '0');
        const minute = (i % 2 === 0 ? '00' : '30');
        return `${hour}:${minute}`;
    })
);

onMounted(() => {
    if (props.selectedHours.start && props.selectedHours.end) {
        combineDatesCommand.value.startDate = formatterInputDateTime(props.selectedHours.start);
        combineDatesCommand.value.startTime = getDateTime(props.selectedHours.start).slice(0, 5);
        combineDatesCommand.value.endTime = getDateTime(props.selectedHours.end).slice(0, 5);
        combineDatesCommand.value.endDate = formatterInputDateTime(props.selectedHours.end);
        if (hasClaimOrModules(['CRM']))
            useEmployeeDtoStore().getEmployeeRelatedProjects({ pageSize: 100000, pageNumber: 1, requestDate: combineDatesCommand.value.endDate });
    }
})

const addTimesheetForm = ref(null as any);
const createTimesheet = () => {
    addTimesheetForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (commandModel.value.type !== TimesheetTypeEnum.Project) {
                commandModel.value.projectId = null
            } else {
                commandModel.value.projectId = selectedProject.value.id;
            }
            combineDatesCommand.value.startDate = combineDatesCommand.value.startDate.slice(0, 10);
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.endTime)

            if (hasOverlap({ start: commandModel.value.startDate, end: commandModel.value.endDate })) {
                buttons.value[1].loading = true;
                useTimesheetStore().createTimesheetWeek(commandModel.value).then((res) => {
                    emit('createItem', {
                        clickable: true,
                        start: commandModel.value.startDate,
                        end: commandModel.value.endDate,
                        title: enumToArray(TimesheetTypeEnum).find((a) => a.value == commandModel.value.type)?.title ?? '',
                        className: `event-type-${TimesheetTypeEnum[commandModel.value.type]} font-weight-bold text-body-1`,
                        itemValue: {
                            id: res.data,
                            startDate: commandModel.value.startDate,
                            endDate: commandModel.value.endDate,
                            description: commandModel.value.description,
                            workHours: 0,
                            overtimeHours: 0,
                            sheetType: commandModel.value.type,
                            project: selectedProject.value
                        },
                        notDataEntered: true
                    });
                    props.dialogClose();
                }).catch((error) => {
                    return catchError(error, () => { createTimesheet() })
                }).finally(() => {
                    buttons.value[1].loading = false
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
            event.notDataEntered === true
    });

    return !hasBlockingOverlap;
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createTimesheet,
        loading: false
    }
])
</script>