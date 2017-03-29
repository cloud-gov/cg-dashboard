
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class InfoSandbox extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <section className={ this.props.className }>
        <h4>Looking at an empty sandbox?</h4>
        <p><a href="https://cloud.gov/docs/getting-started/your-first-deploy/">Try making a “hello world” app</a>.</p>
        <p>Then see <a href="https://cloud.gov/overview/pricing/free-limited-sandbox/#a-few-things-you-can-try-in-your-sandbox">what else you can do</a> and the <a href="https://cloud.gov/overview/pricing/free-limited-sandbox/#sandbox-limitations">sandbox policies</a>.</p>
      </section>
    );
  }
}

InfoSandbox.propTypes = {
  className: React.PropTypes.string
};

InfoSandbox.defaultProps = {
  className: ''
};
