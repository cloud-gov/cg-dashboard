var URL_BASE = '/v2'

var appGuids = [
  'app-guid-one',
  'app-guid-two',
  'app-guid-three'
]

module.exports.appGuids = appGuids;

var apps = appGuids.map(function(guid) {
  return {
    guid: guid,
    name: `app-${guid}`,
    production: false,
    buildpack: 'https://github.com/cloudfoundry/staticfile-buildpack.git',
    command: null,
    console: false,
    debug: null,
    detected_buildpack: 'node.js 1.5.10',
    disk_quota: 1024,
    memory: 64,
    package_state: 'STAGED',
    ports: null,
    instances: 2,
    running_instances: 2,
    service_count: 0,
    service_names: [],
    state: 'STARTED',
    version: 'version',
    urls: [
      `${guid}.apps.cloud.gov`
    ],
    routes: [
      {
        guid: "d32ee365-637b-493d-874e-8fe93c7212e2",
        host: "18f-site",
        path: "",
        domain: {
          guid: "3750eb89-86c6-4882-96bf-66b8c6363290",
          name: "18f.gov"
        }
      }
    ]
  }
});

module.exports.apps = apps;

var organizationGuids = [
  'org-guid-one',
  'org-guid-two',
  'org-guid-three'
];

module.exports.organizationGuids = organizationGuids;

var organizations = organizationGuids.map(function(guid) {
  return {
    metadata: {
      guid: guid,
      url: `${URL_BASE}/organizations/${guid}`,
      created_at: "2015-03-02T19:58:26Z",
      updated_at: "2015-03-02T19:58:26Z",
    },
    entity: {
      name: `org-${guid}`,
      billing_enabled: false,
      status: 'active',
      quota_definition_guid: '',
      quota_definition_url: '',
      spaces_url: `${URL_BASE}/organizations/${guid}/spaces`,
      domains_url: `${URL_BASE}/organizations/${guid}/domains`,
      private_domains_url: `${URL_BASE}/organizations/${guid}/private_domains`,
      users_url: `${URL_BASE}/organizations/${guid}/users`,
      managers_url: `${URL_BASE}/organizations/${guid}/managers`,
      billing_managers_url: `${URL_BASE}/organizations/${guid}/billing_managers`,
      auditors_url: `${URL_BASE}/organizations/${guid}/auditors`,
      app_events_url: `${URL_BASE}/organizations/${guid}/app_events`,
      space_quota_definitions_url: `${URL_BASE}/organizations/${guid}/space_quota_definitions`
    }
  }
});

module.exports.organizations  = organizations;

var spaceGuids = [
  'space-guid-one',
  'space-guid-two',
  'space-guid-three'
];

module.exports.spaceGuids = spaceGuids;

var spaces = spaceGuids.map(function(guid){
  return {
    guid: guid,
    name: `space-${guid}`,
    service_count: 0,
    app_count: 2,
    mem_dev_total: 2560,
    mem_prod_total: 0
  };
});

module.exports.spaces = spaces;
