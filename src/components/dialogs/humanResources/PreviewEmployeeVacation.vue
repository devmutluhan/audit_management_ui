<template>
    <DialogContent title="general.requestVacation" :dialogClose="dialogClose" :buttons="filterButtons"
        titleIcon="mdi-airplane">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
                    <v-row>
                        <v-col cols="auto pr-0 pr-md-4 hidden-xs">
                            <ImageCard :firstValue="leave.employee.firstName" :secondValue="leave.employee.lastName"
                                :avatar-text="leave.employee.avatarUrl" fontSize="20px" />
                        </v-col>
                        <v-col cols="12" sm="9">
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-card color="cardToolbar">
                                        <v-card-text class="text-h6">
                                            <strong>
                                                {{ leave.employee.fullName }}, {{ leaveShow.leaveTypeName }}
                                            </strong> için
                                            <strong>{{ leaveShow.usedDays }} gün</strong>
                                            izin talep
                                            ediyor.
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="auto" class="pt-0">
                                    <v-chip :color="getChipColor(leave.status)" class="font-weight-bold text-body-1">
                                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            leave.status)?.title}}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.status') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{enumToArray(ApprovementStatusEnum).find((a) => a.value == leave.status)?.title}}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.vacationType') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ leaveShow.leaveTypeName }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('list.totalVacation') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ leaveShow.usedDays }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.startDate') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ formatterDateFromHours(leaveShow.startDate) }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.endDate') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ formatterDateFromHours(leaveShow.endDate) }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            {{ $t('form.createdAt') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ formatterDateFromHours(leaveShow.createdAt) }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row v-if="leaveShow.approvers && !isApprovalList">
                        <v-col cols="12" class="text-center text-primary font-weight-bold pb-0">
                            {{ $t('form.approvalProcess') }}
                        </v-col>
                        <v-col cols="12">
                            <PreviewApprovalProcessesTimeline :items="leaveShow.approvers"
                                :histories="leaveShow.approvalHistories" :leave="leave" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type PropType } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import { useLeaveStore } from '@/stores/humanResourcesStores/leaveStore';
import { storeToRefs } from 'pinia';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import type { EmployeeLeaveListDto } from '@/models/entities/humanResource/LeaveDtos';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import PreviewApprovalProcessesTimeline from './PreviewApprovalProcessesTimeline.vue';
import { getChipColor } from '@/core/helpers/generalUtils';
import { catchError } from '@/core/helpers/generalResponse';
import { ConfirmModalType } from '@/models/types';

const { leaveShow } = storeToRefs(useLeaveStore())
const emit = defineEmits(['leave']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    leave: {
        type: Object as PropType<EmployeeLeaveListDto> as any,
        required: true
    },
    isApprovalList: {
        type: Boolean,
        required: false,
        default: false
    }
});

onMounted(() => {
    if (props.leave.status === null || props.leave.status === undefined) {
        props.leave.status = props.leave.approvementStatus;
    }
})

useLeaveStore().getLeaveShow(props.leave.id);

const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType());

const filterButtons = computed(() => {
    if (props.isApprovalList) {
        return buttons.value;
    } else {
        return buttons.value.filter((a) => a.type == 'close');
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'approve',
        click: () => approveFunc(),
        loading: false
    },
    {
        type: 'reject',
        click: () => rejectFunc(),
        loading: false
    }
]);

const approveFunc = () => {
    buttons.value[1].loading = true;
    useLeaveStore().approveLeave(props.leave.id).then(() => {
        props.dialogClose();
        emit('leave', props.leave.id);
    }).catch((error) => {
        return catchError(error, () => { approveFunc() })
    }).finally(() => {
        buttons.value[1].loading = false;
    });
}

const rejectFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.reject',
        isDescriptionField: true,
        text: "general.rejectDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            useLeaveStore().rejectLeave(props.leave.id, reason).then(() => {
                confirmDialog.value = false;
                props.dialogClose();
                emit('leave', props.leave.id);
            }).catch((error) => {
                return catchError(error, () => { rejectFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}
</script>