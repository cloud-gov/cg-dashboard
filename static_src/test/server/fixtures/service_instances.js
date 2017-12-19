const serviceInstances = [
  {
    metadata: {
      guid: "3f6b7712-3c72-48ff-9774-c7b0895c4489",
      url: "/v2/service_instances/3f6b7712-3c72-48ff-9774-c7b0895c4489",
      created_at: "2015-10-29T18:12:48Z",
      updated_at: "2015-10-29T18:12:48Z"
    },
    entity: {
      name: "fake-abcdef",
      credentials: {},
      service_plan_guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
      gateway_data: null,
      dashboard_url: null,
      type: "managed_service_instance",
      last_operation: {
        type: "create",
        state: "succeeded",
        description: "The instance was created",
        updated_at: "2015-10-29T18:12:48Z",
        created_at: "2015-10-29T18:12:48Z"
      },
      tags: [],
      service_guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      space_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794",
      service_plan_url:
        "/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      service_bindings_url:
        "/v2/service_instances/3f6b7712-3c72-48ff-9774-c7b0895c4489/service_bindings",
      service_keys_url:
        "/v2/service_instances/3f6b7712-3c72-48ff-9774-c7b0895c4489/service_keys",
      routes_url:
        "/v2/service_instances/3f6b7712-3c72-48ff-9774-c7b0895c4489/routes",
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030"
    }
  },
  {
    metadata: {
      guid: "78f00930-8942-4d63-b8d7-38353c8d7818",
      url: "/v2/service_instances/78f00930-8942-4d63-b8d7-38353c8d7818",
      created_at: "2017-01-03T22:43:40Z",
      updated_at: "2017-01-03T22:43:40Z"
    },
    entity: {
      name: "fake-sfsdsdsdsdsdsd-rds",
      credentials: {},
      service_plan_guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
      gateway_data: null,
      dashboard_url: null,
      type: "managed_service_instance",
      last_operation: {
        type: "create",
        state: "succeeded",
        description: "The instance was created",
        updated_at: "2017-01-03T22:43:40Z",
        created_at: "2017-01-03T22:43:40Z"
      },
      tags: [],
      service_guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      space_url: "/v2/spaces/82af0edb-8540-4064-82f2-d74df612b794",
      service_plan_url:
        "/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      service_bindings_url:
        "/v2/service_instances/78f00930-8942-4d63-b8d7-38353c8d7818/service_bindings",
      service_keys_url:
        "/v2/service_instances/78f00930-8942-4d63-b8d7-38353c8d7818/service_keys",
      routes_url:
        "/v2/service_instances/78f00930-8942-4d63-b8d7-38353c8d7818/routes",
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030"
    }
  }
];

module.exports = serviceInstances;
