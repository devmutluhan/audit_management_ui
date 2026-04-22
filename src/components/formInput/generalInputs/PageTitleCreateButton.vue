<template>
    <v-btn class="megacore-brand-btn font-weight-bold text-subtitle-2"
        :class="{ 'px-6': !isMobile, 'is-mobile': isMobile }" :prepend-icon="!isMobile ? 'mdi-plus' : undefined"
        :rounded="isMobile ? 'circle' : 'lg'" :size="isMobile ? 'small' : 'large'" :to="to || null" :loading="loading"
        elevation="0" @click="!to && emits('clicked')">
        <v-icon v-if="isMobile" size="20">mdi-plus</v-icon>
        <span v-else>{{ $t(props.title) }}</span>
    </v-btn>
</template>

<script setup lang="ts">
import { isMobileDevice } from '@/assets/ts/_utils';
import type { PropType } from 'vue';

const emits = defineEmits(['clicked'])
const props = defineProps({
    title: {
        type: String,
        default: 'general.addNew'
    },
    to: {
        type: Object as PropType<any>,
        required: false
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const isMobile = isMobileDevice(); 
</script>

<style scoped>
.megacore-brand-btn {
    background: linear-gradient(135deg, #403bc6 0%, #040237 100%) !important;
    color: white !important;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 15px #1E1B8E4D !important;
    letter-spacing: 0.5px;
}

.megacore-brand-btn.is-mobile {
    min-width: 40px !important;
    width: 40px !important;
    height: 40px !important;
    padding: 0 !important;
}

.megacore-brand-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px #1E1B8E4D !important;
    filter: brightness(1.1);
}

.megacore-brand-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px #1E1B8E4D !important;
}
</style>