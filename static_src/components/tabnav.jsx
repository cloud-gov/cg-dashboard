
import React from 'react';

import classNames from 'classnames';

export default class Tabnav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { current: this.props.initialItem };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({current: nextProps.initialItem});
  }

  render() {
    var defaultClasses = ['nav', 'nav-tabs', 'nav-justified'];
    var classes = classNames(defaultClasses, this.props.classes);

    return (
    <ul className={ classes }>
      { this.props.items.map((item) => {
        if (item.name === this.state.current) {
          return <li className="active">{ item.element }</li>;
        } else {
          return <li>{ item.element }</li>;
        }
      })}
    </ul>
    );
  }
};

Tabnav.propTypes = {
  initialItem: React.PropTypes.string.isRequired,
  items: React.PropTypes.any,
  classes: React.PropTypes.array
};
