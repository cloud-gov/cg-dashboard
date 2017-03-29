
import http from 'axios';
import dedent from 'dedent';

import EmptyElement from './pageobjects/empty.element';
import OrgQuicklookElement from './pageobjects/org_quicklook.element';

describe('Expressive empty state', function () {
  let appsEmptyState;

  it('navigates to page', function () {
    browser.url('/');
  });

  it('changes to app emtpy state', function(done) {
    const server = browser.getUrl().split('/')[2];

    const result = browser.executeAsync(function(url, done) {
      var req = fetch(`http://${url}/_admin/api/route/space-summary`, {
        method: 'POST',
        body: { "variant": "space-summary-empty-state" }
      })
      .then((res) => { done({msg: 'success', data: res}) })
      .catch((err) => { done({msg: 'error', data: err, req: req}) });
    }, server);

    console.log('result', result);
    console.log(result.value);
  });

  describe('for apps on overview', function() {
    beforeEach(function () {
      appsEmptyState = new EmptyElement( browser, EmptyElement.primarySelector);
    });

    it('exists', function () {
      expect(appsEmtpyState.exists()).toBe(true);
    });
  });
});
