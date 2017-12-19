import "../../global_setup";

import React from "react";
import CreateServiceInstance from "../../../components/create_service_instance.jsx";
import FormError from "../../../components/form/form_error.jsx";
import serviceActions from "../../../actions/service_actions";
import { shallow } from "enzyme";

describe("<CreateServiceInstance />", () => {
  const serviceBaseProps = {
    service: {},
    servicePlan: {
      guid: "some-plan-guid"
    }
  };

  it("displays an error message when ServiceInstanceStore has one", () => {
    const error = { description: "Bad stuff everyone" };
    const wrapper = shallow(
      <CreateServiceInstance servicePlan={{}} error={error} />
    );

    expect(wrapper.find(FormError).length).toBe(1);
  });

  describe(".handleSubmit()", () => {
    it("calls serviceActions.createInstance with the proper arguments", () => {
      const plan = { guid: "123abc" };
      const spy = sinon.spy(serviceActions, "createInstance");
      const wrapper = shallow(<CreateServiceInstance servicePlan={plan} />);
      const form = {
        name: {
          value: "test"
        }
      };

      wrapper.instance().handleSubmit({}, form);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(form.name.value, null, plan.guid);
      expect(typeof spy.getCall(0).args[0]).toBe("string");
    });
  });

  describe("when serviceAction.createInstance has pre-designated responses", () => {
    it("called for cdn-route", () => {
      const serviceInstanceHTML =
        '<div class="actions-large"><form id="create-service-form"' +
        ' action="/" method="post" class="test-create_service_instance_form"><fieldset><legend>' +
        'The<strong class="actions-callout-inline-block">cdn-route</strong> service instance ' +
        'must be created using the CF CLI. Please refer to <a href="https://cloud.gov/docs/' +
        'services/cdn-route/" target="_blank">https://cloud.gov/docs/services/cdn-route/</a> ' +
        "for more information.</legend></fieldset></form></div>";
      const serviceProps = Object.assign({}, serviceBaseProps, {
        service: { label: "cdn-route" }
      });
      const wrapper = shallow(<CreateServiceInstance {...serviceProps} />);

      expect(wrapper.html()).toEqual(serviceInstanceHTML);
    });

    it("called for cloud-gov-identity-provider", () => {
      const serviceInstanceHTML =
        '<div class="actions-large"><form id="create-service-form"' +
        ' action="/" method="post" class="test-create_service_instance_form"><fieldset><legend>' +
        'The<strong class="actions-callout-inline-block">cloud-gov-identity-provider</strong> ' +
        'service instance must be created using the CF CLI. Please refer to <a href="https:' +
        '//cloud.gov/docs/services/cloud-gov-identity-provider/" target="_blank">https://clo' +
        "ud.gov/docs/services/cloud-gov-identity-provider/</a> for more information.</legend>" +
        "</fieldset></form></div>";
      const serviceProps = Object.assign({}, serviceBaseProps, {
        service: { label: "cloud-gov-identity-provider" }
      });
      const wrapper = shallow(<CreateServiceInstance {...serviceProps} />);

      expect(wrapper.html()).toEqual(serviceInstanceHTML);
    });

    it("called for cloud-gov-service-account", () => {
      const serviceInstanceHTML =
        '<div class="actions-large"><form id="create-service-form"' +
        ' action="/" method="post" class="test-create_service_instance_form"><fieldset><legend>' +
        'The<strong class="actions-callout-inline-block">cloud-gov-service-account</strong> ' +
        'service instance must be created using the CF CLI. Please refer to <a href="' +
        'https://cloud.gov/docs/services/cloud-gov-service-account/" target="_blank">https://' +
        "cloud.gov/docs/services/cloud-gov-service-account/</a> for more information.</legend>" +
        "</fieldset></form></div>";
      const serviceProps = Object.assign({}, serviceBaseProps, {
        service: { label: "cloud-gov-service-account" }
      });
      const wrapper = shallow(<CreateServiceInstance {...serviceProps} />);

      expect(wrapper.html()).toEqual(serviceInstanceHTML);
    });
  });
});
