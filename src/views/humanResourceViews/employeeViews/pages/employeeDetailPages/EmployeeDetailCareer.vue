<template>
    <Tabs1 :pages="filterPages" />
</template>

<script setup lang="ts">

import { ref, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import Tabs1 from '@/components/tabs/Tabs1.vue';
import AddExperienceDialog from '@/components/dialogs/humanResources/AddExperienceDialog.vue';
import AddPayDialog from '@/components/dialogs/humanResources/AddPayDialog.vue';
import { filterMenu } from '@/core/menuPageManagement/moduleClaimUtils';

const route = useRoute();
const pages = ref([
    {
        to: { name: 'employee-position', params: { id: route.params.id } },
        name: 'position',
        createButton: 'general.addPosition',
        createComponent: markRaw(AddExperienceDialog)
    },
    {
        to: { name: 'employee-pay', params: { id: route.params.id } },
        name: 'pay',
        createButton: 'general.addPay',
        createComponent: markRaw(AddPayDialog)
    }
]);

const filterPages = filterMenu(pages.value);

</script>