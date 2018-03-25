import { expect } from "chai";

import presets from "../dist";

describe("presets", function() {
  describe("angular", function() {
    var { validate, ignorePattern } = presets["angular"];

    it('should ignore validation if the message contains "WIP"', function() {
      expect(ignorePattern.test("WIP: some message")).to.be.true;
    });

    it("should return false if the message is too long", function() {
      var str = new Array(100 + 1).join("a");

      expect(validate(`test(foo): ${str}`)).to.be.false;
    });

    it("should return false if it is not in the correct format", function() {
      expect(validate("bar[foo]: aaaaa")).to.be.false;

      expect(validate("barfoo]: aaaaa")).to.be.false;

      expect(validate("bar{foo}: aaaaa")).to.be.false;
    });

    it("should return false if the type provided is not valid", function() {
      expect(validate("foo(bar): bbbbbb")).to.be.false;
    });

    it("should validate a message if a valid type is provided", function() {
      expect(validate("chore(package): update package")).to.be.true;
    });

    it("should validate a message under 100 characters", function() {
      var str = new Array(80).join("a");

      expect(validate(`chore(package): ${str}`)).to.be.true;
    });
  });

  describe("atom", function() {
    var { validate } = presets["atom"];

    it("should return false if the message is too long", function() {
      var str = new Array(72 + 1).join("a");

      expect(validate(`:art: ${str}`)).to.be.false;
    });

    it("should reject invalid emojis", function() {
      expect(validate(":banana: fix a thing")).to.be.false;
    });

    it("should reject multiple emojis", function() {
      expect(validate(":art::racehorse: fix another thing")).to.be.false;
    });

    it("should validate a properly formatted message", function() {
      expect(validate(":art: make it pretty")).to.be.true;
    });
  });

  describe("eslint", function() {
    var { validate, ignorePattern } = presets["eslint"];

    it('should ignore validation if the message contains "WIP"', function() {
      expect(ignorePattern.test("WIP: Some message")).to.be.true;
    });

    it('should validate a correct commit message preceded by "fixup!" prefix', function() {
      expect(validate("fixup! Fix: Message (refs #1234)")).to.be.true;
      expect(validate("fixup! Fix: Message")).to.be.true;
    });

    it("should return false if it is not in the correct format", function() {
      // Lowercase message
      expect(validate("Tag: message")).to.be.false;
      // Lowercase tag
      expect(validate("tag: Message")).to.be.false;
      expect(validate("tag: message")).to.be.false;
      // Message containing a reference to a github issue
      expect(validate("Tag: Close user/repo#22")).to.be.false;
      expect(validate("Tag: Close user/my.repo#22")).to.be.false;
      expect(validate("Tag: Close my-user/my-repo#22")).to.be.false;
      expect(validate("Tag: Close my-user/my.repo#22")).to.be.false;
      expect(validate("Tag: Close my_user/my_repo#22")).to.be.false;
      expect(validate("Tag: Close my_user/my.repo#22")).to.be.false;
      expect(validate("Tag: Close #22")).to.be.false;
      expect(validate("Tag: Close gh-22")).to.be.false;
      expect(validate("Tag: Close GH-22")).to.be.false;
      // Space missing after message
      expect(validate("Tag: Ciao(refs #1987)")).to.be.false;
      expect(validate("Fix: Ciao(fixes user/repo#1987)")).to.be.false;
      // More issue references not comma separated
      expect(validate("Fix: Ciao (fixes #87) (refs #22)")).to.be.false;
      // Test after issue references
      expect(validate("Fix: Message (fixes #87) text")).to.be.false;
    });

    it("should return false if the tag provided is not valid", function() {
      expect(validate("Unknown: Message")).to.be.false;
      expect(validate("Unknown: Message (refs #22)")).to.be.false;
    });

    it("should validate a correct commit message", function() {
      expect(validate("Fix: Message")).to.be.true;
      expect(validate("New: Preset for eslint")).to.be.true;
      expect(validate("Update: 1st change")).to.be.true;
      expect(validate("Breaking: New APIs (refs #1)")).to.be.true;
      expect(validate("Docs: Readme (refs #10)")).to.be.true;
      expect(validate("Build: Gulp (refs gh-22)")).to.be.true;
      expect(validate("Update: Ciao (refs GH-22)")).to.be.true;
      expect(validate("Update: Ciao (refs user/repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs user/one.repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs my-user/one-repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs my-user/one_repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs my_user/one-repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs my_user/one_repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs user/one-repo#22)")).to.be.true;
      expect(validate("Update: Ciao (refs user/one_repo#22)")).to.be.true;
      expect(validate("Fix: Ciao (fixes #22)")).to.be.true;
      expect(validate("Upgrade: Ciao (refs #87, fixes #22)")).to.be.true;
    });
  });

  describe("ember", function() {
    var { validate } = presets["ember"];

    it("should return false if the message is not in the correct format", function() {
      expect(validate("(DOCS canary) Update docs")).to.be.false;
      expect(validate("[FEATUR add a thing] Amazing new feature")).to.be.false;
      expect(validate("[DOC notachannel] Update docs")).to.be.false;
      expect(validate("[DOC beta]")).to.be.false;
    });

    it("should return true if the message is in the correct format", function() {
      expect(validate("[DOC beta] Update CONTRIBUTING.md for commit prefixes")).to.be.true;
      expect(validate("[FEATURE query-params-new] Message")).to.be.true;
      expect(validate("[BUGFIX beta] Message")).to.be.true;
      expect(validate("[SECURITY CVE-111-1111] Message")).to.be.true;
    });

    it("should handle multiline commits", function() {
      const message = `
        [DOC beta] Update CONTRIBUTING.md for commit prefixes

        Fixes #3180
      `;

      expect(validate(message)).to.be.true;
    });
  });

  describe("jquery", function() {
    var { validate } = presets["jquery"];

    it("should return false if the message is not in the correct format", function() {
      var str = new Array(72 + 1).join("a");

      expect(validate("[Component]: Short Description")).to.be.false;
      expect(validate("Component Short Description")).to.be.false;
      expect(validate("Component: Short Description.")).to.be.false;
      expect(validate(`Component: Short Description ${str}`)).to.be.false;
    });

    it("should return true if the message is in the correct format", function() {
      expect(validate("Component: Short Description")).to.be.true;
      expect(validate("Release: remove extraneous files from dist during release")).to.be.true;
      expect(validate("Deferred: Give better stack diagnostics on exceptions")).to.be.true;
      expect(validate("Release: update AUTHORS.txt")).to.be.true;
      expect(validate("Event: Add touch event properties, eliminates need for a plugin")).to.be
        .true;
    });

    it("should handle multiline commits", function() {
      const message = `
        Event: Add touch event properties, eliminates need for a plugin

        Fixes gh-3104
        Closes gh-3108

        See https://github.com/aarongloege/jquery.touchHooks

        Other properties are already present thanks to mouse events.

        squash! Add targetTouches
      `;

      expect(validate(message)).to.be.true;
    });

    it("should fail with invalid multiline commits", function() {
      const message1 = `
        Fixes gh-3104
        Closes gh-3108

        See https://github.com/aarongloege/jquery.touchHooks

        Other properties are already present thanks to mouse events.

        squash! Add targetTouches
      `;
      const message2 = `Component: Short Description
        Closes gh-3108

        See https://github.com/aarongloege/jquery.touchHooks

        ${new Array(80 + 1).join("A")}

        squash! Add targetTouches
      `;

      expect(validate(message1)).to.be.false;
      expect(validate(message2)).to.be.false;
    });
  });

  describe("jshint", function() {
    var { validate, ignorePattern } = presets["jshint"];

    it('should ignore validation if the message starts with "[[WIP]]"', function() {
      expect(ignorePattern.test("[[WIP]] hello world with some description")).to.be.true;
    });

    it('should validate a correct commit message preceded by "fixup!" prefix', function() {
      expect(validate("fixup! [[FIX]] Message")).to.be.true;
      expect(validate("fixup! [[FEAT]] Message")).to.be.true;
    });

    it("should return false if the title provided is not valid", function() {
      expect(validate("[[INVALID]] Message")).to.be.false;
      expect(validate("[[UNKNOWN]] Short descr")).to.be.false;
    });

    it("should return false if the description does not start with an uppercase character or a digit", function() {
      expect(validate("[[FIX]] lowercase")).to.be.false;
    });

    it("should return false if the second line is not blank", function() {
      const mex = `[[FIX]] Short description.
      I'm not blank.
      `;
      expect(validate(mex)).to.be.false;
    });

    it("should validate correct multiline commit messages", function() {
      const mex = `[[CHORE]] Something.

      This commit bla bla bla.
      However bla bla bla.

      Closes #2
      `;
      expect(validate(mex)).to.be.true;
    });

    it("should return false if it is not in the correct format", function() {
      // Lowercase but valid tag
      expect(validate("[[fix]] Message")).to.be.false;
      expect(validate("[[chore]] Message")).to.be.false;

      // Message containing a reference to a github issue
      expect(validate("[[FEAT]] Close user/repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close user/my.repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close my-user/my-repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close my-user/my.repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close my_user/my_repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close my_user/my.repo#22")).to.be.false;
      expect(validate("[[FEAT]] Close #22")).to.be.false;
      expect(validate("[[FEAT]] Close gh-22")).to.be.false;
      expect(validate("[[FEAT]] Close GH-22")).to.be.false;

      // Space missing before description
      expect(validate("[[FEAT]]Ciao")).to.be.false;
    });

    it("should return false if header is too long", function() {
      expect(
        validate(
          "[[FIX]] Very long description that it should be short and contain a maximum sixty characters."
        )
      ).to.be.false;
    });

    it("should return false if body lines are not wrapped at 100 columns", function() {
      const mex = `[[DOCS]] Github pages

      Deploy
      Deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy
      Deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy deploy

      Closes #3
      `;
      expect(validate(mex)).to.be.false;
    });
  });
});
