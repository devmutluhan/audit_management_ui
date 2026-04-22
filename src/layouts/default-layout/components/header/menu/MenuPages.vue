<template>
  <template v-for="(item, i) in filteredMenu" :key="i">
    <template v-if="!item.heading">
      <template v-for="(menuItem, j) in item.sub" :key="j">
        <div v-if="menuItem.heading" class="menu-item me-lg-1">
          <router-link v-if="menuItem.route" class="menu-link" :to="{ name: menuItem.route }" active-class="active">
            <span class="menu-title">{{ translate(menuItem.heading) }}</span>
          </router-link>
        </div>
      </template>
    </template>
    <div v-if="item.heading" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start"
      class="menu-item menu-lg-down-accordion me-lg-1">
      <template v-for="(menuItem, j) in item.sub" :key="j">
        <div v-if="menuItem.heading" class="menu-item me-lg-1">
          <router-link v-if="menuItem.route" class="menu-link" :to="{ name: menuItem.route }" active-class="active">
            <span class="menu-title" :style="{ color: headerIconColor }">{{ translate(menuItem.heading) }}</span>
          </router-link>
        </div>
        <div v-if="menuItem.sectionTitle" data-kt-menu-trigger="{default:'click', lg: 'hover'}"
          data-kt-menu-placement="bottom-start" class="menu-item menu-lg-down-accordion">
          <span v-if="menuItem.route" class="menu-link py-3" :class="{ active: hasActiveChildren(menuItem.route) }">
            <!-- <router-link :to="{name:menuItem.route}">
            </router-link> -->
            <span class="menu-title" :style="{ color: headerIconColor }">{{ translate(menuItem.sectionTitle) }}</span>
          </span>
          <div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
            :style="{ backgroundColor: headerBackgroundColor }">
            <template v-for="(menuItem1, k) in menuItem.sub" :key="k">
              <div v-if="menuItem1.sectionTitle" data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                data-kt-menu-placement="right-start" class="menu-item menu-lg-down-accordion">
                <span v-if="menuItem1.route" class="menu-link py-3"
                  :class="{ active: hasActiveChildren(menuItem1.route) }">
                  <span class="menu-bullet">
                    <i v-if="sidebarMenuIcons === 'bootstrap'" class="bi" :class="menuItem1.bootstrapIcon"
                      :style="{ color: headerIconColor }"></i>
                    <KTIcon v-else-if="sidebarMenuIcons === 'keenthemes'" :icon-name="menuItem1.keenthemesIcon"
                      :style="{ color: headerIconColor }" icon-class="fs-2" />
                  </span>
                  <span class="menu-title" :style="{ color: headerIconColor }">
                    {{ translate(menuItem1.sectionTitle) }}</span>
                  <span class="menu-arrow"></span>
                </span>
                <div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
                  :style="{ backgroundColor: headerBackgroundColor }">
                  <template v-for="(menuItem2, l) in menuItem1.sub" :key="l">
                    <div class="menu-item">
                      <router-link v-if="menuItem2.route && menuItem2.heading" class="menu-link py-3"
                        active-class="active" :to="{ name: menuItem2.route }">
                        <span class="menu-bullet">
                          <span class="bullet bullet-dot" :style="{ color: headerIconColor }"></span>
                        </span>
                        <span class="menu-title" :style="{ color: headerIconColor }">{{ translate(menuItem2.heading)
                          }}</span>
                      </router-link>
                    </div>
                  </template>
                </div>
              </div>
              <div v-if="menuItem1.heading" class="menu-item">
                <router-link v-if="menuItem1.route" class="menu-link" active-class="active"
                  :to="{ name: menuItem1.route }">
                  <span class="menu-bullet">
                    <i v-if="sidebarMenuIcons === 'bootstrap'" class="bi" :class="menuItem1.bootstrapIcon"
                      :style="{ color: headerIconColor }"></i>
                    <KTIcon v-else-if="sidebarMenuIcons === 'keenthemes'" :icon-name="menuItem1.keenthemesIcon"
                      :style="{ color: headerIconColor }" icon-class="fs-2" />
                  </span>
                  <span class="menu-title" :style="{ color: headerIconColor }">{{
                    translate(menuItem1.heading)
                  }}</span>
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </template>
      <div class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px"
        :style="{ backgroundColor: headerBackgroundColor }">
        <template v-for="(menuItem, j) in item.sub" :key="j">
          <div v-if="menuItem.heading" class="menu-item">
            <router-link v-if="menuItem.route && menuItem.route" class="menu-link" active-class="active"
              :to="{ name: menuItem.route }">
              <span class="menu-icon">
                <KTIcon icon-name="element-8" icon-class="fs-2" />
              </span>
              <span class="menu-title">{{ translate(menuItem.heading) }}</span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  sidebarMenuIcons,
  headerIconColor,
  headerBackgroundColor
} from "@/layouts/default-layout/config/helper";
import { headerMenuIcons } from "@/layouts/default-layout/config/helper";
import { filteredMenu } from "@/core/menuPageManagement/moduleClaimUtils"

export default defineComponent({
  name: "KTMenu",
  components: {},
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    const translate = (text: string) => {
      return t('menu.' + text);
    };

    return {
      hasActiveChildren,
      headerMenuIcons,
      filteredMenu,
      headerIconColor,
      translate,
      headerBackgroundColor,
      sidebarMenuIcons,
      getAssetPath,
    };
  },
});
</script>