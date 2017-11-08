import OrgQuicklookElement from "./pageobjects/org_quicklook.element";

describe("Overview page", function() {
  it("navigates to page", function() {
    browser.url("/");
  });

  it("has a title", function() {
    expect(browser.getTitle()).toBe("cloud.gov dashboard");
  });

  it("has a page header", function() {
    const pageHeader = browser.element(".test-page-header-title");
    expect(pageHeader.getText()).toBe("Overview");
  });

  describe("quicklook", function() {
    let quicklookElement;

    it("exists", function() {
      quicklookElement = new OrgQuicklookElement(
        browser,
        browser.element(".test-panel-row-organizations")
      );
      expect(quicklookElement.isVisible()).toBe(true);
    });

    it("has org name", function() {
      const orgName = quicklookElement.title();
      expect(orgName).toBe("fake-cf");
    });

    it("is collapsed", function() {
      expect(quicklookElement.isExpanded()).toBe(false);
    });

    it("is clicked", function() {
      quicklookElement.expand();
    });

    it("is expanded", function() {
      expect(quicklookElement.isExpanded()).toBe(true);
    });

    it("has 2 rows", function() {
      expect(quicklookElement.rows().length).toBe(2);
    });
  });
});
