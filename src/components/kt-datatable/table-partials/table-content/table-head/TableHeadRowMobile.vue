<template>
  <v-sheet class="d-flex align-center mb-2" color="transparent">
    <v-col cols="auto" class="d-flex align-center" v-if="checkboxEnabled">
      <div class="form-check form-check-sm form-check-custom form-check-solid me-3 px-2">
        <input class="form-check-input" type="checkbox" v-model="checked" @change="selectAll()" />
        <v-label class="ml-2">{{ $t('general.selectAll') }}</v-label>
      </div>
    </v-col>
    <v-spacer></v-spacer>
    <v-col class="pa-0" cols="auto" align="end">
      <TableNavDrawerFilter :header="header"></TableNavDrawerFilter>
    </v-col>
  </v-sheet>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import TableNavDrawerFilter from "@/components/kt-datatable/table-partials/table-content/table-head/TableNavDrawerFilter.vue";
import { config } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "table-head-row-mobile",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    header: { type: Array as () => Array<any>, required: true },
  },
  emits: ["on-select", "on-sort"],
  components: {
    TableNavDrawerFilter
  },
  setup(props, { emit }) {
    const checked = ref<boolean>(false);

    const columnLabelAndOrder = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });

    onMounted(() => {
      emit("on-sort", columnLabelAndOrder.value);
    });

    watch(() => props.checkboxEnabledValue, (currentValue) => {
      checked.value = currentValue;
    });

    const selectAll = () => {
      emit("on-select", checked.value);
    };

    const onSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.label === label) {
          if (columnLabelAndOrder.value.order === "asc") {
            columnLabelAndOrder.value.order = "desc";
          } else {
            if (columnLabelAndOrder.value.order === "desc") {
              columnLabelAndOrder.value.order = "asc";
            }
          }
        } else {
          columnLabelAndOrder.value.order = "asc";
          columnLabelAndOrder.value.label = label;
        }
        emit("on-sort", columnLabelAndOrder.value);
      }
    };

    const sortArrow = computed(() => {
      return columnLabelAndOrder.value.order === "asc"
        ? "&#x2191;"
        : "&#x2193;";
    });

    return {
      onSort,
      selectAll,
      checked,
      sortArrow,
      config,
      columnLabelAndOrder,
    };
  },
});
</script>
