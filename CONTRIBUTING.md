## Welcome!

We're so glad you're thinking about contributing to an 18F open source project! If you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contribution, and don't want a wall of rules to get in the way of that.

Before contributing, we encourage you to read our CONTRIBUTING policy (you are here), our LICENSE, and our README, all of which should be in this repository. If you have any questions, or want to read more about our underlying policies, you can consult the 18F Open Source Policy GitHub repository at https://github.com/18f/open-source-policy, or just shoot us an email/official government letterhead note to [18f@gsa.gov](mailto:18f@gsa.gov).

## Information

### High-level roadmap
The cloud.gov deck is currently being refactored to port the codebase from angular to unit-tested react. In doing so, it will take UI/UX cues from the  [community web ui](https://github.com/icclab/cf-webui), and merge that design with the visual [cloudgov-style](https://github.com/18F/cg-) to create a unified cloud.gov experience. This refactor work is accumulated into the `staging-alpha` branch which will eventually be merged with `master` when it's feature complete and bug free. This means all work should be merged into the `staging-alpha` branch, unless working with the deprecated angular codebase.

### Workflow
Tracking work and progress is currently being done through [Zenhub](https://www.zenhub.io/), which adds a browser extension to add additional agile features to github. The main feature Zenhub adds is a "Boards" page which is an agile bboard detailing the state of work for the deck.

- How epics relate to to stories and how they're tracked with aha.io.
- How stories should progress through the board.
- What should a "groomed" story have.
- What to do with PRs.
- No need to estimate.
- Put things in icebox first.
- How things get prioritized into the backlog.

### Code reviewing
- Have ready to merge label which anybody can merge. (helps async work)
- Always have another person review.
- Linting should happen before review.
- https://pages.18f.gov/development-guide/code-review/
- Always merge into `staging-alpha`. Should `staging-alpha` always be deployable?
- Go back and forth on PRs as only two people.
- One person at least reviews each PR.
- What is a good commit message?
- What to look for in code review?
- Should code be pulled down and tested for each review?
- Any time you change a file, you should turn on linting for that file and fix the errors
- Any new files should be linted.
- Currently, only main cg-deck repo will work for CI tests, forks can't run it due to privacy issues.
- How to share credentials required to run things?

#### Current considerations
- Working off a branch that gets deployed to a non-used site (no feedback on bugs/etc)
- Incorporating a separate CSS style library that have to likely work in a lot.
- Using some fast moving libraries like React and Babel (already a little out of date)
- No central design team right now.
- Almost all frontend app.
- Codebase is unlinted right now.

### Coding standards
- Airbnb styleguide for JS
- 18F styleguide for CSS
- Have linters setup for both.
- Use a node linter for the 18f styleguide because want to avoid ruby dep.
- Any time you change a file, you should turn on linting for that file and fix the errors
- Any new files should be linted.
- Should linting be part of test run or main build?
- How should linting fail? Fail only on CI, or all the time? Stop the build? Stop watching?
- Documenting the code.

#### Stuff that's in cg-style already
- Browser support
- Dependency management
- CSS modules and local scope
- CSS Architecture
- Any library added that's total file size is above 25kb should be evaluated for performance affect.

## Performance
- How do we measure performance?
- Should certain PRs talk about performance difference?
- Metrics?

### Project setup
- Should we move it here from main README?

## Public domain

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
