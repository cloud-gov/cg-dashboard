
# Releasing the dashboard

## Steps

1. [Update version number](#updating-version-number)
1. [Manual testing](#manual-testing) of the master branch
1. [Tagging](#tagging) the release to deploy

### Updating version number

Numbers are chosen based on whether the code changes will cause a breaking API
change or not. Version numbers do not follow traditional semver, as this
codebase isn't a library that's consumed but a user interface. Instead, breaking
api changes should be a major change while all other changes can be a minor
change. Single bug fixes can be reserved for patch changes.

Once a version number is decided, it must be updated in `package.json` under
the `version` key. This is currently the only place it has to be updated. To
change the version:

1. Change the `version` key in `package.json` to the new version number.
1. Checkout a new branch with the format `release-{num}` where {num} is the new version number.
1. Commit the change with a message about updating for a new release.
1. Push this change up to the remote and create a pull request.
1. Once ready, merge the pull request (this will not trigger a release yet).

### Manual testing

Currently, the site does not have visual regression testing so must be manually
tested for breaking visual changes. Here is a simple script to assist in manual
testing. Generally, it's best to look through all the pages and check if
anything looks off. Testing should generally be done on the staging environment,
[dashboard.fr-stage.cloud.gov](https://dashboard.fr-stage.cloud.gov/),
when all the necessary code is on the master branch and has been deployed. To
check that the master branch has been deployed, check [Circle
CI](https://circleci.com/gh/18F/cg-dashboard).

#### Script

Actions in the script should be done under the `cf-deck-testing` organization
and the `testSpace01` space.

1. Go to `/` and ensure everything looks OK.
1. Click on an organization on the right hand side nav.
  - Ensure that the correct organization get's highlighted in the sidenav.
  - Ensure the menu correctly opens.
1. Click on `Marketplace` in the sidenav and ensure the page appears and looks OK.
1. Click `Create service instance` on any of the rds service plans.
  - Ensure you are easily able to see the `Create service instance` form.
  - Ensure the `Create service instance` form looks OK.
1. Choose a memorable name for the service instance and type it into the first textbox.
1. Add the service instance under a the `testSpace01` space by selecting it from the dropdown.
1. Click the `Cancel` button and ensure the form correctly disappears.
1. Repeat the last few steps to open the `Create service instance` form again filled out.
1. Click the `Create service instance` button and ensure the form disappears.
1. Click on the `spaces` link and ensure the all spaces page appears and looks OK.
1. Click on a space on the sidnav in the list of spaces.
  - Ensure the space get's correctly highlighted in the sidenav.
  - Ensure the specific space page appears and looks OK.
1. Click on the `Service instances` link in the subnav.
  - Ensure the page appears and looks OK.
  - Ensure that your test service instance you created is in the list of instances.
1. Click the `Delete instance` button for the instance you created.
  - Ensure a delete confirmation form appears.
1. Click the `Cancel` button on the delete confirmation form and ensure the form disappears.
1. Click the `Delete instance` button for the instance you created again.
1. Click 'Confirm delete' and ensure the form and the instance disappear after a few seconds.
1. Click on `User management` in the subnav and ensure the page appears and looks OK.
1. Attempt to click on the role checkboxes for a user. (If it's grayed out, you do not have permission to edit it, which is OK)
  - Ensure the checkbox becomes unchecked after a second of clicking on it.
1. Click on the same checkbox again to keep the permission the same
  - Ensure the checkbox becomes unchecked after a second of clicking on it.
1. Click on the 'All organization users` link in the subnav.
1 Repeat steps to check a user permission.
1. Techinically, we should test removing a user from an org here, but will not because theres no easy way to add them back.
1. Click on the `Apps` link in the subnav
1. Click on `testapp01` or any app available and ensure the page appears and looks OK.
  - Ensure app state, memory and disk usage are correct.
  - Ensure there are the correct bound and unbound service instances.
1. Click on the "Add route" button.
  - Click cancel and ensure the form disappears.
  - Type a route with a host, domain, path.
  - Click "Add route" button and ensure the route is created.
1. Click "Edit route" for the route you created.
  - Rename the Host of the app and click "Apply" button.
  - Ensure the app gets updated.
  - Click edit again.
  - Click "Delete route".
  - Ensure the route is deleted.
1. Click on the `Overview` link in the sidenav and ensure the homepage appears.

## Tagging

Once the site looks OK and ready to deploy, tagging a commit in git will trigger
the deploy process to production, dashboard.cloud.gov.

On the master branch:

1. Ensure you have the most up to date code by pulling or rebasing.
1. Tag the commit by running `git tag -a {num}` where {num} is the new version number
1. Push the tag up to the remote by running `git push origin --tags`

This should start the release process which can be monitored in travis CI.
