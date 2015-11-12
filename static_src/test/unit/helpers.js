
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
  let arg = spy.getCall(0).args[0];
  expect(arg.type).toEqual(type);
  for (let param in params) {
    expect(arg[param]).toEqual(params[param]);
  }
}

