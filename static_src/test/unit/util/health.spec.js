
import '../../global_setup';
import { appHealth, isHealthyApp } from '../../../util/health';

describe('appHealth()', function() {
  let app;

  describe('given STARTED app', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        name: 'my-app',
        state: 'STARTED'
      };
    });

    describe('given 2/2 instances running', function() {
      beforeEach(function() {
        app = { ...app, instances: 2, running_instances: 2 };
      });

      it('returns ok', function() {
        expect(appHealth(app)).toBe('ok');
      });
    });

    describe('given 1/2 instances running', function() {
      beforeEach(function() {
        app = { ...app, instances: 2, running_instances: 1 };
      });

      it('returns warning', function() {
        expect(appHealth(app)).toBe('warning');
      });
    });

    describe('given 0/2 instances running', function() {
      beforeEach(function() {
        app = { ...app, instances: 2, running_instances: 0 };
      });

      it('returns error', function() {
        expect(appHealth(app)).toBe('error');
      });
    });
  });

  describe('given STOPPED app', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        name: 'my-app',
        state: 'STOPPED',
        running_instances: 0
      };
    });

    it('returns inactive', function() {
      expect(appHealth(app)).toBe('inactive');
    });
  });
});

describe('isHealthyApp()', function() {
  let app;

  describe('given ok health', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        state: 'STARTED',
        instances: 1,
        running_instances: 1
      }
    });

    it('returns true', function() {
      expect(isHealthyApp(app)).toBe(true);
    });
  });

  describe('given inactive health', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        state: 'STOPPED',
        running_instances: 0
      }
    });

    it('returns true', function() {
      expect(isHealthyApp(app)).toBe(true);
    });
  });

  describe('given error health', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        state: 'STARTED',
        instances: 2,
        running_instances: 1
      }
    });

    it('returns false', function() {
      expect(isHealthyApp(app)).toBe(false);
    });
  });

  describe('given unknown health', function() {
    beforeEach(function() {
      app = {
        guid: '1234',
        state: 'STOPPED',
        running_instances: -1
      }
    });

    it('returns false', function() {
      expect(isHealthyApp(app)).toBe(false);
    });
  });
});
