
import React from 'react';

import createStyler from '../util/create_styler';
import { config } from 'skin';
import style from 'cloudgov-style/css/cloudgov-style.css';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <footer className={ this.styler('grid', 'footer', 'footer-no_sidebar') }>
        <section className={ this.styler('grid-width-6') }>
          <ul className={ this.styler('footer-links') }>
            { config.footer.links.map((link) =>
              <li key={ link.url }>
                <a href={ link.url }>{ link.text }</a>
              </li>
            )}
          </ul>
        </section>
        <section className={ this.styler('grid-width-6') }>
          <ul className={ this.styler('footer-info') }>
            <li>{ config.footer.disclaimer }</li>
            <li>{ config.footer.code_note }</li>
            <li>{ config.footer.author_note }</li>
          </ul>
        </section>
      </footer>
    );
  }
}
