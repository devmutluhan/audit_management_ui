<template>
    <RouterView />
</template>

<script setup lang="ts">

import { useLeavePolicyStore } from '@/stores/humanResourcesStores/leavePolicyStore';

useLeavePolicyStore().getLeavePolicy();

</script>