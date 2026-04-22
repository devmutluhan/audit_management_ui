<template>
    <div class="fill-height">
        <PageTabsTeleport>
            <template v-slot:component>
                <Tabs2 :pages="filterPages" />
            </template>
        </PageTabsTeleport>
        <RouterView />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Tabs2 from '@/components/tabs/Tabs2.vue';
import { filterMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import PageTabsTeleport from '@/components/teleports/PageTabsTeleport.vue';

const pages = ref([
    {
        to: { name: 'vacation-list' },
        name: 'vacationList'
    },
    // {
    //     to: { name: 'vacation-reports' },
    //     name: 'reports'
    // },
    {
        to: { name: 'vacation-rules-list' },
        name: 'rules'
    },
    {
        to: { name: 'vacation-public-holiday' },
        name: 'publicHoliday'
    },
    {
        to: { name: 'vacation-calendar' },
        name: 'calendar'
    }
]);

const filterPages = filterMenu(pages.value);

</script>