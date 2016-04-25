
import classNames from 'classnames';
import React from 'react';

import IconDownload from '-!babel!svg-react!svgo-loader?{"plugins":[{"removeStyleElement":true}]}!cloudgov-style/img/i-download.svg?name=IconDownload';

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  getImagePath(iconName) {
    return `cloudgov-style/img/i-${iconName}.svg`;
  }

  render() {
    return (
      <IconDownload />
    );
  }
}
