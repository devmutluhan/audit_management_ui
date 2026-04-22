<template>
  <v-card v-if="!isMobileDevice() || notMobileView" class="dataTables_wrapper dt-bootstrap4 no-footer fill-height">
    <TableContent :hover="hover" @on-items-select="onItemSelect" @on-sort="onSort" :header="header"
      :data="dataToDisplay" :checkboxEnabled="checkboxEnabled" :checkboxLabel="checkboxLabel"
      :isHeadRowFilter="isHeadRowFilter" @rowDoubleClicked="rowDoubleClickedFunc($event)"
      :currentlySelectedItems="currentlySelectedItems" :empty-table-text="emptyTableText" :sort-label="sortLabel"
      :sort-order="sortOrder" :loading="loading">
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <div v-if="infiniteScroll" ref="loadMoreTrigger" class="py-4 text-center">
    </div>
    <TableFooter v-if="notPageChange && !infiniteScroll" @page-change="pageChange" :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable" :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled" />
    <div v-else-if="!infiniteScroll" align="end">
      <v-alert type="info">
        {{ $t('form.saveChangeDescriptionTablePage') }}
      </v-alert>
    </div>
    <v-col cols="12" align="end" class="text-body-1 bg-headerBgColor" style="z-index: 999999;" v-if="total">
      {{ $t('form.total') }} : {{ total }}
    </v-col>
  </v-card>
  <v-card v-else class="dataTables_wrapper dt-bootstrap4 no-footer" border="false">
    <TableContentMobile :hover="hover" @on-items-select="onItemSelect" @on-sort="onSort" :header="header"
      :data="dataToDisplay" :checkboxEnabled="checkboxEnabled" :checkboxLabel="checkboxLabel"
      @rowDoubleClicked="rowDoubleClickedFunc($event)" :currentlySelectedItems="currentlySelectedItems"
      :empty-table-text="emptyTableText" :sort-label="sortLabel" :sort-order="sortOrder" :loading="loading">
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContentMobile>
    <div v-if="infiniteScroll" ref="loadMoreTriggerMobile" class="py-4 text-center">
    </div>
    <TableFooter v-if="notPageChange && !infiniteScroll" @page-change="pageChange" :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable" :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled" />
    <div v-else-if="!infiniteScroll" align="end">
      <v-alert type="info">
        {{ $t('form.saveChangeDescriptionTablePage') }}
      </v-alert>
    </div>
    <v-sheet width="100%" align="end" class="text-body-1 pa-4" color="transparent" v-if="total">
      {{ $t('form.total') }} : {{ total }}
    </v-sheet>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableContentMobile from "@/components/kt-datatable/table-partials/table-content/TableContentMobile.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { isMobileApp, isMobileDevice } from "@/assets/ts/_utils";

export default defineComponent({
  name: "kt-datatable",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    hover: { type: Boolean, required: false, default: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    currentlySelectedItems: { type: Array<String>, required: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    total: { type: Number, required: false },
    loading: { type: Boolean, required: false, default: false },
    notPageChange: { type: Boolean, required: false, default: true },
    notMobileView: { type: Boolean, required: false, default: false },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    emptyTableText: { type: String, required: false, default: "general.noDataFound" },
    currentPage: { type: Number, required: false, default: 1 },
    infiniteScroll: { type: Boolean, default: false },
    isHeadRowFilter: { type: Boolean, default: false },
  },
  emits: [
    "page-change",
    "on-sort",
    "on-items-select",
    "on-items-per-page-change",
    'rowDoubleClicked'
  ],
  components: {
    TableContent,
    TableFooter,
    TableContentMobile,
  },
  setup(props, { emit }) {
    const currentPage = ref(props.currentPage);
    const itemsInTable = ref<number>(props.itemsPerPage);

    const loadMoreTrigger = ref<HTMLElement | null>(null);
    const loadMoreTriggerMobile = ref<HTMLElement | null>(null);
    let observer: IntersectionObserver | null = null;

    watch(
      () => itemsInTable.value,
      (val) => {
        currentPage.value = 1;
        emit("on-items-per-page-change", val);
      }
    );


    const rowDoubleClickedFunc = (item) => {
      emit('rowDoubleClicked', item)
    }

    const pageChange = (page: number) => {
      currentPage.value = page;
      emit("page-change", page);
    };

    const dataToDisplay = computed(() => {
      if (props.data) {
        // EĞER INFINITE SCROLL AÇIKSA: Sayfalama (slice) yapma, tüm datayı göster.
        // Çünkü parent component datayı üstüne ekleyerek (push) gönderecek.
        if (props.infiniteScroll) {
          return props.data;
        }

        // Klasik Pagination Mantığı
        if (props.data.length <= itemsInTable.value) {
          return props.data;
        } else {
          let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
          return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
        }
      }
      return [];
    });

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // Loading değilse VE toplam sayıya henüz ulaşmadıysak
        if (!props.loading && props.data.length < (props.total || 0)) {
          // Sayfa numarasını bir arttırıp emit et
          const nextPage = currentPage.value + 1;
          currentPage.value = nextPage;
          emit("page-change", nextPage);
        }
      }
    };

    const initObserver = () => {
      if (props.infiniteScroll) {
        observer = new IntersectionObserver(handleIntersect, {
          root: null, // viewport
          threshold: 1.0 // %100 görünür olduğunda
        });

        // Hem desktop hem mobil ref'i kontrol edip gözlemciye ekle
        nextTick(() => {
          if (loadMoreTrigger.value) observer?.observe(loadMoreTrigger.value);
          if (loadMoreTriggerMobile.value) observer?.observe(loadMoreTriggerMobile.value);
        });
      }
    };
    const totalItems = computed(() => {
      if (props.data) {
        if (props.data.length <= itemsInTable.value) {
          return props.total;
        } else {
          return props.data.length;
        }
      }
      return 0;
    });

    onMounted(() => {
      initObserver();
    });

    onUnmounted(() => {
      if (observer) observer.disconnect();
    });

    watch(() => props.currentPage, (val) => {
      if (val) currentPage.value = val;
    });

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    //eslint-disable-next-line
    const onItemSelect = (selectedItems: any) => {
      emit("on-items-select", selectedItems);
    };

    return {
      pageChange,
      dataToDisplay,
      onSort,
      onItemSelect,
      itemsInTable,
      isMobileApp,
      isMobileDevice,
      rowDoubleClickedFunc,
      totalItems,
      loadMoreTrigger,
      loadMoreTriggerMobile
    };
  },
});
</script>
