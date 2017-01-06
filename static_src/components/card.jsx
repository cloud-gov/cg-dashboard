
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any
};

const defaultProps = {
  children: []
};

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('card') }>
        { this.props.children }
      </div>
    );
  }
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;
