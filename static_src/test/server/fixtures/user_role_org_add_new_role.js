
const userRoleOrgAddNewRole = function(orgGuid){
  return {
    "metadata": {
      "guid": "" + orgGuid + "",
      "url": "/v2/organizations/" + orgGuid + "",
      "created_at": "2016-06-09T17:52:26Z",
      "updated_at": "2016-06-09T17:52:26Z"
    },
    "entity": {
      "name": "cf",
      "billing_enabled": false,
      "quota_definition_guid": "01817050-964e-4632-a9bd-fbcda5f8d14c",
      "status": "active",
      "default_isolation_segment_guid": null,
      "quota_definition_url": "/v2/quota_definitions/01817050-964e-4632-a9bd-fbcda5f8d14c",
      "spaces_url": "/v2/organizations/" + orgGuid + "/spaces",
      "domains_url": "/v2/organizations/" + orgGuid + "/domains",
      "private_domains_url": "/v2/organizations/" + orgGuid + "/private_domains",
      "users_url": "/v2/organizations/" + orgGuid + "/users",
      "managers_url": "/v2/organizations/" + orgGuid + "/managers",
      "billing_managers_url": "/v2/organizations/" + orgGuid + "/billing_managers",
      "auditors_url": "/v2/organizations/" + orgGuid + "/auditors",
      "app_events_url": "/v2/organizations/" + orgGuid + "/app_events",
      "space_quota_definitions_url": "/v2/organizations/" + orgGuid + "/space_quota_definitions"
    }
  }
};

module.exports = userRoleOrgAddNewRole;
