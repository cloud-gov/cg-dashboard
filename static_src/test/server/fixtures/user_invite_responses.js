
const userInviteResponses =
{
  "default": {
    "failed_invites": [],
    "new_invites": [
      {
        "email": "newuser@domain.com",
        "errorCode": null,
        "errorMessage": null,
        "inviteLink": "https://uaa.fr.cloud.gov/invitations/accept?code=2c25Gs41",
        "origin": "uaa",
        "success": true,
        "userId": "4541c882-fake-invited-new-user"
      }
    ]
  },
  "fakenewuser@domain.com": {
    "failed_invites": [],
    "new_invites": [
      {
        "email": "fakenewuser@domain.com",
        "errorCode": null,
        "errorMessage": null,
        "inviteLink": "https://uaa.fr.cloud.gov/invitations/accept?code=Gs2c2541",
        "origin": "uaa",
        "success": true,
        "userId": "4541c882-fake-invited-fakenewuser"
      }
    ]
  }
}

module.exports = userInviteResponses;
