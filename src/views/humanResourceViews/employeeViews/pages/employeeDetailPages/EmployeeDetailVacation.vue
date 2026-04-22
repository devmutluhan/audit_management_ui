<template>
    <Tabs1 :pages="filterPages" @createdItem="getEmployeeVacation($event)" />
</template>

<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { useRoute } from 'vue-router';
import Tabs1 from '@/components/tabs/Tabs1.vue';
import AddVacationDialog from '@/components/dialogs/humanResources/AddVacationDialog.vue';
import { filterMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import { useLeaveStore } from '@/stores/humanResourcesStores/leaveStore';
import type { EmployeeLeaveListDto } from '@/models/entities/humanResource/LeaveDtos';
import { storeToRefs } from 'pinia';
const route = useRoute();
const { employeeLeaveList } = storeToRefs(useLeaveStore());

useLeaveStore().getLeaveSummaryForEmployee(route.params.id.toString());
useLeaveStore().getLeaveForEmployee({ employeeId: route.params.id.toString(), pageNumber: 1, pageSize: 10000 })

const pages = ref([
    {
        to: { name: "personel-vacation-summary", params: { id: route.params.id } },
        name: 'summary'
    },
    {
        to: { name: "personel-vacations", params: { id: route.params.id } },
        name: 'vacationList',
        createButton: 'general.addVacation',
        createComponent: markRaw(AddVacationDialog)
    }
]);

const filterPages = filterMenu(pages.value);

const getEmployeeVacation = (item: EmployeeLeaveListDto) => {
    if (item.id) {
        employeeLeaveList.value.items?.unshift(item);
        employeeLeaveList.value.totalCount += 1
    }
}
</script>