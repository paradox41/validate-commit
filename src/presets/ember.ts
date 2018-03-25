import { Preset } from "../interfaces";

import { log } from "../helpers";

export const ember: Preset = {
  validate(message: string): boolean {
    const TAGS: string[] = ["DOC", "FEATURE", "BUGFIX", "SECURITY"];
    const TAG: string = `(${TAGS.join("|")})`;
    const MESSAGE: string = "(.*)";
    const GIT_MESSAGE: string = "(.*)";
    const VALID_CHANNELS: string[] = ["canary", "beta", "release"];

    const PATTERN: RegExp = new RegExp(`^\\[${TAG} ${MESSAGE}\\] ${GIT_MESSAGE}`);

    // ember only cares about the first line
    message = message
      .trim()
      .split("\n")
      .shift();

    // match[1] = <tag>
    // match[2] = <message>
    // match[3] = <git-message>
    const match: RegExpExecArray = PATTERN.exec(message);

    if (!match) {
      log('Message does not match "[<tag> <message>] <git-message>"', "error");
      log(`Given: "${message}".`, "info");

      return false;
    }

    const tag: string = match[1];
    const msg: string = match[2];

    if (tag === "DOC" && VALID_CHANNELS.indexOf(msg) === -1) {
      log("Not a valid channel for DOC", "error");
      log(`Valid channels are ${VALID_CHANNELS.join(", ")}`);

      return false;
    }

    return true;
  }
};
