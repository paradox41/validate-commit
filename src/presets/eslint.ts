import { Preset } from "../interfaces";

import { log } from "../helpers";

export const eslint: Preset = {
  validate(message: string): boolean {
    // Fixup pattern (optional)
    const FIXUP: string = "(?:fixup!\\s*)?";
    // A string starting with an uppercase character
    const TAG: string = "([A-Z][a-z]+)";
    // A github issue reference - e.g., #1234, GH-1, gh-1, user/repo#1234
    const GH: string = "(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)";
    // Any string starting with an uppercase character or a digit and not referencing a github issue
    const MESSAGE: string = `((?=[A-Z0-9])(?:(?!${GH}).)*)`;
    // Zero or more comma-separated github references preceded by the word "fixes" or "refs",
    // enclosed by parentheses
    const ISSUE: string = `(\\s\\((?:(?:(?:fixes|refs)\\s${GH})(?:,\\s(?!\\))|\\)))+)?`;
    const PATTERN: RegExp = new RegExp(`^${FIXUP}${TAG}:\\s${MESSAGE}${ISSUE}$`);

    // tslint:disable:max-line-length
    // Pattern is:
    // /^
    //   (?:fixup!\\s*)?
    //   ([A-Z][a-z]+):\\s
    //   ((?=[A-Z])(?:(?!(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)).)*)
    //   (\\s\\((?:(?:(?:fixes|refs)\\s(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+))(?:,\\s(?!\\))|\\)))+)?
    // $/
    // tslint:enable:max-line-length

    // only care about the first line
    message = message.split("\n").shift();

    const match: RegExpExecArray = PATTERN.exec(message);

    if (!match) {
      log('Message does not match "Tag: Message (fixes #1234)".', "error");
      log(`Given: "${message}".`, "info");

      return false;
    }

    const matches: string[] = match.filter((str) => (str ? true : false)).map((str) => str.trim());
    // Is input tag ok?
    const TAGS: string[] = ["Fix", "Update", "Breaking", "Docs", "Build", "New", "Upgrade"];
    if (TAGS.indexOf(matches[1]) === -1) {
      log(`The word "${matches[1]}" is not an allowed tag.`, "error");
      log(`Valid types are: ${TAGS.join(", ")}.`, "info");

      return false;
    }

    return true;
  },
  ignorePattern: /^WIP\:/
};
