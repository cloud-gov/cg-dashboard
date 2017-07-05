
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

import AppQuicklook from './app_quicklook.jsx';
import ComplexList from './complex_list.jsx';
import EntityEmpty from './entity_empty.jsx';
import EntityIcon from './entity_icon.jsx';
import InfoAppCreate from './info_app_create.jsx';
import OrgStore from '../stores/org_store.js';
import { spaceHref } from '../util/url';

const propTypes = {
  space: PropTypes.object.isRequired,
  orgGuid: PropTypes.string.isRequired,
  showAppDetail: PropTypes.bool,
  user: PropTypes.object
};

const defaultProps = {
  showAppDetail: false
};

export default class SpaceQuicklook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  spaceHref() {
    const props = this.props;
    return spaceHref(props.orgGuid, props.space.guid);
  }

  get emptyState() {
    const org = OrgStore.get(this.props.orgGuid);
    const content = (
      <EntityEmpty callout="You have no apps in this space">
        <InfoAppCreate space={ this.props.space } org={ org } user={ this.props.user } brief />
      </EntityEmpty>
    );

    return content;
  }

  render() {
    const space = this.props.space;
    const appsContent = (space.apps && space.apps.length > 0) ? (
      <ComplexList>
        { space.apps && space.apps.map((app) =>
           <AppQuicklook
             key={ app.guid }
             app={ app }
             orgGuid={ this.props.orgGuid }
             spaceGuid={ space.guid }
             spaceName={ space.name }
             extraInfo={ this.props.showAppDetail ?
               ['state', 'memory', 'diskQuota'] : ['state'] }
           />
        )}
      </ComplexList>
      ) : this.emptyState;

    return (
      <ComplexList className="test-space-quicklook">
        <h3 className={ this.styler('contents-primary') }>
          <EntityIcon entity="space" iconSize="medium" />
          <a href={ this.spaceHref() }>{ space.name }</a>
        </h3>
        { appsContent }
      </ComplexList>
    );
  }
}

SpaceQuicklook.propTypes = propTypes;
SpaceQuicklook.defaultProps = defaultProps;
