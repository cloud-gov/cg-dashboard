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
    this.state = {
      err: null,
      value: this.props.value || ''
    };

    if (!this.props.key) {
      this.state.id = nextId();
    }

    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.props.attachToForm) {
      this.props.attachToForm(this);
    }
  }

  componentDidMount() {
    this.validate();
  }

  componentWillReceiveProps(props) {
    // If our validator changed, we want to update the error state.
    // TODO we probably also want to notify others about the validation result,
    // but this is a poor place to do it.
    const err = props.validator(this.state.value, props.label);
    this.setState({ err });
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
