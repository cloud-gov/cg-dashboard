import PropTypes from "prop-types";
import React from "react";
import loadingImg from "cloudgov-style/img/loading.gif";

const LOADING_TIME = 300;
const STYLES = [
  // globalSaving is applied to saving notifications inside panels
  "globalSaving",
  // inline is applied when displaying an inline panel loading status
  "inline",
  // cover is used to show a full page loading status
  "cover"
];

const propTypes = {
  text: PropTypes.string,
  active: PropTypes.bool,
  loadingDelayMS: PropTypes.number,
  style: PropTypes.oneOf(STYLES)
};

const defaultProps = {
  text: "Loading",
  active: true,
  loadingDelayMS: LOADING_TIME,
  style: "cover"
};

class Loading extends React.Component {
  constructor(props) {
    super(props);

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
      this.setState({ waitTimer: false });
    }
  }

  get containerClasses() {
    switch (this.props.style) {
      case "globalSaving": {
        return "saving saving-relative";
      }
      case "cover": {
        return "loading loading-relative";
      }
      default: {
        return "loading-inline";
      }
    }
  }

  render() {
    const { style } = this.props;

    if (!this.props.active || this.state.waitTimer) return null;

    return (
      <div
        className={this.containerClasses}
        role="alertdialog"
        aria-live="assertive"
        aria-busy={this.props.active}
      >
        {(() => {
          switch (style) {
            case "globalSaving": {
              return <div>{this.props.text}</div>;
            }
            case "cover": {
              return (
                <img
                  className="loading-indicator"
                  src={`/assets/${loadingImg}`}
                  alt={this.props.text}
                />
              );
            }
            case "inline": {
              return (
                <div>
                  <span className="loading-inline-dot">•</span>
                  <span className="loading-inline-dot">•</span>
                  <span className="loading-inline-dot">•</span>
                  <span className="loading-inline-text">{this.props.text}</span>
                </div>
              );
            }
            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
