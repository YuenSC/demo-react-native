import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../languages/en.json";
import ja from "../languages/ja.json";
import zhHK from "../languages/zh-HK.json";

export enum LanguageEnum {
  EN = "en",
  JA = "ja",
  ZH_HK = "zh-HK",
}
export const LanguageLabels = {
  [LanguageEnum.EN]: "English",
  [LanguageEnum.JA]: "日本語",
  [LanguageEnum.ZH_HK]: "繁體中文",
};

const resources = {
  [LanguageEnum.EN]: en,
  [LanguageEnum.JA]: ja,
  [LanguageEnum.ZH_HK]: zhHK,
};

const deviceLanguage = getLocales()[0].languageCode;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use({
    type: "languageDetector",
    async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
    init(services, detectorOptions, i18nextOptions) {
      console.log("init");
    },
    detect(callback) {
      console.log("detect");
      AsyncStorage.getItem("user-language").then((userLanguage) => {
        console.log("userLanguage", userLanguage);
        callback(userLanguage || deviceLanguage || "en");
      });
    },
    cacheUserLanguage(lng) {
      console.log("cacheUserLanguage");
      AsyncStorage.setItem("user-language", lng);
    },
  } satisfies LanguageDetectorAsyncModule)
  .init({
    compatibilityJSON: "v3",
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    supportedLngs: Object.keys(resources),
  });

export default i18n;
