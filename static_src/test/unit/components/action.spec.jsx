import "../../global_setup.js";

import React from "react";
import { mount, shallow } from "enzyme";
import Action from "../../../components/action.jsx";
import Link from "../../../components/action/link.jsx";
import Button from "../../../components/action/button.jsx";

describe("<Action />", function() {
  let action;

  describe("default behavior", () => {
    it("returns a button", () => {
      action = shallow(<Action />);

      expect(action.find(Button).length).toBe(1);
    });
  });

  describe("component creation", () => {
    describe("given type is link", function() {
      beforeEach(function() {
        action = shallow(<Action type="link" />);
      });

      it("renders as a <Link />", function() {
        expect(action.find(Link).length).toBe(1);
      });

      it("does not render a button", function() {
        expect(action.find("button").length).toBe(0);
      });

      describe("given an href", function() {
        const href = "https://example.com";

        beforeEach(function() {
          action = shallow(<Action type="link" href={href} />);
        });

        it("renders with the href", function() {
          expect(action.find(Link).prop("href")).toBe(href);
        });
      });
    });

    describe("given any other kind of type", () => {
      it("renders a button", () => {
        action = shallow(<Action type="submit" />);
        expect(action.find(Button).length).toBe(1);
        action = shallow(<Action type="outline" />);
        expect(action.find(Button).length).toBe(1);
      });
    });

    describe("with props passed", () => {
      it("always passes `clickHandler`, `label`, and `className`", () => {
        const buttonProps = {
          type: "submit",
          label: "my label",
          classes: ["k"]
        };
        const actionButton = shallow(<Action {...buttonProps} />).find(Button);

        expect(actionButton.prop("label")).toEqual(buttonProps.label);
        expect(actionButton.prop("className")).toMatch(
          new RegExp(buttonProps.classes[0])
        );
        expect(typeof actionButton.prop("clickHandler")).toBe("function");

        const linkProps = {
          href: "p.com",
          label: "great label",
          classes: ["yii"]
        };
        const actionLink = shallow(<Action {...linkProps} />).find(Link);

        expect(actionLink.prop("label")).toEqual(linkProps.label);
        expect(actionLink.prop("className")).toMatch(
          new RegExp(linkProps.classes[0])
        );
        expect(typeof actionLink.prop("clickHandler")).toBe("function");
      });
    });
  });

  describe("clickHandler", () => {
    let clickHandlerSpy;
    beforeEach(() => {
      clickHandlerSpy = sinon.spy();
      action = mount(<Action clickHandler={clickHandlerSpy} />);
    });

    it("triggers clickHandler", () => {
      action.find(Button).simulate("click");
      expect(clickHandlerSpy).toHaveBeenCalledOnce();
    });
  });
});
