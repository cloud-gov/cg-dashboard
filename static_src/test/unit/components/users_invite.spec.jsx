import "../../global_setup.js";

import React from "react";
import { shallow } from "enzyme";

import { Form } from "../../../components/form";
import PanelDocumentation from "../../../components/panel_documentation.jsx";
import UsersInvite from "../../../components/users_invite.jsx";
import Action from "../../../components/action.jsx";

describe("<UsersInvite />", function() {
  const entityType = "space";
  const props = {
    inviteEntityType: entityType,
    currentUserAccess: true
  };
  let wrapper;

  describe("when user has access to inviting other users", () => {
    beforeEach(() => {
      wrapper = shallow(<UsersInvite {...props} />);
    });

    describe("conditional documentation based on inviteEntityType", () => {
      it("refers to `space` when type is space", () => {
        const doc =
          "NOTE: Use the new dashboard to add a new or existing user" +
          " to this space, as we deprecate this dashboard. See our " +
          "updated documentation on how to manage user access and "+
          "roles here.";

        expect(
          wrapper
            .find(PanelDocumentation)
            .find("p")
            .text()
        ).toBe(doc);
      });
    });
  });
});
