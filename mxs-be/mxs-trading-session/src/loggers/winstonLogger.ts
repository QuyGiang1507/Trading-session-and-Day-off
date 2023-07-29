import { Logger } from "@mxs/common";

export const logger = new Logger(process.env.SERVICE_NAME, process.env.NODE_ENV);