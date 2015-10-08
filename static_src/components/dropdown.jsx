
import React from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { open: false };
  }

  render() {
    return (
      <div className="dropdown open">
        <a className="dropdown-toggle" role="button"
            aria-haspopup="true" aria-expanded="{ this.state.open }">
          { this.props.title }
          <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          { this.props.items.map((item) => {
            return (
              <li key={ item.key }>{ item.element }</li>
            )
          })}
        </ul>
      </div>
    );
  }
};
