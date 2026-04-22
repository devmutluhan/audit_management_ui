<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true">
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getGeneralProfilePhoto()" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ userInfo.employeeDetail.fullName }}
          </div>
          <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">
            {{ userInfo.employeeDetail.workEmail }}
          </a>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->


    <!--begin::Menu item-->
    <div class="menu-item px-5" v-for="item in menuArray" :key="item.route">

      <!--begin::Menu item-->
      <div v-if="item.children" data-kt-menu-trigger="hover" data-kt-menu-placement="left-start"
        data-kt-menu-flip="center, top">
        <router-link :to="{ name: item.route }" class="menu-link px-5" @click="closeMenu">
          <span class="menu-title">{{ $t(item.title) }}</span>
          <span class="menu-arrow hidden-sm-and-down"></span>
        </router-link>

        <!--begin::Menu sub-->
        <div class="menu-sub menu-sub-dropdown hidden-sm-and-down w-175px py-4">
          <div class="menu-item px-3" v-for="it in item.children" :key="it.route">
            <router-link :to="{ name: it.route }" class="menu-link px-5" @click="closeMenu">
              {{ $t(it.title) }}
            </router-link>
          </div>
          <!--end::Menu item-->
        </div>
        <!--end::Menu sub-->
      </div>
      <!--end::Menu item-->

      <div v-else-if="!item.children">
        <router-link :to="{ name: item.route }" class="menu-link d-flex flex-stack px-5" @click="closeMenu">
          {{ $t(item.title) }}
          <i class="ms-2 fs-7" data-bs-toggle="tooltip" title="View your statements"></i>
        </router-link>
      </div>

    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5" data-kt-menu-trigger="hover" data-kt-menu-placement="bottom-end"
      data-kt-menu-flip="center, top">
      <div class="menu-link px-5">
        <span class="menu-title position-relative">
          {{ $t("general.language") }}
          <span class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
            {{ currentLangugeLocale.name }}
            <img class="w-15px h-15px rounded-1 ms-2" :src="currentLangugeLocale.flag" alt="flags" />
          </span>
        </span>
      </div>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown  w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a @click="setLang('en')" href="#" class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'en' }">
            <span class="symbol symbol-20px me-4">
              <img class="rounded-1" :src="getAssetPath('media/flags/united-states.svg')" alt="english-flag" />
            </span>
            {{ $t("general.english") }}
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a @click="setLang('tr')" href="#" class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'tr' }">
            <span class="symbol symbol-20px me-4">
              <img class="rounded-1" :src="getAssetPath('media/flags/turkey.svg')" alt="turkish-flag" />
            </span>
            {{ $t("general.turkish") }}
          </a>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link :to="{ name: 'calendar' }" class="menu-link px-5">
        {{ $t("menu.calendar") }}
      </router-link>
    </div>
    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link :to="{ name: 'notification' }" class="menu-link px-5">
        {{ $t("menu.notification") }}
      </router-link>
    </div>
    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link :to="{ name: 'customize' }" class="menu-link px-5">
        {{ $t("menu.customize") }}
      </router-link>
    </div>
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="store.signOut()" class="menu-link px-5">
        {{ $t("login.signOut") }}
      </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts" setup>
import { getAssetPath } from "@/core/helpers/assets";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { filteredAccountMenu } from "@/core/menuPageManagement/moduleClaimUtils";
import { userInfo } from "@/core/helpers/localStorageManagement";
import { getGeneralProfilePhoto } from "@/core/helpers/assets";
import { useBodyStore } from "@/stores/body";

const i18n = useI18n();
const store = useAuthStore();
const { t } = useI18n();

const menuArray = ref(filteredAccountMenu)

i18n.locale.value = localStorage.getItem("lang")
  ? (localStorage.getItem("lang") as string)
  : "tr";

const countries = {
  en: {
    flag: getAssetPath("media/flags/united-states.svg"),
    name: t("general.english"),
  },
  tr: {
    flag: getAssetPath("media/flags/turkey.svg"),
    name: t("general.turkish"),
  },
};

const setLang = (lang: string) => {
  localStorage.setItem("lang", lang);
  i18n.locale.value = lang;
};

if (countries[i18n.locale.value as keyof typeof countries] === undefined) {
  setLang("tr");
}

const currentLanguage = computed(() => {
  return i18n.locale.value;
});

const closeMenu = () => {
  // Body class kaldır
  useBodyStore().removeBodyClassName("show");
  useBodyStore().removeBodyClassName("menu-open");

  // Body attribute varsa kaldır
  useBodyStore().removeBodyAttribute({ qualifiedName: "data-kt-menu-open" });

  // Metronic'in dropdown'larında show class'ını kaldır
  const openMenus = document.querySelectorAll(".menu-sub.show, .menu-item.show, .menu.show");
  openMenus.forEach((el) => el.classList.remove("show"));
};

const currentLangugeLocale = computed(() => {
  return countries[i18n.locale.value as keyof typeof countries];
});

</script>
