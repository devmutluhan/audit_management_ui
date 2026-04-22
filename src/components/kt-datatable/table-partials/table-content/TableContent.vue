<template>
  <div :class="loading ? 'fill-height' : ''">
    <v-sheet color="headerBgColor">
      <v-col v-if="config.general.tableFilter == 'navDrawer' && isFilterActive && !isHeadRowFilter" align="end"
        cols="12" class="pa-2">
        <TableNavDrawerFilter :header="header"></TableNavDrawerFilter>
      </v-col>
    </v-sheet>
    <div class="table-responsive" style="overflow-y: hidden;" :class="loading ? 'fill-height' : ''">
      <table :class="[loading && 'overlay overlay-block']"
        class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
        <TableHeadRow style="position: sticky; top:0; z-index:999" @onSort="onSort" @onSelect="selectAll"
          :checkboxEnabledValue="check" :checkboxEnabled="checkboxEnabled" :sort-label="sortLabel"
          :isHeadRowFilter="isHeadRowFilter" :sort-order="sortOrder" :header="header" />
        <TableBodyRow v-if="data.length !== 0" :hover="hover" @onSelect="itemsSelect"
          :currentlySelectedItems="currentlySelectedItems" @rowDoubleClicked="rowDoubleClickedFunc($event)" :data="data"
          :header="header" :checkbox-enabled="checkboxEnabled" :checkbox-label="checkboxLabel">
          <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
            <slot :name="name" :row="item" />
          </template>
        </TableBodyRow>
        <template v-else-if="!loading">
          <tr class="odd">
            <td :colspan="header.length + 4" class="dataTables_empty">
              <v-row class="d-flex justify-left">
                <v-col cols="12" align="center">
                  <v-alert type="info" color="alertIconColor" variant="outlined">
                    {{ $t(emptyTableText) }}
                  </v-alert>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
        <Loading v-if="loading" />
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { config } from "@/layouts/default-layout/config/helper";
import TableNavDrawerFilter from "@/components/kt-datatable/table-partials/table-content/table-head/TableNavDrawerFilter.vue";

export default defineComponent({
  name: "table-body",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    emptyTableText: { type: String, default: "No data found" },
    hover: { type: Boolean, required: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    currentlySelectedItems: { type: Array<String>, required: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
    isHeadRowFilter: { type: Boolean, required: false, default: false },
  },
  emits: ["on-sort", "on-items-select", "rowDoubleClicked"],
  components: {
    TableHeadRow,
    TableBodyRow,
    Loading,
    TableNavDrawerFilter
  },
  setup(props, { emit }) {
    const selectedItems = ref<Array<unknown>>([]);
    const allSelectedItems = ref<Array<unknown>>([]);
    const check = ref<boolean>(false);

    watch(() => props.data, () => {
      if (props.currentlySelectedItems && props.currentlySelectedItems.length > 0) {
        selectedItems.value = [
          ...new Set([...props.currentlySelectedItems]),
        ];
        allSelectedItems.value = [];
        let checkValue = true
        props.data.forEach((item: any) => {
          if (!selectedItems.value.includes(item[props.checkboxLabel])) {
            checkValue = false
          }
          if (item[props.checkboxLabel]) {
            allSelectedItems.value.push(item[props.checkboxLabel]);
          }
        });
        check.value = checkValue;
      } else {
        setAllFirstSelectedItems()
      }
    });

    const setAllFirstSelectedItems = () => {
      selectedItems.value = [];
      allSelectedItems.value = [];
      check.value = false;
      props.data.forEach((item: any) => {
        if (item[props.checkboxLabel]) {
          allSelectedItems.value.push(item[props.checkboxLabel]);
        }
      });
    }

    const rowDoubleClickedFunc = (item) => {
      emit('rowDoubleClicked', item)
    }

    const selectAll = (checked: any) => {
      check.value = checked;
      if (checked) {
        selectedItems.value = [
          ...new Set([...selectedItems.value, ...allSelectedItems.value]),
        ];
      } else {
        const items = selectedItems.value.filter((a) => !allSelectedItems.value.includes(a));
        selectedItems.value = [
          ...new Set([...items]),
        ];
      }
    };

    const itemsSelect = (value: any) => {
      selectedItems.value = [];
      value.forEach((item: any) => {
        if (!selectedItems.value.includes(item)) selectedItems.value.push(item);
      });
      let checkValue = true
      props.data.forEach((item: any) => {
        if (!selectedItems.value.includes(item[props.checkboxLabel])) {
          checkValue = false
        }
      });
      check.value = checkValue;
    };

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    watch(() => [...selectedItems.value], (currentValue, oldValue) => {
      if (currentValue && (oldValue.length !== 0 || currentValue.length !== 0)) {
        emit("on-items-select", currentValue);
      }
    });

    const isFilterActive = computed(() => {
      return props.header.some((a: any) => a.filterEnabled);
    })

    onMounted(() => {
      setAllFirstSelectedItems();
    });

    return {
      onSort,
      selectedItems,
      selectAll,
      itemsSelect,
      rowDoubleClickedFunc,
      check,
      isFilterActive,
      config
    };
  },
});
</script>
