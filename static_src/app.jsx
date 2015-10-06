
import React from 'react';


export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {

    return (
    <div>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#/dashboard">
            <i className="glyphicon glyphicon-cloud"></i>
            Deck
            <span className="label label-info">Alpha</span>
          </a>
        </div>
      </nav>
      <div className="container-fluid">
        { this.props.children }
      </div>
    </div>
    );
  }
}

App.propTypes = { content: React.PropTypes.element };

