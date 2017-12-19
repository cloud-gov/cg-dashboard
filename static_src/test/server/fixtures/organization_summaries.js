const organizationSummaries = [
  {
    guid: "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
    name: "fake-cf-deck-testing",
    status: "active",
    spaces: [
      {
        guid: "48e18795-de67-467b-aebb-150cb097a168",
        name: "fake-prod",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "82af0edb-8540-4064-82f2-d74df612b794",
        name: "fake-dev",
        service_count: 2,
        app_count: 3,
        mem_dev_total: 292,
        mem_prod_total: 0
      },
      {
        guid: "7ed61149-acf6-48ff-a925-26ad2c3f342d",
        name: "fake-staging",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "191d3cde-dea6-4ba2-82ca-4528b735cd83",
        name: "fake-temp_test_space",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
        name: "fake-testSpace01",
        service_count: 8,
        app_count: 1,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  },
  {
    guid: "user_role-org_x-ffe7-4aa8-8e85-94768d6bd250",
    name: "fake-cf-user_role-org_x-testing",
    status: "active",
    spaces: [
      {
        guid: "user_role-space_xx-de67-467b-aebb-150cb097a168",
        name: "org_x-space_xx",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "user_role-space_yy-de67-467b-aebb-150cb097a168",
        name: "org_x-space_yy",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  },
  {
    guid: "user_role-org_y-ffe7-4aa8-8e85-94768d6bd250",
    name: "fake-cf-user_role-org_y-testing",
    status: "active",
    spaces: [
      {
        guid: "user_role-space_xx-de67-467b-aebb-150cb097a168",
        name: "org_y-space_xx",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "user_role-space_yy-de67-467b-aebb-150cb097a168",
        name: "org_y-space_yy",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  },
  {
    guid: "cfeb9be5-a61a-4f68-894e-8808ab008aaa",
    name: "fake-cf",
    status: "active",
    spaces: [
      {
        guid: "7fc786fe-3ae2-40f2-993f-2a632cb82063",
        name: "fake-dashboard-prod",
        service_count: 1,
        app_count: 2,
        mem_dev_total: 512,
        mem_prod_total: 0
      },
      {
        guid: "5ca76e71-23b9-47a5-90e3-79b44cf75deb",
        name: "fake-dashboard-stage",
        service_count: 1,
        app_count: 2,
        mem_dev_total: 512,
        mem_prod_total: 0
      }
    ]
  },
  {
    guid: "4a962676-e687-46c4-95f4-7a83712065c6",
    name: "fake-sandbox",
    status: "active",
    spaces: [
      {
        guid: "a791b3c3-88c0-4954-9dd5-5f798a914db7",
        name: "fake-ms",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  }
];

module.exports = organizationSummaries;
