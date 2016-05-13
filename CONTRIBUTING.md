## Welcome!

We're so glad you're thinking about contributing to an 18F open source project! If you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contribution, and don't want a wall of rules to get in the way of that.

Before contributing, we encourage you to read our CONTRIBUTING policy (you are here), our LICENSE, and our README, all of which should be in this repository. If you have any questions, or want to read more about our underlying policies, you can consult the 18F Open Source Policy GitHub repository at https://github.com/18f/open-source-policy, or just shoot us an email/official government letterhead note to [18f@gsa.gov](mailto:18f@gsa.gov).

## High-level roadmap
The cloud.gov deck is currently being refactored to port the codebase from angular to unit-tested react. In doing so, it will take UI/UX cues from the  [community web ui](https://github.com/icclab/cf-webui), and merge that design with the visual [cloudgov-style](https://github.com/18F/cg-style) to create a unified cloud.gov experience. This refactor work is accumulated into the `staging-alpha` branch which will eventually be merged with `master` when it's feature complete and bug free. This means all work should be merged into the `staging-alpha` branch, unless working with the deprecated angular codebase.

The work on cloud.gov front end fits into a higher level roadmap for all of cloud.gov. For now, this is in [another tool](https://18f.aha.io/products/CGP/bookmarks/project_timelines/new) only accessible by 18F personnel. Soon we will publish the information.

## Workflow
Tracking work and progress is currently being done through [Zenhub](https://www.zenhub.io/), which adds a browser extension to add additional agile features to github. The main feature Zenhub adds is a "Boards" page which is an agile board detailing the state of work for the deck.

### Board workflow
- Stories or ideas for features can start in backlog or icebox.

#### Criteria for moving through colums
The main criteria for moving a card through the columsn can be found on the main cloud.gov product repo: [cloud.gov Delivery Process](https://github.com/18F/cg-product/blob/master/DeliveryProcess.md). Some aspects that differ or extend for that process as related to cloud.gov front end:
- For a story to be past "in progress" and in "awaiting acceptance" it should:
  - have all new files and newly touched files linted (new files can skip linting if under tight deadline)
  - have all previous unit tests and acceptance tests running without error.
  - covered in units tests.
  - is deployed on a staging site or live site so other team members can see/use it.
  - ensure to not use the github "fixes" or "closes" feature as it will close an issue too early.
- For a story to be past "awaiting acceptance" to "done" it should:
  - stakeholders see and approve the work as meeting acceptance criteria
  - if the work has a visual aspect, post a screenshot attached for later documentation/announcement/demo purposes
- A product owner or team member will check a story waiting acceptance and put it into "done" if it meets the criteria.

For more information, see the high-level [cloud.gov respository](https://github.com/18F/cg-product) and [delivery process](https://github.com/18F/cg-product/blob/master/DeliveryProcess.md).


## Code standards
### Workflow
- Open branches off main repo due to secure travis CI env vars.
- Add the "ready for review" label when the code is ready to be reviewed by another team member.
  - Work-in-progress PRs are allowed. Be sure to tag the review with "ready for review" when it's ready though.
- As another team member, review the code and ensure it conforms to the coding standards and exit criteria
  - PR's do not need to be assigned due to small team size
- When it is reviewed and ready to be merged, add the "ready for merge" label, and take off "ready for review" label.
- Any team member (code author or otherwise) can merge the code once it has the "ready for merge" label.
  - Updates on PRs in the repo will be posted in the #cloud-gov-frontend Slack channel
- It's fine to merge code that isn't "feature complete." The staging branch is not currently in use, so is fine to have some work on it that still needs work.
- We're currently not focusing on acceptance tests right now due to the tests not being easily repeatable and having a clean data state. If a change breaks an acceptance test, spend 10 minutes trying to fix it before disabling the test. Do not write new acceptance tests.

#### Other git standards
- Squashing commits is allowed but discouraged, except in rare instances.
- The team prefers rebasing over merging, though we use Github to close out pull requests. This means that PRs will be merged, but if you're refreshing a local branch make sure to use rebase. For example, if you want to update your `staging-alpha` branch to reflect the most recent changes on Github use `git pull --rebase origin staging-alpha`.

### Branches
- Open branches off main repo due to travis CI env var problem. For now, remember to branch off of the `staging-alpha` branch.
- Name your branch with your initials first.
- Include a short description of the feature that's being developed after your initial.

### Commit message
In general, commit messages can be written in whatever way the author decides, but here are some guidelines:
- Focus on the "why" rather then the "what"
- Have the first line be the "what"
- Discuss the "why" in more detail on subsequent lines.

### Coding style
- [Airbnb styleguide for JS](https://github.com/airbnb/javascript)
  - Re-add deprecation warnings on linter when upgrade react.
- [18F styleguide for CSS](https://pages.18f.gov/frontend/css-coding-styleguide/)
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
- Front end dependencies (as in `package.json`) should be pinned to a specific version
- Front end dependencies should be shrink-wrapped with `npm`.
- Every two weeks, front end dependencies will be upgraded.

#### Steps for dependency upgrades
- React and Babel are moving very quick, so they're the largest concern
- Remove `npm-shrinkwrap.json`
- Use `npm update --save --saveDev` to update any devDependencies
- Make sure it works (run linting, tests, and acceptance tests)
- Add back the shrinkwrap with `npm shrinkwrap --dev` and check it in

### Code review
- When doing code reviews, the reviewer should pull down the code and test on their local computer. This is because the staging site is not often used, meaning bugs could be present for long amounts of time.
  - If a code change is very simple, or is not a code change (but maybe a document change) it doesn't need to be pulled down.
- We can give other members of 18F the public URL to the staging site.

### Device support
- Browser support is all major browsers and Internet Explorer 10 and up.
- Pages and views should work on different device screen-sizes, and should work as specified in design mockups.
  - If making a feature work on mobile is time-consuming, and there isnt' an official design for the mobile view of the feature yet, the mobile view can be held off until a design becomes available.
- Support for browsers not running javascript should be attempted if it's easy, but not a major focus
  - Eventually the react code base will allow server-sided, isomorphic rendering for both performance and support reasons. This means code should attempt to ensure things work without it when it's not detrimental to project timeline to do so.
- CSS in component files should opt to use CSS Modules first, and will use normal CSS class architecture after.
- Any shared styles across cloud.gov should be put in the `cg-style` project, not `cg-deck` or others.

## Performance
Adding performance tracking and metrics is currently a TODO. Here are some items in consideration:
- What metrics should be tracked? ie: page load, speed index, custom events, number of requests, total request size, etc.
- When should performance be measured? ie: on live staging site, locally during test runs.
- How should performance be measured? ie: with what tools
- What should performance budgets for decided metrics be? ie: faster then 1000 for speed index, faster then 1s for certain custom event, total request size below 2mb.
- How should performance metrics and budgets be incorporated into workflow? Going over a budget requires re-implementation, or issue.
- Any library added that's total file size is above 25kb should be evaluated for performance affect.

## Public domain

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
