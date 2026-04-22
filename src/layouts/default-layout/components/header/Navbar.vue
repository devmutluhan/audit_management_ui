<template>
  <!--begin::Navbar-->
  <div class="app-navbar flex-shrink-0">
    <!--begin::Search-->
    <!-- <div class="app-navbar-item align-items-stretch ms-1 ms-md-4">
      <KTSearch />
    </div> -->
    <!--end::Search-->
    <!--begin::Notifications-->
    <div class="app-navbar-item ms-1 ms-md-4">
      <v-menu class="w-350px w-lg-375px h-50" :close-on-content-click="false">
        <template v-slot:activator="{ props: activatorProps }">
          <!-- <v-badge location="top right" color="warning" :content="dashboardItems.notificationCount"
            v-if="dashboardItems.notificationCount > 0">
            <v-btn icon v-bind="activatorProps" variant="text" size="35">
              <KTIcon icon-name="notification-status" icon-class="fs-2" :style="{ color: headerIconColor }" />
            </v-btn>
          </v-badge> -->
          <v-btn icon v-bind="activatorProps" variant="text" size="40">
            <KTIcon icon-name="notification-status" icon-class="fs-2" :style="{ color: headerIconColor }" />
          </v-btn>
        </template>

        <NotificationsMenu />
      </v-menu>
    </div>

    <!--begin::Theme mode-->
    <div class="app-navbar-item ms-1 ms-md-3">
      <!--begin::Menu toggle-->
      <a href="#"
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}" data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end">
        <KTIcon v-if="themeMode === 'light'" icon-name="night-day" icon-class="fs-2"
          :style="{ color: headerIconColor }" />
        <KTIcon v-else icon-name="moon" icon-class="fs-2" :style="{ color: headerIconColor }" />
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher />
    </div>
    <!--end::Theme mode-->

    <!--begin::User menu-->
    <div class="app-navbar-item ms-1 ms-md-4" id="kt_header_user_menu_toggle">
      <!--begin::Menu wrapper-->
      <div class="cursor-pointer symbol symbol-35px" :style="{ color: headerIconColor }"
        data-kt-menu-trigger="{default: 'click', lg: 'hover'}" data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end">
        <img :src="getGeneralProfilePhoto()" class="rounded-3" alt="user" />
      </div>
      <KTUserMenu />
      <!--end::Menu wrapper-->
    </div>
    <!--end::User menu-->
    <!--begin::Header menu toggle-->
    <div class="app-navbar-item d-lg-none ms-2 me-n2">
      <div class="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px" id="kt_app_header_menu_toggle">
        <KTIcon icon-name="element-4" icon-class="fs-2" :style="{ color: headerIconColor }" />
      </div>
    </div>
    <!--end::Header menu toggle-->
  </div>
  <!--end::Navbar-->
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import NotificationsMenu from "@/layouts/default-layout/components/menus/NotificationsMenu.vue";
// import KTSearch from "@/layouts/default-layout/components/search/Search.vue";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";
import KTUserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
import { ThemeModeComponent } from "@/assets/ts/layout";
import { useThemeStore } from "@/stores/theme";
import { headerIconColor } from "@/layouts/default-layout/config/helper";
import { userInfo } from "@/core/helpers/localStorageManagement";
import { getGeneralProfilePhoto } from "@/core/helpers/assets";
import { storeToRefs } from "pinia";
import { useGeneralStore } from "@/stores/generalStores/generalStore";

export default defineComponent({
  name: "header-navbar",
  components: {
    NotificationsMenu,
    KTUserMenu,
    // KTSearch,
    KTThemeModeSwitcher
  },
  setup() {
    const store = useThemeStore();
    const { dashboardItems } = storeToRefs(useGeneralStore());
    const themeMode = computed(() => {
      if (store.mode === "system") {
        return ThemeModeComponent.getSystemMode();
      }
      return store.mode;
    });

    return {
      themeMode,
      headerIconColor,
      userInfo,
      dashboardItems,
      getGeneralProfilePhoto
    };
  },
});
</script>
