<template>
    <v-snackbar class="fixed-snackbar" v-model="responseResultPage" vertical :timeout="responseResultModel.timeout"
        location="top" timer :color="responseResultModel.snackbarColor">
        <div class="text-body-1 pb-2"> {{ $t(responseResultModel.title) }} </div>

        <p class="text-subtitle-1">{{ messageSplit }}</p>

        <template v-slot:actions v-if="responseResultModel.buttonText">
            <v-btn color="indigo" flat variant="text" @click="responseResultModel.buttonAction">
                {{ $t(responseResultModel.buttonText) }}
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores/mainStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const mainStore = useMainStore()
const { responseResultModel, responseResultPage } = storeToRefs(mainStore);

const messageSplit = computed(() => {
    if (responseResultModel.value?.message.includes('*')) {
        const splitMessage = responseResultModel.value.message.split('*')[0];
        const splitMessage2 = responseResultModel.value.message.split('*')[1];
        return t(splitMessage, { PropertyName: t('statusCode.' + splitMessage2) });
    }
    else
        return t(responseResultModel.value.message);
});

</script>

<style scoped>
.fixed-snackbar {
    position: fixed !important;
    top: 20px !important;
    left: 50% !important;
    transform: translateX(-50%);
    z-index: 9999 !important;
}
</style>
