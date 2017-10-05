
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string
};

export default class BreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url = this.props.url;
    const content = url ?
      (
        <a className="breadcrumbs-item-link" href={ url }>
          { this.props.children }
        </a>
      )
      : <span className="breadcrumbs-item-current">{ this.props.children }</span>;

    return (
      <li className="breadcrumbs-item">
        { content }
      </li>
    );
  }
}

BreadcrumbsItem.propTypes = propTypes;
