<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start">
            <v-col cols="auto" class="pr-0">
                <v-icon size="26">mdi-cake-variant-outline</v-icon>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.upcomingBirthDates') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.upcomingBirthdays.length > 0">
                <v-col cols="12">
                    <v-list style="background-color: transparent;">
                        <v-list-item class="px-1" v-for="(item, index) in items.upcomingBirthdays" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="auto">
                                    <ImageCard :first-value="item.firstName" :avatar-text="item.avatarUrl"
                                        :second-value="item.lastName" />
                                </v-col>
                                <v-col cols="5" md="4" class="text-body-1 font-weight-bold pa-0">
                                    {{ item.firstName + ' ' + item.lastName }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="3" md="4" class="font-weight-bold pl-0">
                                    <v-row class="d-flex align-center justify-end">
                                        <v-col align="right" cols="auto" class="py-0">
                                            <p class="ma-0 text-primary">{{ formatDateMonths(item.birthDate) }}</p>
                                            <p class="ma-0 text-warning" v-if="item.leftDay > 0">
                                                {{
                                                    item.leftDay + ' ' + $t('enums.Day') + ' ' + $t('form.lastRemaining')
                                                }}
                                            </p>
                                            <p class="ma-0 text-warning" v-else>
                                                {{
                                                    $t('enums.Today')
                                                }}
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
            <v-row v-else>
                <v-col class="py-8">
                    {{ $t('list.notFoundUpcomingBirthDates') }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { formatDateMonths } from '@/core/helpers/dateUtils';
import ImageCard from '../ImageCard.vue';
import type { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import type { PropType } from 'vue';

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

</script>