import { Dimensions, Platform } from "react-native";

const Device = {
  screen: Dimensions.get("window"),
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
};

export default Device;
