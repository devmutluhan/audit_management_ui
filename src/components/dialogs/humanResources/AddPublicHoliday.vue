<template>
    <DialogContent :title="selectedItem?.id ? 'general.updatePublicHoliday' : 'general.addPublicHoliday'"
        :dialogClose="dialogClose" titleIcon="mdi-plus" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addPublicHolidayForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField v-model="createPublicHolidayCommand.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput v-model="createPublicHolidayCommand.holidayType"
                            :items="enumToArray(HolidayTypeEnum)" item-title="title" item-value="value"
                            label="form.description" />
                    </v-col>
                    <v-col cols="12">
                        <TextField v-model="createPublicHolidayCommand.description" label="form.description" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="combineDatesCommand.startDate" label="form.startDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="combineDatesCommand.startTime" type="time" label="form.startTime"
                            isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="combineDatesCommand.endDate" label="form.endDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="combineDatesCommand.endTime" type="time" label="form.endTime" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SwitchInput v-model="createPublicHolidayCommand.isDeduct" label="form.isDeduct" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SwitchInput v-model="createPublicHolidayCommand.isRecurring" label="form.isRecurring" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { onMounted, type PropType, ref } from 'vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { HolidayTypeEnum } from "@/models/custom/EnumTypes"
import { CreatePublicHolidayCommand, PublicHolidayDto } from '@/models/entities/humanResource/PublicHolidayModels';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { useHolidayCalenderStore } from '@/stores/humanResourcesStores/holidayCalenderStore';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import type { ApiResult } from '@/models/ApiResult';
import { combineDateTime, formatterInputDate, getDateTime } from '@/core/helpers/dateUtils';
import { CombineDatesModel } from '@/models/entities/humanResource/LeaveCommands';

const createPublicHolidayCommand = ref(new CreatePublicHolidayCommand());
const { holidayList } = storeToRefs(useHolidayCalenderStore())

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<PublicHolidayDto>,
        required: false
    }
});

const addPublicHolidayForm = ref(null as any);

const addPublicHoliday = () => {
    addPublicHolidayForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true
            createPublicHolidayCommand.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            createPublicHolidayCommand.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)
            useHolidayCalenderStore().createPublicHoliday(holidayList.value.id, createPublicHolidayCommand.value).then((res: ApiResult<string>) => {
                holidayList.value.publicHolidays.unshift({
                    id: res.data,
                    startDate: createPublicHolidayCommand.value.startDate,
                    endDate: createPublicHolidayCommand.value.endDate,
                    description: createPublicHolidayCommand.value.description,
                    isDeduct: createPublicHolidayCommand.value.isDeduct,
                    isRecurring: createPublicHolidayCommand.value.isRecurring,
                    name: createPublicHolidayCommand.value.name,
                    holidayType: createPublicHolidayCommand.value.holidayType
                })
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addPublicHoliday())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}
const combineDatesCommand = ref(new CombineDatesModel());

const updatePublicHoliday = () => {
    addPublicHolidayForm.value.validate().then((res: any) => {
        if (res.valid && props.selectedItem) {
            buttons.value[1].loading = true
            createPublicHolidayCommand.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            createPublicHolidayCommand.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)
            const updateCommand = {
                id: props.selectedItem.id,
                ...createPublicHolidayCommand.value
            }
            useHolidayCalenderStore().updatePublicHoliday(holidayList.value.id, props.selectedItem.id, updateCommand).then((res: ApiResult<string>) => {
                const index = holidayList.value.publicHolidays.findIndex((a) => a.id == props.selectedItem?.id);
                if (index != -1) {
                    holidayList.value.publicHolidays[index] = {
                        ...updateCommand
                    }
                }
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updatePublicHoliday())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    if (props.selectedItem) {
        createPublicHolidayCommand.value = {
            description: props.selectedItem.description,
            startDate: '',
            endDate: '',
            isDeduct: props.selectedItem.isDeduct,
            isRecurring: props.selectedItem.isRecurring,
            name: props.selectedItem.name,
            holidayType: props.selectedItem.holidayType
        }
        combineDatesCommand.value.startDate = formatterInputDate(props.selectedItem.startDate);
        combineDatesCommand.value.endDate = formatterInputDate(props.selectedItem.endDate);
        combineDatesCommand.value.startTime = getDateTime(props.selectedItem.startDate);
        combineDatesCommand.value.endTime = getDateTime(props.selectedItem.endDate);
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => {
            props.dialogClose();
        }
    },
    {
        type: 'save',
        click: props.selectedItem ? updatePublicHoliday : addPublicHoliday,
        loading: false
    }
]);

</script>