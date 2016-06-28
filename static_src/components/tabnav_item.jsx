
import React from 'react';

export default class TabnavItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { selected: this.props.selected };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({selected: nextProps.selected});
  }

  render() {
    return (
      <a role="tab"
          aria-controls={this.props.controls}
          aria-selected={this.state.selected}
          href={this.props.href}>
        {this.props.content}
      </a>
    );
  }
};

TabnavItem.propTypes = {
  controls: React.PropTypes.string,
  href: React.PropTypes.string,
  content: React.PropTypes.string,
  selected: React.PropTypes.bool
};

TabnavItem.defaultProps = {
  controls: '#',
  href: '#',
  content: '',
  selected: false
}
