
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';


const propTypes = {
  text: React.PropTypes.string,
  active: React.PropTypes.bool,
  style: React.PropTypes.string,
};

const defaultProps = {
  text: 'Saving',
  active: true,
  style: 'global'
};

class Saving extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.style = 'global';
    this.styler = createStyler(style);
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
        switch (this.props.style) {
          case 'global': {
            return (
              <span>{ this.props.text }</span>
            );
          }
          default: return null;
        }
      })()}
      </div>
    );

    return content;
  }
}

Saving.propTypes = propTypes;
Saving.defaultProps = defaultProps;

export default Saving;
