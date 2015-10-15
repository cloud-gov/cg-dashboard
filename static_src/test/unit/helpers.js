
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
