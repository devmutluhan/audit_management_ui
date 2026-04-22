<template>
    <v-card :color="cardColor" class="d-flex flex-column overflow-hidden dialog-shadow"
        :rounded="isMobileDevice() ? '' : 'xl'" :loading="dialogLoading" max-height="90vh">
        <DialogHeader :title="title" :titleIcon="titleIcon" :clickClose="dialogClose" />

        <v-card-text class="flex-grow-1 overflow-y-auto px-6 py-6" style="min-height: 200px;">
            <template v-if="$slots.dialogBody">

                <div v-show="!firstRender" class="fade-transition">
                    <slot name="dialogBody"></slot>
                </div>

                <div v-if="firstRender" class="d-flex flex-column justify-center align-center h-100 py-10">
                    <v-progress-circular :size="60" :width="6" color="primary" indeterminate></v-progress-circular>
                    <span class="mt-4 text-grey text-caption font-weight-medium">
                        {{ $t('general.loading') }}...
                    </span>
                </div>

            </template>
        </v-card-text>

        <DialogFooter :buttons="buttons ? buttons : [{
            click: dialogClose,
            type: 'close',
            loading: false,
            disabled: false
        }]" />
    </v-card>
</template>

<script setup lang="ts">
import DialogHeader from '@/components/dialogs/DialogHeader.vue';
import DialogFooter from '@/components/dialogs/DialogFooter.vue';
import { pendingRequestLength } from '@/core/services/ServiceSettings';
import { onMounted, ref, watch } from 'vue';
import { isMobileDevice } from '@/assets/ts/_utils';

// Interface
interface Button {
    name?: string;
    click: () => void;
    type: string;
    prependIcon?: string;
    appendIcon?: string;
    disabled?: boolean
    loading?: boolean;
}

const firstRender = ref(true);

const props = defineProps({
    dialogClose: {
        type: Function,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    dialogLoading: {
        type: Boolean,
        default: false
    },
    titleIcon: {
        type: String,
        default: ''
    },
    cardColor: {
        type: String,
        default: 'surface', // Vuetify 3 default surface color
    },
    buttons: {
        type: Array as () => Button[],
        required: false
    }
});

// Logic: Pending Request Listener
watch(() => pendingRequestLength.value, (newValue) => {
    if (newValue === 0) {
        firstRender.value = false;
    }
});

onMounted(() => {
    // Küçük bir gecikme UI'ın oturması için iyidir, ancak mantığı korudum
    setTimeout(() => {
        if (pendingRequestLength.value === 0) {
            firstRender.value = false;
        }
    }, 50);
});
</script>

<style scoped>
/* İçerik yüklendiğinde yumuşak bir geçiş efekti */
.fade-transition {
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Custom Scrollbar (Opsiyonel: Daha şık görünüm için) */
.v-card-text::-webkit-scrollbar {
    width: 8px;
}

.v-card-text::-webkit-scrollbar-track {
    background: transparent;
}

.v-card-text::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 4px;
}
</style>