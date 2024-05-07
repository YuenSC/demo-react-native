import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

import { version } from "../package.json";

const isProduction = process.env.NODE_ENV === "prod";

const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  isDev: process.env.EXPO_PUBLIC_ENV === "dev",
  version,
  adBannerUnitId: isProduction
    ? Platform.select({
        ios: "ca-app-pub-3349863138501385/2202800899",
        android: "",
      }) || ""
    : TestIds.ADAPTIVE_BANNER,
  adInterstitialUnitId: isProduction
    ? Platform.select({
        ios: "ca-app-pub-3349863138501385/4558018413",
      }) || ""
    : TestIds.INTERSTITIAL,
};

export default Config;
