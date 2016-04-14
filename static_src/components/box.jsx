
/**
 * A component that renders a box with a different style and background
 */

import React from 'react';

export default class Box extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}
