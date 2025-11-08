export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { logger, ragLogger, medicalLogger } from "./api.logger";
