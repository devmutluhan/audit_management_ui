<template>
  <v-card class="pa-md-12 pa-sm-6 pa-4" rounded="xl">
    <v-card-text>
      <v-form ref="signInFormRef">
        <v-row class="d-flex justify-center">
          <v-col cols="12" class="mb-10 d-flex justify-center">
            <img v-if="themeMode === 'light'" alt="Logo" :src="getAssetPath('media/logos/default.svg')"
              class="h-24px h-35px app-sidebar-logo-default theme-light-show" />
            <img v-if="themeMode === 'dark'" alt="Logo" :src="getAssetPath('media/logos/default-dark.svg')"
              class="h-24px h-35px app-sidebar-logo-default" />
          </v-col>
          <!-- <v-col cols="12" class="text-center mb-10">
            <h1 class="text-gray-900 mb-3"> {{ $t('login.signIn') }} </h1>
          </v-col> -->

          <v-col cols="12" class="mb-10">
            <TextField v-model="preLoginCommand.email" label="form.email" isRequired />
          </v-col>

          <v-col cols="12" class="mb-10">
            <v-row class="d-flex flex-stack">
              <v-col cols="auto" class="py-0">
                <v-label class="form-label fw-bold text-gray-900 fs-6 mb-0">
                  {{ $t("login.password") }} <span style="color:red;" class="ml-1">*</span>
                </v-label>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" class="py-0">
                <router-link :to="{ name: 'forgot-password' }" class="link-primary fs-6 fw-bold">
                  {{ $t("login.forgotPassword") }}
                </router-link>
              </v-col>
            </v-row>

            <TextField v-model="preLoginCommand.password" isRequired type="password" />
          </v-col>

          <v-col cols="10" class="text-center py-0">
            <v-btn block @click="onSubmitLogin" size="x-large" rounded="lg" :loading="loading">
              {{ $t("login.signIn") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { PreSignInCommand } from "@/models/entities/user/UserCommands";

import TextField from "@/components/formInput/generalInputs/TextField.vue";
import { storeToRefs } from "pinia";
import { themeMode } from "@/layouts/default-layout/config/helper";
import { getAssetPath } from "@/core/helpers/assets";

const authStore = useAuthStore();
const preLoginCommand = ref({} as PreSignInCommand);
const { loading } = storeToRefs(useAuthStore())

const signInFormRef = ref(null as any);

const onSubmitLogin = () => {
  signInFormRef.value.validate().then((res: any) => {
    if (res.valid) {
      authStore.preLogin(preLoginCommand.value);
    }
  })
};
</script>
