<template>
    <SingleAutocompleteInput label="form.country" v-model="selectedCountry" :items="items" item-title="name"
        item-value="code" :isRequired="isRequired">
        <template v-slot:menuItem="{ item, closeMenu }">
            <v-list-item link class="py-0 px-2" @click="selectedCountry = item; closeMenu()">
                <v-row>
                    <v-col>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.code }}</v-list-item-subtitle>
                    </v-col>
                </v-row>
            </v-list-item>
        </template>
        <template v-slot:chipItem="{ item }">
            <v-chip size="20" v-if="item.code" color="buttonChipColor">
                <template v-slot:default>
                    <v-col>
                        {{ item.name }}
                    </v-col>
                </template>
            </v-chip>
        </template>
    </SingleAutocompleteInput>
</template>

<script setup lang="ts">
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { ref, watch } from 'vue';
import { CountryDto } from '@/models/entities/general/GeneralDtos';

const emit = defineEmits(['selectValue']);

const selectedCountry = ref(new CountryDto())
const props = defineProps({
    justId: {
        type: Boolean,
        default: false,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    items: {
        type: Array<CountryDto>,
        required: true,
    },
    selectItem: {
        type: String,
        default: '',
    },
});


watch(() => selectedCountry.value, (newValue: CountryDto) => {
    if (props.justId) {
        emit('selectValue', newValue?.code);
    } else {
        emit('selectValue', newValue);
    }
});

watch(() => props.items, (newValue) => {
    if (newValue.length > 0 && props.selectItem) {
        selectedCountry.value = props.items.find((x: CountryDto) => x.code == props.selectItem) ?? new CountryDto()
    }
});
</script>