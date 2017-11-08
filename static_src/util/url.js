function guidFromEntity(entity) {
  if (!entity) {
    throw new Error("Entity must be provided.");
  }

  if (typeof entity === "string") {
    return entity;
  }

  return entity.guid;
}

export function appHref(orgOrGuid, spaceOrGuid, appOrGuid) {
  const org = guidFromEntity(orgOrGuid);
  const space = guidFromEntity(spaceOrGuid);
  const app = guidFromEntity(appOrGuid);

  return `/#/org/${org}/spaces/${space}/apps/${app}`;
}

export function spaceHref(orgOrGuid, spaceOrGuid) {
  const org = guidFromEntity(orgOrGuid);
  const space = guidFromEntity(spaceOrGuid);

  return `/#/org/${org}/spaces/${space}`;
}

export function orgHref(orgOrGuid) {
  const org = guidFromEntity(orgOrGuid);

  return `/#/org/${org}`;
}
