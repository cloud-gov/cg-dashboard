import React from "react";

import { appPropType } from "../../stores/app_store";
import { orgPropType } from "../../stores/org_store";
import { spacePropType } from "../../stores/space_store";
import BreadcrumbsItem from "./breadcrumbs_item";
import { orgHref, spaceHref } from "../../util/url";

const propTypes = {
  org: orgPropType.isRequired,
  space: spacePropType,
  app: appPropType
};

const Breadcrumbs = ({ org, space, app }) => {
  const items = [
    <BreadcrumbsItem key="home" href="/" testLabel="overview">
      Overview
    </BreadcrumbsItem>
  ];

  if (org && space) {
    items.push(
      <BreadcrumbsItem key={org.guid} href={orgHref(org)} testLabel="org">
        {org.name}
      </BreadcrumbsItem>
    );
  }

  if (org && space && app) {
    items.push(
      <BreadcrumbsItem
        key={space.guid}
        href={spaceHref(org, space)}
        testLabel="space"
      >
        {space.name}
      </BreadcrumbsItem>
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
