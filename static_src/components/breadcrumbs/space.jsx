
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';


import BreadcrumbsItem from './breadcrumbs_item.jsx';
import createStyler from '../../util/create_styler';
import EntityIcon from '../entity_icon.jsx';
import { spaceHref } from '../../util/url';


export default class OrgBreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <BreadcrumbsItem url={ spaceHref(this.props.org, this.props.space) }>
        <EntityIcon entity="space" iconSize="small" bordered>
          <span className={ this.styler('breadcrumbs-item-link_text') }>
            { this.props.space.name }
          </span>
        </EntityIcon>
      </BreadcrumbsItem>
    );
  }
}

OrgBreadcrumbsItem.propTypes = {
  org: React.PropTypes.object.isRequired,
  space: React.PropTypes.object.isRequired
};
