import React from 'react';
import classNames from 'classnames';
import formActions from '../../actions/form_actions';
import FormStore from '../../stores/form_store';

let currid = 0;
function nextId() {
  currid += 1;
  return currid;
}

function stateSetter() {
  const model = FormStore.getFormField(this.props.formGuid, this.props.name);
  return {
    model
  };
}


export default class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();

    // Only use model for the initial value, we don't want to override what the user types
    this.state.value = this.state.model.value;
    if (!this.props.key) {
      this.state.id = nextId();
    }

    this.onChange = this.onChange.bind(this);
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    FormStore.addChangeListener(this.onStoreChange);
  }

  componentWillUnmount() {
    FormStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    this.setState(stateSetter());
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  get classes() {
    return this.props.classes.length ? classNames(...this.props.classes) : this.props.className;
  }

  validate() {
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
  model: React.PropTypes.object,
  name: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  validator: React.PropTypes.func,
  value: React.PropTypes.any
};

FormElement.defaultProps = {
  classes: [],
  label: '',
  value: '',
  onValidate: () => {},
  validator: () => {}
};
