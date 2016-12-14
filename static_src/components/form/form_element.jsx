import React from 'react';
import classNames from 'classnames';

let currid = 0;
function nextId() {
  currid += 1;
  return currid;
}

export default class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    if (!this.props.key) {
      this.state.id = nextId();
    }

    Object.assign(this.state, this.checkValidationFromProps(props));
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.props.attachToForm) {
      this.props.attachToForm(this);
    }
  }

  componentWillReceiveProps(props) {
    this.setState(this.checkValidationFromProps(props));
  }

  componentWillUnmount() {
    if (this.props.detatchFromForm) {
      this.props.detatchFromForm(this);
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value }, () => {
      this.validate();
    });
  }

  get classes() {
    return this.props.classes.length ? classNames(...this.props.classes) : this.props.className;
  }

  checkValidationFromProps(props) {
    if (props.value === undefined) {
      return {};
    }

    // Only if an initial value is set, validate it
    const value = props.value;
    const err = props.validator && props.validator(value);
    return { value, err };
  }

  validate() {
    const value = this.state.value;
    const err = this.props.validator(value, this.props.label);
    if (err) {
      err.value = value;
    }

    this.props.onValidate(err, value);
    this.setState({ err });
    return err;
  }

  get key() {
    return this.props.key || `form_element_${this.state.id}`;
  }
}

FormElement.propTypes = {
  attachToForm: React.PropTypes.func,
  classes: React.PropTypes.array,
  className: React.PropTypes.string,
  detatchFromForm: React.PropTypes.func,
  key: React.PropTypes.string,
  label: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  validator: React.PropTypes.func,
  value: React.PropTypes.any
};

FormElement.defaultProps = {
  classes: [],
  label: '',
  onValidate: () => {},
  validator: () => {}
};
