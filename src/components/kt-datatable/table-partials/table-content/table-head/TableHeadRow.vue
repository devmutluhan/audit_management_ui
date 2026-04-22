<template>
  <thead style="border-bottom: 1px solid #E0E0E0;" class="bg-headerBgColor">
    <tr class="text-start fw-bold fs-7 text-uppercase gs-0">
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div class="form-check form-check-sm form-check-custom form-check-solid me-3 px-2">
          <input class="form-check-input" type="checkbox" v-model="checked" @change="selectAll()" />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th v-if="(column.visible !== false && config.general.tableFilter == 'navDrawer') && !isHeadRowFilter" :style="{
          minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
          width: 'auto',
        }" class="px-0 py-2">
          <v-col cols="12">
            <v-row class="d-flex align-center" style="height: 42.5px;">
              <v-col cols="9" class="text-truncate text-headerTextColor"
                @click="onSort(column.columnLabel, column.sortEnabled)"
                :style="{ cursor: column.sortEnabled ? 'pointer' : 'auto' }">
                {{ column.columnName ? $t(column.columnName) : '' }}
                <span v-if="columnLabelAndOrder.label === column.columnLabel &&
                  column.sortEnabled
                " v-html="sortArrow">
                </span>
              </v-col>
            </v-row>
          </v-col>
        </th>
        <th v-if="(column.visible !== false && config.general.tableFilter == 'unVisible') && !isHeadRowFilter" :style="{
          minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
          width: 'auto',
        }" class="px-0 py-2">
          <v-col cols="12">
            <v-row class="d-flex align-center" style="height: 42.5px;">
              <v-col cols="9" class="text-truncate text-headerTextColor"
                @click="onSort(column.columnLabel, column.sortEnabled)"
                :style="{ cursor: column.sortEnabled ? 'pointer' : 'auto' }">
                {{ column.columnName ? $t(column.columnName) : '' }}
                <span v-if="columnLabelAndOrder.label === column.columnLabel &&
                  column.sortEnabled
                " v-html="sortArrow">
                </span>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="3" align="end" v-if="column.filterEnabled && column.filterOption"
                :style="{ cursor: column.filterEnabled ? 'pointer' : 'auto' }">
                <TableColumnFilter :filterOption="column.filterOption" :column="column"></TableColumnFilter>
              </v-col>
            </v-row>
          </v-col>
        </th>
        <th v-if="(column.visible !== false && config.general.tableFilter == 'visible') || isHeadRowFilter" :style="{
          minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
          width: 'auto',
          alignContent: 'baseline'
        }" class="px-0 py-2">
          <v-col cols="12" style="max-height: 120px;">
            <v-row class="d-flex align-center">
              <v-col cols="12" class="text-truncate" :class="header.some((a) => a.filterEnabled) ? 'pb-0' : ''"
                @click="onSort(column.columnLabel, column.sortEnabled)"
                :style="{ cursor: column.sortEnabled ? 'pointer' : 'auto' }">
                {{ column.columnName ? $t(column.columnName) : '' }}
                <span v-if="columnLabelAndOrder.label === column.columnLabel &&
                  column.sortEnabled
                " v-html="sortArrow">
                </span>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="d-flex align-center" v-if="header.some((a) => a.filterEnabled)">
              <v-col cols="12" class="pt-1" v-if="column.filterOption"
                :style="{ cursor: column.filterEnabled ? 'pointer' : 'auto' }">
                <TableColumnHeadFilter :filterOption="column.filterOption" :column="column"></TableColumnHeadFilter>
              </v-col>
              <v-col cols="12" class="pt-1" v-else :style="{ cursor: column.filterEnabled ? 'pointer' : 'auto' }">
                <v-text-field v-if="!filterColumnLabels.includes(column.columnLabel)" disabled></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import TableColumnFilter from "@/components/dropdown/TableColumnFilter.vue";
import TableColumnHeadFilter from "@/components/dropdown/TableColumnHeadFilter.vue";
import { config } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    isHeadRowFilter: { type: Boolean, required: false, default: false },
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
    TableColumnFilter,
    TableColumnHeadFilter
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

    const filterColumnLabels = ['imageUrl', 'avatar', 'avatarUrl', 'image']

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
      filterColumnLabels,
      config,
      columnLabelAndOrder,
    };
  },
});
</script>
