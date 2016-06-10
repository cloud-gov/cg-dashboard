var URL_BASE = '/v2'

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
