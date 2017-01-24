
const spaceUserRoles = [
  {
    metadata: {
      guid: "bba7537f-601d-48c4-9705-4583ba54ea4b",
      url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b",
      created_at: "2015-03-23T22:13:57Z",
      updated_at: "2015-03-23T22:13:57Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "fake-person-b@gsa.gov",
      space_roles: [
        "space_developer"
      ],
      spaces_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/spaces",
      organizations_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/organizations",
      managed_organizations_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/managed_organizations",
      billing_managed_organizations_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/billing_managed_organizations",
      audited_organizations_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/audited_organizations",
      managed_spaces_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/managed_spaces",
      audited_spaces_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "540a87fc-fdce-4f8f-b3ba-b60dc0d8211c",
      url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c",
      created_at: "2015-05-27T19:37:29Z",
      updated_at: "2015-05-27T19:37:29Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "fake-quota-audit",
      space_roles: [
        "space_auditor"
      ],
      spaces_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/spaces",
      organizations_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/organizations",
      managed_organizations_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/managed_organizations",
      billing_managed_organizations_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/billing_managed_organizations",
      audited_organizations_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/audited_organizations",
      managed_spaces_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/managed_spaces",
      audited_spaces_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "f8f34131-dd29-4e02-a39b-7138bbaa956c",
      url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c",
      created_at: "2015-06-03T17:42:25Z",
      updated_at: "2015-06-03T17:42:25Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "fake-personc@gsa.gov",
      space_roles: [
        "space_developer",
        "space_manager"
      ],
      spaces_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/spaces",
      organizations_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/organizations",
      managed_organizations_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/managed_organizations",
      billing_managed_organizations_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/billing_managed_organizations",
      audited_organizations_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/audited_organizations",
      managed_spaces_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/managed_spaces",
      audited_spaces_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "2e6c6e56-897a-4729-8f00-b9d653bf07a0",
      url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0",
      created_at: "2015-06-24T18:17:43Z",
      updated_at: "2015-06-24T18:17:43Z"
    },
    entity: {
      admin: false,
      active: false,
      default_space_guid: null,
      username: "fake-quota-perm-setter",
      space_roles: [
        "space_auditor"
      ],
      spaces_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/spaces",
      organizations_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/organizations",
      managed_organizations_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/managed_organizations",
      billing_managed_organizations_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/billing_managed_organizations",
      audited_organizations_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/audited_organizations",
      managed_spaces_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/managed_spaces",
      audited_spaces_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "2a398848-feea-4365-a7a2-1c0e96894284",
      url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284",
      created_at: "2016-02-23T00:27:43Z",
      updated_at: "2016-02-23T00:27:43Z"
    },
    entity: {
      admin: false,
      active: true,
      default_space_guid: null,
      username: "fake-persond@gsa.gov",
      space_roles: [
        "space_developer"
      ],
      spaces_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/spaces",
      organizations_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/organizations",
      managed_organizations_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/managed_organizations",
      billing_managed_organizations_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/billing_managed_organizations",
      audited_organizations_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/audited_organizations",
      managed_spaces_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/managed_spaces",
      audited_spaces_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "dad8ac0a-6188-4f0c-bb20-244d11ee3b47",
      url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47",
      created_at: "2016-04-28T23:55:36Z",
      updated_at: "2016-04-28T23:55:36Z"
    },
    entity: {
      admin: false,
      active: true,
      default_space_guid: null,
      username: "fake-persone@gsa.gov",
      space_roles: [
        "space_manager"
      ],
      spaces_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/spaces",
      organizations_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/organizations",
      managed_organizations_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/managed_organizations",
      billing_managed_organizations_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/billing_managed_organizations",
      audited_organizations_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/audited_organizations",
      managed_spaces_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/managed_spaces",
      audited_spaces_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/audited_spaces"
    }
  },
  {
    metadata: {
      guid: "9a6ea094-43c2-4df5-961d-1c0806ce89ff",
      url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff",
      created_at: "2016-05-11T21:07:05Z",
      updated_at: "2016-05-11T21:07:05Z"
    },
    entity: {
      admin: false,
      active: true,
      default_space_guid: null,
      username: "fake-personf@gsa.gov",
      space_roles: [
        "space_developer"
      ],
      spaces_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/spaces",
      organizations_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/organizations",
      managed_organizations_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/managed_organizations",
      billing_managed_organizations_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/billing_managed_organizations",
      audited_organizations_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/audited_organizations",
      managed_spaces_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/managed_spaces",
      audited_spaces_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/audited_spaces"
    }
  }
];

module.exports = spaceUserRoles;
