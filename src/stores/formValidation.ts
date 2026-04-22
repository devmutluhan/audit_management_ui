import { ref } from 'vue'
import { defineStore } from 'pinia'
import i18n from "@/core/plugins/i18n";

const t = i18n.global.t;
export const useFormValidationStore = defineStore('formValidation', () => {
  const stringRules = ref([
    (val: string) => {
      const value = val?.toString();
      if (value) return true;
      else return t("general.required");
    },
  ])

  const objectRules = ref([
    (val: Array<any>) => {
      if (val) {
        if (val[0]) {
          if (val[0].id)
            return true
          else
            return t("general.required");
        } else
          return t("general.required");
      } else {
        return t("general.required");
      }
    },
  ])

  const numberRules = ref([
    (val: string) => {
      if (/[^0-9.]/.test(val)) return t("statusCode.justEnterNumber");

      if (val.length == 0) return t("general.required");

      const value = Number(val)

      if (isNaN(value)) return t("statusCode.justEnterNumber");

      if (value >= 0) return true;
      else return t("general.required");
    },
  ])

  const numberRulesForMaxLimit = (limit: number) => {
    return ref([
      (val: string) => {
        if (val === null || val === undefined || val.length == 0) return t("general.required");
        if (/[^0-9.]/.test(val)) return t("statusCode.justEnterNumber");

        const value = Number(val)
        if (isNaN(value)) return t("statusCode.justEnterNumber");

        if (value <= limit) return true;
        else return t("general.exceedingTheLimit") + ' (' + limit + ')';
      },
    ])
  }

  const numberRulesForMinLimit = (limit: number) => {
    return ref([
      (val: string) => {
        if (val === null || val === undefined || val.length == 0) return t("general.required");
        if (/[^0-9.]/.test(val)) return t("statusCode.justEnterNumber");

        const value = Number(val)
        if (isNaN(value)) return t("statusCode.justEnterNumber");

        if (value >= limit) return true;
        else return t("general.underTheLimit") + ' (' + limit + ')';
      },
    ])
  }

  const dateRules = ref([
    (val: string) => {
      const value = val.toString();
      if (value) return true;
      else return t("general.required");
    },
  ])

  const passwordRules = ref([
    (value: string) => {
      // 1. En az 6 karakter olmalı
      if (value.length < 6) {
        return t('statusCode.PasswordTooShort');
      }
      // 2. En az 1 tane büyük harf olmalı
      if (!/[A-Z]/.test(value)) {
        return t('statusCode.PasswordRequiresUpper');
      }
      // 3. En az 1 tane küçük harf olmalı
      if (!/[a-z]/.test(value)) {
        return t('statusCode.PasswordRequiresLower');
      }
      // 4. En az 1 tane özel karakter olmalı
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return t('statusCode.PasswordRequiresNonAlphanumeric');
      }
      return true;
    },
  ]);

  const arrayRules = ref([
    (value: any[]) => {
      if (value.length > 0) return true;
      else return t("general.required");
    }]);


  const phoneNumberRules = ref([
    (value: string) => {
      const filteredValue = value?.replace(/\s+/g, '');
      if (filteredValue?.length === 10) {
        if (/[^0-9]/.test(filteredValue)) {
          return t('statusCode.justEnterNumber')
        }
        return true;
      }
      else
        return "Telefon Numarası 10 haneli olmalıdır!"
    },
  ])

  const emailRules = ref([
    (value: string) => {
      if (value) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(value)) {
          return true;
        } else {
          return t('statusCode.isEmailPattern');
        }
      } else {
        return t('general.required');
      }
    }
  ])

  return {
    stringRules,
    numberRules,
    objectRules,
    dateRules,
    passwordRules,
    arrayRules,
    numberRulesForMaxLimit,
    numberRulesForMinLimit,
    phoneNumberRules,
    emailRules
  }
})
