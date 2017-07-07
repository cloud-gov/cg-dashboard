#!/bin/bash

if cf dev status | grep 'Running' > /dev/null; then
    echo "PCFDev already started"
else
    echo "Starting PCFDev"
    echo "This can take around 10-30 mins."
    cf dev start -s none
fi

# log into local pcf dev and create dashboard client.
docker run governmentpaas/cf-uaac \
  /bin/sh -c '
  uaac target https://uaa.local.pcfdev.io --skip-ssl-validation && \
  uaac token client get admin -s "admin-client-secret" && \
  uaac client delete dashboard-local; \
  uaac client add dashboard-local \
    --scope="cloud_controller.admin cloud_controller.read cloud_controller.write openid scim.read scim.invite" \
    --redirect_uri="http://localhost:8002/oauth2callback" \
    --authorities="uaa.none scim.invite cloud_controller.admin scim.read" \
    --authorized_grant_types "authorization_code client_credentials refresh_token" -s "notarealsecret"'
