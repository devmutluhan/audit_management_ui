<template>
    <div>
        Sample Page
        <p><strong>Current Route:</strong> {{ route.fullPath }}</p>
        <p><strong>Route Name:</strong> {{ route.name }}</p>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>