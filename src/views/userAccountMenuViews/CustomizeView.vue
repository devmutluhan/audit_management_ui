<template>
    <div id="kt_app_layout_builder" class="bg-body">
        <!--begin::Card-->
        <div class="card border-0 shadow-none rounded-0 w-100">
            <!--begin::Card body-->
            <div class="card-body position-relative" id="kt_app_layout_builder_body">
                <!--begin::Content-->
                <div id="kt_app_settings_content" class="position-relative scroll-y me-n5 pe-5" data-kt-scroll="true"
                    data-kt-scroll-wrappers="#kt_app_layout_builder_body"
                    data-kt-scroll-dependencies="#kt_app_layout_builder_header, #kt_app_layout_builder_footer"
                    data-kt-scroll-offset="5px">
                    <!--begin::Form-->
                    <form class="form" id="kt_app_layout_builder_form">
                        <input type="hidden" id="kt_app_layout_builder_action" name="layout-builder[action]" />
                        <!--begin::Card body-->
                        <div class="card-body p-0">
                            <!--begin::Form group-->
                            <div class="form-group">
                                <!--begin::Heading-->
                                <div class="d-flex flex-column mb-4">
                                    <h4 class="fw-bold text-gray-900"> {{ $t('customize.widthMode') }} </h4>
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.widthOptions') }}
                                    </div>
                                </div>
                                <!--end::Heading-->
                                <!--begin::Options-->
                                <div class="d-flex">
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.pageWidth" class="form-check-input" type="radio"
                                            value="default" id="kt_builder_page_width_default" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_default"> {{ $t('customize.default') }} </label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.pageWidth" class="form-check-input" type="radio"
                                            value="fluid" id="kt_builder_page_width_fluid" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_fluid">{{ $t('customize.fluid') }}</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.pageWidth" class="form-check-input" type="radio"
                                            value="fixed" id="kt_builder_page_width_fixed" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_fixed">{{ $t('customize.fixed') }}</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                </div>
                                <!--end::Options-->
                            </div>
                            <div class="separator separator-dashed my-5"></div>
                            <div class="form-group" v-if="!isMobileApp()">
                                <!--begin::Heading-->
                                <div class="d-flex flex-column mb-4">
                                    <h4 class="fw-bold text-gray-900"> {{ $t('customize.tableFilter') }} </h4>
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.tableFilterDescription') }}
                                    </div>
                                </div>
                                <!--end::Heading-->
                                <!--begin::Options-->
                                <div class="d-flex">
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.tableFilter" class="form-check-input"
                                            type="radio" value="unVisible" id="kt_builder_page_width_default" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_default"> {{ $t('customize.unVisible') }}
                                        </label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.tableFilter" class="form-check-input"
                                            type="radio" value="visible" id="kt_builder_page_width_fluid" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_fluid">{{ $t('customize.visible') }}</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.general.tableFilter" class="form-check-input"
                                            type="radio" value="navDrawer" id="kt_builder_page_width_fluid" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_page_width_fluid">{{ $t('customize.navDrawer') }}</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                </div>
                                <!--end::Options-->
                            </div>
                            <!--end::Form group-->
                            <!--begin::Separator-->
                            <div class="separator separator-dashed my-5"></div>
                            <!--end::Separator-->
                            <!--begin::Form group-->
                            <div class="form-group">
                                <!--begin::Heading-->
                                <div class="d-flex flex-column mb-4">
                                    <h4 class="fw-bold text-gray-900"> {{ $t('customize.iconStyle') }} </h4>
                                </div>
                                <!--end::Heading-->
                                <!--begin::Options-->
                                <div class="d-flex flex-stack gap-3">
                                    <!--begin::Option-->
                                    <label :class="config.general.iconsType === 'duotone' && 'active'"
                                        class="form-check-image form-check-success w-100 parent-active parent-hover">
                                        <!--begin::Image-->
                                        <div
                                            class="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                                            <KTIcon icon-type="duotone" icon-name="picture"
                                                icon-class="fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700" />
                                            <span
                                                class="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">{{
                                                    $t('customize.duotone') }}</span>
                                        </div>
                                        <!--end::Image-->
                                        <!--begin::Check-->
                                        <div style="
                          visibility: hidden;
                          height: 0;
                          width: 0;
                          overflow: hidden;
                        ">
                                            <input v-model="config.general.iconsType" class="form-check-input"
                                                type="radio" value="duotone"
                                                :checked="config.general.iconsType === 'duotone'" name="duotone" />
                                        </div>
                                        <!--end::Check-->
                                    </label>
                                    <!--end::Option-->
                                    <!--begin::Option-->
                                    <label :class="config.general.iconsType === 'outline' && 'active'"
                                        class="form-check-image form-check-success w-100 parent-active parent-hover">
                                        <!--begin::Image-->
                                        <div
                                            class="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                                            <KTIcon icon-type="outline" icon-name="picture"
                                                icon-class="fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700" />
                                            <span
                                                class="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">{{
                                                    $t('customize.outline') }}</span>
                                        </div>
                                        <!--end::Image-->
                                        <!--begin::Check-->
                                        <div style="
                          visibility: hidden;
                          height: 0;
                          width: 0;
                          overflow: hidden;
                        ">
                                            <input v-model="config.general.iconsType" class="form-check-input"
                                                type="radio" value="outline" name="outline"
                                                :checked="config.general.iconsType === 'outline'" />
                                        </div>
                                        <!--end::Check-->
                                    </label>
                                    <!--end::Option-->
                                    <!--begin::Option-->
                                    <label :class="config.general.iconsType === 'solid' && 'active'"
                                        class="form-check-image form-check-success w-100 parent-active parent-hover">
                                        <!--begin::Image-->
                                        <div
                                            class="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                                            <KTIcon icon-type="solid" icon-name="picture"
                                                icon-class="fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700" />
                                            <span
                                                class="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">{{
                                                    $t('customize.solid') }}</span>
                                        </div>
                                        <!--end::Image-->
                                        <!--begin::Check-->
                                        <div style="
                          visibility: hidden;
                          height: 0;
                          width: 0;
                          overflow: hidden;
                        ">
                                            <input v-model="config.general.iconsType" class="form-check-input"
                                                type="radio" value="solid" name="solid"
                                                :checked="config.general.iconsType === 'solid'" />
                                        </div>
                                        <!--end::Check-->
                                    </label>
                                    <!--end::Option-->
                                </div>
                                <!--end::Options-->
                            </div>
                            <!--end::Form group-->
                            <!--begin::Separator-->
                            <div class="separator separator-dashed my-5"></div>
                            <!--end::Separator-->
                            <!--begin::Form group-->
                            <div class="form-group">
                                <!--begin::Heading-->
                                <div class="d-flex flex-column mb-4">
                                    <h4 class="fw-bold text-gray-900">{{ $t('customize.menuIcons') }}</h4>
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.selectSidebarIcon') }}
                                    </div>
                                </div>
                                <!--end::Heading-->
                                <!--begin::Options-->
                                <div class="d-flex">
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.sidebar.default.menu.iconType" class="form-check-input"
                                            type="radio" value="keenthemes" id="kt_builder_keenthemes_icons" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_keenthemes_icons">Keenthemes</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                    <!--begin::Check-->
                                    <div
                                        class="form-check form-check-custom form-check-success form-check-solid form-check-sm me-5">
                                        <input v-model="config.sidebar.default.menu.iconType" class="form-check-input"
                                            type="radio" value="bootstrap" id="kt_builder_bootstrap_icons" />
                                        <!--begin::Label-->
                                        <label class="form-check-label text-gray-700 fw-bold text-nowrap"
                                            for="kt_builder_bootstrap_icons">Bootstrap</label>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Check-->
                                </div>
                                <!--end::Options-->
                            </div>
                            <!--end::Form group-->
                            <!--begin::Separator-->
                            <div class="separator separator-dashed my-5"></div>
                            <!--end::Separator-->
                            <v-row>
                                <!--begin::Heading-->
                                <v-col cols="12" class="d-flex flex-column pb-0">
                                    <h4 class="fw-bold text-gray-900">{{ $t('customize.leftNav') }}</h4>
                                </v-col>
                                <!--end::Heading-->
                                <v-col cols="12" md="6" lg="4">
                                    <!--begin::Heading-->
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.selectBackgroundColor') }}
                                        <v-icon class="ml-6"
                                            @click="config.sidebar.default.color.backgroundColor = ''">mdi-lock-reset</v-icon>
                                    </div>
                                    <!--end::Heading-->
                                    <v-col class="d-flex justify-start px-0">
                                        <v-color-picker mode="hex"
                                            v-model="config.sidebar.default.color.backgroundColor"></v-color-picker>
                                    </v-col>
                                </v-col>
                                <v-col cols="12" md="6" lg="4">
                                    <!--begin::Heading-->
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.selectIconColor') }}
                                        <v-icon class="ml-6"
                                            @click="config.sidebar.default.color.iconColor = ''">mdi-lock-reset</v-icon>
                                    </div>
                                    <!--end::Heading-->
                                    <v-col class="d-flex justify-start px-0">
                                        <v-color-picker mode="hex" v-model="config.sidebar.default.color.iconColor">
                                        </v-color-picker>
                                    </v-col>
                                </v-col>
                            </v-row>
                            <!--begin::Separator-->
                            <div class="separator separator-dashed my-5"></div>
                            <!--end::Separator-->
                            <v-row>
                                <!--begin::Heading-->
                                <v-col cols="12" class="d-flex flex-column pb-0">
                                    <h4 class="fw-bold text-gray-900">{{ $t('customize.topNav') }}</h4>
                                </v-col>
                                <!--end::Heading-->
                                <v-col cols="12" md="6" lg="4">
                                    <!--begin::Heading-->
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.selectBackgroundColor') }}
                                        <v-icon class="ml-6"
                                            @click="config.header.default.color.backgroundColor = ''">mdi-lock-reset</v-icon>
                                    </div>
                                    <!--end::Heading-->
                                    <v-col class="d-flex justify-start px-0">
                                        <v-color-picker mode="hex"
                                            v-model="config.header.default.color.backgroundColor"></v-color-picker>
                                    </v-col>
                                </v-col>
                                <v-col cols="12" md="6" lg="4">
                                    <!--begin::Heading-->
                                    <div class="fs-7 fw-semibold text-muted">
                                        {{ $t('customize.selectIconColor') }}
                                        <v-icon class="ml-6"
                                            @click="config.header.default.color.iconColor = ''">mdi-lock-reset</v-icon>
                                    </div>
                                    <!--end::Heading-->
                                    <v-col class="d-flex justify-start px-0">
                                        <v-color-picker mode="hex" v-model="config.header.default.color.iconColor">
                                        </v-color-picker>
                                    </v-col>
                                </v-col>
                            </v-row>
                            <!--begin::Separator-->
                            <div class="separator separator-dashed my-5"></div>
                            <!--end::Separator-->
                            <!--begin::Form group-->
                            <div class="form-group">
                                <!--begin::Heading-->
                                <div class="mb-6">
                                    <h4 class="fw-bold text-gray-900">{{ $t('customize.layouts') }}</h4>
                                </div>
                                <!--end::Heading-->
                                <!--begin::Options-->
                                <div class="row gy-3" data-kt-buttons="true"
                                    data-kt-buttons-target=".form-check-image:not(.disabled),.form-check-input:not([disabled])"
                                    data-kt-initialized="1">
                                    <!--begin::Col-->
                                    <div class="col-6 col-md-3">
                                        <!--begin::Option-->
                                        <label class="form-check-image form-check-success"
                                            :class="[layoutType === 'dark-sidebar' && 'active']">
                                            <!--begin::Image-->
                                            <div class="form-check-wrapper">
                                                <img :src="getAssetPath('media/misc/layout/dark-sidebar.png')
                                                    " class="mw-100" alt="" />
                                            </div>
                                            <!--end::Image-->
                                            <!--begin::Check-->
                                            <div
                                                class="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                                                <input v-model="layoutType" class="form-check-input" type="radio"
                                                    value="dark-sidebar" name="layoutType" />
                                                <!--begin::Label-->
                                                <div class="form-check-label text-gray-700">
                                                    {{ $t('customize.darkSidebar') }}
                                                </div>
                                                <!--end::Label-->
                                            </div>
                                            <!--end::Check-->
                                        </label>
                                        <!--end::Option-->
                                    </div>
                                    <!--end::Col-->
                                    <!--begin::Col-->
                                    <div class="col-6 col-md-3">
                                        <!--begin::Option-->
                                        <label class="form-check-image form-check-success"
                                            :class="[layoutType === 'light-sidebar' && 'active']">
                                            <!--begin::Image-->
                                            <div class="form-check-wrapper">
                                                <img :src="getAssetPath('media/misc/layout/light-sidebar.png')
                                                    " class="mw-100" alt="" />
                                            </div>
                                            <!--end::Image-->
                                            <!--begin::Check-->
                                            <div
                                                class="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                                                <input v-model="layoutType" class="form-check-input" type="radio"
                                                    value="light-sidebar" name="layoutType" />
                                                <!--begin::Label-->
                                                <div class="form-check-label text-gray-700">
                                                    {{ $t('customize.lightSidebar') }}
                                                </div>
                                                <!--end::Label-->
                                            </div>
                                            <!--end::Check-->
                                        </label>
                                        <!--end::Option-->
                                    </div>
                                    <!--end::Col-->
                                    <!--begin::Col-->
                                    <div class="col-6 col-md-3">
                                        <!--begin::Option-->
                                        <label class="form-check-image form-check-success"
                                            :class="[layoutType === 'dark-header' && 'active']">
                                            <!--begin::Image-->
                                            <div class="form-check-wrapper">
                                                <img :src="getAssetPath('media/misc/layout/dark-header.png')
                                                    " class="mw-100" alt="" />
                                            </div>
                                            <!--end::Image-->
                                            <!--begin::Check-->
                                            <div
                                                class="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                                                <input v-model="layoutType" class="form-check-input" type="radio"
                                                    value="dark-header" name="layoutType" />
                                                <!--begin::Label-->
                                                <div class="form-check-label text-gray-700">
                                                    {{ $t('customize.darkHeader') }}
                                                </div>
                                                <!--end::Label-->
                                            </div>
                                            <!--end::Check-->
                                        </label>
                                        <!--end::Option-->
                                    </div>
                                    <!--end::Col-->
                                    <!--begin::Col-->
                                    <div class="col-6 col-md-3">
                                        <!--begin::Option-->
                                        <label class="form-check-image form-check-success"
                                            :class="[layoutType === 'light-header' && 'active']">
                                            <!--begin::Image-->
                                            <div class="form-check-wrapper">
                                                <img :src="getAssetPath('media/misc/layout/light-header.png')
                                                    " class="mw-100" alt="" />
                                            </div>
                                            <!--end::Image-->
                                            <!--begin::Check-->
                                            <div
                                                class="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                                                <input v-model="layoutType" class="form-check-input" type="radio"
                                                    value="light-header" name="layoutType" />
                                                <!--begin::Label-->
                                                <div class="form-check-label text-gray-700">
                                                    {{ $t('customize.lightHeader') }}
                                                </div>
                                                <!--end::Label-->
                                            </div>
                                            <!--end::Check-->
                                        </label>
                                        <!--end::Option-->
                                    </div>
                                    <!--end::Col-->
                                </div>
                                <!--end::Options-->
                            </div>
                            <!--end::Form group-->
                        </div>
                        <!--end::Card body-->
                    </form>
                    <!--end::Form-->
                </div>
                <!--end::Content-->
            </div>
            <!--end::Card body-->
            <!--begin::Card footer-->
            <div class="card-footer border-0 d-flex gap-3 pb-9 pt-0" id="kt_app_layout_builder_footer">
                <button type="button" @click="submit" id="kt_app_layout_builder_preview"
                    class="btn btn-primary flex-grow-1 fw-semibold">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">{{ $t('general.preview') }}</span>
                    <!--end::Indicator label-->
                </button>
                <button @click="reset" type="button" id="kt_app_layout_builder_reset"
                    class="btn btn-light flex-grow-1 fw-semibold">
                    <!--begin::Indicator label-->
                    <span class="indicator-label">{{ $t('general.reset') }}</span>
                    <!--end::Indicator label-->
                    <!--begin::Indicator progress-->
                    <span class="indicator-progress"> {{ $t('general.pleaseWait') }}
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                    <!--end::Indicator progress-->
                </button>
            </div>
            <!--end::Card footer-->
        </div>
        <!--end::Card-->
    </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { config, layout, themeMode } from "@/layouts/default-layout/config/helper";
import { LS_CONFIG_NAME_KEY, useConfigStore } from "@/stores/config";
import { useTheme } from 'vuetify';
import { useThemeStore } from "@/stores/theme";
import { isMobileApp } from "@/assets/ts/_utils";

export default defineComponent({
    name: "customize-layout",
    components: {},
    setup() {
        const storeConfig = useConfigStore();
        const storeTheme = useThemeStore();
        const theme = useTheme();
        const leftNavigationColor = ref("#1976D2");
        const layoutType = ref(layout.value);

        /**
         * Reset config
         * @param e
         */
        const reset = (e: Event) => {
            e.preventDefault();
            // remove existing saved config
            localStorage.removeItem(LS_CONFIG_NAME_KEY);
            window.location.reload();
        };

        const onThemeModeChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            storeConfig.setLayoutConfigProperty("general.mode", target.value);
            storeTheme.setThemeMode(target.value as "dark" | "light" | "system");
            theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'

            // save new config to localStorage
            localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
        };

        /**
         * Submit form
         * @param event
         */
        const submit = (event: Event) => {
            event.preventDefault();
            storeConfig.setLayoutConfigProperty("general.layout", layoutType);
            // save new config to localStorage
            localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
            window.location.reload();
        };

        return {
            reset,
            onThemeModeChange,
            submit,
            config,
            layoutType,
            leftNavigationColor,
            themeMode,
            isMobileApp,
            getAssetPath,
        };
    },
});
</script>
