<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start" color="transparent">
            <v-col cols="auto" class="pr-0">
                <v-card color="warning" border="false">
                    <v-card-text class="d-flex pa-2 align-center justify-center">
                        <v-icon color="white" size="20">mdi-wallet-outline</v-icon>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.requestPayment') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-btn variant="text" icon="mdi-refresh" @click="!isClicked ? emit('isRefresh') : null"
                    :disabled="isClicked"></v-btn>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.expenseApprovals.length > 0">
                <v-col cols="12">
                    <v-list style="background-color: transparent;">
                        <v-list-item class="px-1" v-for="(item, index) in items.expenseApprovals" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="auto">
                                    <ImageCard :first-value="item.employee?.firstName"
                                        :avatar-text="item.employee?.avatarUrl"
                                        :second-value="item.employee?.lastName" />
                                </v-col>
                                <v-col cols="5" md="4" class="text-body-1 font-weight-bold pa-0">
                                    {{ item.employee?.firstName + ' ' + item.employee?.lastName }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="3" md="4" class="font-weight-bold pl-0">
                                    <v-row class="d-flex align-center justify-end">
                                        <v-col align="right" class="py-0">
                                            <p class="ma-0"
                                                :class="item.isPaid ? 'text-warning' : 'text-cancelButtonColor'">
                                                {{ item.isPaid ? $t('list.isPaid') : $t('list.notPaid') }}
                                            </p>
                                            <p class="ma-0 text-priceTextColor">
                                                {{ formatterPrice(item.totalAmount, item.currency ?? 'TRY') }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
            <v-row class="fill-height" v-else>
                <v-col class="py-8 pl-6">
                    {{ $t('list.notFoundPaymentRequest') }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'expense-request' }">
                    {{ $t('list.viewAll') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
    </v-card>
</template>

<script lang="ts" setup>
import type { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import ImageCard from '../ImageCard.vue';
import { formatterPrice } from '@/core/helpers/generalUtils';
import type { PropType } from 'vue';

const emit = defineEmits(['isRefresh'])


const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    },
    isClicked: {
        type: Boolean,
        required: false
    }
});


</script>