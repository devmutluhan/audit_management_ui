<template>
  <tbody class="fw-semibold">
    <template v-for="(row, i) in data" :key="i">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <tr v-bind="hover ? props : null" @dblclick="rowDoubleClickedFunc(row)"
            @click="checkboxEnabled ? selectItem(row) : null" :class="getRowClass(row, i, isHovering)">
            <td class="pa-2" v-if="checkboxEnabled">
              <div class="form-check form-check-sm form-check-custom form-check-solid px-2">
                <input class="form-check-input" type="checkbox" :value="row[checkboxLabel]" v-model="selectedItems"
                  @change="onChange" />
              </div>
            </td>
            <template v-for="(properties, j) in header" :key="j">
              <td class="pa-2 text-rowTextColor">
                <slot v-if="!properties.valueFormatter" :name="`${properties.columnLabel}`" :row="row">
                  {{ columnSplit(row, properties.columnLabel) }}
                </slot>
                <slot v-else :name="`${properties.columnLabel}`" :row="row">
                  {{ properties.valueFormatter(row) }}
                </slot>
              </td>
            </template>
          </tr>
        </template>
      </v-hover>
    </template>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "table-body-row",
  components: {},
  props: {
    header: { type: Array as () => Array<any>, required: true },
    data: { type: Array as () => Array<any>, required: true },
    hover: { type: Boolean, required: false },
    currentlySelectedItems: { type: Array, required: false, default: () => [] },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: {
      type: String as () => string,
      required: false,
      default: "id",
    },
  },
  emits: ["on-select", "rowDoubleClicked"],
  setup(props, { emit }) {
    const selectedItems = ref<Array<any>>([]);

    const columnSplit = (row: any, columnLabel: string) => {
      if (columnLabel.includes('.')) {
        const [first, ...rest] = columnLabel.split('.');
        if (row[first]) {
          return row[first][rest.join('.')]
        } else {
          return '-'
        }
      } else if (columnLabel.includes('+')) {
        const firstValue = columnLabel.split('+')[0].trim();
        const secondValue = columnLabel.split('+')[1].trim();
        return row[firstValue] + " " + row[secondValue];
      } else
        return row[columnLabel];
    };

    watch(() => [...props.currentlySelectedItems], (currentValue) => {
      if (props.currentlySelectedItems.length !== 0) {
        selectedItems.value = [
          ...new Set([...currentValue]),
        ];
      } else {
        selectedItems.value = [];
      }
    });

    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    const selectItem = (row: any) => {
      const val = row[props.checkboxLabel];

      if (selectedItems.value.includes(val)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== val);
      } else {
        selectedItems.value.push(val);
      }

      onChange();
    };

    const rowDoubleClickedFunc = (item) => {
      emit('rowDoubleClicked', item)
    }

    const rowClickSelect = (id: any) => {
      if (selectedItems.value.some((item) => item === id)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== id);
      } else {
        selectedItems.value.push(id);
      }
    };

    const getRowClass = (row: any, index: number, isHovering: boolean | null) => {
      // 1. Öncelik: Mouse üzerindeyse (Hover)
      if (isHovering) {
        return 'bg-hoverRowColor';
      }

      // 2. Öncelik: Satır seçiliyse (ve hover değilse - yukarıdaki if bunu sağlar)
      if (selectedItems.value.includes(row[props.checkboxLabel])) {
        // Herhangi bir validasyon kuralı belirlenmişse
        if (props.header.some((a) => a.rowColor == true)) {
          let headerRow = props.header.find((a) => a.rowColor == true);
          if (headerRow.rowColorFunc(row))
            return headerRow.rowColorFunc(row)
          else
            return 'bg-selectedRowColor';
        } else {
          return 'bg-selectedRowColor';
        }
      }

      // 3. Öncelik: Tek/Çift satır (Striped)
      if (index % 2 === 1) {
        return 'bg-pairRowBgColor'; // Tek sayılar
      } else {
        return 'bg-singleRowBgColor'; // Çift sayılar
      }
    };
    return {
      selectedItems,
      rowDoubleClickedFunc,
      onChange,
      selectItem,
      rowClickSelect,
      columnSplit,
      getRowClass
    };
  },
});
</script>