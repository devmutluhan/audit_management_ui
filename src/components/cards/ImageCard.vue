<template>
    <v-avatar v-if="!avatarText" :color="color" class="d-flex align-center text-center text-uppercase ls-3"
        :rounded="rounded" :size="size" :style="{ fontSize: fontSize }">
        {{ resultValue }}
    </v-avatar>
    <v-avatar v-else :rounded="rounded" :size="size">
        <v-img :src="getFileUrl(avatarText)" cover></v-img>
    </v-avatar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getFileUrl } from '@/core/helpers/assets';

const resultValue = computed(() => {
    if (props.fullName.trim() == '') {
        if (props.firstValue.length > 0 && props.secondValue.length > 0)
            return props.firstValue[0] + props.secondValue[0];
        else if (props.firstValue.length > 0 && props.secondValue.length == 0)
            return props.firstValue[0] + props.firstValue[1]
        else
            return ""
    } else {
        let firstValue = props.fullName.split(' ')[0] ?? '--';
        let secondValue = props.fullName.split(' ')[1];
        if (secondValue) {
            return firstValue[0] + secondValue[0]
        } else {
            return firstValue[0] + firstValue[1]
        }
    }
})

const props = defineProps({
    fullName: {
        type: String,
        default: ''
    },
    firstValue: {
        type: String,
        default: '',
    },
    secondValue: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: '40'
    },
    fontSize: {
        type: String,
        default: '15px',
    },
    avatarText: {
        type: String,
        default: ''
    },
    rounded: {
        type: String,
        default: "lg"
    },
    color: {
        type: String,
        default: 'red'
    }
});
</script>