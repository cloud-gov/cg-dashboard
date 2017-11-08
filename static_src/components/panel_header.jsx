import React from "react";

export default class PanelHeader extends React.Component {
  render() {
    return <header className="panel-header">{this.props.children}</header>;
  }
}
