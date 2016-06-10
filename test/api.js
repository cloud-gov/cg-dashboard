var data = require('./fixtures');

var organizations = data.organizations;
var spaces = data.spaces;

var BASE_URL = '/v2';

module.exports = function api(smocks) {
  smocks.route({
    id: 'organizations',
    label: 'Organizations', // label is optional
    path: `${BASE_URL}/organizations`,
    handler: function (req, reply) {
      reply({
        "total_results": organizations.length,
        "total_pages": 1,
        "prev_url": null,
        "next_url": null,
        "resources": organizations
      })
    }
  });

  smocks.route({
    id: 'organization-summary',
    label: 'Organization summary',
    path: `${BASE_URL}/organizations/{guid}/summary`,
    handler: function (req, reply) {
      var guid = req.params.guid;
      reply({
        guid: guid,
        name: 'org-name',
        status: 'active',
        spaces: spaces
      });
    }
  })
};
