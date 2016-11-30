
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

import AppCountStatus from './app_count_status.jsx';
import SpaceCountStatus from './space_count_status.jsx';

const propTypes = {
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
      <div className={ this.styler('panel-column') }>
        <h2>
          <a href={ `/#/org/${props.org.guid}` }>{ props.org.name }</a>
        </h2>
      </div>
      <div className={ this.styler('panel-column', 'panel-column-less') }>
        <SpaceCountStatus spaces={ props.org.spaces } />
        <AppCountStatus appCount={ this.totalAppCount(props.org.spaces) } />
      </div>
    </div>
    );
  }
}

OrgQuickLook.propTypes = propTypes;
OrgQuickLook.defaultProps = defaultProps;
