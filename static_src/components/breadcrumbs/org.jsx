
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';


import BreadcrumbsItem from './breadcrumbs_item.jsx';
import createStyler from '../../util/create_styler';
import EntityIcon from '../entity_icon.jsx';
import { orgHref } from '../../util/url';


export default class OrgBreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <BreadcrumbsItem url={ orgHref(this.props.org) }>
        <EntityIcon entity="org" iconSize="small">
          <span className={ this.styler('breadcrumbs-item-link_text') }>
            { this.props.org.name }
          </span>
        </EntityIcon>
      </BreadcrumbsItem>
    );
  }
}

OrgBreadcrumbsItem.propTypes = {
  org: React.PropTypes.object
};
