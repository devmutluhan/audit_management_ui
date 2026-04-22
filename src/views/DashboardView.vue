<template>
  <PageTitleTeleport v-if="!isMobileDevice()">
    <template v-slot:component>
      <p v-if="!isUpdated" class="text-end mb-0 cursor-pointer text-primary text-decoration-underline"
        @click="setIsUpdated()">
        {{ $t('general.update') }}
      </p>
      <p v-else class="text-end mb-0 cursor-pointer text-decoration-underline text-primary" @click="setIsUpdated()">
        {{ $t('general.toGiveUp') }}
      </p>
      <p v-if="isUpdated" class="text-rejectButtonColor mb-0 text-end"> ** {{ $t('general.dashboardLayoutsInfo') }} **
      </p>
    </template>
  </PageTitleTeleport>
  <div style="width:100%;margin-top: 10px;height:100%;" v-if="layoutItem">
    <GridLayout v-model:layout="layoutItem" @layout-updated="onLayoutUpdated" :row-height="30" :is-draggable="isUpdated"
      :is-resizable="isUpdated" @breakpoint-changed="breakpointChanged" :responsive-layouts="localStorageLayouts"
      responsive>
      <GridItem v-for="(item, index) in layoutItem" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :min-w="item.minW"
        :max-w="item.maxW" :min-h="item.minH" :max-h="item.maxH" :i="item.i">
        <component :is="componentMap[item.component]" :items="dashboardItems" :isClicked="isClicked"
          @isRefresh="getDashboardItems()" />
      </GridItem>
    </GridLayout>
    <v-row v-if="isUpdated" class="d-flex justify-center">
      <v-col cols="auto">
        <v-btn color="alertIconColor" @click="resetLayout"> {{ $t('general.reset') }} </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="cancelButtonColor" @click="cancelEdit"> {{ $t('general.toGiveUp') }} </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="editButtonColor" @click="saveLayout"> {{ $t('general.save') }} </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { type Breakpoint, GridItem, GridLayout, type Layout } from 'grid-layout-plus';
import { defaultLayouts, componentMap } from '@/core/data/dashboardLayouts';
import { clearPastDashboardLayouts, getDashboardLayouts, setDashboardLayouts } from '@/core/helpers/localStorageManagement';
import { DashboardItemsDto } from '@/models/entities/management/ManagementDtos';
import { isMobileDevice } from '@/assets/ts/_utils';
import PageTitleTeleport from '@/components/teleports/PageTitleTeleport.vue';

const { dashboardItems } = storeToRefs(useGeneralStore());
const isUpdated = ref(false);
const layoutItem = ref([] as any);
const isClicked = ref(false);
const isChange = ref(false);
const currentBreakpoint = ref('lg')
let localStorageLayouts = ref(null as any);
dashboardItems.value = new DashboardItemsDto();

const getDashboardItems = () => {
  if (isClicked.value) return;

  isClicked.value = true;
  useGeneralStore().getDashboardItems();

  setTimeout(() => {
    isClicked.value = false;
  }, 30000);
};
getDashboardItems();

onMounted(() => {
  clearPastDashboardLayouts();
  const savedLayout = getDashboardLayouts();
  if (savedLayout) {
    try {
      localStorageLayouts.value = savedLayout;
      layoutItem.value = localStorageLayouts.value[currentBreakpoint.value]
    } catch (e) {
      console.log("eeerrror", e)
    }
  } else {
    defaultLayouts.lg.sort((a, b) => Number(a.i) - Number(b.i))
    defaultLayouts.md.sort((a, b) => Number(a.i) - Number(b.i))
    defaultLayouts.sm.sort((a, b) => Number(a.i) - Number(b.i))
    defaultLayouts.xs.sort((a, b) => Number(a.i) - Number(b.i))
    setDashboardLayouts(defaultLayouts);
    localStorageLayouts.value = JSON.parse(JSON.stringify(defaultLayouts));
  }
});

const breakpointChanged = (breakpoint: Breakpoint, newLayout: Layout) => {
  currentBreakpoint.value = breakpoint;
  layoutItem.value = newLayout;
}

const setIsUpdated = () => {
  if (isUpdated.value) {
    if (!isChange.value)
      isUpdated.value = false
  } else {
    isUpdated.value = true
  }
}

const onLayoutUpdated = (newLayout: Layout[]) => {
  if (isUpdated.value)
    isChange.value = true;
  layoutItem.value = newLayout;
};

const saveLayout = () => {
  localStorageLayouts.value[currentBreakpoint.value] = JSON.parse(JSON.stringify(layoutItem.value))
  setDashboardLayouts(localStorageLayouts.value);
  isUpdated.value = false;
  isChange.value = false;
};

const resetLayout = () => {
  layoutItem.value = defaultLayouts[currentBreakpoint.value]
  isChange.value = false;
  isUpdated.value = false;
  setDashboardLayouts(defaultLayouts);
  localStorageLayouts.value = JSON.parse(JSON.stringify(defaultLayouts));
};

const cancelEdit = () => {
  const savedLayouts = getDashboardLayouts();
  if (savedLayouts) {
    try {
      layoutItem.value = JSON.parse(savedLayouts);
    } catch (e) {
      layoutItem.value = JSON.parse(JSON.stringify(localStorageLayouts.value[currentBreakpoint.value]))
    }
  } else {
    layoutItem.value = JSON.parse(JSON.stringify(localStorageLayouts.value[currentBreakpoint.value]))
  }
  isUpdated.value = false;
  isChange.value = false;
};

</script>

<style scoped></style>
