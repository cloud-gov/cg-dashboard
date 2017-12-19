import "../../global_setup";
import React from "react";
import { shallow } from "enzyme";
import ServiceInstanceTableRow from "../../../components/service_instance_table_row.jsx";
import Action from "../../../components/action.jsx";
import ConfirmationBox from "../../../components/confirmation_box.jsx";

describe("<ServiceInstanceTableRow/>", () => {
  const baseInstance = {
    deleting: false,
    name: "service",
    last_operation: {
      type: "",
      updated_at: "2015-07-14T04:02:30Z"
    }
  };

  it("renders a button to begin instance deletion process", () => {
    const wrapper = shallow(
      <ServiceInstanceTableRow instance={baseInstance} />
    );

    expect(wrapper.find(Action).length).toBe(1);
  });

  it("does not render a <ConfirmationBox/> when not deleting an instance", () => {
    const instance = Object.assign({}, baseInstance, {
      confirmDelete: false
    });
    const wrapper = shallow(<ServiceInstanceTableRow instance={instance} />);

    expect(wrapper.find(ConfirmationBox).length).toBe(0);
  });

  it("renders a <ConfirmationBox /> when deleting an instance", () => {
    const instance = Object.assign({}, baseInstance, {
      confirmDelete: true
    });
    const wrapper = shallow(<ServiceInstanceTableRow instance={instance} />);

    expect(wrapper.find(ConfirmationBox).length).toBe(1);
  });

  it("provides an onClick handler to <Action/>", () => {
    const props = {
      instance: baseInstance
    };
    const wrapper = shallow(<ServiceInstanceTableRow {...props} />);

    expect(wrapper.find(Action).prop("clickHandler")).toEqual(
      wrapper.instance().handleBeginDelete
    );
  });

  it("supplies correct props to <ConfirmationBox/>", () => {
    const props = {
      instance: Object.assign({}, baseInstance, {
        deleting: false,
        confirmDelete: true
      })
    };
    const wrapper = shallow(<ServiceInstanceTableRow {...props} />);
    const box = wrapper.find(ConfirmationBox);
    const component = wrapper.instance();
    const expectedProps = {
      style: "nexto",
      confirmationText: "Confirm delete",
      confirmHandler: component.handleConfirmDelete,
      cancelHandler: component.handleCancelDelete,
      disabled: props.instance.deleting,
      message: null
    };

    expect(box.props()).toEqual(expectedProps);
  });
});
