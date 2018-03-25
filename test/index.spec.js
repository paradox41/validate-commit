import path from "path";

import { expect } from "chai";
import "mocha-sinon";

import presets, { validateMessage, validateMessageFromFile } from "../dist";

describe("#validateMessage", function() {
  it("should return false if no message is provided", function() {
    expect(validateMessage()).to.be.false;
    expect(validateMessage("")).to.be.false;
  });

  it("should throw an error if no valid preset is provided", function() {
    const f = function() {
      validateMessage("chore(package): foo", {
        preset: "notapreset"
      });
    };

    expect(f).to.throw(Error);
  });

  describe("#ignorePattern", function() {
    beforeEach(function() {
      this.sinon.stub(console, "warn");
    });

    afterEach(function() {
      this.sinon.restore();
    });

    it("should omit validation if ignore pattern is provided", function() {
      expect(validateMessage("WIP: ignore me")).to.be.true;
    });

    it("should warn that validation has been ignored when SILENT env variable is missing and ignore pattern is used", function() {
      delete process.env.SILENT;
      validateMessage("WIP: work in progress");
      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.calledWith("Commit message validation ignored.")).to.be.true;
      process.env.SILENT = true;
    });
  });
});

describe("#validateMessageFromFile", function() {
  const validFixture = {};
  const wrongFixture = {};

  for (let preset in presets) {
    validFixture[preset] = path.resolve(__dirname, "fixtures", preset, "valid.txt");
    wrongFixture[preset] = path.resolve(__dirname, "fixtures", preset, "wrong.txt");
  }

  for (let preset in validFixture) {
    it(`should accept a valid message for ${preset} preset`, function() {
      expect(validateMessageFromFile(validFixture[preset], { preset })).to.be.true;
    });
  }

  for (let preset in wrongFixture) {
    it(`should reject a wrong message for ${preset} preset`, function() {
      expect(validateMessageFromFile(wrongFixture[preset], { preset })).to.be.false;
    });
  }

  it("should use the default preset", function() {
    const defaultPreset = "angular";
    const fixture = path.resolve(__dirname, "fixtures", defaultPreset, "wrong.txt");

    expect(validateMessageFromFile(fixture)).to.be.false;
  });
});

describe("#logging", function() {
  beforeEach(function() {
    // Some mocha reporters use console.log as well, so the tests that stub it may not yield any output
    // Workaround
    var log = console.log;
    this.sinon.stub(console, "log").callsFake(() => log.apply(log, arguments));
  });

  afterEach(function() {
    this.sinon.restore();
  });

  describe("(SILENT ON)", function() {
    it("should not work when SILENT env variable is true (boolean)", function() {
      process.env.SILENT = true;
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.false;
    });

    it("should not work when SILENT env variable is true (string)", function() {
      process.env.SILENT = "true";
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.false;
    });
  });

  describe("(SILENT OFF)", function() {
    it("should work when SILENT env variable is missing", function() {
      delete process.env.SILENT;
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.true;
      process.env.SILENT = "true";
    });

    it("SILENT env variable false (string)", function() {
      process.env.SILENT = "false";
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.true;
      process.env.SILENT = "true";
    });

    it("SILENT env variable false (boolean)", function() {
      process.env.SILENT = false;
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.true;
      process.env.SILENT = "true";
    });

    it("SILENT env variable any string (string)", function() {
      process.env.SILENT = "ciaociao";
      validateMessage("invalid message");
      expect(console.log.calledOnce).to.be.true;
      process.env.SILENT = "true";
    });
  });
});
