
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';


import BreadcrumbsItem from './breadcrumbs_item.jsx';
import createStyler from '../../util/create_styler';
import { spaceHref } from '../../util/url';


export default class OrgBreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <BreadcrumbsItem
        key={ this.props.space.guid }
        url={ spaceHref(this.props.org, this.props.space) }
      >
        { this.props.space.name }
      </BreadcrumbsItem>
    );
  }
}

OrgBreadcrumbsItem.propTypes = {
  org: React.PropTypes.object.isRequired,
  space: React.PropTypes.object.isRequired
};
