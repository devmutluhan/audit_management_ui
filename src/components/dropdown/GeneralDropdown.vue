<template>
    <!--begin::Menu-->
    <v-menu class="menu-gray-800 menu-state-bg-light-primary" data-kt-menu="true">
        <template v-slot:activator="{ props }">
            <v-col class="py-0">
                <v-btn variant="text" icon size="25" v-bind="props">
                    <v-icon>{{ icon }}</v-icon>
                </v-btn>
            </v-col>
        </template>
        <v-card rounded="lg" elevation="10" color="dropdownCard">
            <v-card-text>
                <!--begin::Menu item-->
                <div class="menu-item" v-if="titleActive">
                    <div class="menu-content text-muted pb-2 fs-7 text-uppercase">
                        {{ $t("general.actions") }}
                    </div>
                </div>
                <!--end::Menu item-->

                <!--begin::Menu item-->
                <div class="menu-item" v-for="item in items.menuItems">
                    <!-- Sadece To => Route a yönlendirir -->
                    <router-link
                        v-if="item.to && !routeId && !item.action && !item.confirmModalValue && item.isVisible !== false"
                        :to="{ name: item.to }" class="menu-link flex-stack px-5 text-subtitle-2">
                        {{ $t(item.title) }}
                        <i v-if="item.icon" :class="item.icon" class="bi fs-3"></i>
                    </router-link>
                    <!-- Params To => Route a yönlendirir -->
                    <router-link
                        v-if="item.to && routeId && !item.action && !item.confirmModalValue && item.isVisible !== false"
                        :to="{ name: item.to, params: { id: routeId } }"
                        class="menu-link text-subtitle-2 flex-stack px-5">
                        {{ $t(item.title) }}
                        <i v-if="item.icon" :class="item.icon" class="bi fs-3"></i>
                    </router-link>
                    <!-- Sadece Action => Method çalıştırır. -->
                    <a v-if="item.action && !item.to && !item.confirmModalValue && item.isVisible !== false"
                        class="menu-link text-subtitle-2 flex-stack px-5" @click="item.action(data)">
                        {{ $t(item.title) }}
                        <i v-if="item.icon" :class="item.icon" class="bi fs-3"></i>
                    </a>
                    <!-- ConfirmDialog => Confirm Dialogu Açar -->
                    <a v-if="item.confirmModalValue && !item.action && !item.to && item.isVisible !== false"
                        class="menu-link text-subtitle-2 flex-stack px-5"
                        @click="selectedConfirmValue = item.confirmModalValue; confirmDialog = true">
                        {{ $t(item.title) }}
                        <i v-if="item.icon" :class="item.icon" class="bi fs-3"></i>
                    </a>
                </div>
                <!--end::Menu item-->
            </v-card-text>
        </v-card>
    </v-menu>
    <ConfirmDialog v-model="confirmDialog" :data="data" :modal="selectedConfirmValue" />
    <!--end::Menu-->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { GeneralDropdownType, ConfirmModalType } from "@/models/types";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

const confirmDialog = ref(false);
const selectedConfirmValue = ref({} as ConfirmModalType);

const items = defineProps({
    menuItems: {
        required: true,
        type: Array<GeneralDropdownType>,
        default: false,
    },
    titleActive: {
        required: false,
        type: Boolean,
        default: false,
    },
    routeId: {
        required: false,
        type: String,
        default: '',
    },
    data: {
        required: false,
        type: Object as any,
        default: null,
    },
    icon: {
        required: false,
        type: String,
        default: 'mdi-dots-horizontal-circle-outline',
    },
});
</script>