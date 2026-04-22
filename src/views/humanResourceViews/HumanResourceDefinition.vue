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
        to: { name: 'hr-working-day-definition' },
        name: 'hrWorkingDay'
    },
    {
        to: { name: 'hr-position-definition' },
        name: 'hrPosition'
    },
    {
        to: { name: 'hr-department-definition' },
        name: 'hrDepartment'
    },
    {
        to: { name: 'payment-expense-category' },
        name: 'hrExpenseCategory'
    },
    {
        to: { name: 'hr-leave-work-reason-definition' },
        name: 'hrLeaveWorkReason'
    },
    {
        to: { name: 'hr-document-definition' },
        name: 'hrDocumentDefinition'
    },
]);

const filterPages = filterMenu(pages.value);

</script>