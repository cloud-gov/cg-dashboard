import "../../../global_setup";
import React from "react";
import RouteProvider from "../../../../components/router/route_provider.jsx";
import Loading from "../../../../components/loading.jsx";
import { shallow } from "enzyme";
import RouterStore from "../../../../stores/router_store";

describe("<RouteProvider />", () => {
  beforeEach(() => {
    RouterStore.routeComponent = {};
  });

  it("sets a default state from the RouteStore", () => {
    const component = () => <div />;
    const props = { some: "data" };
    RouterStore.routeComponent = Object.assign({}, { component, props });
    const wrapper = shallow(<RouteProvider />);

    expect(wrapper.state().component).toBe(component);
    expect(wrapper.state().props.some).toBe("data");
    expect(wrapper.find(component).length).toBe(1);
  });

  it("renders a loading component as a fallback", () => {
    const wrapper = shallow(<RouteProvider />);

    expect(wrapper.find(Loading).length).toBe(1);
  });
});
