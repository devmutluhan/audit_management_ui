<template>
  <!--begin::Toolbar-->
  <div id="kt_app_toolbar" class="app-toolbar pt-2 pt-lg-4 mt-2">
    <!--begin::Toolbar container-->
    <div id="kt_app_toolbar_container" class="app-container d-flex flex-stack" :class="{
      'container-fluid': toolbarWidthFluid,
      'container-xxl': !toolbarWidthFluid,
    }">
      <KTPageTitle />
    </div>
    <!--end::Toolbar container-->
  </div>
  <div id="kt_page_tabs_actions" class="pl-5 pl-md-9">
  </div>
  <v-divider></v-divider>
  <!--end::Toolbar-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toolbarWidthFluid } from "@/layouts/default-layout/config/helper";
import KTPageTitle from "@/layouts/default-layout/components/toolbar/PageTitle.vue";

export default defineComponent({
  name: "layout-toolbar",
  components: {
    KTPageTitle,
  },
  setup() {
    return {
      toolbarWidthFluid,
    };
  },
});
</script>