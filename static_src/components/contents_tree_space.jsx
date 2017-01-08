
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

import ContentsTreeApp from './contents_tree_app.jsx';
import EntityIcon from './entity_icon.jsx';
import Loading from './loading.jsx';
import PanelEntry from './panel_entry.jsx';
import { spaceHref } from '../util/url';

const propTypes = {
  space: React.PropTypes.object.isRequired,
  orgGuid: React.PropTypes.string.isRequired,
  loading: React.PropTypes.bool,
  showAppDetail: React.PropTypes.bool
};

const defaultProps = {
  loading: false,
  showAppDetail: false
};

export default class ContentsTreeSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  spaceHref() {
    const props = this.props;
    return spaceHref(props.orgGuid, props.space.guid);
  }

  render() {
    const space = this.props.space;
    let loading = <Loading text="Loading spaces" loadingDelayMS={ 1 } />;
    let content = <div className={ this.styler('loading-container')}>{ loading }</div>;

    if (!this.props.loading) {
      content = (
        <div className={ this.styler('contents-tree-space')}>
          <PanelEntry>
            <h3 className={ this.styler('contents-primary') }>
              <EntityIcon entity="space" iconSize="medium" />
              <a href={ this.spaceHref() }>{ space.name }</a>
            </h3>
          </PanelEntry>
          <div className={ this.styler('row')}>
            { space.apps && space.apps.map((app) =>
               <ContentsTreeApp
                 key={ app.guid }
                 app={ app }
                 orgGuid={ this.props.orgGuid }
                 spaceGuid={ space.guid }
                 spaceName={ space.name }
                 extraInfo={ this.props.showAppDetail ?
                   ['state', 'memory', 'diskQuota'] : ['state'] }
               />
            )}
          </div>
        </div>
      );
    }

    return content;
  }
}

ContentsTreeSpace.propTypes = propTypes;
ContentsTreeSpace.defaultProps = defaultProps;
