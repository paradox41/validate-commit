import { Preset } from "../interfaces";

import { log } from "../helpers";

export const jquery: Preset = {
  validate(message: string): boolean {
    const SUBJECT_MAX_LENGTH: number = 72;
    const LONG_DESCRIPTION_MAX_LENGTH: number = 80;
    const SUBJECT_PATTERN: RegExp = /^(\w*): ([\w\s\S]*[^.])$/;

    const messageParts: string[] = message
      .trim()
      .split("\n")
      .map((line) => line.trim());

    const subject: string = messageParts[0];
    const match: RegExpExecArray = SUBJECT_PATTERN.exec(subject);

    if (subject.length > SUBJECT_MAX_LENGTH) {
      log(`Subject is longer than ${SUBJECT_MAX_LENGTH} characters.`, "error");

      return false;
    }

    if (!match) {
      log('Subject does not match "Component: Short Description".', "error");
      log(`Given: "${subject}".`, "info");

      return false;
    }

    const isMessageLengthValid: boolean = messageParts.slice(1).every((part: string): boolean => {
      return part.length < LONG_DESCRIPTION_MAX_LENGTH;
    });

    if (!isMessageLengthValid) {
      log(
        // tslint:disable:max-line-length
        `Line lengths (except the subject one) should be wrapped at ${LONG_DESCRIPTION_MAX_LENGTH} columns.`,
        // tslint:enable:max-line-length
        "error"
      );

      return false;
    }

    return true;
  }
};
