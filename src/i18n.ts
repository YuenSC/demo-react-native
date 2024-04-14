import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../languages/en.json";
import ja from "../languages/ja.json";
import zhHK from "../languages/zh-HK.json";

export enum LanguageEnum {
  EN = "en",
  JA = "ja",
  ZH_HK = "zh-HK",
}

const resources = {
  [LanguageEnum.EN]: en,
  [LanguageEnum.JA]: ja,
  [LanguageEnum.ZH_HK]: zhHK,
};

const deviceLanguage = getLocales()[0].languageCode;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: "v3",
    resources,
    lng: deviceLanguage || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
