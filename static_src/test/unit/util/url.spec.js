import "../../global_setup.js";
import * as url from "../../../util/url.js";

describe("url", function() {
  describe("appHref()", function() {
    describe("with undefined parameters", function() {
      it("throws", function() {
        expect(() => url.appHref()).toThrowError(/Entity must be provided/);
      });
    });

    describe("with entities", function() {
      let org, space, app;

      beforeEach(function() {
        org = { guid: "org-guid-123" };
        space = { guid: "space-guid-123" };
        app = { guid: "app-guid-123" };
      });

      it("returns a url with guids", function() {
        expect(url.appHref(org, space, app)).toBe(
          "/#/org/org-guid-123/spaces/space-guid-123/apps/app-guid-123"
        );
      });
    });

    describe("with guids", function() {
      let org, space, app;

      beforeEach(function() {
        org = "org-guid-123";
        space = "space-guid-123";
        app = "app-guid-123";
      });

      it("returns a url with guids", function() {
        expect(url.appHref(org, space, app)).toBe(
          "/#/org/org-guid-123/spaces/space-guid-123/apps/app-guid-123"
        );
      });
    });
  });

  describe("spaceHref()", function() {
    describe("with undefined parameters", function() {
      it("throws", function() {
        expect(() => url.spaceHref()).toThrowError(/Entity must be provided/);
      });
    });

    describe("with entities", function() {
      let org, space;

      beforeEach(function() {
        org = { guid: "org-guid-123" };
        space = { guid: "space-guid-123" };
      });

      it("returns a url with guids", function() {
        expect(url.spaceHref(org, space)).toBe(
          "/#/org/org-guid-123/spaces/space-guid-123"
        );
      });
    });

    describe("with guids", function() {
      let org, space;

      beforeEach(function() {
        org = "org-guid-123";
        space = "space-guid-123";
      });

      it("returns a url with guids", function() {
        expect(url.spaceHref(org, space)).toBe(
          "/#/org/org-guid-123/spaces/space-guid-123"
        );
      });
    });
  });

  describe("orgHref()", function() {
    describe("with undefined parameters", function() {
      it("throws", function() {
        expect(() => url.orgHref()).toThrowError(/Entity must be provided/);
      });
    });

    describe("with entities", function() {
      let org;

      beforeEach(function() {
        org = { guid: "org-guid-123" };
      });

      it("returns a url with guids", function() {
        expect(url.orgHref(org)).toBe("/#/org/org-guid-123");
      });
    });

    describe("with guids", function() {
      let org;

      beforeEach(function() {
        org = "org-guid-123";
      });

      it("returns a url with guids", function() {
        expect(url.orgHref(org)).toBe("/#/org/org-guid-123");
      });
    });
  });
});
