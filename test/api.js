var data = require('./fixtures');

var apps = data.apps;
var organizations = data.organizations;
var routes = data.routes;
var services = data.services;
var serviceInstances = data.serviceInstances;
var servicePlans = data.servicePlans;
var spaces = data.spaces;
var users = data.users;

var BASE_URL = '/v2';

module.exports = function api(smocks) {

  smocks.route({
    id: 'app-routes',
    label: 'App routes',
    path: `${BASE_URL}/apps/{guid}/routes`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      var route = routes.pop();
      console.log('guid', guid);
      reply(route);
    }
  });

  smocks.route({
    id: 'app-stats',
    label: 'App stats',
    path: `${BASE_URL}/apps/{guid}/stats`,
    handler: function (req, reply) {
      reply({
        "yo": "fool"
      });
    }
  });

  smocks.route({
    id: 'app-summary',
    label: 'App summary',
    path: `${BASE_URL}/apps/{guid}/summary`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      var app = apps.filter((app) => app.guid === guid).pop();
      reply(app);
    }
  });

  smocks.route({
    id: 'organizations',
    label: 'Organizations',
    path: `${BASE_URL}/organizations`,
    handler: function (req, reply) {
      reply({
        "total_results": organizations.length,
        "total_pages": 1,
        "prev_url": null,
        "next_url": null,
        "resources": organizations
      })
    }
  });

  smocks.route({
    id: 'organization',
    label: 'Organization',
    path: `${BASE_URL}/organizations/{guid}`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      var organization = organizations.filter((org) => org.metadata.guid === guid).pop();
      reply(organization);
    }
  });

  smocks.route({
    id: 'organization-summary',
    label: 'Organization summary',
    path: `${BASE_URL}/organizations/{guid}/summary`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        guid: guid,
        name: 'org-name',
        status: 'active',
        spaces: spaces
      });
    }
  });

  smocks.route({
    id: 'organization-memory-usage',
    label: 'Organization memory usage',
    path: `${BASE_URL}/organizations/{guid}/memory_usage`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        memory_usage_in_mb: 17616
      });
    }
  });

  smocks.route({
    id: 'organization-user-roles',
    label: 'Organization user roles',
    path: `${BASE_URL}/organizations/{guid}/user_roles`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        total_results: users.length,
        total_pages: 1,
        prev_url: null,
        next_url: null,
        resources: users
      });
    }
  });

  smocks.route({
    id: 'service-service-plans',
    label: 'Service service plans',
    path: `${BASE_URL}/services/{guid}/service_plans`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      var plans = servicePlans(guid);
      reply({
        total_results: plans.length,
        total_pages: 1,
        prev_url: null,
        next_url: null,
        resources: plans
      });
    }
  });

  smocks.route({
    id: 'space-summary',
    label: 'Space summary',
    path: `${BASE_URL}/spaces/{guid}/summary`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        guid: guid,
        name: `space-${guid}`,
        apps: apps
      });
    }
  });

  smocks.route({
    id: 'organization-services',
    label: 'Organization services',
    path: `${BASE_URL}/organizations/{guid}/services`,
    handler: function(req, reply) {
      var guid = req.params.guid;
      reply({
        total_results: services.length,
        total_pages: 1,
        prev_url: null,
        next_url: null,
        resources: services
      });
    }
  });

  smocks.route({
    id: 'space-service-instances',
    label: 'Space service instances',
    path: `${BASE_URL}/spaces/{guid}/service_instances`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        total_results: serviceInstances.length,
        total_pages: 1,
        prev_url: null,
        next_url: null,
        resources: serviceInstances
     });
   }
  });

  smocks.route({
    id: 'space-user-roles',
    label: 'Space user roles',
    path: `${BASE_URL}/spaces/{guid}/user_roles`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        total_results: users.length,
        total_pages: 1,
        prev_url: null,
        next_url: null,
        resources: users
      });
    }
  });
};
