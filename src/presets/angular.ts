import { Preset } from "../interfaces";

import { log } from "../helpers";

export const angular: Preset = {
  validate(message: string): boolean {
    /**
     * Git COMMIT-MSG hook for validating commit message
     * See https://docs.google.com/document/d/1rk04jEuGfk9kYzfqCuOlPTSJw3hEDZJTBN5E5f1SALo/edit
     *
     * Taken from https://github.com/angular/angular.js/blob/master/validate-commit-msg.js
     * and cleaned up a bit
     *
     * Thanks to the Angular team!
     */
    const MAX_LENGTH: number = 100;
    const PATTERN: RegExp = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/;
    const TYPES: any = {
      build: true,
      chore: true,
      ci: true,
      docs: true,
      feat: true,
      fix: true,
      perf: true,
      refactor: true,
      revert: true,
      style: true,
      test: true
    };

    // angular only cares about the first line
    message = message.split("\n").shift();

    if (message.length >= MAX_LENGTH) {
      log(`Message is longer than ${MAX_LENGTH} characters!`, "error");

      return false;
    }

    const match: RegExpExecArray = PATTERN.exec(message);

    if (!match) {
      log(`Message does not match "<type>(<scope>): <subject>"! was: ${message}`, "error");

      return false;
    }

    const type: string = match[1];
    // in case they are needed
    // const scope: string = match[3];
    // const subject: string = match[4];

    if (!TYPES.hasOwnProperty(type)) {
      log(`'${type}' is not an allowed type!`, "error");
      log(`Valid types are: ${Object.keys(TYPES).join(", ")}`, "info");

      return false;
    }

    return true;
  },
  ignorePattern: /^WIP\:/
};
