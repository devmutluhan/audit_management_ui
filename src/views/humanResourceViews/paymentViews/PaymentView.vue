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
        to: { name: 'payment-expense-list' },
        name: 'expenseList'
    },
    {
        to: { name: 'payment-advance-list' },
        name: 'advanceList'
    }
]);

const filterPages = filterMenu(pages.value);

</script>