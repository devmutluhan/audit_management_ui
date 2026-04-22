<template>
    <v-row>
        <v-col cols="12" align="left">
            <v-text-field density="comfortable" v-model="modelValue" :label="$t(label)" :base-color="color"
                appendInnerIcon="mdi-magnify" @update:model-value="emit('update:modelValue', $event)"
                @update:focused="isFocused" autocomplete="off" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { ref } from 'vue';

const modelValue = ref('');
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: {
        required: false,
        type: String,
        default: 'general.search'
    },
});
const color = ref('')
const isFocused = (isFocus: boolean) => {
    color.value = ''
    if (modelValue.value !== '' && !isFocus) {
        color.value = '#C62828'
    }
}

</script>