import "../../global_setup";
import React from "react";
import ServiceInstanceTable from "../../../components/service_instance_table.jsx";
import ServiceInstanceTableRow from "../../../components/service_instance_table_row.jsx";
import Loading from "../../../components/loading.jsx";
import ServiceInstanceStore from "../../../stores/service_instance_store";
import serviceActions from "../../../actions/service_actions";
import serviceInstances from "../../server/fixtures/service_instances";
import Immutable from "immutable";
import { shallow } from "enzyme";

describe("<ServiceInstanceStore />", () => {
  const instances = serviceInstances.map(instance => instance.entity);
  let wrapper;

  beforeEach(() => {
    ServiceInstanceStore._data = Immutable.fromJS(instances);
    wrapper = shallow(<ServiceInstanceTable />);
    wrapper.setState(
      {
        serviceInstances: ServiceInstanceStore.getAll(),
        empty: false,
        updating: true
      },
      () => wrapper.update()
    );
  });

  describe("children", () => {
    it("renders a <ServiceInstanceTableRow /> for each service", () => {
      expect(wrapper.find(ServiceInstanceTableRow).length).toBe(
        instances.length
      );
    });

    it("passes the correct props", () => {
      const row = wrapper.find(ServiceInstanceTableRow).first();
      const expected = {
        instance: instances[0],
        onBeginDelete: serviceActions.deleteInstanceConfirm,
        onCancelDelete: serviceActions.deleteInstanceCancel,
        onConfirmDelete: serviceActions.deleteInstance
      };

      expect(row.props()).toEqual(expected);
    });
  });

  describe("deleting a service instance", () => {
    it("renders a loading badge when updating state is true", () => {
      expect(wrapper.find(Loading).length).toBe(1);
    });
  });
});
