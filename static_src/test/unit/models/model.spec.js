import '../../global_setup.js';

import Model from '../../../models/model';

describe('Model', function () {
  let TestModel;

  beforeEach(function () {
    TestModel = class extends Model('Test', { value: null }) {};
  });

  it('returns a constructor', function () {
    expect(typeof TestModel).toBe('function');
  });

  it('has a name', function () {
    expect(TestModel.modelName).toBe('TestModel');
  });

  describe('with a default instance', function () {
    let testModel;
    beforeEach(function () {
      testModel = new TestModel();
    });

    it('has a default', function () {
      expect(testModel.value).toBeNull();
    });

    it('has methods from immutable', function () {
      expect(typeof testModel.get).toBe('function');
      expect(typeof testModel.merge).toBe('function');
      expect(typeof testModel.update).toBe('function');
    });

    it('is immutable', function () {
      expect(() => { testModel.value = 'other' }).toThrow();;
    });
  });

  describe('with an instance', function () {
    let testModel;
    beforeEach(function () {
      testModel = new TestModel({ value: 'ok' });
    });

    it('has', function () {
      expect(testModel.value).toBe('ok');
    });

    it('is immutable', function () {
      expect(() => { testModel.value = 'other' }).toThrow();;
    });
  });

  describe('with methods', function () {
    beforeEach(function () {
      TestModel = class extends Model('Test', { name: null }) {
        sayHello() {
          return this.name ? `Hello ${this.name}` : 'I forget';
        }
      };
    });

    it('has a method', function () {
      expect(typeof TestModel.prototype.sayHello).toBe('function');
    });

    describe('with an instance', function () {
      let testModel;

      beforeEach(function () {
        testModel = new TestModel({ name: 'Alice' });
      });

      it('has methods bound to the instance', function () {
        expect(testModel.sayHello()).toBe('Hello Alice');
      });
    });
  });
});
