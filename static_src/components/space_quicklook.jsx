
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

import AppCountStatus from './app_count_status.jsx';
import PanelRow from './panel_row.jsx';
import SpaceCountStatus from './space_count_status.jsx';
import orgActions from '../actions/org_actions.js';

const propTypes = {
  space: React.PropTypes.object.isRequired
};

const defaultProps = {
};

export default class SpaceQuicklook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }


  render() {
    const space = this.props.space;

    console.log(space);
    return (
      <PanelRow>
        <h3>{ space.name }</h3>
        { space.apps && space.apps.map((app) => {
          return (
          <PanelRow key={ app.guid }>
            <span className={ this.styler('panel-column') }>
              <h3>{ space.name } / { app.name }</h3>
            </span>
            <span className={ this.styler('panel-column', 'panel-column-less') }>
              <span>{ app.state }</span>
            </span>
          </PanelRow>
          );
        })}
      </PanelRow>
    );
  }
}

SpaceQuicklook.propTypes = propTypes;
SpaceQuicklook.defaultProps = defaultProps;
