<template>
    <div class="d-flex align-center justify-end px-6 py-4 bg-dropdownCard border-t">
        <v-btn v-for="(button, index) in buttons" :key="index" @click="button.click"
            :color="findButton(button.type).color" :loading="button.loading" :disabled="button.disabled"
            :variant="findButton(button.type).variant" class="ml-3 text-capitalize" elevation="0" height="44">
            <v-icon v-if="findButton(button.type).prependIcon" start>
                {{ findButton(button.type).prependIcon }}
            </v-icon>

            {{ $t(findButton(button.type).name) }}

            <v-icon v-if="button.appendIcon" end>{{ button.appendIcon }}</v-icon>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import buttonTypes from '@/core/data/buttonTypes';

// Button interface'ini burada da tanımlamak typesafe açısından iyidir
interface Button {
    name?: string;
    click: () => void;
    type: string;
    prependIcon?: string;
    appendIcon?: string;
    loading?: boolean;
    disabled?: boolean
}

const findButton = (type: string) => {
    // buttonTypes yapınızın { variant: 'flat' | 'text' | 'outlined', color: string, name: string } döndürdüğünü varsayıyorum
    return buttonTypes[type] || { color: 'primary', variant: 'elevated', name: 'Button' };
}

const props = defineProps({
    buttons: {
        type: Array as () => Button[] as any,
        default: () => [{
            click: () => { },
            loading: false,
            disabled: false,
            type: 'save'
        }],
        required: true
    }
});
</script>

<style scoped>
.border-t {
    border-top: 1px solid rgba(var(--v-border-color), 0.08);
}
</style>