import "../../../global_setup";
import React from "react";
import RouteEventItem from "../../../../components/app_activity/route_event_item.jsx";
import { shallow } from "enzyme";

describe("<RouteEventItem />", () => {
  it("renders an <a> tag with a link derived from the domain and host", () => {
    const props = {
      route: { host: "app", path: "dummy-app" },
      domain: { name: "test.domain.io" }
    };
    const wrapper = shallow(<RouteEventItem {...props} />);
    const child = wrapper.find("a");

    expect(child.length).toBe(1);
    expect(child.first().prop("href")).toBe("//app.test.domain.io/dummy-app");
  });
});
