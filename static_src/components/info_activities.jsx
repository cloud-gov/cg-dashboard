
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class InfoActivities extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <section className={ this.props.className }>
        <h4>A few things you can do here</h4>
        <ul>
          <li>See recent log events for your apps.</li>
          <li>Create and bind service instances for your apps.</li>
          <li>Create and bind routes for your apps.</li>
          <li>Change memory allocation and number of instances for your apps.</li>
          <li>Restart your apps.</li>
          <li>Manage permissions for users of your orgs and spaces.</li>
        </ul>
      </section>
    );
  }
}

InfoActivities.propTypes = {
  className: React.PropTypes.string
};

InfoActivities.defaultProps = {
  className: ''
};
