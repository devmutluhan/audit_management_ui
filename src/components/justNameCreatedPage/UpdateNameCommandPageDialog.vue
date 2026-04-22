<template>
    <v-dialog v-model="modelValue" width="500">
        <v-card color="dropdownCard">
            <v-card-text>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="updateNameCommand.name" :label="label ? label : 'general.title'"
                            @keyup.enter="clickSubmit()" hideDetails />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="modelValue = false" color="cancelButtonColor">
                    {{ $t('general.cancel') }}
                </v-btn>
                <v-btn @click="clickSubmit()" color="approveButtonColor" :loading="loading"
                    :disabled="updateNameCommand.name.length == 0">
                    {{ $t('general.save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { NameCommand } from "@/models/ApiResult";
import TextField from "@/components/formInput/generalInputs/TextField.vue";

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: {
        required: true,
        default: false,
        type: Boolean,
    },
    label: {
        type: String,
        default: "",
    },
    updateClick: {
        type: Function,
        default: () => { },
    },
    selectedItem: {
        type: null as any,
        required: true
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
});

const updateNameCommand = ref(new NameCommand());

const clickSubmit = () => {
    if (updateNameCommand.value.name) {
        props.updateClick(updateNameCommand.value);
    }
}

const modelValue = computed({
    get() {
        return props.modelValue ?? false
    },
    set(newValue: Boolean | null) {
        emit('update:modelValue', newValue);
    }
});

watch(() => props.selectedItem, (newValue) => {
    if (newValue)
        updateNameCommand.value.name = props.selectedItem.name
})

onMounted(() => {
    updateNameCommand.value.name = props.selectedItem.name
})

</script>