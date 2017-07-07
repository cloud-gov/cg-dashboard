
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import classNames from 'classnames';

const propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.any,
  classes: PropTypes.array
};

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
    this.handleTitleClick = this.handleTitleClick.bind(this);
  }

  handleTitleClick(ev) {
    this.setState({ open: !this.state.open });
  }

  render() {
    var id = 'dropdown-' + this.props.title,
        classes = classNames(style.dropdown, this.props.classes, {
          'open': !!this.state.open
        });

    return (
      <div className={ classes }>
      <a id= { 'dropdown-' + this.props.title } role="button"
            aria-haspopup="true" aria-expanded={ id }
            onClick={ this.handleTitleClick }>
          { this.props.title }
        </a>
        <ul aria-labelledby={ id }>
          { this.props.items.map((item) => {
            return (
              <li key={ item.key }>{ item.element }</li>
            )
          })}
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = propTypes;
