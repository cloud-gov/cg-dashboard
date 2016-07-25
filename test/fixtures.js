var URL_BASE = '/v2'

var appGuids = [
  'app-guid-one',
  'app-guid-two',
  'app-guid-three'
];

module.exports.appGuids = appGuids;

var organizationGuids = [
  'org-guid-one',
  'org-guid-two',
  'org-guid-three'
];

module.exports.organizationGuids = organizationGuids;

var routeGuids = [
  'route-guid-one',
  'route-guid-two',
  'route-guid-three'
];

module.exports.routeGuids = routeGuids;

var serviceGuids = [
  'serivce-guid-one',
  'service-guid-two',
  'service-guid-three',
  'service-guid-four'
];

module.exports.serviceGuids = serviceGuids;

var serviceInstanceGuids = [
  'service-instance-guid-one',
  'service-instance-guid-two',
  'service-instance-guid-three'
];

module.exports.serviceInstanceGuids = serviceInstanceGuids;

var servicePlanGuids = [
  'service-plan-guid-one',
  'service-plan-guid-two',
  'service-plan-guid-three'
];

module.exports.servicePlanGuids = servicePlanGuids;

var spaceGuids = [
  'space-guid-one',
  'space-guid-two',
  'space-guid-three'
];

module.exports.spaceGuids = spaceGuids;

var currentUserGuid = 'user-guid-current';

module.exports.currentUserGuid = currentUserGuid;

var userGuids = [
  currentUserGuid,
  'user-guid-one',
  'user-guid-two',
  'user-guid-three'
];

module.exports.userGuids = userGuids;

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
        guid: 'd32ee365-637b-493d-874e-8fe93c7212e2',
        host: '18f-site',
        path: '',
        domain: {
          guid: '3750eb89-86c6-4882-96bf-66b8c6363290',
          name: '18f.gov'
        }
      }
    ]
  }
});

module.exports.apps = apps;

var organizations = organizationGuids.map(function(guid) {
  return {
    metadata: {
      guid: guid,
      url: `${URL_BASE}/organizations/${guid}`,
      created_at: '2015-03-02T19:58:26Z',
      updated_at: '2015-03-02T19:58:26Z',
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

var routes = routeGuids.map(function(guid, i){
  var domainGuid = 'yo';
  var spaceGuid = spaceGuids[i];
  return {
    total_results: 1,
    total_pages: 1,
    prev_url: null,
    next_url: null,
    resources: [
      {
        metadata: {
          guid: guid,
          url: `${URL_BASE}/routes/${guid}`,
          created_at: '2015-10-13T18:30:37Z',
          updated_at: null
        },
        entity: {
          host: 'console',
          path: '',
          domain_guid: '',
          space_guid: spaceGuids[i],
          service_instance_guid: null,
          port: 0,
          domain_url: `${URL_BASE}/domains/${domainGuid}`,
          space_url: `${URL_BASE}/spaces/${spaceGuid}`,
          apps_url: `${URL_BASE}/routes/${guid}/apps`,
          route_mappings_url: `${URL_BASE}/routes/${guid}/route_mappings`
        }
      }
    ]
  }
});

module.exports.routes = routes;

var services = serviceGuids.map(function(guid, i) {
  return {
    metadata: {
      guid: guid,
      url: `${URL_BASE}/services/${guid}`,
      created_at: '2015-04-23T21:40:06Z',
      updated_at: '2015-07-22T19:14:50Z'
    },
    entity: {
      label: `service-${guid}`,
      provider: null,
      url: null,
      description: 'Generic cloud.gov Service',
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: 'db80ca29-2d1b-4fbc-aad3-d03c0bfa7593',
      extra: '{\'displayName\':\'Generic cloud.gov Service\',\'imageUrl\':\'\',\'longDescription\':\'\',\'providerDisplayName\':\'RDS\',\'documentationUrl\':\'\',\'supportUrl\':\'\'}',
      tags: [
        'amazing',
        'service',
      ],
      requires: [

      ],
      documentation_url: null,
      service_broker_guid: '9f97e259-93de-4fc8-96e6-b3cb1dd7835e',
      plan_updateable: false,
      service_plans_url: '/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030/service_plans'
    }
  }
});

module.exports.services = services;

var serviceInstances = serviceInstanceGuids.map(function(guid, i) {
  return {
    metadata: {
      guid: guid,
      url: `${URL_BASE}/service_instances/${guid}`,
      created_at: '2015-07-14T04:02:30Z',
      updated_at: null
    },
    entity: {
      name: `service-instance-${guid}`,
      credentials: {},
      service_plan_guid: 'fake-service-plan-guid',
      space_guid: spaceGuids[i],
      gateway_data: null,
      dashboard_url: null,
      type: 'managed_service_instance',
      last_operation: {
        type: 'create',
        state: 'succeeded',
        description: 'The instance was created',
        created_at: '2015-07-14T04:02:30Z',
        updated_at: '2015-07-14T04:02:30Z',
        tags: [],
        space_url: `${URL_BASE}/spaces/${spaceGuids[i]}`,
        service_plan_url: '',
        service_bindings_url: `${URL_BASE}/service_instances/${guid}/service_bindings`,
        service_keys_url: `${URL_BASE}/service_instances/${guid}/service_keys`,
        routes_url: `${URL_BASE}/service_instances/${guid}/routes`
      }
    }
  }
});

module.exports.serviceInstances = serviceInstances;

var servicePlans = function(serviceGuid) {
  return servicePlanGuids.map(function(guid, i) {
    return {
      metadata: {
        guid: `${serviceGuid}-${guid}`,
        url: `${URL_BASE}/service_plans/${guid}`,
        created_at: '2015-07-14T04:02:30Z',
        updated_at: null
      },
      entity: {
        active: true,
        description: 'Shared infrastructure for Postgres DB',
        extra: "{\"bullets\":[\"Shared RDS Instance\",\"Postgres instance\"],\"costs\":[{\"amount\":{\"usd\":0},\"unit\":\"MONTHLY\"}],\"displayName\":\"Free Shared Plan\"}",
        free: true,
        name: 'shared-psql',
        public: true,
        service_guid: serviceGuid,
        service_instances_url: '/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8/service_instances',
        service_url: '/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030',
        unique_id: '44d24fc7-f7a4-4ac1-b7a0-de82836e89a3'
      }
    }
  });
};

module.exports.servicePlans = servicePlans;

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

var currentUser = {
  email: "current.user@gsa.gov",
  family_name: "gsa.gov",
  given_name: "current.user",
  name: "current.user gsa.gov",
  user_id: currentUserGuid,
  user_name: "current.user@gsa.gov"
};

module.exports.currentUser = currentUser;
module.exports.currentUserGuid = currentUser;

var users = userGuids.map(function(guid, i) {
  return {
    metadata: {
      guid: guid,
      url: `${URL_BASE}/users/${guid}`,
      created_at: '2015-02-19T08:46:28Z',
      updated_at: null
    },
    entity: {
      admin: (i === 0) ? true : false,
      active: true,
      default_space_guid: null,
      username: `user-${guid}`,
      spaces_url: `${URL_BASE}/users/${guid}/spaces`,
      organizations_url: `${URL_BASE}/users/${guid}/organizations`,
      managed_organizations_url: `${URL_BASE}/users/${guid}/managed_organizations_url`,
      billing_managed_organizations_url: `${URL_BASE}/users/${guid}/billing_managed_organizations`,
      audited_organizations_url: `${URL_BASE}/users/${guid}/audited_organizations`,
      managed_spaces_url: `${URL_BASE}/users/${guid}/managed_spaces`,
      audited_spaces_url: `${URL_BASE}/users/${guid}/audited_spaces`
    }
  }
});

module.exports.users = users;
module.exports.orgUsers = users;

var orgUserRoles = users.map(function(user, i) {
  var roles = [];
  if (i % 2 === 0 || user.guid === currentUserGuid) {
    roles.push('org_manager');
  }
  if (i % 3 === 0) {
    roles.push('org_auditor');
  }
  var entity = Object.assign({}, user.entity, { organization_roles: roles});
  return Object.assign({}, user, {entity: entity});
});

module.exports.orgUserRoles = orgUserRoles;

var spaceUsers = users.map(function(user, i) {
  var roles = ['space_developer'];
  if (i % 2 === 0 && user.guid !== currentUserGuid) {
    roles.push('space_manager');
  }
  var entity = Object.assign({}, user.entity, { space_roles: roles});
  return Object.assign({}, user, {entity: entity});
});
spaceUsers.pop();

module.exports.spaceUsers = spaceUsers;

