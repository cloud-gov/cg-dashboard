
import React from 'react';

import PanelDocumentation from './panel_documentation.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';


const propTypes = {
  callout: React.PropTypes.node,
  children: React.PropTypes.any
};

const defaultProps = {
  children: null
};

export default class EntityEmpty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    return (
      <PanelDocumentation>
        <div className={ this.styler('empty', 'test-empty') }>
          <h4 className="test-empty-callout">{ props.callout }</h4>
          { props.children }

        </div>
      </PanelDocumentation>
    );
  }
}

EntityEmpty.propTypes = propTypes;
EntityEmpty.defaultProps = defaultProps;
