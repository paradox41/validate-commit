#!/usr/bin/env node
var path = require('path');
var yargs = require('yargs');
var isFile = require('is-file');

var validate = require('../dist');

var argv = yargs
  .usage('validate-commit-msg <message>')
  .option('preset', {
    alias: 'p',
    type: 'string',
    default: 'angular',
    description: 'specify a preset',
    choices: ['angular', 'atom', 'eslint', 'ember', 'jquery', 'jshint']
  })
  .option('silent', {
    alias: 's',
    type: 'boolean',
    default: false,
    description: 'mute log messages'
  })
  .option('msgfile', {
    alias: 'mf',
    type: 'string',
    default: false,
    description: 'relative path to COMMIT_EDITMSG file'
  })
  .version()
  .help().argv;

var valid = false;

var workspaceRoot =  process.cwd()
var message = argv._[0];
var msgFile = argv.mf
var options = {
  preset: argv.preset
};

if (argv.silent) {
  process.env.SILENT = true;
}

if (message === undefined) {

  var gitFolder = path.resolve(workspaceRoot, '.git');

  if (!gitFolder) {
    throw new Error('No .git folder found');
  }

  var commitMsgFile =  msgFile ? path.resolve(workspaceRoot , msgFile) : path.resolve(gitFolder, 'COMMIT_EDITMSG');
    
  valid = validate.validateMessageFromFile(commitMsgFile, options);
} else {
  if (isFile(message)) {
    valid = validate.validateMessageFromFile(message, options);
  } else {
    valid = validate.validateMessage(message, options);
  }
}

if (valid === false) {
  process.exit(1);
}
process.exit(0);