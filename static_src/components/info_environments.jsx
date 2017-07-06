
import style from 'cloudgov-style/css/cloudgov-style.css';
import PropTypes from 'prop-types';
import React from 'react';

import createStyler from '../util/create_styler';

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

export default class InfoEnvironment extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <section className={ this.props.className }>
        <h4>Environments</h4>
        <p>If your org <a href="https://cloud.gov/docs/apps/govcloud/">is in GovCloud</a>, use <a href="https://dashboard.fr.cloud.gov/">https://dashboard.fr.cloud.gov/</a> to see it.</p>
      </section>
    );
  }
}

InfoEnvironment.propTypes = propTypes;

InfoEnvironment.defaultProps = defaultProps;
