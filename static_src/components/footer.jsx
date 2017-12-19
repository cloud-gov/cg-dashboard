import React from "react";

import { config } from "skin";

export default class Header extends React.Component {
  render() {
    return (
      <footer className="grid footer footer-no_sidebar">
        <section className="grid-width-6">
          <ul className="footer-links">
            {config.footer.links.map(link => (
              <li key={link.url}>
                <a href={link.url}>{link.text}</a>
              </li>
            ))}
          </ul>
        </section>
        <section className="grid-width-6">
          <ul className="footer-info">
            <li>{config.footer.author_note}</li>
            <li>{config.footer.code_note}</li>
            <li>{config.footer.disclaimer_note}</li>
          </ul>
        </section>
      </footer>
    );
  }
}
