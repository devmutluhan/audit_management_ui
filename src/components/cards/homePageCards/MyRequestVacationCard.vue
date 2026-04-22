<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start">
            <v-col cols="auto" class="pr-0">
                <v-icon size="26">mdi-shield-airplane-outline</v-icon>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.myVacationRequest') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.myLeaveRequests.length > 0">
                <v-col cols="12" v-for="(item, index) in items.myLeaveRequests" :key="index">
                    <v-card>
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto" class="text-truncate text-h6 font-weight-bold">
                                    {{ item.leaveType ? item.leaveType.name : '-' }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" class="font-weight-bold cursor-pointer"
                                    :class="'text-' + getChipColor(item.approvementStatus)" @click="preview(item)">
                                    {{
                                        enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            item.approvementStatus)?.title
                                    }}
                                </v-col>
                            </v-row>
                            <v-row class="my-3">
                                <v-col cols="auto" class="text-warning font-weight-bold py-0">
                                    {{
                                        item.leftDay + ' ' + $t('enums.Day') + ' ' +
                                        $t('form.lastRemaining')
                                    }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="7" class="text-body-2 pt-2">
                                    <p class="mb-2">{{ $t('form.startDate') }}</p>
                                    <p class="mb-2">{{ $t('form.endDate') }}</p>
                                    <p class="mb-2">{{ $t('form.vacationDayCount') }}</p>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="5" align="end" class="text-primary font-weight-bold pt-2">
                                    <p class="mb-2">{{ formatterDate(item.startDate) }}</p>
                                    <p class="mb-2">{{ formatterDate(item.endDate) }}</p>
                                    <p class="mb-2">{{ item.usedDays + ' ' + $t('enums.Day') }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class="py-8 pl-6">
                    {{ $t('list.notFoundVacationRequest') }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-vacation' }">
                    {{ $t('menu.myVacations') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
        <VDialogContent v-model="previewVacationDialog">
            <PreviewEmployeeVacation :dialogClose="() => { previewVacationDialog = false }" :leave="selectedVacation" />
        </VDialogContent>
    </v-card>
</template>

<script lang="ts" setup>
import PreviewEmployeeVacation from '@/components/dialogs/humanResources/PreviewEmployeeVacation.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { formatterDate } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import { getChipColor } from '@/core/helpers/generalUtils';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { DashboardItemsDto, LeaveApprovalRequestDto } from '@/models/entities/management/ManagementDtos';
import { type PropType, ref } from 'vue';

const emit = defineEmits(['isRefresh']);

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

const previewVacationDialog = ref(false);
const selectedVacation = ref(new LeaveApprovalRequestDto());
const preview = (item: LeaveApprovalRequestDto) => {
    selectedVacation.value = item;
    previewVacationDialog.value = true;
}

</script>