module.exports = function authstatus(smocks) {
  smocks.route({
    id: 'authstatus',
    label: 'Auth status', // label is optional
    path: '/v2/authstatus',

    handler: function (req, reply) {
      reply({
        "status": "authorized"
      })
    }
  })
};
