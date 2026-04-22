<template>
    <v-layout>
        <v-col align="right" cols="12" class="text-end pa-0">
            <v-icon class="pr-12" v-if="isActiveFilter" size="30" color="error" @click="reset()">
                mdi-filter-remove
            </v-icon>
            <v-icon size="30" :color="isActiveFilter ? 'success' : 'cancelButtonColor'" @click="filterDrawer = true;">
                {{ isActiveFilter ? 'mdi-filter-menu' : 'mdi-filter-outline' }}
            </v-icon>
        </v-col>
        <v-navigation-drawer v-model="filterDrawer" v-if="filterDrawer" temporary absolute location="right">
            <v-row class="d-flex align-center px-4 pt-4">
                <v-col cols="auto">
                    <v-label class="text-h6 font-weight-bold">
                        {{ $t('general.filterOptions') }}
                    </v-label>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" align="end" class="pa-0">
                    <v-btn variant="outlined" size="28" icon="" @click="filterDrawer = false">
                        <v-icon size="15">mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-for="(column, i) in header" :key="i">
                <v-col v-if="column.filterEnabled && column.filterOption">
                    <TableColumnFilterNavDrawer :filterOption="column.filterOption" :column="column" />
                </v-col>
            </v-row>
            <v-row>
                <v-col align="end">
                    <v-btn v-if="isActiveFilter" class="mr-2" @click="reset()" variant="outlined"
                        color="rejectButtonColor">
                        {{ $t('general.allReset') }}
                    </v-btn>
                    <v-btn class="mr-2" @click="filterDrawer = false" variant="outlined" color="cancelButtonColor">
                        {{ $t('general.close') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-navigation-drawer>
    </v-layout>
</template>

<script lang="ts" setup>
import { computed, type PropType, ref } from 'vue';
import TableColumnFilterNavDrawer from '@/components/dropdown/TableColumnFilterNavDrawer.vue'
import { resetAllFilters } from '@/core/helpers/tableFilterUtils';

const filterDrawer = ref(false);

const props = defineProps({
    header: {
        required: true,
        type: Object as PropType<any>,
    }
});

const reset = () => {
    resetAllFilters(props.header);
}

const isActiveFilter = computed(() => {
    const filterEnabledList = props.header.filter((a) => a.filterEnabled);
    return filterEnabledList.some((a) => a.filterOption.active);
})

</script>