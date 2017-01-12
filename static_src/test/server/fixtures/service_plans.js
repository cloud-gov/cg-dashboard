
const servicePlans = [
  {
    metadata: {
      guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      url: "/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
      created_at: "2015-04-23T21:40:06Z",
      updated_at: "2015-07-22T01:46:24Z"
    },
    entity: {
      name: "shared-psql",
      free: true,
      description: "Shared infrastructure for Postgres DB",
      service_guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      extra: "{\"bullets\":[\"Shared RDS Instance\",\"Postgres instance\"],\"costs\":[{\"amount\":{\"usd\":0},\"unit\":\"MONTHLY\"}],\"displayName\":\"Free Shared Plan\"}",
      unique_id: "44d24fc7-f7a4-4ac1-b7a0-de82836e89a3",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030",
      service_instances_url: "/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8/service_instances"
    }
  }
];

module.exports = servicePlans;
