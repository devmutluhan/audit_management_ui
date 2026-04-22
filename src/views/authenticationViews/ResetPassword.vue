<template>
    <v-card border="false">
        <v-card-text>
            <v-form ref="passwordResetFormRef">
                <v-col cols="12" class="text-center mb-10">
                    <h1 class="text-gray-900 mb-3">{{ $t('form.verifyPassword') }}</h1>
                    <p class="text-gray-500 fw-semibold fs-4">
                        {{ $t('form.verifyPasswordDesc') }}
                    </p>
                </v-col>
                <v-col cols="12" class="fv-row mb-10">
                    <TextField v-model="resetPasswordCommand.newPassword" label="form.password" type="password"
                        isRequired />
                </v-col>
                <v-col cols="12" class="fv-row mb-10">
                    <TextField v-model="resetPasswordCommand.rePassword" label="form.rePassword" type="password"
                        isRequired />
                </v-col>
                <v-row class="d-flex justify-center">
                    <v-col cols="auto">
                        <v-btn @click="onResetPassword" :loading="loading" size="x-large" color="confirmButtonColor">
                            {{ $t("form.send") }}
                        </v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn size="x-large" color="cancelButtonColor" :to="{ name: 'sign-in' }">
                            {{ $t('general.cancel') }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-col cols="12" class="pt-8">
                    <v-row>
                        <v-col cols="12" v-for="(item, index) in rulesArray" :key="index" align="start">
                            <v-icon :color="item.isValid ? 'success' : 'error'">mdi-check-circle</v-icon>
                            {{ item.message }}
                        </v-col>
                    </v-row>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import router from "@/router";
import { storeToRefs } from "pinia";
import i18n from "@/core/plugins/i18n";
const t = i18n.global.t;

const authStore = useAuthStore();
const resetPasswordCommand = ref({
    newPassword: "",
    rePassword: "",
    code: ""
});

const rulesArray = ref([
    { isValid: false, message: t('statusCode.PasswordTooShort') },
    { isValid: false, message: t('statusCode.PasswordRequiresUpper') },
    { isValid: false, message: t('statusCode.PasswordRequiresLower') },
    { isValid: false, message: t('statusCode.PasswordRequiresNonAlphanumeric') },
    { isValid: false, message: t('statusCode.PasswordsNotMatch') },
])

const { loading } = storeToRefs(authStore);
const code = ref('');

onMounted(() => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    code.value = params.get('code') ?? '';
    if (!code.value) {
        router.push({ name: 'sign-in' })
    }
});

const passwordResetFormRef = ref(null as any)
const onResetPassword = async () => {
    passwordResetFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            if (resetPasswordCommand.value.newPassword === resetPasswordCommand.value.rePassword) {
                resetPasswordCommand.value.code = code.value;
                authStore.resetPassword(resetPasswordCommand.value);
            } else {
                ErrorStatusResult[400]({ message: 'form.rePasswordValidation' })
            }
        }
    })
};

watch(() => resetPasswordCommand.value.newPassword, (value) => {
    // 1. En az 6 karakter olmalı
    if (value.length > 6)
        rulesArray.value[0].isValid = true;
    else
        rulesArray.value[0].isValid = false;

    // 2. En az 1 tane büyük harf olmalı
    if (/[A-Z]/.test(value))
        rulesArray.value[1].isValid = true;
    else
        rulesArray.value[1].isValid = false;

    // 3. En az 1 tane küçük harf olmalı
    if (/[a-z]/.test(value))
        rulesArray.value[2].isValid = true;
    else
        rulesArray.value[2].isValid = false;

    // 4. En az 1 tane özel karakter olmalı
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value))
        rulesArray.value[3].isValid = true;
    else
        rulesArray.value[3].isValid = false;

    // 5. Şifreler Eşleşmiyor
    if (resetPasswordCommand.value.newPassword === resetPasswordCommand.value.rePassword && resetPasswordCommand.value.rePassword)
        rulesArray.value[4].isValid = true;
    else
        rulesArray.value[4].isValid = false;

})

watch(() => resetPasswordCommand.value.rePassword, (value) => {
    // 5. Şifreler Eşleşmiyor
    if (resetPasswordCommand.value.newPassword === resetPasswordCommand.value.rePassword && resetPasswordCommand.value.newPassword)
        rulesArray.value[4].isValid = true;
    else
        rulesArray.value[4].isValid = false;
})
</script>