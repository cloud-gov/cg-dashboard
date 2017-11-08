import PropTypes from "prop-types";
import React from "react";
import UserStore from "../stores/user_store.js";

const userProvider = Component => {
  class UserProvider extends React.Component {
    constructor(props) {
      super(props);

      this.state = { currentUser: null };
      this.onChange = this.onChange.bind(this);
    }

    getChildContext() {
      return { currentUser: this.state.currentUser };
    }

    componentDidMount() {
      UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
      UserStore.removeChangeListener(this.onChange);
    }

    onChange() {
      this.setState({
        currentUser: UserStore.currentUser
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  UserProvider.childContextTypes = {
    currentUser: PropTypes.object
  };

  return UserProvider;
};

export default userProvider;
