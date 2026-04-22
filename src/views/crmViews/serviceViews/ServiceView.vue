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
import { ref, watch } from "vue";
import Tabs2 from "@/components/tabs/Tabs2.vue";
import { filterMenu } from "@/core/menuPageManagement/moduleClaimUtils";
import { storeToRefs } from "pinia";
import { useManagementDtoStore } from "@/stores/managementStores/managementDtoStore";
import PageTabsTeleport from "@/components/teleports/PageTabsTeleport.vue";

const pages = ref([
    {
        to: { name: 'service-group-list' },
        name: 'serviceGroupList'
    },
    {
        to: { name: 'service-list' },
        name: 'serviceList'
    },
    {
        to: { name: 'service-position-price-list' },
        name: 'positionPriceList'
    },
    {
        to: { name: 'service-conflict-list' },
        name: 'serviceConflictList'
    },
]);

const filterPages = ref(filterMenu(pages.value));

const { companySettings } = storeToRefs(useManagementDtoStore());
useManagementDtoStore().getCompanySettings();


watch(() => companySettings.value, (newValue) => {
    if (newValue && newValue.id) {
        if (!newValue.includeServiceConflict) {
            filterPages.value = filterPages.value.filter((a) => a.to.name != 'service-conflict-list');
        }
    }
}, { immediate: true, deep: true });



</script>