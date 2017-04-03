
import dedent from 'dedent';

import BreadcrumbsElement from './pageobjects/breadcrumbs.element';
import GlobalErrorsElement from './pageobjects/global_errors.element';

const crashedAppUrl = dedent`/#
  /org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250
  /spaces/82af0edb-8540-4064-82f2-d74df612b794
  /apps/7fa78964-4d44-4a2a-8d26-7468b7cbf67d`;

const brokenDataAppUrl = dedent`/#
  /org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250/
  spaces/82af0edb-8540-4064-82f2-d74df612b794/
  apps/3c37ff32-d954-4f9f-b730-15e22442fd82`;

function getErrorsComponent() {
  return new GlobalErrorsElement(
      browser,
      browser.element('.test-global-errors')
    );
}

describe('Global error', function () {
  let globalErrorsElement;

  it('navigates to specific app page with broken data', function () {
    browser.url(brokenDataAppUrl);
  });

  describe('global errors', function () {
    beforeEach(function () {
      globalErrorsElement = getErrorsComponent();
    });

    it('exists', function () {
      expect(globalErrorsElement.exists()).toBe(true);
    });

    describe('notification', function () {
      let notificationAmount = 0;
      let notificationElement;

      it('has at least one that exists', function () {
        notificationElement = globalErrorsElement.firstNotification();
        expect(notificationElement.exists()).toBe(true);
        notificationAmount = globalErrorsElement.notifications().length;
      });

      it('has error message about app stats data missing', function () {
        expect(notificationElement.message()).toMatch('app usage');
      });

      it('has refresh action which refreshes the page', function () {
        const refreshAction = notificationElement.refreshAction();
        expect(refreshAction.isVisible()).toBe(true);
        expect(refreshAction.getText()).toEqual('Refresh');
        // TODO test refresh
      });

      it('has dismiss action that removes it from the page', function () {
        const dismissAction = notificationElement.dismissAction();
        expect(dismissAction.isVisible()).toBe(true);
        notificationElement.dismiss();

        expect(globalErrorsElement.notifications().length).toEqual(notificationAmount - 1);
      });
    });

    describe('on navigation', function () {
      beforeEach(function () {
        browser.refresh();
        globalErrorsElement = getErrorsComponent();

        const breadcrumbsElement = new BreadcrumbsElement(
          browser,
          browser.element(BreadcrumbsElement.primarySelector)
        );
        breadcrumbsElement.goToSpace();
      });

      it('dismisses the error when navigating to any other route', function () {
        expect(globalErrorsElement.notifications().length).toEqual(0);
      });
    });

    describe('on crashed app page', function () {
      beforeEach(function () {
        browser.url(crashedAppUrl);
        globalErrorsElement = getErrorsComponent();
      });

      it('should not show fetch errors because no stats were fetched', function () {
        expect(globalErrorsElement.notifications().length).toEqual(0);
      });
    });
  });
});
