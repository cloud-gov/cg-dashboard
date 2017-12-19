const uaaRoles = {
  uaa_admin: {
    id: "cca7537f-601d-48c4-9705-4583ba54ea4c",
    externalId: "fake-person-uaa-admin@gsa.gov",
    meta: {
      version: 0,
      created: "2016-09-16T13:24:31.423Z",
      lastModified: "2016-09-16T13:24:31.423Z"
    },
    userName: "fake-person-uaa-admin@gsa.gov",
    name: {
      familyName: "gsa.gov",
      givenName: "fake-person-uaa-admin"
    },
    emails: [
      {
        value: "fake-person-uaa-admin@gsa.gov",
        primary: false
      }
    ],
    groups: [
      {
        value: "88e68451-dc2e-413d-963b-848740512e01c1a23019",
        display: "cloud_controller.admin",
        type: "DIRECT"
      }
    ],
    approvals: [],
    active: true,
    verified: true,
    origin: "gsa.gov",
    zoneId: "uaa",
    passwordLastModified: "2016-09-16T13:24:31.000Z",
    previousLogonTime: 1489612053883,
    lastLogonTime: 1489612053883,
    schemas: ["urn:scim:schemas:core:1.0"]
  },
  default: {
    id: "bba7537f-601d-48c4-9705-4583ba54ea4b",
    externalId: "fake-personb@gsa.gov",
    meta: {
      version: 0,
      created: "2016-09-16T13:24:31.423Z",
      lastModified: "2016-09-16T13:24:31.423Z"
    },
    userName: "fake-personb@gsa.gov",
    name: {
      familyName: "gsa.gov",
      givenName: "fake-personb"
    },
    emails: [
      {
        value: "fake-personb@gsa.gov",
        primary: false
      }
    ],
    groups: [],
    approvals: [],
    active: true,
    verified: true,
    origin: "gsa.gov",
    zoneId: "uaa",
    passwordLastModified: "2016-09-16T13:24:31.000Z",
    previousLogonTime: 1489612053883,
    lastLogonTime: 1489612053883,
    schemas: ["urn:scim:schemas:core:1.0"]
  }
};

module.exports = uaaRoles;
