/*
 * Defines a model class based on Immutable datatypes.
 */
import Immutable from 'immutable';


export default function defineModel(name, defaults, methods = {}) {
  if (!defaults) {
    throw new Error('You must pass a set of defaults for your model.');
  }

  const modelName = `${name}Model`;
  const ModelClass = class extends Immutable.Record(defaults, modelName) {} // eslint-disable-line

  Object.assign(ModelClass.prototype, methods);
  ModelClass.modelName = modelName;
  return ModelClass;
}
