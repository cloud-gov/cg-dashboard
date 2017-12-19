const organizationQuotaDefinitions = [
  {
    metadata: {
      guid: "f7963421-c06e-4847-9913-bcd0e6048fa2",
      url: "/v2/quota_definitions/f7963421-c06e-4847-9913-bcd0e6048fa2",
      created_at: "2015-04-08T18:55:21Z",
      updated_at: "2015-12-08T21:08:53Z"
    },
    entity: {
      name: "fakeDevOps",
      non_basic_services_allowed: true,
      total_services: 10000,
      total_routes: 1000,
      total_private_domains: -1,
      memory_limit: 40960,
      trial_db_allowed: false,
      instance_memory_limit: -1,
      app_instance_limit: -1,
      app_task_limit: -1,
      total_service_keys: -1,
      total_reserved_route_ports: 0
    }
  }
];

module.exports = organizationQuotaDefinitions;
