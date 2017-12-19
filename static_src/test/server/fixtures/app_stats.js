const appStats = [
  {
    guid: "2f684200-b9da-4ea6-a3c8-01a1df5ef2d3", // Fake

    "0": {
      state: "RUNNING",
      stats: {
        name: "fake-adfake-node",
        uris: ["fake-adfake-node.apps.cloud.gov"],
        host: "10.10.2.101",
        port: 62853,
        uptime: 673981,
        mem_quota: 85983232,
        disk_quota: 2147483648,
        fds_quota: 16384,
        usage: {
          time: "2017-01-12 23:56:54 +0000",
          cpu: 0,
          mem: 19812352,
          disk: 54493184
        }
      }
    },
    "1": {
      state: "RUNNING",
      stats: {
        name: "fake-adfake-node",
        uris: ["fake-adfake-node.apps.cloud.gov"],
        host: "10.10.1.116",
        port: 62946,
        uptime: 541975,
        mem_quota: 85983232,
        disk_quota: 2147483648,
        fds_quota: 16384,
        usage: {
          time: "2017-01-12 23:56:54 +0000",
          cpu: 0,
          mem: 9162752,
          disk: 54489088
        }
      }
    }
  }
];

module.exports = appStats;
