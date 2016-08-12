
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import loadingImg from 'cloudgov-style/img/loading.gif';

import createStyler from '../util/create_styler';

const propTypes = {
  text: React.PropTypes.string,
  active: React.PropTypes.bool
};

const defaultProps = {
  text: 'Loading',
  active: false
};

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
  }

  render() {
    let content = <div></div>;

    if (this.props.active) {
      content = (
        <img src={ `/assets/${loadingImg}` } alt={ this.props.text } />
      );
    }

    return (
      <div className={ this.styler('loading') }
        role="alertdialog"
        ariaLive="assertive"
        ariaBusy={ this.props.active }
      >
        { content }
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
