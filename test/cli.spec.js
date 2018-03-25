import { exec, execSync } from "child_process";
import path from "path";

import { expect } from "chai";
import "mocha-sinon";

const pathToCLI = path.resolve(__dirname, "..", "bin", "index.js");

describe("cli", function() {
  beforeEach(function() {
    this.command = [pathToCLI];
  });

  it("should not throw an error with a valid commit message", function(done) {
    this.command.push('"chore: foo"');

    let command = this.command.join(" ");

    exec(command, function(error) {
      if (error) {
        throw error;
      }

      expect(error).to.be.null;

      done();
    });
  });

  it("should throw an error with an invalid commit message", function() {
    this.command.push('"foo"');

    let command = this.command.join(" ");

    let fn = () => {
      return execSync(command);
    };

    expect(fn).to.throw(Error);
  });

  it("should not throw an error with a valid commit msm file", function(done) {
    this.command.push("--mf ./test/fixtures/angular/valid.txt");

    let command = this.command.join(" ");

    exec(command, function(error) {
      if (error) {
        throw error;
      }

      expect(error).to.be.null;

      done();
    });
  });

  it("should throw an error with a invalid commit msm file", function() {
    this.command.push("--mf .git/WRONG_COMMIT_EDITMSG");

    let command = this.command.join(" ");

    let fn = () => {
      return execSync(command);
    };

    expect(fn).to.throw(Error);
  });
});
