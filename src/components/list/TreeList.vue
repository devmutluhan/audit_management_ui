<template>
    <div v-for="(item, index) in items" :key="index">
        <v-list v-if="item.isLeaf" class="pa-0">
            <v-list-item class="bg-warning">
                <template v-slot:prepend>
                    <v-icon v-if="item.isLeaf" color="primary">mdi-label-off-outline</v-icon>
                </template>
                <template v-slot:title>
                    <v-row class="d-flex align-center">
                        <v-col class="ps-5">
                            <template v-if="$slots.rowContent">
                                <slot name="rowContent" :item="item" :index="index"></slot>
                            </template>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" v-if="menuItems" class="ps-5 pr-12">
                            <GeneralDropdown :menuItems="menuItems" :data="item" />
                        </v-col>
                    </v-row>
                </template>
            </v-list-item>
        </v-list>
        <v-list v-else class="pa-0">
            <v-list-group class="bg-red" :value="item.id">
                <template v-slot:activator="{ isOpen, props }">
                    <v-list-item active-class="bg-blue" v-bind="props"
                        @click.prevent="isOpen ? '' : getDetailMethod(item)">
                        <template v-slot:title>
                            <v-row class="d-flex align-center">
                                <v-col class="pa-0 d-flex">
                                    <template v-if="$slots.rowContent">
                                        <slot name="rowContent" :item="item" :index="index">
                                        </slot>
                                    </template>
                                </v-col>
                                <!-- <v-col cols="auto" v-if="loading">
                                    <v-progress-circular :width="3" color="#005d9f" indeterminate>
                                    </v-progress-circular>
                                </v-col> -->
                                <v-col cols="auto" class="pa-0" v-if="menuItems">
                                    <GeneralDropdown :menuItems="menuItems" :data="item" />
                                </v-col>
                            </v-row>
                        </template>
                        <template v-slot:prepend>
                            <v-icon color="primary">mdi-label-multiple</v-icon>
                        </template>
                    </v-list-item>
                </template>
                <!-- <v-list-item v-if="loading">
                    <v-progress-circular :width="3" color="#005d9f" indeterminate>
                    </v-progress-circular>
                </v-list-item> -->
                <TreeList :items="item.subItems" :loading="loading" :getDetailMethod="getDetailMethod"
                    :menuItems="menuItems" :isSubItem="true">
                    <template v-slot:rowContent="{ item, index }">
                        <v-col>
                            <p class="ma-0">{{ item.title }}</p>
                            <p class="ma-0">{{ item }}</p>
                        </v-col>
                    </template>
                </TreeList>
            </v-list-group>
        </v-list>
    </div>
</template>

<script lang="ts" setup>
import GeneralDropdown from '@/components/dropdown/GeneralDropdown.vue';


const slots = defineSlots<{
    rowContent(props: { item: any, index: number }): any
}>()

const props = defineProps({
    items: {
        type: Array as any,
        default: () => [],
        required: true
    },
    loading: {
        type: Boolean as any,
        default: false,
        required: true
    },
    getDetailMethod: {
        type: Function as any,
        required: true
    },
    menuItems: {
        type: Array as any,
        default: () => [],
        required: false
    },
    isSubItem: {
        type: Boolean as any,
        default: false,
        required: false
    }
})

</script>