<template>
  <div class="d-flex align-items-center justify-content-between flex-wrap w-100 mb-5 mb-lg-0 px-4">
    <div class="d-flex flex-column align-items-start me-3">
      <template v-if="pageTitle">
        <div class="d-flex align-items-center mb-1">
          <v-icon v-if="backRoute" class="position-absolute ml-n6" color="pageTitleColor">mdi-chevron-left</v-icon>
          <router-link v-if="backRoute" class="d-flex align-items-center text-hover-primary me-2"
            :to="{ name: backRoute }">
            <p class="d-flex text-pageTitleColor fw-bold fs-3 flex-column justify-content-center my-0">
              {{ $t('menu.' + pageTitle) }}
            </p>
          </router-link>
          <p v-else class="d-flex text-pageTitleColor fw-bold fs-3 flex-column justify-content-center my-0">
            {{ $t('menu.' + pageTitle) }}
          </p>
        </div>
        <ul v-if="breadcrumbs" class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
          <template v-for="(item, i) in breadcrumbs" :key="i">
            <li class="breadcrumb-item" v-if="i > 0">
              <span class="bullet bg-gray-400 w-5px h-2px"></span>
            </li>
            <li class="breadcrumb-item text-muted text-breadcrumbsColor">{{ $t('menu.' + item) }}</li>
          </template>
        </ul>
      </template>
    </div>
    <div id="kt_page_title_actions">
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  pageTitleDirection,
  pageTitleDisplay,
} from "@/layouts/default-layout/config/helper";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "layout-page-title",
  components: {},
  setup() {
    const route = useRoute();

    const pageTitle = computed(() => {
      return route.meta.pageTitle;
    });

    const backRoute = computed(() => {
      return route.meta.backRoute as any;
    });

    const breadcrumbs = computed(() => {
      return route.meta.breadcrumbs;
    });

    return {
      pageTitle,
      breadcrumbs,
      backRoute,
      pageTitleDisplay,
      pageTitleDirection,
    };
  },
});
</script>