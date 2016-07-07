
import React from 'react';

const propTypes = {
  text: React.PropTypes.string
};

const defaultProps = {
  text: 'Loading'
};

class Loading extends React.Component {
  render() {
    return (
      <div>
        { this.props.text }
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;
