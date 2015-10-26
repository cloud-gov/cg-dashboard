
import '../global_setup.js';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import App from '../../app.jsx';

describe('App', function() {
  it('should work', function() {
    var app = TestUtils.renderIntoDocument(<App/>);
    expect(app).toBeDefined();
  });
});
