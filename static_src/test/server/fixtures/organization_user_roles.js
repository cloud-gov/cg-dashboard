const orgUserRoles = {
  "user_role-org_y-ffe7-4aa8-8e85-94768d6bd250": [
    {
      metadata: {
        guid: "org-manager-x-uid-601d-48c4-9705",
        url: "/v2/users/org-manager-x-uid-601d-48c4-9705",
        created_at: "2015-03-23T22:13:57Z",
        updated_at: "2015-03-23T22:13:57Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-org-manager-x@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/org-manager-x-uid-601d-48c4-9705/spaces",
        organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/organizations",
        managed_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/audited_organizations",
        managed_spaces_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/managed_spaces",
        audited_spaces_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "org-manager-y-uid-601d-48c4-9705",
        url: "/v2/users/org-manager-y-uid-601d-48c4-9705",
        created_at: "2015-03-23T22:13:57Z",
        updated_at: "2015-03-23T22:13:57Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-org-manager-y@gsa.gov",
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/org-manager-y-uid-601d-48c4-9705/spaces",
        organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/organizations",
        managed_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/audited_organizations",
        managed_spaces_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/managed_spaces",
        audited_spaces_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/audited_spaces"
      }
    }
  ],
  "user_role-org_x-ffe7-4aa8-8e85-94768d6bd250": [
    {
      metadata: {
        guid: "org-manager-x-uid-601d-48c4-9705",
        url: "/v2/users/org-manager-x-uid-601d-48c4-9705",
        created_at: "2015-03-23T22:13:57Z",
        updated_at: "2015-03-23T22:13:57Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-org-manager-x@gsa.gov",
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/org-manager-x-uid-601d-48c4-9705/spaces",
        organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/organizations",
        managed_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/audited_organizations",
        managed_spaces_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/managed_spaces",
        audited_spaces_url:
          "/v2/users/org-manager-x-uid-601d-48c4-9705/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "org-manager-y-uid-601d-48c4-9705",
        url: "/v2/users/org-manager-y-uid-601d-48c4-9705",
        created_at: "2015-03-23T22:13:57Z",
        updated_at: "2015-03-23T22:13:57Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-org-manager-y@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/org-manager-y-uid-601d-48c4-9705/spaces",
        organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/organizations",
        managed_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/audited_organizations",
        managed_spaces_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/managed_spaces",
        audited_spaces_url:
          "/v2/users/org-manager-y-uid-601d-48c4-9705/audited_spaces"
      }
    }
  ],
  default: [
    {
      metadata: {
        guid: "2e60959a-a2e6-4d69-ac85-49dbbaab1229",
        url: "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229",
        created_at: "2015-02-25T02:11:46Z",
        updated_at: "2015-02-25T02:11:46Z"
      },
      entity: {
        admin: false,
        active: true,
        default_space_guid: null,
        organization_roles: ["org_auditor", "billing_manager"],
        spaces_url: "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/spaces",
        organizations_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/organizations",
        managed_organizations_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/audited_organizations",
        managed_spaces_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/managed_spaces",
        audited_spaces_url:
          "/v2/users/2e60959a-a2e6-4d69-ac85-49dbbaab1229/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "bb60f6e1-b495-45be-8bc4-7db4e8f3ed46",
        url: "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46",
        created_at: "2015-03-19T18:00:06Z",
        updated_at: "2015-03-19T18:00:06Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-persona@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/spaces",
        organizations_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/organizations",
        managed_organizations_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/audited_organizations",
        managed_spaces_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/managed_spaces",
        audited_spaces_url:
          "/v2/users/bb60f6e1-b495-45be-8bc4-7db4e8f3ed46/audited_spaces"
      }
    },
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
        username: "fake-personb@gsa.gov",
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/spaces",
        organizations_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/organizations",
        managed_organizations_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/audited_organizations",
        managed_spaces_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/managed_spaces",
        audited_spaces_url:
          "/v2/users/bba7537f-601d-48c4-9705-4583ba54ea4b/audited_spaces"
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
        username: "fake-autit",
        organization_roles: ["org_user", "org_manager", "org_auditor"],
        spaces_url: "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/spaces",
        organizations_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/organizations",
        managed_organizations_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/audited_organizations",
        managed_spaces_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/managed_spaces",
        audited_spaces_url:
          "/v2/users/540a87fc-fdce-4f8f-b3ba-b60dc0d8211c/audited_spaces"
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
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/spaces",
        organizations_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/organizations",
        managed_organizations_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/audited_organizations",
        managed_spaces_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/managed_spaces",
        audited_spaces_url:
          "/v2/users/f8f34131-dd29-4e02-a39b-7138bbaa956c/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "a3a521fd-638b-48d5-8b74-ed383a6073fc",
        url: "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc",
        created_at: "2015-06-08T18:08:12Z",
        updated_at: "2015-06-08T18:08:12Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-persond@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/spaces",
        organizations_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/organizations",
        managed_organizations_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/audited_organizations",
        managed_spaces_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/managed_spaces",
        audited_spaces_url:
          "/v2/users/a3a521fd-638b-48d5-8b74-ed383a6073fc/audited_spaces"
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
        organization_roles: ["org_user", "org_manager", "org_auditor"],
        spaces_url: "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/spaces",
        organizations_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/organizations",
        managed_organizations_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/audited_organizations",
        managed_spaces_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/managed_spaces",
        audited_spaces_url:
          "/v2/users/2e6c6e56-897a-4729-8f00-b9d653bf07a0/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "4205acb0-a57d-4059-925d-fd6ae18ac7df",
        url: "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df",
        created_at: "2015-07-23T20:18:05Z",
        updated_at: "2015-07-23T20:18:05Z"
      },
      entity: {
        admin: false,
        active: false,
        default_space_guid: null,
        username: "fake-sys-tester",
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/spaces",
        organizations_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/organizations",
        managed_organizations_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/audited_organizations",
        managed_spaces_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/managed_spaces",
        audited_spaces_url:
          "/v2/users/4205acb0-a57d-4059-925d-fd6ae18ac7df/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "b46f24d3-b427-46b6-99b9-15ea828c9aab",
        url: "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab",
        created_at: "2015-10-23T14:42:21Z",
        updated_at: "2015-10-23T14:42:21Z"
      },
      entity: {
        admin: false,
        active: true,
        default_space_guid: null,
        username: "fake-persond@gsa.gov",
        organization_roles: ["org_user", "org_manager"],
        spaces_url: "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/spaces",
        organizations_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/organizations",
        managed_organizations_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/audited_organizations",
        managed_spaces_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/managed_spaces",
        audited_spaces_url:
          "/v2/users/b46f24d3-b427-46b6-99b9-15ea828c9aab/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "6d009950-cbb4-4121-b1a7-9efd137a4e8e",
        url: "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e",
        created_at: "2015-10-27T15:49:22Z",
        updated_at: "2015-10-27T15:49:22Z"
      },
      entity: {
        admin: false,
        active: true,
        default_space_guid: null,
        username: "fake-persone@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/spaces",
        organizations_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/organizations",
        managed_organizations_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/audited_organizations",
        managed_spaces_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/managed_spaces",
        audited_spaces_url:
          "/v2/users/6d009950-cbb4-4121-b1a7-9efd137a4e8e/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "3024ea56-66c1-42f2-8511-c76207e8d884",
        url: "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884",
        created_at: "2015-11-04T18:06:53Z",
        updated_at: "2015-11-04T18:06:53Z"
      },
      entity: {
        admin: false,
        active: true,
        default_space_guid: null,
        username: "fake-personf@gsa.gov",
        organization_roles: ["org_user"],
        spaces_url: "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/spaces",
        organizations_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/organizations",
        managed_organizations_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/audited_organizations",
        managed_spaces_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/managed_spaces",
        audited_spaces_url:
          "/v2/users/3024ea56-66c1-42f2-8511-c76207e8d884/audited_spaces"
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
        username: "fake-persong@gsa.gov",
        organization_roles: ["org_user", "org_manager"],
        spaces_url: "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/spaces",
        organizations_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/organizations",
        managed_organizations_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/audited_organizations",
        managed_spaces_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/managed_spaces",
        audited_spaces_url:
          "/v2/users/2a398848-feea-4365-a7a2-1c0e96894284/audited_spaces"
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
        username: "fake-personh@gsa.gov",
        organization_roles: ["org_user", "org_manager", "org_auditor"],
        spaces_url: "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/spaces",
        organizations_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/organizations",
        managed_organizations_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/audited_organizations",
        managed_spaces_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/managed_spaces",
        audited_spaces_url:
          "/v2/users/dad8ac0a-6188-4f0c-bb20-244d11ee3b47/audited_spaces"
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
        username: "fake-personi@gsa.gov",
        organization_roles: [
          "org_user",
          "org_manager",
          "org_auditor",
          "billing_manager"
        ],
        spaces_url: "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/spaces",
        organizations_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/organizations",
        managed_organizations_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/audited_organizations",
        managed_spaces_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/managed_spaces",
        audited_spaces_url:
          "/v2/users/9a6ea094-43c2-4df5-961d-1c0806ce89ff/audited_spaces"
      }
    },
    {
      metadata: {
        guid: "aa3a9f58-bcd8-4fd2-be05-0e80d9578bba",
        url: "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba",
        created_at: "2016-11-07T18:13:49Z",
        updated_at: "2016-11-07T18:13:49Z"
      },
      entity: {
        admin: false,
        active: true,
        default_space_guid: null,
        username: "fake-personj@gsa.gov",
        organization_roles: ["org_user", "org_manager"],
        spaces_url: "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/spaces",
        organizations_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/organizations",
        managed_organizations_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/managed_organizations",
        billing_managed_organizations_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/billing_managed_organizations",
        audited_organizations_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/audited_organizations",
        managed_spaces_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/managed_spaces",
        audited_spaces_url:
          "/v2/users/aa3a9f58-bcd8-4fd2-be05-0e80d9578bba/audited_spaces"
      }
    }
  ]
};

module.exports = orgUserRoles;
