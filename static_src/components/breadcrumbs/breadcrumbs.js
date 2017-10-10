import React from 'react';

import { appPropType } from '../../stores/app_store';
import { orgPropType } from '../../stores/org_store';
import { spacePropType } from '../../stores/space_store';
import Item from './breadcrumbs_item';
import { orgHref, spaceHref } from '../../util/url';

const propTypes = {
  org: orgPropType.isRequired,
  space: spacePropType,
  app: appPropType
};

const Breadcrumbs = ({ org, space, app }) => {
  const items = [
    <Item key="home" href="/" testLabel="overview">
      Overview
    </Item>
  ];

  if (org && space) {
    items.push(
      <Item key={org.guid} href={orgHref(org)} testLabel="org">
        {org.name}
      </Item>
    );
  }

  if (org && space && app) {
    items.push(
      <Item key={space.guid} href={spaceHref(org, space)} testLabel="space">
        {space.name}
      </Item>
    );
  }

  return (
    <ol className="breadcrumbs" data-test="breadcrumbs">
      {items}
    </ol>
  );
};

Breadcrumbs.propTypes = propTypes;

export default Breadcrumbs;
