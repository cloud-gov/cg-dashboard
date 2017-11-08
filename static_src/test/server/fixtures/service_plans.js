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
      extra:
        '{"bullets":["Shared RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"displayName":"Free Shared Plan"}',
      unique_id: "44d24fc7-f7a4-4ac1-b7a0-de82836e89a3",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030",
      service_instances_url:
        "/v2/service_plans/fca6b5c2-2e57-4436-a68e-562c1ee3b8b8/service_instances"
    }
  },
  {
    metadata: {
      guid: "69c4a060-05b5-48ee-9e5a-31c0823c7001",
      url: "/v2/service_plans/69c4a060-05b5-48ee-9e5a-31c0823c7001",
      created_at: "2015-07-22T01:46:24Z",
      updated_at: "2015-07-22T01:46:33Z"
    },
    entity: {
      name: "micro-psql",
      free: false,
      description: "Dedicated Micro RDS Postgres DB Instance",
      service_guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0.036},"unit":"HOURLY"}],"displayName":"Dedicated Micro Postgres"}',
      unique_id: "da91e15c-98c9-46a9-b114-02b8d28062c6",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030",
      service_instances_url:
        "/v2/service_plans/69c4a060-05b5-48ee-9e5a-31c0823c7001/service_instances"
    }
  },
  {
    metadata: {
      guid: "592c8238-dd7c-410c-855f-7c290f003af7",
      url: "/v2/service_plans/592c8238-dd7c-410c-855f-7c290f003af7",
      created_at: "2015-07-22T01:46:24Z",
      updated_at: "2015-07-22T01:46:34Z"
    },
    entity: {
      name: "medium-psql",
      free: false,
      description: "Dedicated Medium RDS Postgres DB Instance",
      service_guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0.19},"unit":"HOURLY"}],"displayName":"Dedicated Medium Postgres"}',
      unique_id: "332e0168-6969-4bd7-b07f-29f08c4bf78e",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030",
      service_instances_url:
        "/v2/service_plans/592c8238-dd7c-410c-855f-7c290f003af7/service_instances"
    }
  },
  {
    metadata: {
      guid: "07df58f6-e42f-496a-a368-70a58119deb0",
      url: "/v2/service_plans/07df58f6-e42f-496a-a368-70a58119deb0",
      created_at: "2015-08-28T21:56:00Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      name: "3x",
      free: true,
      description: "medium",
      service_guid: "04a366c8-6f52-42e8-9140-97b6fa582c39",
      extra:
        '{"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"bullets":["Elasticsearch 1.7.1 - 3G Heap"]}',
      unique_id: "3caff8d4-48f9-429a-a951-50e4141bf206",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/04a366c8-6f52-42e8-9140-97b6fa582c39",
      service_instances_url:
        "/v2/service_plans/07df58f6-e42f-496a-a368-70a58119deb0/service_instances"
    }
  },
  {
    metadata: {
      guid: "8bf2e0e1-db62-47e6-8255-2aad240bb225",
      url: "/v2/service_plans/8bf2e0e1-db62-47e6-8255-2aad240bb225",
      created_at: "2015-08-28T22:21:54Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      name: "6x",
      free: true,
      description: "medium",
      service_guid: "04a366c8-6f52-42e8-9140-97b6fa582c39",
      extra:
        '{"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"bullets":["Elasticsearch 1.7.1 - 6GB Heap"]}',
      unique_id: "98a87da4-710f-4723-b2eb-0d8efb14e06a",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/04a366c8-6f52-42e8-9140-97b6fa582c39",
      service_instances_url:
        "/v2/service_plans/8bf2e0e1-db62-47e6-8255-2aad240bb225/service_instances"
    }
  },
  {
    metadata: {
      guid: "e2c4cdca-9f26-4f96-bae5-eee44a399234",
      url: "/v2/service_plans/e2c4cdca-9f26-4f96-bae5-eee44a399234",
      created_at: "2015-08-29T16:55:49Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      name: "1x",
      free: true,
      description: "medium",
      service_guid: "04a366c8-6f52-42e8-9140-97b6fa582c39",
      extra:
        '{"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"bullets":["Elasticsearch 1.7.1 - 1GB Heap"]}',
      unique_id: "56f87778-0646-449c-99dd-fa33ea97d032",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/04a366c8-6f52-42e8-9140-97b6fa582c39",
      service_instances_url:
        "/v2/service_plans/e2c4cdca-9f26-4f96-bae5-eee44a399234/service_instances"
    }
  },
  {
    metadata: {
      guid: "3e64dba4-8c26-417f-9441-299c6ddf2e41",
      url: "/v2/service_plans/3e64dba4-8c26-417f-9441-299c6ddf2e41",
      created_at: "2015-11-09T17:18:26Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      name: "standard",
      free: true,
      description: "standard",
      service_guid: "03f26e73-5f2a-445d-af8e-d41502095c87",
      extra:
        '{"costs":[{"amount":{"usd":0.0},"unit":"MONTHLY"}],"bullets":["Redis 2.8 running inside a Docker container"]}',
      unique_id: "846227e8-f68a-4a6b-b4ef-970e81658e96",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/03f26e73-5f2a-445d-af8e-d41502095c87",
      service_instances_url:
        "/v2/service_plans/3e64dba4-8c26-417f-9441-299c6ddf2e41/service_instances"
    }
  },
  {
    metadata: {
      guid: "d129e8e0-6ef8-491a-bee5-e343da3cc67a",
      url: "/v2/service_plans/d129e8e0-6ef8-491a-bee5-e343da3cc67a",
      created_at: "2015-12-04T03:46:34Z",
      updated_at: "2015-12-07T23:47:43Z"
    },
    entity: {
      name: "basic",
      free: false,
      description:
        "An S3 plan providing a single bucket with unlimited storage.",
      service_guid: "2c0933b1-812d-45ef-97af-6b67b59af337",
      extra:
        '{"bullets":["Single S3 bucket","Unlimited storage","Unlimited number of objects"]}',
      unique_id: "s3-basic-plan",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/2c0933b1-812d-45ef-97af-6b67b59af337",
      service_instances_url:
        "/v2/service_plans/d129e8e0-6ef8-491a-bee5-e343da3cc67a/service_instances"
    }
  },
  {
    metadata: {
      guid: "9fee83be-27ed-46fc-ac0a-7ecb9edf01c4",
      url: "/v2/service_plans/9fee83be-27ed-46fc-ac0a-7ecb9edf01c4",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:10Z"
    },
    entity: {
      name: "shared-psql",
      free: true,
      description: "Shared infrastructure for Postgres DB",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Shared RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"displayName":"Free Shared Plan"}',
      unique_id: "1bbd9c4f-adb8-43dc-bbec-ab0315bcb14e",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/9fee83be-27ed-46fc-ac0a-7ecb9edf01c4/service_instances"
    }
  },
  {
    metadata: {
      guid: "603fecd5-4a97-4507-b74b-fd465d39ddf4",
      url: "/v2/service_plans/603fecd5-4a97-4507-b74b-fd465d39ddf4",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:10Z"
    },
    entity: {
      name: "micro-psql",
      free: false,
      description: "Dedicated Micro RDS Postgres DB Instance",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0.036},"unit":"HOURLY"}],"displayName":"Dedicated Micro Postgres"}',
      unique_id: "52bf678a-43f6-4c0f-961a-bc5009d874a6",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/603fecd5-4a97-4507-b74b-fd465d39ddf4/service_instances"
    }
  },
  {
    metadata: {
      guid: "eee54d74-7e44-431f-889d-134f39036324",
      url: "/v2/service_plans/eee54d74-7e44-431f-889d-134f39036324",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:11Z"
    },
    entity: {
      name: "medium-psql",
      free: false,
      description: "Dedicated Medium RDS Postgres DB Instance",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","Postgres instance"],"costs":[{"amount":{"usd":0.19},"unit":"HOURLY"}],"displayName":"Dedicated Medium Postgres"}',
      unique_id: "ee75aef3-7697-4906-9330-fb1f83d719be",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/eee54d74-7e44-431f-889d-134f39036324/service_instances"
    }
  },
  {
    metadata: {
      guid: "58c8e259-1172-495e-9690-5dd22487f45d",
      url: "/v2/service_plans/58c8e259-1172-495e-9690-5dd22487f45d",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:12Z"
    },
    entity: {
      name: "shared-mysql",
      free: true,
      description: "Shared infrastructure for MySQL DB",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Shared RDS Instance","MySQL instance"],"costs":[{"amount":{"usd":0},"unit":"MONTHLY"}],"displayName":"Free Shared Plan"}',
      unique_id: "57dd4bf0-465b-4e11-838d-2142caa6d763",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/58c8e259-1172-495e-9690-5dd22487f45d/service_instances"
    }
  },
  {
    metadata: {
      guid: "4cc82d50-dfa5-4c65-b0d0-27c46a0ca4fe",
      url: "/v2/service_plans/4cc82d50-dfa5-4c65-b0d0-27c46a0ca4fe",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:13Z"
    },
    entity: {
      name: "micro-mysql",
      free: false,
      description: "Dedicated Micro RDS Postgres DB Instance",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","MySQL instance"],"costs":[{"amount":{"usd":0.036},"unit":"HOURLY"}],"displayName":"Dedicated Micro MySQL"}',
      unique_id: "f35bc854-e393-41ed-825e-7f66a6118dfa",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/4cc82d50-dfa5-4c65-b0d0-27c46a0ca4fe/service_instances"
    }
  },
  {
    metadata: {
      guid: "d4e962bc-e6e9-464e-a788-2c8d17b6e9d4",
      url: "/v2/service_plans/d4e962bc-e6e9-464e-a788-2c8d17b6e9d4",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-29T15:49:13Z"
    },
    entity: {
      name: "medium-mysql",
      free: false,
      description: "Dedicated Medium RDS MySQL DB Instance",
      service_guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      extra:
        '{"bullets":["Dedicated Redundant RDS Instance","MySQL instance"],"costs":[{"amount":{"usd":0.19},"unit":"HOURLY"}],"displayName":"Dedicated Medium MySQL"}',
      unique_id: "30e19cab-8d4e-492a-ac2c-33dd59d436d8",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      service_instances_url:
        "/v2/service_plans/d4e962bc-e6e9-464e-a788-2c8d17b6e9d4/service_instances"
    }
  },
  {
    metadata: {
      guid: "abc10d1c-476a-4d23-84af-9498b7bc01ed",
      url: "/v2/service_plans/abc10d1c-476a-4d23-84af-9498b7bc01ed",
      created_at: "2016-11-30T20:58:13Z",
      updated_at: "2016-11-30T20:58:16Z"
    },
    entity: {
      name: "CATS-2-SVC-PLAN-74d34e9a-9c0a-431a-5",
      free: true,
      description:
        "Shared fake Server, 5tb persistent disk, 40 max concurrent connections",
      service_guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      extra:
        '{"cost":0,"bullets":[{"content":"Shared fake server"},{"content":"5 TB storage"},{"content":"40 concurrent connections"}]}',
      unique_id: "CATS-2-SVC-PLAN-ID-7d182730-42e1-451a-5",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      service_instances_url:
        "/v2/service_plans/abc10d1c-476a-4d23-84af-9498b7bc01ed/service_instances"
    }
  },
  {
    metadata: {
      guid: "326e1c70-92ef-4e70-8dc5-c0884204d2c7",
      url: "/v2/service_plans/326e1c70-92ef-4e70-8dc5-c0884204d2c7",
      created_at: "2016-11-30T20:58:13Z",
      updated_at: "2016-11-30T20:58:17Z"
    },
    entity: {
      name: "CATS-2-SVC-PLAN-3a2864f8-57af-48b0-5",
      free: true,
      description:
        "Shared fake Server, 5tb persistent disk, 40 max concurrent connections",
      service_guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      extra:
        '{"cost":0,"bullets":[{"content":"Shared fake server"},{"content":"5 TB storage"},{"content":"40 concurrent connections"}]}',
      unique_id: "CATS-2-SVC-PLAN-ID-1dce3b2c-c9b2-4599-6",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      service_instances_url:
        "/v2/service_plans/326e1c70-92ef-4e70-8dc5-c0884204d2c7/service_instances"
    }
  },
  {
    metadata: {
      guid: "cdacefaf-6306-41ca-a893-71014c928f22",
      url: "/v2/service_plans/cdacefaf-6306-41ca-a893-71014c928f22",
      created_at: "2016-11-30T20:58:13Z",
      updated_at: "2016-11-30T20:58:18Z"
    },
    entity: {
      name: "CATS-2-SVC-PLAN-3f5e4d38-adf8-40a8-6",
      free: true,
      description:
        "Shared fake Server, 5tb persistent disk, 40 max concurrent connections. 100 async",
      service_guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      extra: '{"cost":0,"bullets":[{"content":"40 concurrent connections"}]}',
      unique_id: "CATS-2-SVC-PLAN-ID-ce8370d1-0014-47cd-5",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      service_instances_url:
        "/v2/service_plans/cdacefaf-6306-41ca-a893-71014c928f22/service_instances"
    }
  },
  {
    metadata: {
      guid: "1e4b1b7a-13fc-45f6-9cae-c6945b76c7e4",
      url: "/v2/service_plans/1e4b1b7a-13fc-45f6-9cae-c6945b76c7e4",
      created_at: "2016-11-30T20:58:13Z",
      updated_at: "2016-11-30T20:58:19Z"
    },
    entity: {
      name: "CATS-2-SVC-PLAN-7596fbb9-e8e1-485f-6",
      free: true,
      description:
        "Shared fake Server, 5tb persistent disk, 40 max concurrent connections. 100 async",
      service_guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      extra: '{"cost":0,"bullets":[{"content":"40 concurrent connections"}]}',
      unique_id: "CATS-2-SVC-PLAN-ID-8830cb3f-b061-4a02-4",
      public: true,
      bindable: true,
      active: true,
      service_url: "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      service_instances_url:
        "/v2/service_plans/1e4b1b7a-13fc-45f6-9cae-c6945b76c7e4/service_instances"
    }
  }
];

module.exports = servicePlans;
