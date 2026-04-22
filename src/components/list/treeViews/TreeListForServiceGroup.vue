<template>
    <div v-for="(item, index) in items" :key="index">
        <v-list v-if="!item.hasChild" class="pa-0 ps-5 bg-transparent">
            <v-list-item class="border">
                <template v-slot:prepend>
                    <v-icon v-if="!item.hasChild" color="primary">mdi-label-off-outline</v-icon>
                </template>
                <template v-slot:title>
                    <v-row class="d-flex align-center">
                        <v-col class="ps-5 text-wrap" cols="5">
                            <v-col cols="auto" class="px-0">
                                <p class="ma-0 font-weight-bold text-body-1" v-if="item.title">{{ item.title }}</p>
                                <p class="ma-0" v-if="item.companyBranch">
                                    {{ $t('list.companyBranch') }} :
                                    <v-chip color="warning">
                                        {{ item.companyBranch.name }}
                                    </v-chip>
                                </p>
                                <p class="ma-0"
                                    v-if="item.inRotation !== undefined && companySettings.includeCompanyRotation">
                                    {{ $t('list.inRotation') }} :
                                    <v-chip :color="item.inRotation ? 'success' : 'error'">
                                        {{ item.inRotation ? $t('list.include') : $t('list.exclude') }}
                                    </v-chip>
                                </p>
                                <p class="ma-0 font-weight-medium text-body-1" v-if="item.name">{{ item.name }}</p>
                            </v-col>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" v-if="menuItems" class="pl-0 pr-7 pr-sm-12">
                            <GeneralDropdown :menuItems="filterMenuItems(item)" :data="item" />
                        </v-col>
                    </v-row>
                </template>
            </v-list-item>
        </v-list>
        <v-list v-else class="pa-0 ps-5 bg-transparent">
            <v-list-group class="border" :value="item.id">
                <template v-slot:activator="{ isOpen, props }">
                    <v-list-item active-class="" v-bind="props" @click.prevent="isOpen ? '' : getDetailMethod(item)">
                        <template v-slot:title>
                            <v-row class="d-flex align-center">
                                <v-col cols="10" class="ps-5 d-flex">
                                    <v-col cols="auto">
                                        <p class="ma-0 font-weight-bold text-body-1" v-if="item.title">{{ item.title }}
                                        </p>
                                        <p class="ma-0" v-if="item.companyBranch">
                                            {{ $t('list.companyBranch') }} :
                                            <v-chip color="warning">
                                                {{ item.companyBranch.name }}
                                            </v-chip>
                                        </p>
                                        <p class="ma-0"
                                            v-if="item.inRotation !== undefined && companySettings.includeCompanyRotation">
                                            {{ $t('list.inRotation') }} :
                                            <v-chip :color="item.inRotation ? 'success' : 'error'">
                                                {{ item.inRotation ? $t('list.include') : $t('list.exclude') }}
                                            </v-chip>
                                        </p>
                                        <p class="ma-0 font-weight-bold text-body-1" v-if="item.name">{{ item.name }}
                                        </p>
                                    </v-col>
                                </v-col>
                                <v-col cols="2" align="right" class="pa-0" v-if="menuItems">
                                    <GeneralDropdown :menuItems="filterMenuItems(item)" :data="item" />
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
                <TreeListForServiceGroup :items="item.subItems" :loading="loading" :getDetailMethod="getDetailMethod"
                    :menuItems="menuItems" :isSubItem="true" />
            </v-list-group>
        </v-list>
    </div>
</template>

<script lang="ts" setup>
import GeneralDropdown from '@/components/dropdown/GeneralDropdown.vue';
import type { GeneralDropdownType } from '@/models/types';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import { storeToRefs } from 'pinia';

const { companySettings } = storeToRefs(useManagementDtoStore());
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

const isServiceType = (item) => {
    if (Object.keys(item).includes('companyBranch')) {
        return 'ServiceGroup'
    } else if (Object.keys(item).includes('inRotation')) {
        return 'Service'
    } else {
        return 'Position'
    }
}

const filterMenuItems = (item: any): (GeneralDropdownType[]) => {
    const serviceType = isServiceType(item);
    if (serviceType == 'ServiceGroup') {
        if (item.hasChild)
            return props.menuItems.filter((x: any) => x.id >= 0 && x.id < 5)
        else
            return props.menuItems.filter((x: any) => x.id >= 0 && x.id < 5 && x.id != 2)
    }
    else if (serviceType == 'Service') {
        return props.menuItems.filter((x: any) => x.id >= 5 && x.id < 8)
    }
    else if (serviceType == 'Position') {
        return props.menuItems.filter((x: any) => x.id >= 8)
    }
    else
        return props.menuItems
}

</script>