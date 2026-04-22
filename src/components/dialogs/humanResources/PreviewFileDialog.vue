<template>
    <DialogContent title="general.receiptDetail" :dialogClose="dialogClose" titleIcon="mdi-airplane">
        <template v-slot:dialogBody>
            <v-card>
                <v-card-text class="d-flex justify-center align-center" style="min-height: 400px;">
                    <template v-if="previewUrl">
                        <!-- PDF veya görseli kontrol et -->
                        <iframe v-if="previewUrl.endsWith('.pdf')" :src="previewUrl" width="100%" height="500px"
                            style="border: none;"></iframe>
                        <v-img v-else :src="previewUrl" alt="Preview" />
                    </template>
                    <template v-else>
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </template>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '../DialogContent.vue';

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    previewUrl: {
        type: String,
        required: true,
        default: ''
    }
});

</script>