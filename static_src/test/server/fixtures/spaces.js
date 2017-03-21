
const env = require('../envvars.js');

const spaces = [
  {
    metadata: {
      guid: "a791b3c3-88c0-4954-9dd5-5f798a914db7",
      url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7",
      created_at: "2015-03-23T22:14:00Z",
      updated_at: "2016-02-11T17:45:02Z"
    },
    entity: {
      name: "person",
      organization_guid: "4a962676-e687-46c4-95f4-7a83712065c6",
      space_quota_definition_guid: "66404ac5-9979-4e80-9457-85afa3af929a",
      isolation_segment_guid: null,
      allow_ssh: true,
      organization_url: "/v2/organizations/4a962676-e687-46c4-95f4-7a83712065c6",
      space_quota_definition_url: "/v2/space_quota_definitions/66404ac5-9979-4e80-9457-85afa3af929a",
      developers_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/developers",
      managers_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/managers",
      auditors_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/auditors",
      apps_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/apps",
      routes_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/routes",
      domains_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/domains",
      service_instances_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/service_instances",
      app_events_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/app_events",
      events_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/events",
      security_groups_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/security_groups",
      staging_security_groups_url: "/v2/spaces/a791b3c3-88c0-4954-9dd5-5f798a914db7/staging_security_groups"
    }
  },
  {
    metadata: {
      guid: "82af0edb-8540-4064-82f2-d74df612b794",
      url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794",
      created_at: "2015-08-14T19:20:11Z",
      updated_at: "2015-08-14T19:20:11Z"
    },
    entity: {
      name: "dev",
      organization_guid: "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      space_quota_definition_guid: null,
      isolation_segment_guid: null,
      allow_ssh: true,
      organization_url: "/v2/organizations/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      developers_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/developers",
      managers_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/managers",
      auditors_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/auditors",
      apps_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/apps",
      routes_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/routes",
      domains_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/domains",
      service_instances_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/service_instances",
      app_events_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/app_events",
      events_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/events",
      security_groups_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/security_groups",
      staging_security_groups_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794/staging_security_groups"
    }
  },
  {
    metadata: {
      guid: "48e18795-de67-467b-aebb-150cb097a168",
      url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168",
      created_at: "2015-08-14T19:20:18Z",
      updated_at: "2015-08-14T19:20:18Z"
    },
    entity: {
      name: "prod",
      organization_guid: "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      space_quota_definition_guid: null,
      isolation_segment_guid: null,
      allow_ssh: true,
      organization_url: "/v2/organizations/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      developers_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/developers",
      managers_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/managers",
      auditors_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/auditors",
      apps_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/apps",
      routes_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/routes",
      domains_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/domains",
      service_instances_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/service_instances",
      app_events_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/app_events",
      events_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/events",
      security_groups_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/security_groups",
      staging_security_groups_url: "/v2/spaces/48e18795-de67-467b-aebb-150cb097a168/staging_security_groups"
    }
  },
  {
    metadata: {
      guid: "7ed61149-acf6-48ff-a925-26ad2c3f342d",
      url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d",
      created_at: "2015-08-14T19:20:23Z",
      updated_at: "2015-08-14T19:20:23Z"
    },
    entity: {
      name: "staging",
      organization_guid: "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      space_quota_definition_guid: null,
      isolation_segment_guid: null,
      allow_ssh: true,
      organization_url: "/v2/organizations/48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
      developers_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/developers",
      managers_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/managers",
      auditors_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/auditors",
      apps_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/apps",
      routes_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/routes",
      domains_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/domains",
      service_instances_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/service_instances",
      app_events_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/app_events",
      events_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/events",
      security_groups_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/security_groups",
      staging_security_groups_url: "/v2/spaces/7ed61149-acf6-48ff-a925-26ad2c3f342d/staging_security_groups"
    }
  }
];

if(env.testing) {
  spaces.push({
    metadata: {
      guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
      url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58",
      created_at: "2015-09-16T17:41:53Z",
      updated_at: "2015-09-16T17:41:53Z"
    },
    entity: {
      name: "fake-testSpace01",
      organization_guid: "cfeb9be5-a61a-4f68-894e-8808ab008aaa",
      space_quota_definition_guid: null,
      isolation_segment_guid: null,
      allow_ssh: true,
      organization_url: "/v2/organizations/cfeb9be5-a61a-4f68-894e-8808ab008aaa",
      developers_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/developers",
      managers_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/managers",
      auditors_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/auditors",
      apps_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/apps",
      routes_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/routes",
      domains_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/domains",
      service_instances_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/service_instances",
      app_events_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/app_events",
      events_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/events",
      security_groups_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/security_groups",
      staging_security_groups_url: "/v2/spaces/b7e56bba-b01b-4c14-883f-2e6d15284b58/staging_security_groups"
    }
  });
}

module.exports = spaces;
