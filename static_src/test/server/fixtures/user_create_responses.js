const userCreateResponses = {
  default: {
    metadata: {
      guid: "4541c882-fake-invited-new-user",
      url: "/v2/users/4541c882-fake-invited-new-user",
      created_at: "2017-05-17T15:09:51Z",
      updated_at: "2017-05-17T15:09:51Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "newuser@domain.com",
      spaces_url: "/v2/users/4541c882-fake-invited-new-user/spaces",
      organizations_url:
        "/v2/users/4541c882-fake-invited-new-user/organizations",
      managed_organizations_url:
        "/v2/users/4541c882-fake-invited-new-user/managed_organizations",
      billing_managed_organizations_url:
        "/v2/users/4541c882-fake-invited-new-user/billing_managed_organizations",
      audited_organizations_url:
        "/v2/users/4541c882-fake-invited-new-user/audited_organizations",
      managed_spaces_url:
        "/v2/users/4541c882-fake-invited-new-user/managed_spaces",
      audited_spaces_url:
        "/v2/users/4541c882-fake-invited-new-user/audited_spaces"
    }
  },
  "4541c882-fake-invited-fake-new-user": {
    metadata: {
      guid: "4541c882-fake-invited-fake-new-user",
      url: "/v2/users/4541c882-fake-invited-fake-new-user",
      created_at: "2017-05-17T15:09:51Z",
      updated_at: "2017-05-17T15:09:51Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "fake-new-user@domain.com",
      spaces_url: "/v2/users/4541c882-fake-invited-fake-new-user/spaces",
      organizations_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/organizations",
      managed_organizations_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/managed_organizations",
      billing_managed_organizations_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/billing_managed_organizations",
      audited_organizations_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/audited_organizations",
      managed_spaces_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/managed_spaces",
      audited_spaces_url:
        "/v2/users/4541c882-fake-invited-fake-new-user/audited_spaces"
    }
  }
};

module.exports = userCreateResponses;
