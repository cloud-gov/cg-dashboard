
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import savingImg from 'cloudgov-style/img/loading.gif';

import createStyler from '../util/create_styler';


const propTypes = {
  text: React.PropTypes.string,
  active: React.PropTypes.bool,
  style: React.PropTypes.string
};

const defaultProps = {
  text: 'Saving',
  active: true,
  style: 'inline'
};

class Saving extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = {
      waitTimer: false
    };
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {

    const classes = this.styler('saving', 'saving-relative');
    const content = (
      <div className={ classes }
        role="alertdialog"
        aria-live="assertive"
        aria-busy={ this.props.active }
      >
      {(() => {
        return (
          <span>{ this.props.text }</span>
        );
      })()}
      </div>
    );

    return content;
  }
}

Saving.propTypes = propTypes;
Saving.defaultProps = defaultProps;

export default Saving;
