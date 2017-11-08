const spaceSummaries = [
  {
    guid: "a791b3c3-88c0-4954-9dd5-5f798a914db7",
    name: "fake-ms",
    apps: [],
    services: []
  },
  {
    guid: "82af0edb-8540-4064-82f2-d74df612b794",
    name: "fake-dev",
    apps: [
      {
        guid: "7fa78964-4d44-4a2a-8d26-7468b7cbf67d",
        urls: ["adfake-node-crashed.apps.cloud.gov"],
        routes: [
          {
            guid: "b0a7fd97-ce44-4aeb-9bd8-204d17cdf9ef",
            host: "adfake-node-crashed",
            port: null,
            path: 0,
            domain: {
              guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
              name: "fake-apps.cloud.gov"
            }
          }
        ],
        service_count: 0,
        service_names: [],
        running_instances: 0,
        name: "fake-adfake-node-crashed",
        production: false,
        space_guid: "82af0edb-8540-4064-82f2-d74df612b794",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: null,
        detected_buildpack: "node.js 1.5.25",
        detected_buildpack_guid: "a12a1517-f676-4c7a-aa6c-1b05887190f3",
        environment_json: {},
        memory: 64,
        instances: 2,
        disk_quota: 1024,
        state: "STARTED",
        version: "630aa1f3-f6e8-4cba-aebb-f63252f31cc1",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "561387da-edcf-49ed-ae3e-ccf57db83a5a",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2016-12-22T22:06:18Z",
        detected_start_command: "node web.js",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      },
      {
        guid: "2f684200-b9da-4ea6-a3c8-01a1df5ef2d3",
        urls: ["adfake-node.apps.cloud.gov"],
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
        service_names: ["fake-abcdef"],
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
          AUTH_USER: "user"
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
  },
  {
    guid: "user_role-org_x-space_xx-4064-82f2-d74df612b794",
    name: "user_role-org_x-space_xx",
    apps: [],
    services: []
  },
  {
    guid: "user_role-org_x-space_yy-4064-82f2-d74df612b794",
    name: "user_role-org_x-space_yy",
    apps: [],
    services: []
  },
  {
    guid: "user_role-org_y-space_xx-4064-82f2-d74df612b794",
    name: "user_role-org_y-space_xx",
    apps: [],
    services: []
  },
  {
    guid: "user_role-org_y-space_yy-4064-82f2-d74df612b794",
    name: "user_role-org_y-space_yy",
    apps: [],
    services: []
  },
  {
    guid: "48e18795-de67-467b-aebb-150cb097a168",
    name: "fake-prod",
    apps: [],
    services: []
  },
  {
    guid: "7ed61149-acf6-48ff-a925-26ad2c3f342d",
    name: "fake-staging",
    apps: [],
    services: []
  },
  {
    guid: "191d3cde-dea6-4ba2-82ca-4528b735cd83",
    name: "fake-temp_test_space",
    apps: [],
    services: []
  },
  {
    guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
    name: "fake-testSpace01",
    apps: [
      {
        guid: "b44c91fc-f85b-4c6d-9623-e72babfe0f29",
        urls: ["testapp01test.18f.gov/path"],
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
        service_names: ["fake-marco", "fake-test-alpha"],
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
        guid: "da2abb12-2e21-407f-a30e-699bfbbfac2e",
        name: "fake-test-bravo",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2016-06-15T22:58:28Z",
          created_at: "2016-06-15T22:58:28Z"
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
        guid: "718edaba-aff0-40dc-bfdd-347a26044658",
        name: "fake-test12345679",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2016-11-30T21:21:29Z",
          created_at: "2016-11-30T21:21:29Z"
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
        guid: "662c7ebb-a618-4517-9a3d-dbd4828d894f",
        name: "fake-5555",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: 0,
          updated_at: "2017-01-09T23:52:40Z",
          created_at: "2017-01-09T23:52:40Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "abc10d1c-476a-4d23-84af-9498b7bc01ed",
          name: "CATS-2-SVC-PLAN-74d34e9a-9c0a-431a-5",
          service: {
            guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
            label: "CATS-2-SVC-c120d2a4-6bd9-49dc-4",
            provider: null,
            version: null
          }
        }
      },
      {
        guid: "4a85af65-7ea7-4651-b686-3e7ebc82ef91",
        name: "fake-6666",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: 0,
          updated_at: "2017-01-09T23:55:54Z",
          created_at: "2017-01-09T23:55:54Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "abc10d1c-476a-4d23-84af-9498b7bc01ed",
          name: "CATS-2-SVC-PLAN-74d34e9a-9c0a-431a-5",
          service: {
            guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
            label: "CATS-2-SVC-c120d2a4-6bd9-49dc-4",
            provider: null,
            version: null
          }
        }
      },
      {
        guid: "f61dde99-1bd4-4f78-94bc-0e6c7fef2976",
        name: "fake-4444",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: 0,
          updated_at: "2017-01-09T23:46:21Z",
          created_at: "2017-01-09T23:46:21Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "abc10d1c-476a-4d23-84af-9498b7bc01ed",
          name: "CATS-2-SVC-PLAN-74d34e9a-9c0a-431a-5",
          service: {
            guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
            label: "CATS-2-SVC-c120d2a4-6bd9-49dc-4",
            provider: null,
            version: null
          }
        }
      },
      {
        guid: "1bf0f2c8-9761-4bf3-928d-a52440805fc6",
        name: "fake-test-alpha",
        bound_app_count: 1,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: "The instance was created",
          updated_at: "2016-06-15T22:52:56Z",
          created_at: "2016-06-15T22:52:56Z"
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
        guid: "8ea75b19-167d-453d-b55e-b995840a322b",
        name: "fake-marco",
        bound_app_count: 1,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: 0,
          updated_at: "2016-05-13T21:33:48Z",
          created_at: "2016-05-13T21:33:48Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "d129e8e0-6ef8-491a-bee5-e343da3cc67a",
          name: "basic",
          service: {
            guid: "2c0933b1-812d-45ef-97af-6b67b59af337",
            label: "s3",
            provider: null,
            version: null
          }
        }
      },
      {
        guid: "b4679fb4-67a2-4e0d-affc-460064ce674d",
        name: "fake-3333",
        bound_app_count: 0,
        last_operation: {
          type: "create",
          state: "succeeded",
          description: 0,
          updated_at: "2017-01-09T23:45:50Z",
          created_at: "2017-01-09T23:45:50Z"
        },
        dashboard_url: null,
        service_plan: {
          guid: "abc10d1c-476a-4d23-84af-9498b7bc01ed",
          name: "CATS-2-SVC-PLAN-74d34e9a-9c0a-431a-5",
          service: {
            guid: "101b4967-acd2-4ffc-aa4a-6bc980ed954c",
            label: "CATS-2-SVC-c120d2a4-6bd9-49dc-4",
            provider: null,
            version: null
          }
        }
      }
    ]
  },
  {
    guid: "7fc786fe-3ae2-40f2-993f-2a632cb82063",
    name: "fake-dashboard-prod",
    apps: [
      {
        guid: "d2881206-7f65-4b8d-a027-ae9519c7646a",
        urls: ["dashboard.cloud.gov"],
        routes: [
          {
            guid: "a43dbd2b-42ae-4f8f-89a8-da37bcb39dad",
            host: 0,
            port: null,
            path: 0,
            domain: {
              guid: "9fe0ca62-53c5-451d-94f3-9bd389003b99",
              name: "fake-dashboard.cloud.gov"
            }
          }
        ],
        service_count: 1,
        service_names: ["fake-dashboard-ups"],
        running_instances: 1,
        name: "fake-cg-dashboard",
        production: false,
        space_guid: "7fc786fe-3ae2-40f2-993f-2a632cb82063",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: "go_buildpack",
        detected_buildpack: null,
        detected_buildpack_guid: "a59c4cec-55ee-43ed-b374-2bc093491617",
        environment_json: {
          BUILD_INFO: "build::::2017-01-09-19-54-39::894::1.13.0",
          CONSOLE_API_URL: "https://api.cloud.gov/",
          CONSOLE_HOSTNAME: "https://dashboard.cloud.gov",
          CONSOLE_LOGIN_URL: "https://login.cloud.gov/",
          CONSOLE_LOG_URL: "https://loggregator.cloud.gov/",
          CONSOLE_UAA_URL: "https://uaa.cloud.gov/",
          GO15VENDOREXPERIMENT: 1,
          GOPACKAGENAME: "github.com/18F/cg-dashboard"
        },
        memory: 256,
        instances: 1,
        disk_quota: 1024,
        state: "STARTED",
        version: "356928ba-b4fc-493a-9b9b-68c348aa7982",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "874d0072-d4c8-45eb-87dd-d30070b3f899",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2017-01-09T19:54:57Z",
        detected_start_command: "cg-dashboard -port=$PORT",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      },
      {
        guid: "a249aed7-9da1-4c39-bcf7-dfe115da6335",
        urls: ["console.cloud.gov"],
        routes: [
          {
            guid: "080acc69-b213-45de-b2b3-666dfa5767b9",
            host: 0,
            port: null,
            path: 0,
            domain: {
              guid: "067dc9ef-8d95-49cb-a607-aada3543138e",
              name: "console.cloud.gov"
            }
          }
        ],
        service_count: 0,
        service_names: [],
        running_instances: 1,
        name: "fake-cg-deck",
        production: false,
        space_guid: "7fc786fe-3ae2-40f2-993f-2a632cb82063",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: "https://github.com/ddollar/heroku-buildpack-multi.git",
        detected_buildpack: null,
        detected_buildpack_guid: null,
        environment_json: {
          BUILD_INFO: "build-deprecated-2016-07-07-20-22-29-861",
          CONSOLE_API_URL: "https://api.cloud.gov/",
          CONSOLE_CLIENT_SECRET: "[secret]",
          CONSOLE_HOSTNAME: "https://console.cloud.gov",
          CONSOLE_LOGIN_URL: "https://login.cloud.gov/",
          CONSOLE_LOG_URL: "https://loggregator.cloud.gov/",
          CONSOLE_UAA_URL: "https://uaa.cloud.gov/"
        },
        memory: 256,
        instances: 1,
        disk_quota: 1024,
        state: "STARTED",
        version: "345ba5ad-24c6-4579-97f8-c06be2e36eb3",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "a249aed7-9da1-4c39-bcf7-dfe115da6335",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2016-10-13T15:14:34Z",
        detected_start_command: "cg-deck -port=$PORT",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      }
    ],
    services: [
      {
        guid: "7d637f49-3979-448e-bc24-b3f3caf10711",
        name: "dashboard-ups",
        bound_app_count: 1
      }
    ]
  },
  {
    guid: "5ca76e71-23b9-47a5-90e3-79b44cf75deb",
    name: "fake-dashboard-stage",
    apps: [
      {
        guid: "6e7edf4d-1801-4948-9436-b3adcf89ce95",
        urls: ["dashboard-staging.apps.cloud.gov"],
        routes: [
          {
            guid: "2bce599f-114d-4fe6-b055-1f0f37a9a90c",
            host: "dashboard-staging",
            port: null,
            path: 0,
            domain: {
              guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
              name: "apps.cloud.gov"
            }
          }
        ],
        service_count: 1,
        service_names: ["dashboard-ups"],
        running_instances: 1,
        name: "fake-cg-dashboard-staging",
        production: false,
        space_guid: "5ca76e71-23b9-47a5-90e3-79b44cf75deb",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: "go_buildpack",
        detected_buildpack: null,
        detected_buildpack_guid: "a59c4cec-55ee-43ed-b374-2bc093491617",
        environment_json: {
          BUILD_INFO: "build::master::2017-01-10-02-35-02::898::1.13.0",
          CONSOLE_API_URL: "https://api.cloud.gov/",
          CONSOLE_HOSTNAME: "https://dashboard-staging.apps.cloud.gov",
          CONSOLE_LOGIN_URL: "https://login.cloud.gov/",
          CONSOLE_LOG_URL: "https://loggregator.cloud.gov/",
          CONSOLE_UAA_URL: "https://uaa.cloud.gov/",
          GO15VENDOREXPERIMENT: 1,
          GOPACKAGENAME: "github.com/18F/cg-dashboard"
        },
        memory: 256,
        instances: 1,
        disk_quota: 1024,
        state: "STARTED",
        version: "73746d8e-8175-4f83-96fd-587911fd4eb4",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "38d53975-fb95-4aff-aca4-af839cfdfcdc",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2017-01-10T02:35:22Z",
        detected_start_command: "cg-dashboard -port=$PORT",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      },
      {
        guid: "2300adbc-e83e-4e04-81a5-f8e25295f540",
        urls: ["dashboard-demo.apps.cloud.gov"],
        routes: [
          {
            guid: "1d49a639-d82b-4a7d-8493-7c4697c4bd47",
            host: "dashboard-demo",
            port: null,
            path: 0,
            domain: {
              guid: "97435c2f-d5bb-4c10-8393-55d7d7169932",
              name: "apps.cloud.gov"
            }
          }
        ],
        service_count: 1,
        service_names: ["dashboard-ups"],
        running_instances: 1,
        name: "fake-cg-dashboard-demo",
        production: false,
        space_guid: "5ca76e71-23b9-47a5-90e3-79b44cf75deb",
        stack_guid: "77590563-6c7c-4ec4-9b4a-01ce9d628190",
        buildpack: "go_buildpack",
        detected_buildpack: null,
        detected_buildpack_guid: "a59c4cec-55ee-43ed-b374-2bc093491617",
        environment_json: {
          BUILD_INFO: "build::demo::2017-01-07-01-01-47::866::1.12.0",
          CONSOLE_API_URL: "https://api.cloud.gov/",
          CONSOLE_HOSTNAME: "https://dashboard-demo.apps.cloud.gov",
          CONSOLE_LOGIN_URL: "https://login.cloud.gov/",
          CONSOLE_LOG_URL: "https://loggregator.cloud.gov/",
          CONSOLE_UAA_URL: "https://uaa.cloud.gov/",
          GO15VENDOREXPERIMENT: 1,
          GOPACKAGENAME: "github.com/18F/cg-dashboard"
        },
        memory: 256,
        instances: 1,
        disk_quota: 1024,
        state: "STARTED",
        version: "57e05319-0485-44ff-a4ed-f3dd71ef13b8",
        command: null,
        console: false,
        debug: null,
        staging_task_id: "75740080-dbae-4de4-bae6-cfba383c85d2",
        package_state: "STAGED",
        health_check_type: "port",
        health_check_timeout: null,
        health_check_http_endpoint: null,
        staging_failed_reason: null,
        staging_failed_description: null,
        diego: false,
        docker_image: null,
        package_updated_at: "2017-01-07T01:02:07Z",
        detected_start_command: "cg-dashboard -port=$PORT",
        enable_ssh: true,
        docker_credentials_json: {
          redacted_message: "[PRIVATE DATA HIDDEN]"
        },
        ports: null
      }
    ],
    services: [
      {
        guid: "08f2a9e8-d527-43b5-b223-e383c28d1c51",
        name: "dashboard-ups",
        bound_app_count: 2
      }
    ]
  }
];

module.exports = spaceSummaries;
