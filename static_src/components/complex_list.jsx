
import React from 'react';

import ComplexListItem from './complex_list_item.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  children: React.PropTypes.array,
  title: React.PropTypes.string
};
const defaultProps = {
  children: [],
  title: null
};

export default class ComplexList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const header = this.props.title && (
      <header className={ this.styler('complex_list-header') }>
        <h4 className={ this.styler('complex_list-title') }>
          { this.props.title }
        </h4>
      </header>
    );

    return (
      <div className={ this.styler('complex_list') }>
        { header }
        { this.props.children.map((child, i) => {
          if (child.type.name === 'ComplexList') {
            return child;
          }
          return (
            <ComplexListItem key={ i }>
              { child }
            </ComplexListItem>
          )
        })}
      </div>
    );
  }
}

ComplexList.propTypes = propTypes;
ComplexList.defaultProps = defaultProps;
