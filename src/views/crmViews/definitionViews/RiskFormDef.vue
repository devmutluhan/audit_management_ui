<template>
    <v-window v-model="step">
        <v-window-item :value="1">
            <RiskFormDetailCard @currentStep="step = $event" @selectedFormType="selectedFormType = $event">
            </RiskFormDetailCard>
        </v-window-item>
        <v-window-item :value="2">
            <RiskFormUpdateCard @currentStep="step = $event" :selectedFormType="selectedFormType" v-if="step == 2">
            </RiskFormUpdateCard>
        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
import RiskFormDetailCard from '@/components/cards/crmCards/RiskFormDetailCard.vue';
import RiskFormUpdateCard from '@/components/cards/crmCards/RiskFormUpdateCard.vue';
import { RiskFormType } from '@/models/custom/EnumTypes';
import { ref } from 'vue';

const step = ref(1);
const selectedFormType = ref(RiskFormType.Devam);

</script>