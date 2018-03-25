import { Preset } from "../interfaces";

import { log } from "../helpers";

export const atom: Preset = {
  validate(message: string): boolean {
    const MAX_LENGTH: number = 72;
    const EMOJIS: string[] = [
      ":art:",
      ":racehorse:",
      ":non-potable_water:",
      ":memo:",
      ":penguin:",
      ":apple:",
      ":checkered_flag:",
      ":bug:",
      ":fire:",
      ":green_heart:",
      ":white_check_mark:",
      ":lock:",
      ":arrow_up:",
      ":arrow_down:",
      ":shirt:"
    ];
    const PATTERN: RegExp = new RegExp(`^(${EMOJIS.join("|")})(?:\ )(?:.*)$`);

    // atom only cares about the first line
    message = message.split("\n").shift();

    if (message.length > MAX_LENGTH) {
      log(`Message is longer than ${MAX_LENGTH} characters!`, "error");

      return false;
    }

    const match: RegExpExecArray = PATTERN.exec(message);

    if (!match) {
      log(`Message does not match "<emoji> <subject>"! was: ${message}`, "error");
      log(`Valid emojis are: ${EMOJIS.join(", ")}`, "info");

      return false;
    }

    return true;
  }
};
