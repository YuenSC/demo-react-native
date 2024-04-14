import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../languages/en.json";
import es from "../languages/es.json";
import fr from "../languages/fr.json";
import hi from "../languages/hi.json";
import ja from "../languages/ja.json";
import pt from "../languages/pt.json";
import ru from "../languages/ru.json";
import zhHK from "../languages/zh-HK.json";
import zh from "../languages/zh.json";

export enum LanguageEnum {
  EN = "en",
  JA = "ja",
  ZH_HK = "zh-HK",
  ZH = "zh",
  ES = "es",
  HI = "hi",
  PT = "pt",
  RU = "ru",
  FR = "fr",
}
export const LanguageLabels = {
  [LanguageEnum.EN]: "English",
  [LanguageEnum.JA]: "日本語",
  [LanguageEnum.ZH_HK]: "繁體中文",
  [LanguageEnum.ZH]: "简体中文",
  [LanguageEnum.ES]: "Español",
  [LanguageEnum.HI]: "हिन्दी",
  [LanguageEnum.PT]: "Português",
  [LanguageEnum.RU]: "русский",
  [LanguageEnum.FR]: "français",
};

const resources = {
  [LanguageEnum.EN]: en,
  [LanguageEnum.JA]: ja,
  [LanguageEnum.ZH_HK]: zhHK,
  [LanguageEnum.ZH]: zh,
  [LanguageEnum.ES]: es,
  [LanguageEnum.HI]: hi,
  [LanguageEnum.PT]: pt,
  [LanguageEnum.RU]: ru,
  [LanguageEnum.FR]: fr,
};

const { languageCode, regionCode } = getLocales()[0];

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use({
    type: "languageDetector",
    async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
    init(services, detectorOptions, i18nextOptions) {},
    detect(callback) {
      AsyncStorage.getItem("user-language").then((userLanguage) => {
        console.log(userLanguage || languageCode || "en");

        // use tag if our LanguageEnum has that tag
        const detectedTag = Object.values(LanguageEnum).find((lang) =>
          lang.includes(regionCode || ""),
        );

        callback(userLanguage || detectedTag || languageCode || "en");
      });
    },
    cacheUserLanguage(lng) {
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
