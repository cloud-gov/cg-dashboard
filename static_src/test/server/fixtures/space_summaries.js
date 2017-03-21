
const env = require('../envvars.js');

const spaceSummaries = [
  {
    guid: "a791b3c3-88c0-4954-9dd5-5f798a914db7",
    name: "person",
    apps: [],
    services: []
  },
  {
    guid: "82af0edb-8540-4064-82f2-d74df612b794",
    name: "dev",
    apps: [],
    services: []
  },
  {
    guid: "48e18795-de67-467b-aebb-150cb097a168",
    name: "prod",
    apps: [],
    services: []
  },
  {
    guid: "7ed61149-acf6-48ff-a925-26ad2c3f342d",
    name: "staging",
    apps: [],
    services: []
  }
];

if(env.testing) {
  spaceSummaries.push({
    guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
    name: "fake-testSpace01",
    apps: [
      {
        guid: "3c37ff32-d954-4f9f-b730-15e22442fd82",
        urls: [],
        routes: [],
        service_count: 0,
        service_names: [],
        running_instances: 1,
        name: "fake-data-problem",
        production: false,
        space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: null,
        detected_buildpack: null,
        detected_buildpack_guid: null,
        environment_json: {
          AUTH_PASS: "pass",
          AUTH_USER: "user",
        },
        memory: 24,
        instances: 1,
        disk_quota: 1024,
        state: "STARTED",
        version: "4887152d-0d8f-433d-b34a-6a1e62f278f6",
        command: null,
        console: false,
        debug: null,
        staging_task_id: null,
        package_state: "PENDING",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: null,
        detected_start_command: 0,
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      },
      {
        guid: "2f684200-b9da-4ea6-a3c8-01a1df5ef2d3",
        urls: [
          "adfake-node.apps.cloud.gov"
        ],
        routes: [
          {
            guid: "228342e9-2c9d-4874-95fe-0a06ac5ceb43",
            host: "adfake-node",
            port: null,
            path: 0,
            domain: {
              guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
              name: "fake-apps.cloud.gov"
            }
          }
        ],
        service_count: 1,
        service_names: [
          "fake-abcdef"
        ],
        running_instances: 2,
        name: "fake-adfake-node",
        production: false,
        space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: null,
        detected_buildpack: "node.js 1.5.25",
        detected_buildpack_guid: "a12a1517-f676-4c7a-aa6c-1b05887190f3",
        environment_json: {},
        memory: 82,
        instances: 2,
        disk_quota: 2048,
        state: "STARTED",
        version: "ba72db14-a392-4a2a-ac18-f95714661b28",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "542281c8-69ed-42a3-8664-3cdaa482e5ac",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2016-12-05T21:13:48Z",
        detected_start_command: "node web.js",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      },
      {
        guid: "b44c91fc-f85b-4c6d-9623-e72babfe0f29",
        urls: [
          "testapp01test.18f.gov/path"
        ],
        routes: [
          {
            guid: "75f29b94-de11-4da9-9bc1-9d2bad1f0746",
            host: "testapp01test",
            port: null,
            path: "/path",
            domain: {
              guid: "3750eb89-86c6-4882-96bf-66b8c6363290",
              name: "fake-18f.gov"
            }
          }
        ],
        service_count: 2,
        service_names: [
          "fake-marco",
          "fake-test-alpha"
        ],
        running_instances: 0,
        name: "fake-testapp01",
        production: false,
        space_guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: "https://github.com/cloudfoundry/go-buildpack.git",
        detected_buildpack: null,
        detected_buildpack_guid: null,
        environment_json: {},
        memory: 16,
        instances: 1,
        disk_quota: 32,
        state: "STOPPED",
        version: "aa7364d8-c351-4224-aae8-80283382e705",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "d51dbb06-9c32-4933-b230-7632eefc889b",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2016-10-13T15:14:34Z",
        detected_start_command: "app01",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      }
    ],
    services: [
      {
        guid: "78f00930-8942-4d63-b8d7-38353c8d7818",
        name: "fake-sfsdsdsdsdsdsd-rds",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2017-01-03T22:43:40Z",
          created_at: "2017-01-03T22:43:40Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
          name: "shared-psql",
          service: {
            guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
            label: "rds",
            provider: null,
            version: null
          }
        }
      },
      {
        guid: "3f6b7712-3c72-48ff-9774-c7b0895c4489",
        name: "fake-abcdef",
        bound_app_count: 1,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2015-10-29T18:12:48Z",
          created_at: "2015-10-29T18:12:48Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "fca6b5c2-2e57-4436-a68e-562c1ee3b8b8",
          name: "shared-psql",
          service: {
            guid: "be2de43d-bf57-4bd3-98d3-6ae021268030",
            label: "rds",
            provider: null,
            version: null
          }
        }
      }
    ]
  });
}
module.exports = spaceSummaries;
