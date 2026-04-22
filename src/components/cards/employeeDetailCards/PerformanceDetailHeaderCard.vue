<template>
    <v-card rounded="xl">
        <v-card-text class="d-flex align-center">
            <v-col cols="8" class="pr-0 pr-md-4">
                <p class="text-h6 font-weight-bold mb-1">
                    {{ performanceDetail.title }}
                </p>
                <p class="text-body-1 text-headerTextColor font-weight-bold mb-1">
                    {{
                        enumToArray(PeriodStatusType).find((a) => a.value == performanceDetail.status)?.title
                    }}
                </p>
                <p class="text-body-1 mb-1">
                    <span class="text-headerTextColor"> {{ $t('form.startEndDate') }} : </span> {{
                        formatterDate(performanceDetail.startDate)
                    }} - {{
                        formatterDate(performanceDetail.endDate)
                    }}
                </p>
                <p class="text-body-1 mb-1">
                    <span class="text-headerTextColor"> {{ $t('form.goalSettingDueDate') }} : </span>
                    {{ formatterDate(performanceDetail.goalSettingDueDate) }}
                </p>
                <p class="text-body-1 mb-1">
                    <span class="text-headerTextColor"> {{ $t('form.evaluationStartDate') }} : </span>{{
                        formatterDate(performanceDetail.evaluationStartDate)
                    }}
                </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="pr-0 pr-md-4" v-if="isUpdated">
                <GeneralDropdown :menuItems="filterMenuItems()"></GeneralDropdown>
            </v-col>
        </v-card-text>
        <VDialogContent v-model="updateDialog">
            <UpdatePerformancePeriodDialog :dialogClose="() => { updateDialog = false }"
                :performance="performanceDetail" @createItem="updatePeriod($event)" />
        </VDialogContent>
    </v-card>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { enumToArray } from '@/core/helpers/enumToArray';
import { PeriodStatusType } from '@/models/custom/EnumTypes';
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import UpdatePerformancePeriodDialog from "@/components/dialogs/humanResources/UpdatePerformancePeriodDialog.vue";
import type { GeneralDropdownType } from '@/models/types';
import { PeriodDetailDto } from '@/models/entities/humanResource/PerformanceDtos';
import { formatterDate } from '@/core/helpers/dateUtils';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { useRoute, useRouter } from 'vue-router';
import type { UpdatePeriodCommand } from '@/models/entities/humanResource/PerformanceCommands';

const updateDialog = ref(false);

const updatePeriod = (event: UpdatePeriodCommand) => {
    props.performanceDetail.startDate = event.startDate;
    props.performanceDetail.title = event.title;
    props.performanceDetail.endDate = event.endDate;
}

const props = defineProps({
    performanceDetail: {
        type: Object as PropType<PeriodDetailDto>,
        required: true,
        default: new PeriodDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

const filterMenuItems = () => {
    if (props.isUpdated) {
        return menuItems.value
    } else {
        return new Array<GeneralDropdownType>()
    }
}
const router = useRouter()
const route = useRoute()

const deleteFunc = () => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    usePerformanceCommandStore().deletePeriod(route.params.id.toString()).then(() => {
        router.replace({ name: 'performance-list' })
    }).catch((error) => {
        return catchError(error, () => { deleteFunc() })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        }
    },
    {
        title: "general.update",
        action: () => {
            updateDialog.value = true;
        }
    },
]);

</script>