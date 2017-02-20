
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import overrideStyle from '../css/overrides.css';

import createStyler from '../util/create_styler';

import Disclaimer from './disclaimer.jsx';
import GlobalErrorContainer from './global_error_container.jsx';
import Footer from './footer.jsx';
import Header from './header.jsx';
import Login from './login.jsx';
import LoginStore from '../stores/login_store.js';
import Notification from './notification.jsx';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import { Nav } from './navbar.jsx';

function stateSetter() {

  return {
    currentOrgGuid: OrgStore.currentOrgGuid,
    currentSpaceGuid: SpaceStore.currentSpaceGuid,
    isLoggedIn: LoginStore.isLoggedIn()
  };
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style, overrideStyle);
    this.state = stateSetter();;
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    LoginStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let content;
    let errMessages;

    if (this.state.isLoggedIn) {
      content = this.props.children;
    } else {
      content = <Login />;
    }


    return (
      <div>
        <Disclaimer />
        <GlobalErrorContainer />
        <Header />
        <div className={ this.styler('main_content', 'content-no_sidebar') }>
          <main className={ this.styler('usa-content') }>
            <div className={ this.styler('content', 'grid') }>
              { content }
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.any
};

App.defaultProps = {
  children: []
};
