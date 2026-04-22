<template>
    <v-col cols="12" class="d-flex justify-center align-center">
        <v-card border="false" class="d-flex justify-center align-center" color="transparent" elevation="0">
            <v-card-text>
                <v-alert type="info" variant="tonal">
                    <p class="text-h6 ma-0">{{ $t('general.noDataFound') }}</p>
                </v-alert>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

</script>