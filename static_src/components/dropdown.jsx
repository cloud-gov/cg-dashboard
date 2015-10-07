
import React from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { open: false };
  }

  render() {
    return (
      <div class="dropdown open">
        <a class="dropdown-toggle" role="button"
            aria-haspopup="true" aria-expanded="{ this.state.open }">
          { this.props.title }
          <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          { this.props.items.map((item) => {
            return (
              <li>{ item.element }</li>
            );
          })};
        </ul>
      </div>
    );
  }
};
