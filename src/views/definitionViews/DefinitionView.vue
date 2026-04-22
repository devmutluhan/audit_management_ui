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
import { ref } from "vue";
import Tabs2 from "@/components/tabs/Tabs2.vue";
import { filterMenu } from "@/core/menuPageManagement/moduleClaimUtils";
import PageTabsTeleport from "@/components/teleports/PageTabsTeleport.vue";

const pages = ref([
    {
        to: { name: 'general-definition' },
        name: 'generalDefinition'
    },
    {
        to: { name: 'tax-definition' },
        name: 'taxDefinition'
    },
    {
        to: { name: 'public-holiday-definition' },
        name: 'publicHoliday'
    },
    {
        to: { name: 'company-branch-definition' },
        name: 'companyBranchDefinition'
    },
    {
        to: { name: 'approvement-card-definition' },
        name: 'approvementCardDefinition'
    },
    {
        to: { name: 'claim-card-definition' },
        name: 'claimCardDefinition'
    },
    {
        to: { name: 'user-claim-definition' },
        name: 'userClaimDefinition'
    },
]);

const filterPages = filterMenu(pages.value);
</script>