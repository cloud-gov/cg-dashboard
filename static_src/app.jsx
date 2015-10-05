
import React from 'react';


export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <h3>it works</h3>
      </div>
    );
  }
}

export function run(selector) {
  React.render(<App/>, selector);
};
