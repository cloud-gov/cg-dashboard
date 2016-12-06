
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string
};

const defaultProps = {
  title: 'Default title'
};

const search = ['usa-search', 'js-search-form'];
if (this.state.showSearch) {
  search.push('is-visible');
}

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <form className={this.state.showSearch} acceptCharset="UTF-8"
        action="https://search.usa.gov/search" id="search_form" method="get"
      >
                <div role="search">
                  <label className={ this.styler('usa-sr-only')} htmlFor="search-field-small">Search
                  </label>
                  <input id="affiliate" name="affiliate" type="hidden" value="cloud.gov"></input>
                  <input name="utf8" type="hidden" value="✓"></input>
                  <input id="search-field" autoComplete="off" type="search" name="query"
                    placeholder="Search documentation"
                  ></input>
                    <button type="submit" onClick={this.toggleSearch.bind(this)}>
                    <span className={ this.styler('usa-sr-only')}>Search</span>
                  </button>
                </div>
              </form>
    );
  }
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;
