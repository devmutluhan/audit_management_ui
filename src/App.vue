<template>
  <RouterView />
  <ResponseResultPage />
  <!-- <ConsoleLogs /> -->
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, watch } from "vue";
import { RouterView } from "vue-router";
import ResponseResultPage from "@/components/dialogs/ResponseResultPage.vue";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useBodyStore } from "@/stores/body";
import { themeConfigValue } from "@/layouts/default-layout/config/helper";
import { initializeComponents } from "@/core/plugins/keenthemes";
import { useTheme } from 'vuetify';
import { userInfo } from "./core/helpers/localStorageManagement";
import { useEmployeeDtoStore } from "./stores/humanResourcesStores/employeeDtoStore";
import ConsoleLogs from "@/components/defaultComponents/ConsoleLogs.vue";
import { sendMessageToFlutter } from "./core/helpers/generalUtils";

export default defineComponent({
  name: "app",
  components: {
    RouterView,
    ConsoleLogs,
    ResponseResultPage
  },
  setup() {
    const configStore = useConfigStore();
    const themeStore = useThemeStore();
    const bodyStore = useBodyStore();

    onBeforeMount(() => {
      /**
       * Overrides the layout config using saved data from localStorage
       * remove this to use static config (@/layouts/default-layout/config/DefaultLayoutConfig.ts)
       */
      configStore.overrideLayoutConfig();

      /**
       *  Sets a mode from configuration
       */

      const theme = useTheme();

      theme.global.name.value = themeConfigValue.value == 'dark' ? 'dark' : 'light';

      themeStore.setThemeMode(themeConfigValue.value);
      sendMessageToFlutter('themeMode', theme.global.name.value)
    });

    const getEmployeeDetail = () => {
      if (!userInfo.value.employeeDetail?.id && userInfo.value.employeeId) {
        useEmployeeDtoStore().getEmployeeDetail(userInfo.value.employeeId);
      }
    }

    watch(() => userInfo.value, () => {
      getEmployeeDetail();
    })

    onMounted(() => {
      nextTick(() => {
        initializeComponents();
        getEmployeeDetail();
        bodyStore.removeBodyClassName("page-loading");
      });
    });
  },
});
</script>

<style lang="scss">
@import "bootstrap-icons/font/bootstrap-icons.css";
@import "apexcharts/dist/apexcharts.css";
@import "quill/dist/quill.snow.css";
@import "nouislider/dist/nouislider.css";
@import "animate.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";
@import "line-awesome/dist/line-awesome/css/line-awesome.css";
@import "dropzone/dist/dropzone.css";
@import "prism-themes/themes/prism-shades-of-purple.css";

// Main demo style scss
@import "assets/keenicons/duotone/style.css";
@import "assets/keenicons/outline/style.css";
@import "assets/keenicons/solid/style.css";
@import "assets/sass/plugins";
@import "assets/sass/style";

#app {
  display: contents;
}
</style>