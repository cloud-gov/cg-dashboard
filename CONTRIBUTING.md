## Welcome!

We're so glad you're thinking about contributing to an 18F open source project! If you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contribution, and don't want a wall of rules to get in the way of that.

Before contributing, we encourage you to read our CONTRIBUTING policy (you are here), our LICENSE, and our README, all of which should be in this repository. If you have any questions, or want to read more about our underlying policies, you can consult the 18F Open Source Policy GitHub repository at https://github.com/18f/open-source-policy, or just shoot us an email/official government letterhead note to [18f@gsa.gov](mailto:18f@gsa.gov).

## High-level roadmap

The cloud.gov dashboard is a unit-tested React single-page application. Its previous version was an Angular app and is available at the `deprecated` branch.

The work on the cloud.gov front-end fits into a higher-level roadmap for all of cloud.gov. For now, this is defined quarterly in a PI planning, documented in [favro](https://favro.com/organization/1e11108a2da81e3bd7153a7a/9243243f8278f7c7f138efed).

## Workflow

We track work and progress through [Favro](https://favro.com/organization/1e11108a2da81e3bd7153a7a/e9acfea577acd5bdadf3d6a2) which is an agile board detailing the state of work for the dashboard and other customer facing projects.

### Board workflow

- Stories or ideas for features can start in backlog or icebox.

#### Criteria for moving through columns

The criteria for moving a card through the columns is in the main cloud.gov product repo: [cloud.gov Delivery Process](https://github.com/18F/cg-product/blob/master/DeliveryProcess.md). Some aspects that differ or extend for that process as related to the cloud.gov front end:

##### Awaiting acceptance

  - Have all new files and newly touched files linted (new files can skip linting if under tight deadline)
  - Have all previous unit tests running without error.
  - Non-JSX code covered in units tests.
  - Is deployed on a demo, staging or live site so other team members can see/use it.

##### Done

  - Stakeholders see and approve the work as meeting acceptance criteria.
  - If the work has a visual aspect, post a screenshot attached for later documentation/announcement/demo purposes.

##### Definition of done for a feature

A feature is a higher-level epic that will encompass multiple smaller units of work. An example would be "Route panel" or "Service panel on app page".

- Stakeholders see and approve the work as meeting acceptance criteria.
- Is deployed to production, dashboard.cloud.gov site.
- All appropriate shared global styling is in cg-style rather then cg-dashboard
  or other repos.
- All potential errors are handled correctly.
- If uses new data from cloud foundry api (new methods added to `cf_api.js`) ensure they are mocked in testing server.
- Open an issue or PR in [cg-docs](https://github.com/18F/cg-docs) to document the new feature.
- A product owner or team member will check a story waiting acceptance and put it into "done" if it meets the criteria.
- The feature has been usability tested with at least two current or potential cloud.gov users.

For more information, see the high-level [cloud.gov respository](https://github.com/18F/cg-product) and [delivery process](https://github.com/18F/cg-product/blob/master/DeliveryProcess.md).


## Code standards
### Technology
- Languages
  - ES6 Javascript ([primer](http://webapplog.com/es6/))
  - CSS
- JS unit testing: 
  - [Karma with Chrome](https://karma-runner.github.io/1.0/index.html)
  - [Sinon](http://sinonjs.org/)
  - [Jasmine](http://jasmine.github.io/)
- View layer
  - [React (0.14.x)](https://facebook.github.io/react/docs/getting-started.html)
- Data/model layer
  - [Flux](https://facebook.github.io/flux/docs/overview.html)
  - [Immutable.js](https://facebook.github.io/immutable-js/docs/#/)
- Build
  - [Webpack](http://webpack.github.io/docs/)
  - [UglifyJS](https://github.com/mishoo/UglifyJS)
  - [Babel](https://babeljs.io/docs/setup/)
- Front end router
  - [Director](https://github.com/flatiron/director#api-documentation)

### Workflow
- Add the "ready for review" label when the code is ready to be reviewed by another team member.
  - Work-in-progress PRs are allowed. Be sure to tag the review with "ready for review" when it's ready though.
- As another team member, review the code and ensure it conforms to the coding standards and exit criteria
  - PR's do not need to be assigned due to small team size
- When it is reviewed and ready to be merged, use Github's [Code
  Review](https://help.github.com/articles/approving-a-pull-request-with-required-reviews/)
  feature to approve the pull request.
- Any team member (code author or otherwise) can merge the code once it has an
  approved review.
  - Updates on PRs in the repo will be posted in the #cloud-gov-nav-news Slack channel
- It's fine to merge code that isn't "feature complete." The `demo` branch is
  not currently in use, so it is fine to force push the branch for "in progress
  work", e.g. `git push -f origin HEAD:demo`.
- We're currently not focusing on acceptance tests right now due to the tests not being easily repeatable and having a clean data state. If a change breaks an acceptance test, spend 10 minutes trying to fix it before disabling the test. Do not write new acceptance tests.

#### Other Git standards
- Squashing commits is allowed but discouraged, except in rare instances.
- The team prefers rebasing over merging, though we use GitHub to close out pull requests. This means that PRs will be merged, but if you're refreshing a local branch make sure to use rebase. For example, if you want to update your `new-feature` branch to reflect the most recent changes on GitHub use `git pull --rebase origin new-feature`.

### Branches
- Open branches off main repo due to Circle CI env var problem. For now, remember to branch off of the `master` branch.
- Name your branch with your initials first. For example, `ms-feature`.
- Include a short description of the feature that's being developed after your initial.

### Commit message
In general, commit messages can be written in whatever way the author decides, but here are some guidelines:
- Focus on the "why" rather then the "what".
- Have the first line be the "what".
- Discuss the "why" in more detail on subsequent lines.

### Coding style
- [Airbnb styleguide for JS](https://github.com/airbnb/javascript)
  - Re-add deprecation warnings on linter when upgrade react.
- [18F styleguide for CSS](https://pages.18f.gov/frontend/css-coding-styleguide/), through [stylelint](https://github.com/18F/stylelint-rules).
- Linting will be run before tests run, so will fail the tests if files are not linted.
- Additionally, linting should always
  - fail on CI
  - should not stop watching commands
  - should not fail builds
  - should fail test runs
- Documentation will not be a focus right now.

### Linting
The code base includes linting configurations and tools, but is currently not fully linted. This means that there's an "opt-in" policy to linting: you decide when to add a file to linting.
- Theres a lint ignore file, `.eslintignore` with all non-linted files.
- If you touch another file that isn't linted yet, you should generally fix it and remove it from the lint ignore.
  - Unless under strict time constraints.
- No new files should be added to the lint ignore. Consequently, all new files should be linted.

### Dependency management
- The only language level dependencies should be `nodejs` and `go`.
- Front end dependencies (as in `package.json`) should be pinned to minor versions and below under most circumstances.
- Front end dependencies should be shrink-wrapped with `npm`.
- Every month, front end dependencies will be upgraded to most recent patch or minor version as stipulated in package.json.
- React, Babel, Webpack, ImmutableJS, and other major libraries should upgraded to major versions when there's time to test the changes.

#### How to upgrade dependencies

To upgrade all dependencies to version stipulated in package.json

- Ensure cloudgov-style or other dependencies are unlinked by runnging `npm unlink cloudgov-style`.
- Remove `npm-shrinkwrap.json`.
- Use `npm update --save --saveDev` to update all dependencies.
- Make sure it works (run linting, tests, and acceptance tests).
- Add back the shrinkwrap with `npm shrinkwrap --dev` and commit it.

To update a single package to a specific version

- Ensure cloudgov-style or other dependencies are unlinked by runnging `npm unlink cloudgov-style`.
- Run `npm install --save[Dev] {package name}@{version}` where package name is the name of the package to update and version is the version you want to update to.
- If there are errors related to peer dependencies, continue installing them in the same fashion.
- If there are no errors, both package.json and npm-shrinkwrap.json should have changes that can be commited.

### Code review
- When doing code reviews, the reviewer should pull down the code and test on their local computer. This is because the staging site is not often used, meaning bugs could be present for long amounts of time.
  - If a code change is very simple, or is not a code change (but maybe a document change) it doesn't need to be pulled down.
- We can give other members of 18F the public URL to the staging site.

### Device support
- Browser support is all major browsers and Internet Explorer 10 and up.
- Pages and views should work on different device screen-sizes, and should work as specified in design mockups.
  - If making a feature work on mobile is time-consuming, and there isnt' an official design for the mobile view of the feature yet, the mobile view can be held off until a design becomes available.
- Support for browsers not running javascript should be attempted if it's easy, but not a major focus
  - Eventually the react code base will allow server-side, isomorphic rendering
    for both performance and support reasons. This means code should attempt to
    ensure things work without it when it's not detrimental to project timeline
    to do so.
- CSS in component files should opt to use CSS Modules first, and will use normal CSS class architecture after.

### Working with React/Flux
The dashboard uses the [Flux architecture](https://facebook.github.io/flux/docs/overview.html) and renders HTML with [React](https://facebook.github.io/react/). The Flux implementation is mostly vanilla JS with a Flux dispatcher, as opposed to using a tool such as Redux.

#### Action creators

- Each action creator (each method in `*_actions.js`)  should dispatch only
  a single action.
- Each action creator should return a `Promise`.
- Any XHR calls should happen within the fetch action creators which
  should return a promise of the request.
- Any `fetch` action should call the appropriate `receive`/`success`/`error` action on the resolve of the fetch's promise.
- Each async action should have a fetch, success, and error sub-action (e.g.
  `TOGGLE`, `TOGGLE_SUCCESS`, and `TOGGLE_ERROR`).

#### Stores

- Stores should avoid doing async work, including making any calls to the API.
  Instead, action creators should manage the async data flow and dispatch
  actions to update the store as async event occur.
- Store specs should not use action creators, instead they should dispatch
  actions directly.
  
#### Patterns

<a name="ui-actions"></a>
##### UI actions

When a UI is supposed to do something based on something a user did, such as clicking a a dropdown to display what's within, these actions should go through the dispatcher as an action.

<a name="container-component"></a>
##### Container component

The general pattern for different UIs on the app is to fetch data for Cloud Foundry entities, and then render React components with the data. To organize around this, container components should get and keep the state of the data and pass down this data through various UI based components through props. This means UIs will have one container (which is usually but not always linked to a page, like `org`, `space`, etc) and all other components will just have props and will have all data passed down through them.

There's no perfect guidance on what should be a container component vs a props component, besides that almost all base pages are a container component. A good way to determine is to see what data various UIs require and then separate containers and prop containers based on this.
  
#### Anti-patterns

##### Components should 

Most components will use either props or state to control updates. There are some components that currently break this anti-pattern, often having initial data passed in. This can be done with the `handleUIAction` dispatcher, which sets the distinction that the action is just a UI based action rather then from the server or app.

Instead, use the [state container component](#container-component).

##### Setting state in component rather then through actions

Besides pure UI components, no components should set state within themselves without the use of an action. This is due to keeping both UI actions the users take, and server actions when data comes in from the server to move through the app in the same way, through the dispatcher. 

Instead, use [ui actions](#ui-actions).

##### Doing async work in the stores

This pattern is slowly being phased out of multiple stores, so will be seen many places. For new stores, all async work should be done in the action creator functions. For example, for a fetch action, the fetch action should be dispatched and then the API call should be made.

When async code is in stores, it should be migrated to action creators.

## Analytics

Both client-side routed page views and all client-side events are logged in google analytics.

- Different client-side urls, such as `/org/{org guid}/spaces/` are logged as page views. This is done through the [router](https://github.com/18F/cg-dashboard/blob/828fe79a8a303734719afcdce3e4bdabfe39b824/static_src/main.js#L23).
- Any action called is logged as a Google Analytics event. This is done from the [App Dispatcher](https://github.com/18F/cg-dashboard/blob/master/static_src/dispatcher.js).
- There's a utility file for all analytics related functionality, [util/analytics.js](https://github.com/18F/cg-dashboard/blob/828fe79a8a303734719afcdce3e4bdabfe39b824/static_src/util/analytics.js)

### Google analytics dashboard

There's no distinction from the dashboard and any of the other cloud.gov site's in the GA dashboard. To help with this, there's a shared GA segment representing just the dashboard production traffic. If you have access to the cloud.gov GA, it's available with a [shared link](https://analytics.google.com/analytics/web/template?uid=n5PjjEaRSlSzON6I3mrhrA). There's also a dashboard GA dashboard, which doesn't have a shareable link but should be in the "Customization" -> "Dashboard" section.

## Performance

Performance, as in speed of the site as perceived to users, has been briefly researched and tracked. The main web performance metrics tracked are [Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index), [input latency](https://developers.google.com/web/tools/lighthouse/audits/estimated-input-latency), [time to interactive](https://developers.google.com/web/tools/lighthouse/audits/time-to-interactive), total page weight, and number of DOM nodes. These metrics were tracked for five comparison sites for cloud.gov and documented in a [google sheet, GSA only](https://docs.google.com/spreadsheets/d/1SuGQv5o75n6bkZaQNzL-cjkR2WTDvGuQJlFtPuUGNfM/edit#gid=0). These comparison stats were used to determine performance goals (ideal numbers to reach over time) and budgets (limits placed on the team to stop performance from degrading). Performance is tracked as part of the CI build process, and the build fails if performance goes over the budgets. Any library added that's total file size is above 25kb should be evaluated for performance affect.

## Onboarding checklist
Complete the [onboarding tasks](https://github.com/18F/cg-product/blob/master/OnboardingChecklist.md) for the whole cloud.gov team and for the Customer theme.

## Public domain

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
