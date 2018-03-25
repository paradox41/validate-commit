import * as chalk from "chalk";

import { LogLevels, Severity } from "./interfaces";

const LOG_LEVELS: LogLevels = {
  error: {
    color: "red"
  },
  warn: {
    color: "yellow"
  },
  info: {
    color: "cyan"
  },
  debug: {
    color: "white"
  }
};

export function log(message: string, severity: Severity = "info"): void {
  const color: string = LOG_LEVELS[severity].color || "cyan";

  if (process.env.SILENT !== "true") {
    console.log((<any>chalk)[color](message));
  }
}
