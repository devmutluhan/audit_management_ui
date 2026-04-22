<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start" color="transparent">
            <v-col cols="auto" class="pr-0">
                <v-card color="addButtonColor" border="false">
                    <v-card-text class="d-flex pa-2 align-center justify-center">
                        <v-icon color="white" size="20">mdi-calendar-month-outline</v-icon>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.activityCalender') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="requestPayment.length > 0">
                <v-col cols="12">
                    <v-list style="background-color: transparent;">
                        <v-list-item class="px-1" v-for="(item, index) in requestPayment" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="6" class="text-body-1 text-primary font-weight-bold">
                                    {{ item.name }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="6" class="text-primary font-weight-bold pl-0">
                                    <v-row class="d-flex align-center justify-end">
                                        <v-col align="right" class="py-0">
                                            <p class="ma-0 text-grey">{{ item.lastDayCount + ' ' + $t('enums.Day') }}
                                            </p>
                                        </v-col>
                                        <v-col align="right">
                                            <p class="ma-0"> {{ item.date }}</p>
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
                    {{ $t('list.notFoundActivity') }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-vacation' }">
                    {{ $t('list.viewAll') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import type { PropType } from 'vue';

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

const requestPayment = ref([
    {
        name: "Okul Gezisi",
        lastDayCount: "10",
        date: "23 Mayıs",
    },
    {
        name: "Okul Gezisi",
        lastDayCount: "14",
        date: "23 Mayıs",
    },
] as any)

</script>