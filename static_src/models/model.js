/*
 * Defines a model class based on Immutable datatypes.
 */
import Immutable from 'immutable';


export default function Model(name, defaults) {
  if (!defaults) {
    throw new Error('You must pass a set of defaults for your model.');
  }

  const modelName = `${name}Model`;
  const ModelClass = class extends Immutable.Record(defaults, modelName) {} // eslint-disable-line

  ModelClass.modelName = modelName;
  return ModelClass;
}
