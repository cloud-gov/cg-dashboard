let organizationUsers = [];
const userGuids = [
  {
    guid: "bb60f6e1-b495-45be-8bc4-7db4e8f3ed46",
    admin: false,
    active: false,
    username: "fake-persona@gsa.gov",
  },
  {
    guid: "4541c882-fake-invited-fake-new-user",
    admin: false,
    active: false,
    username: "fake-new-user@domain.com",
  },
  {
    guid: "bba7537f-601d-48c4-9705-4583ba54ea4b",
    admin: false,
    active: false,
    username: "fake-personb@gsa.gov",
  },
  {
    guid: "540a87fc-fdce-4f8f-b3ba-b60dc0d8211c",
    admin: false,
    active: false,
    username: "fake-quota-audit",
  },
  {
    guid: "f8f34131-dd29-4e02-a39b-7138bbaa956c",
    admin: false,
    active: false,
    username: "fake-personc@gsa.gov",
  },
  {
    guid: "a3a521fd-638b-48d5-8b74-ed383a6073fc",
    admin: false,
    active: false,
    username: "fake-persond@gsa.gov",
  },
  {
    guid: "2e6c6e56-897a-4729-8f00-b9d653bf07a0",
    admin: false,
    active: false,
    username: "fake-quota-perm-setter",
  },
  {
    guid: "4205acb0-a57d-4059-925d-fd6ae18ac7df",
    admin: false,
    active: false,
    username: "fake-sys-tester",
  },
  {
    guid: "b46f24d3-b427-46b6-99b9-15ea828c9aab",
    admin: false,
    active: true,
    username: "fake-persone@gsa.gov",
  },
  {
    guid: "6d009950-cbb4-4121-b1a7-9efd137a4e8e",
    admin: false,
    active: true,
    username: "fake-persone@gsa.gov",
  },
  {
    guid: "3024ea56-66c1-42f2-8511-c76207e8d884",
    admin: false,
    active: true,
    username: "fake-personf@gsa.gov",
  },
  {
    guid: "2a398848-feea-4365-a7a2-1c0e96894284",
    admin: false,
    active: true,
    username: "fake-persong@gsa.gov",
  },
  {
    guid: "dad8ac0a-6188-4f0c-bb20-244d11ee3b47",
    admin: false,
    active: true,
    username: "fake-personh@gsa.gov",
  },
  {
    guid: "9a6ea094-43c2-4df5-961d-1c0806ce89ff",
    admin: false,
    active: true,
    username: "fake-personi@gsa.gov",
  },
  {
    guid: "org-manager-x-uid-601d-48c4-9705",
    admin: false,
    active: true,
    username: "fake-org-manager-x@gsa.gov",
  },
  {
    guid: "org-manager-y-uid-601d-48c4-9705",
    admin: false,
    active: true,
    username: "fake-org-manager-y@gsa.gov",
  },
  {
    guid: "org-x-space-manager-xx-uid-601d-48c4-9705",
    admin: false,
    active: true,
    username: "fake-org-x-space-manager-XX@gsa.gov",
  },
  {
    guid: "org-x-space-manager-yy-uid-601d-48c4-9705",
    admin: false,
    active: true,
    username: "fake-org-x-space-manager-YY@gsa.gov",
  },
  {
    guid: "aa3a9f58-bcd8-4fd2-be05-0e80d9578bba",
    admin: false,
    active: true,
    username: "fake-personj@gsa.gov",
  }
]

for (var i = userGuids.length - 1; i >= 0; i--) {
  organizationUsers.push({
    metadata: {
      guid: userGuids[i]['guid'],
      url: "/v2/users/" + userGuids[i]['guid'],
      created_at: "2016-11-07T18:13:49Z",
      updated_at: "2016-11-07T18:13:49Z"
    },
    entity: {
      admin: userGuids[i]['admin'],
      active: userGuids[i]['active'],
      default_space_guid: null,
      username: userGuids[i]['username'],
      spaces_url: "/v2/users/" + userGuids[i]['guid'] + "/spaces",
      organizations_url: "/v2/users/" + userGuids[i]['guid'] + "/organizations",
      managed_organizations_url: "/v2/users/" + userGuids[i]['guid'] + "/managed_organizations",
      billing_managed_organizations_url: "/v2/users/" + userGuids[i]['guid'] + "/billing_managed_organizations",
      audited_organizations_url: "/v2/users/" + userGuids[i]['guid'] + "/audited_organizations",
      managed_spaces_url: "/v2/users/" + userGuids[i]['guid'] + "/managed_spaces",
      audited_spaces_url: "/v2/users/" + userGuids[i]['guid'] + "/audited_spaces"
    }
  })
}

module.exports = organizationUsers;
