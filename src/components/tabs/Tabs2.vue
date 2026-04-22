<template>
    <v-row class="d-flex justify-left">
        <v-col cols="auto" class="pb-1">
            <v-tabs align-tabs="center" color="selectedTab">
                <v-tab v-for="item in props.pages" class="text-body-1" :key="item.route" :to="item.to">
                    {{ $t('menu.' + item.name) }}
                </v-tab>
            </v-tabs>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">

import type { PropType } from 'vue';

const props = defineProps({
    pages: {
        type: Array as PropType<any>,
        default: [],
        required: true
    },
});


</script>