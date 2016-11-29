
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const props = {
  org: React.PropTypes.object.isRequired,
  spaces: React.PropTypes.array
};

const defaultProps = {
  spaces: []
};

export default class OrgQuickLook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  totalAppCount(spaces) {
    return spaces.reduce((sum, space) => sum + space.app_count, 0);
  }

  render() {
    const props = this.props;

    return (
    <div>
      <div className={ this.styler('panel_column') }>
        <h4>{ props.org.name }</h4>
      </div>
      <div className={ this.styler('panel_column') }>
        <span>{ props.org.spaces.length } spaces</span>
      </div>
      <div className={ this.styler('panel_column') }>
        <span>{ this.totalAppCount(props.org.spaces) } apps</span>
      </div>
    </div>
    );
  }
}

OrgQuickLook.props = props;
OrgQuickLook.defaultProps = defaultProps;
