<template>
  <!--begin::sidebar-->
  <div v-if="displaySidebar" ref="sidebarRef" id="kt_app_sidebar" class="app-sidebar flex-column" data-kt-drawer="true"
    :style="{ backgroundColor: sidebarBackgroundColor }" data-kt-drawer-name="app-sidebar"
    data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px"
    data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
    <KTSidebarLogo :sidebar-ref="sidebarRef" :menuColor="menuColor()"></KTSidebarLogo>
    <KTSidebarMenu :menuColor="menuColor()"></KTSidebarMenu>
  </div>
  <!--end::sidebar-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { displaySidebar, sidebarBackgroundColor, sidebarIconColor } from "@/layouts/default-layout/config/helper";
import KTSidebarLogo from "@/layouts/default-layout/components/sidebar/SidebarLogo.vue";
import KTSidebarMenu from "@/layouts/default-layout/components/sidebar/SidebarMenu.vue";
import { useConfigStore } from "@/stores/config";

export default defineComponent({
  name: "theme-sidebar",
  components: {
    KTSidebarLogo,
    KTSidebarMenu,
  },
  setup() {
    const sidebarRef = ref<HTMLFormElement | null>(null);

    const menuColor = () => {
      if (sidebarIconColor.value) {
        return sidebarIconColor.value
      } else {
        let config = useConfigStore().getLayoutConfig('general.layout');
        let themeMode = useConfigStore().getLayoutConfig('general.mode');
        if (config == 'dark-sidebar')
          return '#9A9CAE'
        else if (themeMode == 'dark')
          return '#9A9CAE'
        else
          return '#1E1B8E'
      }
    }

    return {
      displaySidebar,
      sidebarBackgroundColor,
      sidebarRef,
      menuColor
    };
  },
});
</script>
