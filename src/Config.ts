import { version } from "../package.json";

const Config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  isDev: __DEV__,
  version,
};

export default Config;
