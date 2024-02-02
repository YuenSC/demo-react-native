import { logger } from "react-native-logs";

const myLogger = logger.createLogger();

export const log = myLogger.info;
