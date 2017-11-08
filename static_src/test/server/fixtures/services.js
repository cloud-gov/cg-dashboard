const services = [
  {
    metadata: {
      guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
      url: "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030",
      created_at: "2015-04-23T21:40:06Z",
      updated_at: "2015-07-22T19:14:50Z"
    },
    entity: {
      label: "rds",
      provider: null,
      url: null,
      description: "RDS Database Broker",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "db80ca29-2d1b-4fbc-aad3-d03c0bfa7593",
      extra:
        '{"displayName":"RDS Database Broker","imageUrl":"","longDescription":"","providerDisplayName":"RDS","documentationUrl":"","supportUrl":""}',
      tags: ["database", "RDS", "postgresql"],
      requires: [],
      documentation_url: null,
      service_broker_guid: "9f97e259-93de-4fc8-96e6-b3cb1dd7835e",
      plan_updateable: false,
      service_plans_url:
        "/v2/services/be2de43d-bf57-4bd3-98d3-6ae021268030/service_plans"
    }
  },
  {
    metadata: {
      guid: "04a366c8-6f52-42e8-9140-97b6fa582c39",
      url: "/v2/services/04a366c8-6f52-42e8-9140-97b6fa582c39",
      created_at: "2015-08-28T21:56:00Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      label: "elasticsearch-swarm-1.7.1",
      provider: null,
      url: null,
      description: "Elasticsearch 1.7.1",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "bb97d584-baf8-463d-8878-71cefcd46634",
      extra:
        '{"displayName":"Elasticsearch 1.7.1: 3G / 3x CPU","longDescription":"A Elasticsearch 1.7.1 service","providerDisplayName":"18F","documentationUrl":"","supportUrl":""}',
      tags: ["elasticsearch171", "elasticsearch", "search"],
      requires: [],
      documentation_url: null,
      service_broker_guid: "543ecf36-80e4-44fd-906f-e2d4c5fc1d3b",
      plan_updateable: false,
      service_plans_url:
        "/v2/services/04a366c8-6f52-42e8-9140-97b6fa582c39/service_plans"
    }
  },
  {
    metadata: {
      guid: "03f26e73-5f2a-445d-af8e-d41502095c87",
      url: "/v2/services/03f26e73-5f2a-445d-af8e-d41502095c87",
      created_at: "2015-11-09T17:18:26Z",
      updated_at: "2016-03-08T16:29:21Z"
    },
    entity: {
      label: "redis28-swarm",
      provider: null,
      url: null,
      description: "Redis 2.8 service for application development and testing",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "c1380a4f-8ba1-4f2f-9966-cf9c83ef3965",
      extra:
        '{"displayName":"Redis 2.8","longDescription":"A Redis 2.8 service for development and testing running inside a Docker container","providerDisplayName":"Pivotal Software","documentationUrl":"http://docs.run.pivotal.io","supportUrl":"http://support.run.pivotal.io/home"}',
      tags: ["redis28", "redis", "key-value"],
      requires: [],
      documentation_url: null,
      service_broker_guid: "543ecf36-80e4-44fd-906f-e2d4c5fc1d3b",
      plan_updateable: false,
      service_plans_url:
        "/v2/services/03f26e73-5f2a-445d-af8e-d41502095c87/service_plans"
    }
  },
  {
    metadata: {
      guid: "2c0933b1-812d-45ef-97af-6b67b59af337",
      url: "/v2/services/2c0933b1-812d-45ef-97af-6b67b59af337",
      created_at: "2015-12-04T03:46:34Z",
      updated_at: "2015-12-07T23:27:08Z"
    },
    entity: {
      label: "s3",
      provider: null,
      url: null,
      description: "Amazon S3 is storage for the Internet.",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "s3",
      extra:
        '{"longDescription":"Amazon S3 Service","documentationUrl":"http://aws.amazon.com/s3","providerDisplayName":"Amazon","displayName":"Amazon S3","imageUrl":"http://a1.awsstatic.com/images/logos/aws_logo.png","supportUrl":"http://aws.amazon.com/s3"}',
      tags: ["s3", "object-storage"],
      requires: ["syslog_drain"],
      documentation_url: null,
      service_broker_guid: "42c17790-5642-42d0-9ad4-1ab3deeac853",
      plan_updateable: false,
      service_plans_url:
        "/v2/services/2c0933b1-812d-45ef-97af-6b67b59af337/service_plans"
    }
  },
  {
    metadata: {
      guid: "ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      url: "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa",
      created_at: "2016-01-14T14:58:19Z",
      updated_at: "2016-01-26T23:01:39Z"
    },
    entity: {
      label: "aws-rds",
      provider: null,
      url: null,
      description: "RDS Database Broker",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "ec0fd2fa-2aff-49ce-97f4-518d6937e365",
      extra:
        '{"displayName":"RDS Database Broker","imageUrl":"","longDescription":"","providerDisplayName":"RDS","documentationUrl":"","supportUrl":""}',
      tags: ["database", "RDS", "postgresql", "mysql"],
      requires: [],
      documentation_url: null,
      service_broker_guid: "8e5939e6-ad58-44b9-9f93-322f1b138b93",
      plan_updateable: false,
      service_plans_url:
        "/v2/services/ecdd80c3-0394-4958-9424-f4437a8ad9fa/service_plans"
    }
  },
  {
    metadata: {
      guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      url: "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c",
      created_at: "2016-11-30T20:58:13Z",
      updated_at: "2016-11-30T20:58:13Z"
    },
    entity: {
      label: "CATS-2-SVC-c120d2a4-6bd9-49dc-4",
      provider: null,
      url: null,
      description: "fake service",
      long_description: null,
      version: null,
      info_url: null,
      active: true,
      bindable: true,
      unique_id: "CATS-2-SVC-ID-9eb3bec5-d470-48e8-7",
      extra:
        '{"provider":{"name":"The name"},"listing":{"imageUrl":"http://catgifpage.com/cat.gif","blurb":"fake broker that is fake","longDescription":"A long time ago, in a galaxy far far away..."},"displayName":"The Fake Broker"}',
      tags: ["no-sql", "relational"],
      requires: [],
      documentation_url: null,
      service_broker_guid: "d153e57f-fa3c-4c39-bfb6-6cd0f28dad96",
      plan_updateable: true,
      service_plans_url:
        "/v2/services/101b4967-acd2-4ffc-aa4a-6bc980ed954c/service_plans"
    }
  }
];

module.exports = services;
