
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';


import BreadcrumbsItem from './breadcrumbs_item.jsx';
import createStyler from '../../util/create_styler';
import { orgHref } from '../../util/url';


export default class OrgBreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <BreadcrumbsItem key={ this.props.org.guid } url={ orgHref(this.props.org) }>
        { this.props.org.name }
      </BreadcrumbsItem>
    );
  }
}

OrgBreadcrumbsItem.propTypes = {
  org: React.PropTypes.object
};
