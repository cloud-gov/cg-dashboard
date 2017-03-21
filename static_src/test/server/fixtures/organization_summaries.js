
const env = require('../envvars.js');

const organizationSummaries = [
  {
    guid: "48b3f8a1-ffe7-4aa8-8e85-94768d6bd250",
    name: env.orgName,
    status: "active",
    spaces: [
      {
        guid: "48e18795-de67-467b-aebb-150cb097a168",
        name: "prod",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      },
      {
        guid: "82af0edb-8540-4064-82f2-d74df612b794",
        name: "dev",
        service_count: 2,
        app_count: 3,
        mem_dev_total: 292,
        mem_prod_total: 0
      },
      {
        guid: "7ed61149-acf6-48ff-a925-26ad2c3f342d",
        name: "staging",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  },
  {
    guid: "4a962676-e687-46c4-95f4-7a83712065c6",
    name: "sandbox",
    status: "active",
    spaces: [
      {
        guid: "a791b3c3-88c0-4954-9dd5-5f798a914db7",
        name: "person",
        service_count: 0,
        app_count: 0,
        mem_dev_total: 0,
        mem_prod_total: 0
      }
    ]
  }
];

if(env.testing) {
  organizationSummaries.push({
    guid: "cfeb9be5-a61a-4f68-894e-8808ab008aaa",
    name: "fake-cf",
    status: "active",
    spaces: [
      {
        guid: "b7e56bba-b01b-4c14-883f-2e6d15284b58",
        name: "fake-testSpace01",
        service_count: 1,
        app_count: 1,
        mem_dev_total: 512,
        mem_prod_total: 0
      }
    ]
  });
}

module.exports = organizationSummaries;
