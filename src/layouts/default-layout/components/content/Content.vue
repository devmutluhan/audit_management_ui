<template>
  <div id="kt_app_content" class="app-content flex-column-fluid fill-height">
    <!--begin::Content container-->
    <div id="kt_app_content_container" class="app-container fill-height" style="justify-content: center !important;"
      :class="{
        'container-fluid': contentWidthFluid,
        'container-xxl': !contentWidthFluid,
      }">
      <RouterView></RouterView>
    </div>
    <!--end::Content container-->
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { contentWidthFluid } from "@/layouts/default-layout/config/helper";
import { RouterView } from "vue-router";
import { watchWidth } from "@/core/helpers/contentWidth";

const div = ref(null as any);
onMounted(() => {
  nextTick(() => {
    div.value = document.getElementById('kt_app_content_container') as HTMLElement | null;
    if (div.value) {
      watchWidth(div.value);
    }
  });
})

</script>