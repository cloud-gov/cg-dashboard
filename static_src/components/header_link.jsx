
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.any,
  classes: PropTypes.array
};

export default class HeaderLink extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let linkContent = (<a href={this.props.url} className={ this.props.classes }>
      {this.props.text}</a>);
    if (this.props.children) {linkContent = this.props.children;}
    return (
      <li className="nav-link">
        {linkContent}
      </li>
    );
  }
}

HeaderLink.propTypes = propTypes;
