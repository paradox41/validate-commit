import * as fs from "fs";

import { Opts, Preset, Presets } from "./interfaces";

import { angular, atom, ember, eslint, jquery, jshint } from "./presets";

const presets: Presets = {
  angular,
  atom,
  eslint,
  ember,
  jquery,
  jshint
};

/**
 * Validate a commit message according to preset
 * @param  {string} message The commit message
 * @param  {object} options
 * @return {boolean} Whether or not the message was valid
 */
function validateMessage(message: string, options: Opts = {}): boolean {
  if (!message) {
    return false;
  }

  message = message.trim();

  options = (<any>Object).assign(
    {
      preset: "angular"
    },
    options
  );

  const preset: Preset = presets[options.preset];

  if (!preset) {
    throw new Error(`Preset '${options.preset}' does not exist. A preset must be provided`);
  }

  const { validate, ignorePattern }: Preset = preset;

  if (ignorePattern && ignorePattern.test(message)) {
    if (process.env.SILENT === "true" || !process.env.SILENT) {
      console.warn("Commit message validation ignored.");
    }

    return true;
  }

  return validate(message);
}

/**
 * @private
 * Convert a buffer to a string
 * @param  {Buffer} buffer
 * @return {string}
 */
function getMessageFromBuffer(buffer: Buffer): string {
  return buffer.toString();
}

/**
 * Validate a commit message from a file - e.g., for a pre-commit hook
 * @param {string} file The file to be read in
 * @param {object} options
 * @return {boolean}
 */
function validateMessageFromFile(file: string, options: Opts = {}): boolean {
  const buffer: Buffer = fs.readFileSync(file);
  const message: string = getMessageFromBuffer(buffer);

  return validateMessage(message, options);
}

export default presets;

export { validateMessage, validateMessageFromFile };
