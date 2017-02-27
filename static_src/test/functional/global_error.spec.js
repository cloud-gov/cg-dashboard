
import dedent from 'dedent';

import GlobalErrorsElement from './pageobjects/global_errors.element';


describe('Global error', function () {
  it('navigates to specific app page', function () {
    browser.url(dedent`/#/org/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250/
      spaces/82af0edb-8540-4064-82f2-d74df612b794/
      apps/3c37ff32-d954-4f9f-b730-15e22442fd82`);
  });

  describe('global errors', function () {
    let globalErrorsElement;

    it('exists', function () {
      globalErrorsElement = new GlobalErrorsElement(
        browser,
        browser.element('.test-global-errors')
      );

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
  });
});
