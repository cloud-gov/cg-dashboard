import React from 'react';

let currid = 0;
function nextId() {
  currid += 1;
  return currid;
}

export default class FormElement extends React.Component {
  static validatorString(value, name) {
    if (!value.length) {
      return { message: `The ${name || ''} field was not filled out` };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = { err: null };
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

  componentWillUnmount() {
    if (this.props.detatchFromForm) {
      this.props.detatchFromForm(this);
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  validate() {
    const err = this.props.validator(this.state.value, this.props.label);
    if (err) {
      err.value = this.state.value;
      // TODO rename to onError.
      this.props.onValidate(err);
    }
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
  detatchFromForm: React.PropTypes.func,
  key: React.PropTypes.string,
  label: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  validator: React.PropTypes.func
};

FormElement.defaultProps = {
  classes: [],
  label: '',
  onValidate: () => {},
  validator: () => {}
};
