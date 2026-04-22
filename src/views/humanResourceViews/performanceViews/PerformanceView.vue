<template>
    <div class="fill-height">
        <PageTabsTeleport v-if="route.path.includes('list')">
            <template v-slot:component>
                <Tabs2 :pages="filterPages" />
            </template>
        </PageTabsTeleport>
        <RouterView />
    </div>
</template>

<script lang="ts" setup>

import Tabs2 from '@/components/tabs/Tabs2.vue';
import PageTabsTeleport from '@/components/teleports/PageTabsTeleport.vue';
import { filterMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const pages = ref([
    {
        to: { name: 'performance-list' },
        name: 'performanceList'
    },
    {
        to: { name: 'evaluation-template-list' },
        name: 'evaluationTemplateList'
    },
    {
        to: { name: 'competency-template-list' },
        name: 'competencyTemplateList'
    }
]);
const filterPages = filterMenu(pages.value);

</script>