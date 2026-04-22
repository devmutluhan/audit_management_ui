<template>
    <v-col v-if="label" class="px-0 py-2">
        <v-label class="font-weight-bold">
            {{ $t(label) }}
            <span v-if="isRequired" style="color:red;" class="ml-1"> * </span>
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
            <span v-if="isRequired" style="color:red;" class="ml-1"> * </span>
        </span>
    </v-col>
</template>

<script setup lang="ts">

const props = defineProps({
    descriptionText: {
        type: String,
        default: '',
    },
    label: {
        required: false,
        type: String,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
})
</script>
