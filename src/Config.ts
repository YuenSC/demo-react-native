import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

import { version } from "../package.json";

const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  isDev: __DEV__,
  version,
  adBannerUnitId: __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : Platform.select({
        ios: "ca-app-pub-3349863138501385/2202800899",
        android: "",
      }) || "",
  adInterstitialUnitId: __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        ios: "ca-app-pub-3349863138501385/4558018413",
      }) || "",
};

export default Config;
