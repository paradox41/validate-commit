export type PresetTypes = "angular" | "atom" | "ember" | "eslint" | "jquery" | "jshint";

export type Severity = "error" | "warn" | "info" | "debug";

export interface LogLevels {
  [severity: string]: {
    color: string;
  };
}

export interface Preset {
  ignorePattern?: RegExp;
  validate(message: string): boolean;
}

export interface Presets {
  [preset: string]: Preset;
}

export interface Opts {
  preset?: PresetTypes;
}
