
import AppDispatcher from '../../dispatcher.js';

export function wrapInRes(responses) {
  var n = 0;
  return responses.map((res) => {
    return {
      metadata: { guid: res.guid || n },
      entity: res
    };
    n++;
  });
};

export function unwrapOfRes(entities) {
  return entities.map((entity) => {
    return Object.assign(entity.entity, entity.metadata);
  });
}

export function assertAction(spy, type, params) {
  expect(spy).toHaveBeenCalledOnce();
  let actionInfo = spy.getCall(0).args[0];
  expect(actionInfo.type).toEqual(type);
  for (let param in params) {
    expect(actionInfo[param]).toEqual(params[param]);
  }
}

export function setupUISpy(sandbox) {
  return sandbox.stub(AppDispatcher, 'handleUIAction');
}

export function setupViewSpy(sandbox) {
  return sandbox.stub(AppDispatcher, 'handleViewAction');
}

export function setupServerSpy(sandbox) {
  return sandbox.stub(AppDispatcher, 'handleServerAction');
}
