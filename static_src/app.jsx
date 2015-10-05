
import React from 'react';


export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {

    return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <a className="navbar-brand" href="#/dashboard" ng-click="clearDashboard()">
            <i className="glyphicon glyphicon-cloud"></i>
            Deck
            <span className="label label-info">Alpha</span>
          </a>
        </div>
      </div>
    </nav>
    <div className="container-fluid">

    </div>
    );
  }
}

export function run(selector) {
  React.render(<App/>, selector);
};
