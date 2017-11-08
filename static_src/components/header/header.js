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
    </header>
  );
};

export default Header;
