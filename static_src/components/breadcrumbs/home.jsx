
import React from 'react';

import BreadcrumbsItem from './breadcrumbs_item.jsx';


export default class HomeBreadcrumbsItem extends React.Component {
  render() {
    return (
      <BreadcrumbsItem key="home" url="/#/">
        overview
      </BreadcrumbsItem>
    );
  }
}
