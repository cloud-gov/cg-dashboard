import React from 'react';
import classNames from 'classnames';
import formActions from '../../actions/form_actions';

let currid = 0;
function nextId() {
  currid += 1;
  return currid;
}

export default class FormElement extends React.Component {
  constructor(props) {
    super(props);
    const err = props.validator(this.props.value, props.label);
    this.state = {
      err,
      value: this.props.value || ''
    };

    if (!this.props.key) {
      this.state.id = nextId();
    }

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(props) {
    // If our validator changed, we want to update the error state.
    // TODO we probably also want to notify others about the validation result,
    // but this is a poor place to do it.
    if (this.props.validator !== props.validator) {
      const err = props.validator(this.state.value, props.label);
      this.setState({ err, value: props.value });
    }
  }

  onChange(e) {
    const value = e.target.value;
    const err = this.props.validator(value, this.props.label);
    this.setState({ err, value }, () => {
      formActions.changeField(this.props.formGuid, this.props.name, value)
        .then(() => {
          let promise;
          if (err) {
            err.value = value;
            promise = formActions.changeFieldError(this.props.formGuid, this.props.name, err);
          } else {
            promise = formActions.changeFieldSuccess(this.props.formGuid, this.props.name);
          }

          return promise;
        });
    });
  }

  get classes() {
    return this.props.classes.length ? classNames(...this.props.classes) : this.props.className;
  }

  get key() {
    return this.props.key || `form_element_${this.state.id}`;
  }
}

FormElement.propTypes = {
  classes: React.PropTypes.array,
  className: React.PropTypes.string,
  formGuid: React.PropTypes.string.isRequired,
  key: React.PropTypes.string,
  label: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
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
