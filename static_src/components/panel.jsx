
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string
};

const defaultProps = {
  title: 'default'
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const title = this.props.title !== 'default' &&
      <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>;
    return (
      <div className={ this.styler('panel') }>
       { title }
        <div className={ this.styler('panel-rows') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
