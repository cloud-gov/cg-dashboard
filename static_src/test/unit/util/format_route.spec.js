
import '../../global_setup.js';

import formatRoute from '../../../util/format_route';

describe('format_route util', () => {
  it('should show a properly formatted route with only a domain', () => {
    const route = {
      domain: 'fake-domain.com'
    };
    const actual = formatRoute(route.domain, route.host, route.path);
    expect(actual).toEqual(route.domain);
  });

  it('should show a properly formatted route with a domain and host', () => {
    const route = {
      domain: 'fake-domain.com',
      host: 'gopher'
    };
    const actual = formatRoute(route.domain, route.host, route.path);
    expect(actual).toEqual(`${route.host}.${route.domain}`);
  });

  it('should show a properly formatted route with a domain, host & path', () => {
    const route = {
      domain: 'fake-domain.com',
      host: 'gopher',
      path: 'about.html'
    };
    const actual = formatRoute(route.domain, route.host, route.path);
    expect(actual).toEqual(`${route.host}.${route.domain}/${route.path}`);
  });

  it('should show a blank string if domain undefined', () => {
    const route = {
      domain: undefined
      host: 'gopher',
      path: 'about.html'
    };
    const actual = formatRoute(route.domain, route.host, route.path);

    expect(actual).toEqual(`${route.host}./${route.path}`);
  });
});
