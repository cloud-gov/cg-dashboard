
import '../global_setup.js';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import MainContainer from '../../components/main_container.jsx';

describe('App', function() {
  it('should work', function() {
    var app = TestUtils.renderIntoDocument(<MainContainer/>);
    expect(app).toBeDefined();
  });
});
