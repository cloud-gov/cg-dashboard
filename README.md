# 18F Cloud Foundry Console

## Tech Stack
- `Go` for the backend server.
- `AngularJS` for the frontend.

## Setup
### Create a Client with UAAC
- Make sure [UAAC](https://github.com/cloudfoundry/cf-uaac) is installed.
- Target your UAA server. `uaac target <uaa.your-domain.com>`
- Login with your current UAA account. `uaac token client get <your admin account> -s <your uaa admin password>`
- Create client account:
```
uaac client add <your-client-id> \
 --authorities cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
 --authorized_grant_types authorization_code,client_credentials,refresh_token \
 --scope cloud_controller.admin,cloud_controller.read,cloud_controller.write,openid,scim.read \
-s <your-client-secret>
```
- Unable to create an account still? Troubleshoot [here](https://docs.cloudfoundry.org/adminguide/uaa-user-management.html#creating-admin-users)

### Set the environment variables
If you are testing locally, export these variables. If you are deploying to cloud foundry, modify the manifest.yml
- CONSOLE_CLIENT_ID: Registered client id with UAA.
- CONSOLE_CLIENT_SECRET: The client secret.
- CONSOLE_API: The URL of the API service.
- CONSOLE_HOSTNAME: The URL of the service itself.
- CONSOLE_AUTH_URL: The URL of the auth service.
- CONSOLE_TOKEN_URL: The URL of the token service.

## Running locally
- Modify the ClientID and ClientSecret in main() to reflect your client id and secret. TODO: Use environment variables.
- Modify the AuthURL and TokenURL in main() to reflect the URLs to login and get tokens. TODO: Use environment variables.
- `go run server.go`
- Navigate browser to `http://localhost:9999`

## Deploying
- `cf push <optional-app-name>`
