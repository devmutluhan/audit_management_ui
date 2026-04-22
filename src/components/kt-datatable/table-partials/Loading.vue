<template>
  <div class="d-flex align-center justify-center overlay-layer card-rounded bg-dark bg-opacity-5"
    style="min-height: 70vh;">
    <div class="d-flex flex-column justify-center align-center h-100 py-10">
      <v-progress-circular :size="60" :width="6" color="primary" indeterminate></v-progress-circular>
      <span class="mt-4 text-grey text-caption font-weight-medium">
        {{ $t('general.loading') }}...
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "kt-loading",
  components: {},
});
</script>
