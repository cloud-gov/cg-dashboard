const userInviteResponses = {
  default: {
    status: "success",
    userGuid: "4541c882-fake-invited-new-user"
  },
  "fake-new-user@domain.com": {
    status: "success",
    userGuid: "4541c882-fake-invited-fake-new-user"
  }
};

module.exports = userInviteResponses;
