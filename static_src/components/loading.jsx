
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import loadingImg from 'cloudgov-style/img/loading.gif';

import createStyler from '../util/create_styler';

const LOADING_TIME = 300;

const propTypes = {
  text: React.PropTypes.string,
  active: React.PropTypes.bool,
  loadingDelayMS: React.PropTypes.number
};

const defaultProps = {
  text: 'Loading',
  active: true,
  loadingDelayMS: LOADING_TIME
};

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = {
      waitTimer: false
    };
  }

  componentWillMount() {
    const timer = window.setTimeout(() => {
      this.showLoader();
    }, this.props.loadingDelayMS);
    this._timer = timer;
    this.setState({ waitTimer: true });
  }

  componentWillUnmount() {
    window.clearTimeout(this._timer);
    this._timer = null;
  }

  showLoader() {
    if (this._timer) {
      window.clearTimeout(this._timer);
      this.setState({ waitTimer: false })
    }
  }

  render() {
    let content = <div></div>;

    if (this.props.active && !this.state.waitTimer) {
      content = (
        <div className={ this.styler('loading', 'loading-relative') }
          role="alertdialog"
          ariaLive="assertive"
          ariaBusy={ this.props.active }
        >
          <img className={ this.styler('loading-indicator') }
            src={ `/assets/${loadingImg}` } alt={ this.props.text } />
        </div>
      );
    }

    return (
      <div>
        { content }
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
