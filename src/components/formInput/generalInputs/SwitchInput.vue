<template>
    <v-row>
        <v-col cols="12">
            <v-switch v-model="modelValue" :hideDetails="hideDetails" :disabled="disabled">
                <template #label>
                    <div v-if="label" class="d-flex flex-column justify-center">
                        <v-label class="font-weight-bold">
                            {{ $t(label) }}
                            <v-tooltip v-if="descriptionText != '' && !descriptionTextVisible">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="ml-1" size="15" color="info"> mdi-information</v-icon>
                                </template>
                                <v-row>
                                    <v-col>
                                        {{ $t(descriptionText) }}
                                    </v-col>
                                </v-row>
                            </v-tooltip>
                        </v-label>
                        <span class="pl-2" v-if="descriptionTextVisible">
                            {{ $t(descriptionText) }}
                        </span>
                    </div>
                </template>
            </v-switch>
            <v-btn v-if="clearable" variant="text" @click="emit('clickClear')">
                <v-icon> mdi-close </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { computed } from 'vue';

const emit = defineEmits(['update:modelValue', 'clickClear']);
const props = defineProps({
    modelValue: {
        required: true,
        type: null as any,
    },
    descriptionText: {
        type: String,
        default: '',
    },
    label: {
        required: false,
        type: String,
    },
    hideDetails: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const modelValue = computed({
    get() {
        return props.modelValue ?? false;
    },
    set(newValue: boolean | null) {
        emit('update:modelValue', newValue);
    }
});

</script>