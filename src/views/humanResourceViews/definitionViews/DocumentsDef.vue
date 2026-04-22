<template>
    <v-window v-model="step">
        <v-window-item :value="1">
            <DocumentCategoryDef @currentStep="selectCategory($event)"></DocumentCategoryDef>
        </v-window-item>
        <v-window-item :value="2">
            <DocumentChildDef @currentStep="goBack()">
            </DocumentChildDef>
        </v-window-item>
    </v-window>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import DocumentCategoryDef from './DocumentsDefComp/DocumentCategoryDef.vue';
import DocumentChildDef from './DocumentsDefComp/DocumentChildDef.vue';
import type { DocumentCategoryDto } from '@/models/entities/humanResource/DocumentModels';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const step = ref(1);

const selectCategory = async (category: DocumentCategoryDto) => {
    await router.push({ query: { id: category.id } });
    step.value = 2;
}

const goBack = async () => {
    await router.replace({ query: {} })
    step.value = 1;
}

onMounted(() => {
    if (route.query.id) {
        step.value = 2;
    } else {
        step.value = 1;
    }
})

watch(() => route.query.id, (newValue) => {
    if (!newValue) {
        step.value = 1;
        router.replace({ query: {} })
    }
})


</script>
