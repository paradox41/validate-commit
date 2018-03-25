import { Preset } from "../interfaces";

import { log } from "../helpers";

export const jshint: Preset = {
  validate(message: string): boolean {
    const HEADER_LENGTH: number = 60;
    const LINES_LENGTH: number = 100;

    // A github issue reference - e.g., #1234, GH-1, gh-1, user/repo#1234
    const GH: string = "(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)";
    // Any string starting with an uppercase character or a digit and not referencing a github issue
    const SHORTDESCR: string = `((?=[A-Z0-9])(?:(?!${GH}).)*)`;
    // [[TYPE]] part
    const TITLE: string = "\\[{2}([A-Z]+)\\]{2}";
    // Fixup pattern (optional)
    const FIXUP: string = "(?:fixup!\\s*)?";
    const HEADER_PATTERN: RegExp = new RegExp(`^${FIXUP}${TITLE}\\s${SHORTDESCR}$`);

    const lines: string[] = message
      .trim()
      .split("\n")
      .map((line) => line.trim());
    const header: string = lines.shift();

    if (header.length > HEADER_LENGTH) {
      log(`Header is longer than ${HEADER_LENGTH} characters.`, "error");

      return false;
    }

    const match: RegExpExecArray = HEADER_PATTERN.exec(header);

    if (!match) {
      log('Header does not match "[[TYPE]] Short description".', "error");
      log(`Given: "${header}".`, "info");

      return false;
    }

    // Is input title ok?
    const TITLES: string[] = ["FIX", "FEAT", "DOCS", "TEST", "CHORE"];

    if (TITLES.indexOf(match[1]) === -1) {
      log(`The word "${match[1]}" is not an allowed title.`, "error");
      log(`Valid titles are: ${TITLES.join(", ")}.`, "info");

      return false;
    }

    // Early exit for one line commit messages
    if (lines.length === 0) {
      return true;
    }

    const secondLine: string = lines.shift();

    // Is second line a blank one?
    if (secondLine.length > 0) {
      log("Second line of commit message must be a blank line.", "error");

      return false;
    }

    if (!lines.every((line) => line.length <= LINES_LENGTH)) {
      log(`Line lengths (except first) should be wrapped at ${LINES_LENGTH} columns.`, "error");

      return false;
    }

    return true;
  },
  ignorePattern: /^\[{2}WIP\]{2}/
};
