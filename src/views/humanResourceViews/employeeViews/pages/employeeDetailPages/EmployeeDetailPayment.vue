<template>
    <Tabs1 :pages="filterPages" @createdItem="createdItem()" />
</template>

<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { useRoute } from 'vue-router';
import Tabs1 from '@/components/tabs/Tabs1.vue';
import { filterMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import AddExpenseDialog from '@/components/dialogs/humanResources/AddExpenseDialog.vue';
import AddAdvanceDialog from '@/components/dialogs/humanResources/AddAdvanceDialog.vue';
import { usePaymentStore } from '@/stores/humanResourcesStores/paymentStore';
import { useExpenseStore } from '@/stores/humanResourcesStores/expenseStore';

const route = useRoute();

const pages = ref([
    {
        to: { name: "personel-expenses", params: { id: route.params.id } },
        name: 'employeePaymentExpense',
        createButton: 'general.addExpense',
        createComponent: markRaw(AddExpenseDialog)
    },
    {
        to: { name: "personel-advances", params: { id: route.params.id } },
        name: 'employeePaymentAdvance',
        createButton: 'general.addAdvance',
        createComponent: markRaw(AddAdvanceDialog)
    }
]);

const filterPages = filterMenu(pages.value);

const createdItem = () => {
    if (route.name == 'personel-expenses') {
        useExpenseStore().getExpenseList({ employeeId: route.params.id.toString(), pageNumber: 1, pageSize: 1000 });
    } else if (route.name == 'personel-advances') {
        usePaymentStore().getAdvanceList({ employeeId: route.params.id.toString(), pageNumber: 1, pageSize: 1000 })
    }
}

</script>