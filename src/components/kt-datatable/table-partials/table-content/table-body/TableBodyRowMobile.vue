<template>
  <v-row class="tdMobile">
    <v-col v-for="(row, i) in data" :key="i" cols="12" md="6" lg="4">

      <v-card :link="false" class="mobile-data-card mb-2" :class="getCardClass(row)" rounded="lg"
        @click="handleCardClick(row)">
        <div class="status-strip" :class="{ 'active': isSelected(row) }"></div>

        <div class="d-flex justify-space-between align-center px-4 pt-3 pb-2">
          <div v-if="checkboxEnabled" class="d-flex align-center" @click.stop>
            <v-checkbox-btn :model-value="isSelected(row)" color="primary" density="compact" hide-details
              @update:model-value="selectItem(row)"></v-checkbox-btn>
          </div>

          <v-spacer v-else></v-spacer>

          <div v-if="header.some((a) => a.columnLabel == 'actions')" @click.stop>
            <slot :name="`actions`" :row="row"></slot>
          </div>
        </div>

        <v-divider class="mx-4 mt-0 mb-2 opacity-20"></v-divider>

        <v-card-text class="pt-0 pb-4 px-4" @click="rowDoubleClickedFunc(row)">
          <template v-for="(properties, j) in header" :key="j">

            <div v-if="properties.columnLabel !== 'actions'"
              class="data-row d-flex justify-space-between align-center py-2">

              <span class="text-caption text-medium-emphasis font-weight-bold text-uppercase mr-2">
                {{ properties.columnName ? $t(properties.columnName) : '' }}
              </span>

              <div class="text-body-2 font-weight-medium text-high-emphasis text-right text-truncate-multiline">
                <slot v-if="!properties.valueFormatter" :name="`${properties.columnLabel}`" :row="row">
                  {{ columnSplit(row, properties.columnLabel) ?? '--' }}
                </slot>
                <slot v-else :name="`${properties.columnLabel}`" :row="row">
                  {{ properties.valueFormatter(row) }}
                </slot>
              </div>

            </div>

            <v-divider v-if="j < header.length - 2 && properties.columnLabel !== 'actions'"
              class="border-style-dashed my-1"></v-divider>
          </template>
        </v-card-text>

      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "table-body-row-mobile",
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

    // Helper: Değeri parçalama
    const columnSplit = (row: any, columnLabel: string) => {
      if (columnLabel.includes('.')) {
        const [first, ...rest] = columnLabel.split('.');
        return row[first] ? row[first][rest.join('.')] : '-';
      } else if (columnLabel.includes('+')) {
        const [firstValue, secondValue] = columnLabel.split('+').map(v => v.trim());
        return `${row[firstValue]} ${row[secondValue]}`;
      }
      return row[columnLabel];
    };

    // Watcher: Dışarıdan gelen seçimleri senkronize et
    watch(() => props.currentlySelectedItems, (newVal) => {
      selectedItems.value = [...new Set(newVal)];
    }, { deep: true });

    // Seçim değiştiğinde emit et
    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    const rowDoubleClickedFunc = (item: any) => {
      emit('rowDoubleClicked', item);
    };

    // Satırın seçili olup olmadığını kontrol et
    const isSelected = (row: any) => {
      return selectedItems.value.includes(row[props.checkboxLabel]);
    };

    // Seçim işlemi
    const selectItem = (row: any) => {
      if (!props.checkboxEnabled) return;

      const val = row[props.checkboxLabel];
      if (selectedItems.value.includes(val)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== val);
      } else {
        selectedItems.value.push(val);
      }
      onChange();
    };

    // Kartın tamamına tıklandığında (Checkbox enabled ise seçim yapar)
    const handleCardClick = (row: any) => {
      if (props.checkboxEnabled) {
        selectItem(row);
      }
    };

    // Dinamik Kart Class'ları
    const getCardClass = (row: any) => {
      const isRowSelected = isSelected(row);
      let classes = ['transition-swing'];

      // Seçili ise özel stil
      if (isRowSelected) {
        classes.push('bg-blue-lighten-5'); // Vuetify renk sınıfı örneği (customize edilebilir)
        classes.push('border-primary'); // Seçiliyse border rengi
      } else {
        classes.push('bg-surface');
      }

      // Custom Row Color logic (Header'dan gelen)
      const colorRule = props.header.find((a) => a.rowColor === true);
      if (colorRule && colorRule.rowColorFunc) {
        // Eğer custom bir renk fonksiyonu varsa buraya eklenebilir
        // classes.push(colorRule.rowColorFunc(row)); 
      }

      return classes.join(' ');
    };

    return {
      selectedItems,
      rowDoubleClickedFunc,
      selectItem,
      columnSplit,
      getCardClass,
      isSelected,
      handleCardClick
    };
  },
});
</script>

<style scoped>
/* Kart Genel Yapısı */
.mobile-data-card {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
  /* Hafif border */
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  /* Strip taşmasın diye */
}

/* Seçili Olduğunda Kart Efekti */
.mobile-data-card.border-primary {
  border: 1px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15) !important;
}

/* Sol Taraftaki Durum Çubuğu */
.status-strip {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: transparent;
  transition: background-color 0.2s;
  z-index: 1;
}

.status-strip.active {
  background-color: rgb(var(--v-theme-primary));
}

/* Metinlerin çok uzun olması durumunda ... ile bitmesi için */
.text-truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 2 satıra kadar izin ver */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: right;
  word-break: break-word;
}

/* Kesikli Çizgi Stili */
.border-style-dashed {
  border-style: dashed !important;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  opacity: 0.4;
}
</style>