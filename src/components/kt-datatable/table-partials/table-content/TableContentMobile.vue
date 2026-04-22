<template>
    <v-row style="min-height: 900px;" class="overflow-auto">
        <v-col class="fill-height">
            <TableHeadRowMobile v-if="header.some((a: any) => a.filterEnabled == true)" @onSort="onSort"
                @onSelect="selectAll" :checkboxEnabledValue="check" :checkboxEnabled="checkboxEnabled"
                :sort-label="sortLabel" :sort-order="sortOrder" :header="header" />
            <TableBodyRowMobile v-if="data.length !== 0" :hover="hover" @onSelect="itemsSelect"
                @rowDoubleClicked="rowDoubleClickedFunc($event)" :currentlySelectedItems="currentlySelectedItems"
                :data="data" :header="header" :checkbox-enabled="checkboxEnabled" :checkbox-label="checkboxLabel">
                <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
                    <slot :name="name" :row="item" />
                </template>
            </TableBodyRowMobile>
            <template v-else-if="!loading">
                <v-row class="d-flex justify-left">
                    <v-col cols="12" align="center" class="pa-6">
                        <v-alert type="info" color="alertIconColor" variant="outlined">
                            {{ $t(emptyTableText) }}
                        </v-alert>
                    </v-col>
                </v-row>
            </template>
            <Loading v-if="loading" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import TableHeadRowMobile from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRowMobile.vue";
import TableBodyRowMobile from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRowMobile.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
    name: "table-body-mobile",
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
    },
    emits: ["on-sort", "on-items-select", "rowDoubleClicked"],
    components: {
        TableHeadRowMobile,
        TableBodyRowMobile,
        Loading,
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
        };
    },
});
</script>
