const spaceQuotaDefinitions = [
  {
    total_results: 1,
    total_pages: 1,
    prev_url: null,
    next_url: null,
    resources: [
      {
        metadata: {
          guid: "66404ac5-9979-4e80-9457-85afa3af929a",
          url:
            "/v2/space_quota_definitions/66404ac5-9979-4e80-9457-85afa3af929a",
          created_at: "2016-02-11T17:44:57Z",
          updated_at: "2016-02-27T01:28:06Z"
        },
        entity: {
          name: "sandbox_quota",
          organization_guid: "4a962676-e687-46c4-95f4-7a83712065c6",
          non_basic_services_allowed: true,
          total_services: 10,
          total_routes: 10,
          memory_limit: 1024,
          instance_memory_limit: -1,
          app_instance_limit: -1,
          app_task_limit: 5,
          total_service_keys: 1000,
          total_reserved_route_ports: -1,
          organization_url:
            "/v2/organizations/4a962676-e687-46c4-95f4-7a83712065c6",
          spaces_url:
            "/v2/space_quota_definitions/66404ac5-9979-4e80-9457-85afa3af929a/spaces"
        }
      }
    ]
  }
];

module.exports = spaceQuotaDefinitions;
