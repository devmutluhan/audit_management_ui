<template>
    <div class="fill-height">
        <PageTabsTeleport>
            <template v-slot:component>
                <Tabs2 :pages="menuArray"></Tabs2>
            </template>
        </PageTabsTeleport>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import Tabs2 from '@/components/tabs/Tabs2.vue';
import PageTabsTeleport from '@/components/teleports/PageTabsTeleport.vue';
import { filteredAccountMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import { ref } from 'vue';

const menuArray = ref(filteredAccountMenu.value.find((x: any) => x.route == 'approval-request').children.map((a: any) => {
    return {
        name: a.title.slice(5, a.title.length),
        to: { name: a.route }
    }
}));
</script>