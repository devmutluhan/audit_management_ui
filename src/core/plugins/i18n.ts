import { createI18n } from "vue-i18n";
import tr from "./locales/tr";
import en from "./locales/en";

const messages = {
  en: en,
  tr: tr
};

const i18n = createI18n({
  legacy: false,
  locale: "tr",
  globalInjection: true,
  messages,
});

export default i18n;
