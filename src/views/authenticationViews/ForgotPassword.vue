<template>
  <v-card border="false">
    <v-card-text>
      <v-form ref="passwordResetFormRef">
        <v-col cols="12" class="text-center mb-10">
          <h1 class="text-gray-900 mb-3">{{ $t('login.forgotPassword') }}</h1>
          <p class="text-gray-500 fw-semibold fs-4">
            {{ $t('login.enterEmail') }}
          </p>
        </v-col>

        <v-col cols="12" class="fv-row mb-10">
          <TextField v-model="email" label="form.email" isRequired />
        </v-col>

        <v-row class="d-flex justify-center">
          <v-col cols="auto">
            <v-btn @click="onForgotPassword" :loading="loading" size="x-large" color="confirmButtonColor">
              {{ $t("login.send") }}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn size="x-large" color="cancelButtonColor" :to="{ name: 'sign-in' }">
              {{ $t('general.cancel') }}
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
import TextField from "@/components/formInput/generalInputs/TextField.vue";

const authStore = useAuthStore();
const email = ref("");
const loading = ref(false)
const passwordResetFormRef = ref(null as any);

const onForgotPassword = async () => {
  passwordResetFormRef.value.validate().then((res: any) => {
    if (res.valid) {
      loading.value = true;
      authStore.forgotPassword(email.value).finally(() => {
        loading.value = false;
        email.value = ""
      });
    }
  })
};

</script>
