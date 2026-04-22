<template>
  <v-row class="px-4 bg-headerBgColor" v-if="count > itemsPerPage || itemsPerPage != 10">
    <v-col cols="12" style="border-top: 1px solid #E0E0E0;" class="d-flex py-2">
      <TableItemsPerPageSelect v-if="count > itemsPerPage || itemsPerPage != 10"
        v-model:itemsPerPage="itemsCountInTable" :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled" />
      <v-spacer></v-spacer>
      <TablePagination v-if="pageCount > 1" :total-pages="pageCount" :total="count" :per-page="itemsPerPage"
        :current-page="page" @page-change="pageChange" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import TableItemsPerPageSelect from "@/components/kt-datatable/table-partials/table-content/table-footer/TableItemsPerPageSelect.vue";
import TablePagination from "./table-content/table-footer/TablePagination.vue";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  type WritableComputedRef,
} from "vue";
import { ScrollTopComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "table-footer",
  components: {
    TableItemsPerPageSelect,
    TablePagination,
  },
  props: {
    count: { type: Number, required: false, default: 5 },
    itemsPerPage: { type: Number, default: 5 },
    itemsPerPageDropdownEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    currentPage: { type: Number, required: false, default: 1 },
  },
  emits: ["update:itemsPerPage", "page-change"],
  setup(props, { emit }) {
    const page = ref(props.currentPage);
    const inputItemsPerPage = ref(props.itemsPerPage);

    watch(() => props.count, () => {
      page.value = 1;
    });

    watch(() => inputItemsPerPage.value, () => {
      page.value = 1;
    });

    watch(() => props.currentPage, (newVal, oldVal) => {
      if (newVal != oldVal)
        page.value = newVal
    });

    onMounted(() => {
      inputItemsPerPage.value = props.itemsPerPage;
    });

    const pageChange = (newPage: number) => {
      page.value = newPage;
      emit("page-change", page.value);
      ScrollTopComponent.goTop();
    };

    const itemsCountInTable: WritableComputedRef<number> = computed({
      get(): number {
        return props.itemsPerPage;
      },
      set(value: number): void {
        inputItemsPerPage.value = value;
        emit("update:itemsPerPage", value);
      },
    });

    const pageCount = computed(() => {
      return Math.ceil(props.count / itemsCountInTable.value);
    });

    return {
      pageChange,
      pageCount,
      page,
      itemsCountInTable,
      inputItemsPerPage,
    };
  },
});
</script>
