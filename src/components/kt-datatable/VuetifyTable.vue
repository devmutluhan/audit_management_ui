<template>
    <v-data-table :group-by="groupBy" :items="data" :hover="hover" height="55vh" fixed-header hide-default-footer
        items-per-page="-1">
        <template v-if="groupBy" v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
            <template :ref="(el) => {
                if (firstRender && !isGroupOpen(item))
                    toggleGroup(item);
            }"></template>
            <tr
                :class="groupBy.length > 1 ? item.depth % 2 == 1 ? 'bg-pairGroupRowColor' : 'bg-singleGroupRowColor' : 'bg-pairGroupRowColor'">
                <td :colspan="groupBy.find((x) => x.key == item.key).groupMenuItems ? headers.length - 1 : headers.length"
                    @click="toggleGroup(item);" style="height: 55px;"
                    class="pa-4 fw-semibold text-uppercase cursor-pointer text-groupRowTextColor">
                    <v-icon>{{ isGroupOpen(item) ? '$expand' : '$next' }}</v-icon>
                    {{ groupByValue(item) }}
                </td>
                <td v-if="groupBy.find((x) => x.key == item.key).groupMenuItems" colspan="1" @click="toggleGroup(item);"
                    style="height: 55px;" class="pa-4 fw-semibold text-uppercase cursor-pointer text-groupRowTextColor">
                    <GeneralDropdown :data="item.items[0].columns"
                        :menuItems="groupBy.find((x) => x.key == item.key).groupMenuItems" />
                </td>
            </tr>
        </template>
        <template v-if="!slots.listItem" v-slot:item="{ item, index }">
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <tr v-bind="hover ? props : null" style="height: 52px;"
                        :class="isHovering ? 'bg-hoverRowColor' : index % 2 == 1 ? 'bg-pairRowBgColor' : 'bg-singleRowBgColor'">
                        <template v-for="(properties, j) in headers" :key="j">
                            <td class="pa-3 text-rowTextColor fw-semibold">
                                <slot v-if="!properties.valueFormatter" :name="`${properties.key}`" :row="item">
                                    {{ columnSplit(item, properties.key) }}
                                </slot>
                                <slot v-else :name="`${properties.key}`" :row="item">
                                    {{ properties.valueFormatter(item) }}
                                </slot>
                            </td>
                        </template>
                    </tr>
                </template>
            </v-hover>
        </template>
        <template v-else v-slot:item="{ item, index, props }">
            <slot name="listItem" :item="item" :props="props" :index="index"></slot>
        </template>
        <template v-slot:headers>
            <th v-for="(column, i) in headers" :key="i" style="height: 50px;"
                class="bg-headerBgColor text-start fw-bold fs-7 text-uppercase">
                <v-row class="d-flex align-center px-4">
                    <v-col cols="9" class="text-truncate text-headerTextColor"
                        :style="{ cursor: column.sortEnabled ? 'pointer' : 'auto' }">
                        {{ $t(column.title) }}
                    </v-col>
                </v-row>
            </th>
        </template>
        <template v-slot:no-data>
            <tr class="d-flex position-absolute" style="width: 100vw;">
                <td class="w-100">
                    <v-alert style="width: 100%;" type="info" color="alertIconColor" variant="outlined">
                        {{ $t('general.noData') }}
                    </v-alert>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted } from 'vue';
import { ref } from 'vue';
import type { GeneralDropdownType } from '@/models/types';

const firstRender = ref(true)

const slots = defineSlots<{
    listItem(props: { item: any, props: any, index: number }): any
}>()

onMounted(() => {
    firstRender.value = false;
})

const columnSplit = (row: any, key: string) => {
    if (key.includes('.')) {
        const [first, ...rest] = key.split('.');
        if (row[first]) {
            return row[first][rest.join('.')]
        } else {
            return '-'
        }
    } else if (key.includes('+')) {
        const firstValue = key.split('+')[0].trim();
        const secondValue = key.split('+')[1].trim();
        return row[firstValue] + " " + row[secondValue];
    } else
        return row[key];
};

const props = defineProps({
    groupBy: { type: Array as () => Array<any>, required: false, default: () => [] },
    headers: { type: Array as () => Array<any>, required: true },
    data: { type: Array as () => Array<any>, required: true },
    hover: { type: Boolean, required: false, default: true },
    currentlySelectedItems: { type: Array<String>, required: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" }
})

watch(() => props.data.length, () => {
    firstRender.value = true;
    setTimeout(() => {
        firstRender.value = false;
    }, 300)
})

const groupByValue = (item: any) => {
    const index = props.groupBy.findIndex((a) => a.key == item.key && a.valueFormatter)
    if (index != -1) {
        return props.groupBy[index].valueFormatter(item.value)
    } else {
        return item.value
    }
}


</script>