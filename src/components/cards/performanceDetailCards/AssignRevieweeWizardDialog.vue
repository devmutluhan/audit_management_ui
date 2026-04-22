<template>
    <DialogContent :title="dialogHeader.title" :buttons="filterButtons()" :dialogClose="dialogClose"
        :titleIcon="dialogHeader.icon">
        <template v-slot:dialogBody>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-form ref="selectRevieweeFormRef">
                        <SelectRevieweeListCard v-model:selectedEmployeeIds="selectedEmployeeIds"
                            :initialEmployeeList="initialEmployeeList" :periodReviewList="periodReviewList">
                        </SelectRevieweeListCard>
                    </v-form>
                </v-window-item>
                <v-window-item :value="2">
                    <v-form ref="assignEvaluationTemplateForm">
                        <AssignEvaluationTemplateCard v-model:selectedTemplate="selectedTemplate"
                            :selectedEmployeeIds="selectedEmployeeIds" />
                    </v-form>
                </v-window-item>
            </v-window>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { PaginatedList } from '@/models/ApiResult';
import type { EmployeeListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { EvaluationTemplateDto, ReviewSummaryDto } from '@/models/entities/humanResource/PerformanceDtos';
import { computed, type PropType, ref } from 'vue';
import SelectRevieweeListCard from './SelectRevieweeListCard.vue';
import AssignEvaluationTemplateCard from './AssignEvaluationTemplateCard.vue';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { AssignRevieweesCommand, RevieweeDto } from '@/models/entities/humanResource/PerformanceCommands';
import { useRoute } from 'vue-router';

const selectedEmployeeIds = ref(new Array<String>());
const selectRevieweeFormRef = ref(null as any);
const assignEvaluationTemplateForm = ref(null as any);
const selectedTemplate = ref(new EvaluationTemplateDto());

const emits = defineEmits(['assignReviewees'])

const props = defineProps({
    initialEmployeeList: {
        type: Object as PropType<PaginatedList<EmployeeListDto>>,
        required: true
    },
    periodReviewList: {
        type: Array<ReviewSummaryDto>,
        required: true
    },
    dialogClose: {
        type: null as any,
        required: true
    }
});

const step = ref(1);
const selectEmployee = () => {
    selectRevieweeFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            step.value = 2;
        }
    })
}

const route = useRoute();
const assignEvaluation = () => {
    assignEvaluationTemplateForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[3].loading = true;
            if (props.initialEmployeeList.items) {
                let revieweeList = props.initialEmployeeList.items.filter((a) => selectedEmployeeIds.value.includes(a.id));
                let reviewees = revieweeList.map((a) => {
                    return {
                        revieweeId: a.id,
                        managerId: a.managerId
                    } as RevieweeDto
                })
                const command = new AssignRevieweesCommand();
                command.templateId = selectedTemplate.value.id;
                command.reviewees = reviewees;
                usePerformanceCommandStore().assignReviewees(route.params.id.toString(), command).then((res) => {
                    let emitReviewees = revieweeList.map((a) => {
                        return {
                            manager: {
                                id: a.managerId,
                                name: a.managerName
                            },
                            reviewee: {
                                id: a.id,
                                name: a.firstName + ' ' + a.lastName
                            }
                        }
                    })
                    emits('assignReviewees', { reviewees: emitReviewees, template: selectedTemplate.value })
                    props.dialogClose();
                }).catch((error) => {
                    return catchError(error, () => { assignEvaluation() })
                }).finally(() => {
                    buttons.value[3].loading = false;
                })
            }
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'next',
        click: () => selectEmployee(),
        loading: false
    },
    {
        type: 'back',
        click: () => { step.value = 1 }
    },
    {
        type: 'save',
        click: () => assignEvaluation(),
        loading: false
    }
])

const filterButtons = ref(() => {
    if (step.value == 1) {
        return buttons.value.slice(0, 2)
    } else {
        return buttons.value.slice(2, 4)
    }
})

const dialogHeader = computed(() => {
    return step.value == 1 ? { title: 'menu.applicantEmployeeList', icon: 'mdi-view-list' } : { title: 'general.assignEvaluationTemplate', icon: 'mdi-plus' }
})

</script>