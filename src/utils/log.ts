import { logger } from "react-native-logs";

const myLogger = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
  async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  fixedExtLvlLength: false,
  enabled: true,
});

export const log = myLogger;
