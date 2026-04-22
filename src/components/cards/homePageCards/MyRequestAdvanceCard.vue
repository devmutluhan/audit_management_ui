<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start">
            <v-col cols="auto" class="pr-0">
                <v-icon size="26">mdi-account-cash-outline</v-icon>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.myAdvanceRequest') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.myAdvanceRequests.length > 0">
                <v-col cols="12" v-for="(item, index) in items.myAdvanceRequests" :key="index">
                    <v-card>
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto">
                                    <v-row>
                                        <v-col cols="12" class="text-truncate text-body-2 font-weight-bold pb-1"
                                            :class="item.isPaid ? 'text-warning' : 'text-cancelButtonColor'">
                                            {{ item.isPaid ? $t('list.isPaid') : $t('list.notPaid') }}
                                        </v-col>
                                        <v-col cols="12" class="text-priceTextColor font-weight-bold pt-1">
                                            {{ formatterPrice(item.amount, item.currency ?? 'TRY') }}
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" class="font-weight-bold cursor-pointer"
                                    :class="'text-' + getChipColor(item.approvementStatus)" @click="preview(item)">
                                    {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                        item.approvementStatus)?.title}}
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="fill-height" v-else>
                <v-col class="py-8 pl-6">
                    {{ $t('list.notFoundAdvanceRequest') }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-advance' }">
                    {{ $t('menu.myAdvances') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
        <VDialogContent v-model="previewExpenseDialog">
            <PreviewSpendingDialog :dialogClose="() => { previewExpenseDialog = false }"
                :selectedItem="selectedExpense" />
        </VDialogContent>
    </v-card>
</template>

<script lang="ts" setup>
import PreviewSpendingDialog from '@/components/dialogs/humanResources/PreviewExpenseDialog.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { formatterPrice, getChipColor } from '@/core/helpers/generalUtils';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { AdvanceApprovalRequestDto, type DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import { ref, type PropType } from 'vue';

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

const previewExpenseDialog = ref(false);
const selectedExpense = ref(new AdvanceApprovalRequestDto());
const preview = (item: AdvanceApprovalRequestDto) => {
    selectedExpense.value = item;
    previewExpenseDialog.value = true;
}

</script>