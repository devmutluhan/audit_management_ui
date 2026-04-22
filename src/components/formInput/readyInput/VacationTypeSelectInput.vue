<template>
    <SingleAutocompleteInput v-model="selectedVacationType" label="form.vacationType" :items="items" item-title="name"
        item-value="id" :isRequired="isRequired" @click:clear="emit('clickClear')"
        @update:model-value="emit('updateModelValue')">
        <template v-slot:menuItem="{ item, closeMenu }">
            <v-list-item link @click="selectedVacationType = item; emit('updateModelValue');">
                <v-row>
                    <v-col @click="closeMenu()">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-col>
                    <v-spacer @click="closeMenu()"></v-spacer>
                    <v-col cols="auto">
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" color="primary" size="25"> mdi-information-outline</v-icon>
                            </template>
                            <v-card border="false" max-width="250px">
                                <v-card-text>
                                    <v-row>
                                        <v-col class="text-body-1">
                                            <span class="mr-2" :class="item.isPaid ? 'text-success' : 'text-warning'">
                                                {{ item.isPaid ? $t('form.paid') : $t('form.unPaid') }}
                                            </span>
                                            <v-icon size="5">mdi-record</v-icon>
                                            <span class="ml-2">
                                                {{ limitationResult(item) }}
                                            </span>
                                            <v-divider class="ma-0 my-1"></v-divider>
                                            <p class="ma-0">
                                                {{ item.description }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tooltip>
                    </v-col>
                </v-row>
            </v-list-item>
        </template>
        <template v-slot:chipItem="{ item }">
            <v-chip size="20" v-if="item.id" color="buttonChipColor">
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
import i18n from '@/core/plugins/i18n';
import { LimitationTypeEnum } from '@/models/custom/EnumTypes';
import { LeaveTypeDetailDto } from '@/models/entities/humanResource/LeavePolicyDtos';
import { ref, watch } from 'vue';

const emit = defineEmits(['selectValue', 'updateModelValue', 'clickClear']);
const t = i18n.global.t
const selectedVacationType = ref(new LeaveTypeDetailDto())
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
        type: Array<LeaveTypeDetailDto>,
        required: true,
    },
    selectItem: {
        type: String,
        default: '',
    },
});


watch(() => selectedVacationType.value, (newValue: LeaveTypeDetailDto) => {
    if (props.justId) {
        emit('selectValue', newValue?.id);
    } else {
        emit('selectValue', newValue);
    }
});

watch(() => props.items, (newValue) => {
    if (newValue.length > 0 && props.selectItem) {
        selectedVacationType.value = props.items.find((x: LeaveTypeDetailDto) => x.id == props.selectItem) ?? new LeaveTypeDetailDto()
    }
});

watch(() => props.selectItem, (newValue) => {
    if (newValue.length > 0 && props.selectItem && selectedVacationType.value.id != props.selectItem) {
        selectedVacationType.value = props.items.find((x: LeaveTypeDetailDto) => x.id == props.selectItem) ?? new LeaveTypeDetailDto()
    }
})

const limitationResult = (item: LeaveTypeDetailDto) => {
    if (item.limitation == LimitationTypeEnum.NotLimited) {
        return t('enums.NotLimited')
    } else if (item.limitation == LimitationTypeEnum.LimitedToYear) {
        return t('form.forYear') + ' ' + item.dayLimit + ' ' + t('enums.Day')
    } else if (item.limitation == LimitationTypeEnum.LimitedToEvent) {
        return t('form.forAllRequest') + ' ' + item.dayLimit + ' ' + t('enums.Day')
    } else {
        return ' '
    }
}

</script>