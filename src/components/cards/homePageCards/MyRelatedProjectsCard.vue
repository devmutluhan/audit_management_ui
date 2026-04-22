<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start">
            <v-col cols="auto" class="pr-0">
                <v-icon size="26">mdi-projector-screen-outline</v-icon>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.myRelatedProjects') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4">
            <v-row v-if="items.myRelatedProjects.length > 0">
                <v-col cols="12" v-for="(item, index) in items.myRelatedProjects" :key="index">
                    <v-card>
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto">
                                    <v-row>
                                        <v-col cols="12" class="text-truncate text-body-1 font-weight-bold pb-1">
                                            {{ item.title }}
                                        </v-col>
                                        <v-col cols="12" class="text-priceTextColor font-weight-bold">
                                            {{ item.customer.name }}
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="fill-height" v-else>
                <v-col class="py-8 pl-6">
                    {{ $t('list.notFoundRelatedProjects') }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import type { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import type { PropType } from 'vue';

const props = defineProps({
    items: {
        type: Object as PropType<DashboardItemsDto>,
        required: true
    }
});

</script>