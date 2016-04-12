## Welcome!

We're so glad you're thinking about contributing to an 18F open source project! If you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contribution, and don't want a wall of rules to get in the way of that.

Before contributing, we encourage you to read our CONTRIBUTING policy (you are here), our LICENSE, and our README, all of which should be in this repository. If you have any questions, or want to read more about our underlying policies, you can consult the 18F Open Source Policy GitHub repository at https://github.com/18f/open-source-policy, or just shoot us an email/official government letterhead note to [18f@gsa.gov](mailto:18f@gsa.gov).

## Information

### High-level roadmap
The cloud.gov deck is currently being refactored to port the codebase from angular to unit-tested react. In doing so, it will take UI/UX cues from the  [community web ui](https://github.com/icclab/cf-webui), and merge that design with the visual [cloudgov-style](https://github.com/18F/cg-style) to create a unified cloud.gov experience. This refactor work is accumulated into the `staging-alpha` branch which will eventually be merged with `master` when it's feature complete and bug free. This means all work should be merged into the `staging-alpha` branch, unless working with the deprecated angular codebase.

### Workflow
Tracking work and progress is currently being done through [Zenhub](https://www.zenhub.io/), which adds a browser extension to add additional agile features to github. The main feature Zenhub adds is a "Boards" page which is an agile bboard detailing the state of work for the deck.

#### Board workflow
- Stories or ideas for features can start in backlog.
- For a story to be past "ready" it must have a value statement and acceptance criteria
  - A value statement that has who the user is, what the value is to them and what the deliverable is.
- A story is put into "awaiting acceptance" when it's been merged and is available on a staging or live site.
  - Ensure to not use the github "fixes" feature as it will close a branch too early.
- A product owner or team member will check a story waiting acceptance and put it into "done" if it meets the criteria.


- What to call branches? Should we put the issue number in them? Other conventions


#### Code reviewing
- Open a PR whenever you want
- Add the "ready for review" label.
- Another person the the team reviews it
- When it's ready, they add the "ready for merge" label, and take off "ready for review"
- The person that wrote the code merges after they get a thumbs up. 
  - Ensure integration slack to get updates on comments for PRs.

#### Branches and PRs
- Open branches off main repo due to travis CI env var problem
- Put in your initials
- Put what the feature is

### Code reviewing

#### Linting
- Theres a lint ignore file with all file not being linted.
- If you touch another file that isn't linted yet, you generally fix it and remove it from the ignore.
  - Unless under strict time constraints.


- It's fine if staging-alpha isn't feature perfect.
- One person at least reviews each PR.
- What is a good commit message?
  - Focus on the "why" rather then the "what"
  - Have the first line be the "what"
  - Discuss the "why" in more detail
- What to look for in code review?
  - Hopefully don't need to look for linting
- Should code be pulled down and tested for each review?
  - Yes, although for super easy code, not necessary.
- Can we give the staging url to people at 18f?
  - Would be good to find bugs.
  - Have the url more prominent on the readme of the branch
- How to share credentials required to run things?

#### Current considerations
- Working off a branch that gets deployed to a non-used site (no feedback on bugs/etc)
- Incorporating a separate CSS style library that have to likely work in a lot.
- Using some fast moving libraries like React and Babel (already a little out of date)
  - Should shrinkwrap our dependencies
  - Every two weeks, attempt to update

### Coding standards
- Airbnb styleguide for JS
  - Re-add deprecation warnings on linter when upgrade react.
- 18F styleguide for CSS
- Should linting be part of test run or main build?
  - Test run
- How should linting fail? Fail only on CI, or all the time? Stop the build? Stop watching?
  - Fail on CI
  - Should not stop watching
  - Should fail test runs
- Documenting the code. probably wont' document right now

#### Stuff that's in cg-style already
- Browser support, IE10 and up
- Javascript support
  - If its easy, make it work without JS
- Dependency management, shrinking etc
- CSS modules and local scope
- CSS Architecture
  - Anything shared shoudl be in cg-style


## Performance
Table this for now, and if we have time
- How do we measure performance?
- Should certain PRs talk about performance difference?
- Metrics?
- Any library added that's total file size is above 25kb should be evaluated for performance affect.

### Project setup
- Should we move it here from main README?
  No, or either way.

## Public domain

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
