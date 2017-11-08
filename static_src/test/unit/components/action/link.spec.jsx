import "../../../global_setup.js";

import React from "react";
import { shallow } from "enzyme";
import Link from "../../../../components/action/link.jsx";

describe("<Link />", () => {
  it("returns an `a` tag", () => {
    expect(shallow(<Link />).find("a").length).toBe(1);
  });

  it("sets a default href", () => {
    const link = shallow(<Link />);
    expect(link.find("a").prop("href")).toBe("#");
  });

  it("sets a base class of `action-link`", () => {
    expect(
      shallow(<Link />)
        .find("a")
        .hasClass("action-link")
    ).toBe(true);
  });

  it("renders its children", () => {
    const child = "hi";
    const link = shallow(<Link>{child}</Link>);
    expect(link.find("a").prop("children")).toBe(child);
  });
});
