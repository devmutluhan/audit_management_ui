<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start" color="transparent">
            <v-col cols="auto" class="pr-0">
                <v-card color="addButtonColor" border="false">
                    <v-card-text class="d-flex pa-2 align-center justify-center">
                        <v-icon color="white" size="20">mdi-umbrella-beach</v-icon>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.holidayList') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.publicHolidays.length > 0">
                <v-col cols="12">
                    <v-list style="background-color: transparent;">
                        <v-list-item class="px-1" v-for="(item, index) in items.publicHolidays" :key="index">
                            <div
                                class="d-flex flex-row justify-space-between align-center text-primary font-weight-bold">
                                <div class="text-body-1 font-weight-bold">
                                    {{ item.name }}
                                </div>
                                <div class="text-grey">
                                    {{ calculateDayDifference(item.startDate, item.endDate) + ' ' +
                                        $t('enums.Day') }}
                                </div>
                                <div>
                                    {{ formatterDate(item.startDate) }}
                                </div>
                                <div v-if="daysUntilStart(item.startDate)" class="text-warning">
                                    {{ daysUntilStart(item.startDate) + ' ' + $t('enums.Day') + ' ' +
                                        $t('form.lastRemaining')
                                    }}
                                </div>
                            </div>
                            <v-divider class="mb-0"></v-divider>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
            <v-row class="fill-height" v-else>
                <v-col class="py-8 pl-6">
                    {{ $t('list.notFoundHoliday') }}
                </v-col>
            </v-row>
        </v-card-text>
        <!-- <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-vacation' }">
                    {{ $t('list.viewAll') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar> -->
    </v-card>
</template>

<script lang="ts" setup>
import { formatterDate } from '@/core/helpers/dateUtils';
import type { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import type { PropType } from 'vue';

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

const calculateDayDifference = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const differenceInTime = endDate.getTime() - startDate.getTime();

    return Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1;
};

const daysUntilStart = (start: string): string => {
    const today = new Date();
    const startDate = new Date(start);

    // Sadece tarih karşılaştırması için saatleri sıfırla
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    const differenceInTime = startDate.getTime() - today.getTime();
    const result = Math.ceil(differenceInTime / (1000 * 3600 * 24))
    if (result > 0 && result < 30) {
        return result.toString()
    } else
        return ''
};
</script>