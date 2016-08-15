
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import loadingImg from 'cloudgov-style/img/loading.gif';

import createStyler from '../util/create_styler';

const LOADING_TIME = 400;

const propTypes = {
  text: React.PropTypes.string,
  active: React.PropTypes.bool
};

const defaultProps = {
  text: 'Loading',
  active: true
};

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = {
      loadingTimer: null
    };
    console.log('INIT');
  }

  componentWillReceiveProps() {
    console.log('NEW PROPS');
  }

  componentDidMount() {
    console.log('DID MOUNT');
  }

  componentWillMount() {
    console.log('MOUNT');
    const timer = window.setTimeout(() => {
      this.showLoader();
    }, LOADING_TIME);
    this.setState({ loadingTimer: timer });
  }

  showLoader() {
    window.clearTimeout(this.state.loadingTimer);
    this.setState({ loadingTimer: null })
  }

  render() {
    let content = <div></div>;

    if (this.props.active && !this.state.loadingTimer) {
      content = (
        <div className={ this.styler('loading') }
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
