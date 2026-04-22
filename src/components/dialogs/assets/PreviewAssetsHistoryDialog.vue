<template>
    <DialogContent title="general.previewAssetsHistory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-history">
        <template v-slot:dialogBody>
            Geçmiş Zimmetler
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { AssetsDto } from '@/models/entities/assets/AssetsModels';

const emit = defineEmits(['createItem']);

const props = defineProps({
    selectedItem: {
        type: Object as PropType<AssetsDto>,
        required: true
    },
    dialogClose: {
        type: null as any,
        required: true
    }
});


const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    }
])

</script>