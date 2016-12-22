
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

export default class SpaceList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
    this.spaceLink = this.spaceLink.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  spaceLink(spaceGuid) {
    return `/#/org/${this.state.currentOrgGuid}/spaces/${spaceGuid}`;
  }

  render() {
    return <div></div>;
  }
}

SpaceList.propTypes = {};
