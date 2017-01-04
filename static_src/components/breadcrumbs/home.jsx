
import React from 'react';

import BreadcrumbsItem from './breadcrumbs_item.jsx';
import Icon from '../icon.jsx';


export default class HomeBreadcrumbsItem extends React.Component {
  render() {
    return (
      <BreadcrumbsItem url="/#/">
        <Icon name="home" iconType="fill" iconSize="small" bordered />
      </BreadcrumbsItem>
    );
  }
}
