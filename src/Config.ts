import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

import { version } from "../package.json";

const adUnitId =
  Platform.select({
    ios: "ca-app-pub-3349863138501385~9578743941",
    android: "",
  }) || "";

const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  isDev: __DEV__,
  version,
  adBannerUnitId: __DEV__ ? TestIds.ADAPTIVE_BANNER : adUnitId,
  adAppOpenUnitId: __DEV__ ? TestIds.APP_OPEN : adUnitId,
  adInterstitialUnitId: __DEV__ ? TestIds.INTERSTITIAL : adUnitId,
};

export default Config;
