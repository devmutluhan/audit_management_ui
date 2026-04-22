<template>
    <v-card>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="auto pr-0 pr-md-4">
                    <v-avatar :rounded="true" :size="140">
                        <v-img :src="getAssetPath('media/auth/img-26.jpg')" cover></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4">
                    <p class="text-h6 font-weight-bold mb-1">
                        {{ projectDetail.title }}
                        <v-chip class="font-weight-bold text-body-2 ml-4"
                            :color="projectDetail.isExpenseIncluded ? 'success' : 'error'">
                            {{ $t('form.expense') }}: {{ projectDetail.isExpenseIncluded ? $t('list.include')
                                :
                                $t('list.exclude') }}
                        </v-chip>
                    </p>
                    <p class="text-body-1 text-blue-accent-3 font-weight-bold mb-1">
                        {{ projectDetail.agreementCode }}
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.subTotal') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(projectDetail.subTotal,
                                projectDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.totalAmount') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(projectDetail.finalTotal,
                                projectDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.expenseLimit') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(projectDetail.expenseLimit,
                                projectDetail.defaultCurrency.code) }}</span>
                    </p>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="pl-0 pl-sm-4" cols="auto"
                    v-if="projectDetail.requestApproval.status !== ApprovementStatusEnum.Approved">
                    <v-chip class="font-weight-bold" :color="getChipColor(projectDetail.requestApproval.status)">
                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                            projectDetail.requestApproval.status)?.title}}
                    </v-chip>
                    <p class="text-error ma-0">
                        {{ projectDetail.requestApproval.cancellationMessage }}
                    </p>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4"
                    v-if="projectDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                    <GeneralDropdown :menuItems="menuItems"></GeneralDropdown>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import { getAssetPath } from '@/core/helpers/assets';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import type { GeneralDropdownType } from '@/models/types';
import { ProjectDetailDto } from '@/models/entities/crm/CrmProjectDtos';

const emit = defineEmits(['endToProject'])
const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true,
        default: new ProjectDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.endToProject",
        action: () => emit('endToProject')
    },
]);

</script>