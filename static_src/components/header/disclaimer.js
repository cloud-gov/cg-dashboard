import React from "react";
import classNames from "classnames";

import { header } from "skin";
import { generateId } from "../../util/element_id";

const { disclaimer } = header;

export default class Disclaimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };

    this.handleClick = this.handleClick.bind(this);

    this.panelId = generateId("header_disclaimer_panel_");
  }

  handleClick(e) {
    e.preventDefault();

    this.setState(({ expanded }) => ({ expanded: !expanded }));
  }

  renderGuidance({ renderIcon, heading, content }) {
    return (
      <div className="usa-width-one-half">
        {renderIcon && renderIcon()}
        <div className="usa-media_block-body">
          <p>
            <strong>{heading}</strong>
            <br />
            {content}
          </p>
        </div>
      </div>
    );
  }

  render() {
    const {
      flag,
      text,
      linkText,
      renderToggleIcon,
      guidance1,
      guidance2
    } = disclaimer;

    const { expanded } = this.state;
    const hidden = !expanded;
    const panelClass = classNames(
      "usa-banner-content usa-grid usa-accordion-content",
      {
        hide: hidden
      }
    );

    return (
      <div className="usa-banner usa-disclaimer disclaimer-no_sidebar">
        <header className="grid">
          <span className="usa-disclaimer-official">
            {text}
            {flag && <img {...flag} />}
            <a
              className="action action-link action-secondary"
              aria-expanded={expanded}
              aria-controls={this.panelId}
              onClick={this.handleClick}
            >
              <span className="p1">{linkText}</span>
              {renderToggleIcon({ expanded })}
            </a>
          </span>
        </header>
        <div className={panelClass} id={this.panelId} aria-hidden={hidden}>
          {this.renderGuidance(guidance1)}
          {this.renderGuidance(guidance2)}
        </div>
      </div>
    );
  }
}
