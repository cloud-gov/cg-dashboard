import React from "react";
import classNames from "classnames";

import { header } from "skin";
import LoginStore from "../../stores/login_store.js";
import HeaderLink from "./header_link";
import Action from "../action.jsx";

const Header = () => {
  const loginLink = LoginStore.isLoggedIn() ? (
    <HeaderLink>
      <Action href="/logout" label="Log out" type="outline">
        Log out
      </Action>
    </HeaderLink>
  ) : (
    <HeaderLink>
      <Action href="/handshake" label="Login" type="outline">
        Login
      </Action>
    </HeaderLink>
  );

  return (
    <header className={classNames("header", "header-no_sidebar")}>
      <div className="header-wrap">
        <div>
          {header.logo.render()}
          <nav className="header-side">
            <ul className="nav">
              {header.links.map((l, i) => (
                <HeaderLink key={i} url={l.url} text={l.text} />
              ))}
              {loginLink}
            </ul>
          </nav>
        </div>
        <div className="form-notification">
          <h2 className="bg-lightestgray"><a href={header.deprecation_notice.url}>{header.deprecation_notice.text}</a></h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
