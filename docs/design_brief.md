# Design brief
Description: This document is mean't to introduce new people to the current state and desired goals of the design of the cloud.gov deck.

Date: 10/15/2015

### Product description
#### cloud.gov
- cloud.gov is a platform as a service offered to government entities to improve their workflow for deploying web services.
- it's built off an open source platform called cloud foundry.
- it allows a user to specify parameters about their application and deploy it to the cloud easily from the command line menu or deck ui.
- the command line product is already farther developed then the deck ui.
- there are similar tools in the private sector such as: pivotal cloud foundry, heroku, IBM bluemix.
- cloud.gov selling point is that it offers an easier ATO process over private industry tools.

#### cg deck
- the cloud.gov deck is a web ui that allows similiar functionality from the command line application.
- a user would first sign up with cloud.gov and would then be able to login to their deck.

  
### Current features
 - view basic information on your organizations, spaces with those organizations and apps within those spaces.
- remove, add, update users in your organization/space.
- add services to your app through the marketplace. these could be anything from databases to logging.
- manage an app by by stopping/starting it, modifying routes, setting up services.
- monitor an app by checking memory information, log entries, events, cpu usage, etc.
- see the status of the cloud.gov platform as a whole

### Budget and schedule

### Assumptions
- managed services (the ability to add a secondary service like a database or logging to the app) is an important use case of using the deck.
- program/product managers who aren't as comfortable on the command line will use the deck for even complex actions.
- the main flows of somebody using the deck are: a new user just signing up and setting up their app, a user investigating when something is going wrong


### User research done
none that I know of


### Objectives
- improve usability of the cloud.gov deck ui.

note: developing the visual style and brand of cloud.gov is less important at this time but will likely be important in the future.


### Questions
in terms of UI/design work, here's some questions we're interested in exploring:

- a idea of who the central users of the deck is/are
  - any usability problems the currently have with the deck?
  - do our users have experience with similar platforms?
  - what are our users motivations and goals in using the deck?
  - why they're using the deck over the command line?
- what are the most important features/aspects of the deck:
  - what do users expect to have?
  - what features will likely be the most used?
  - is there any current ui that's not needed?
- what would successful interactions with these features look like
  - what are the primary reasons a user would come to the deck? what brought them here?
  - steps should a user go through to accomplish various tasks
  - what problems exist with current flow?
  
its open to how these questions are answered (user interviews, usability test, a/b testing, competative research, brainstorming, common sense) or how the answers are delivered (user flows, wireframes, personas, journey map, storyboards) as long as they are sound.
  
### Suggestions
- theres other competing products out there that have done a good job in this space. Pivotal has specifically done a good job in the cloud foundry space. 
  
### Setup
to use the cloud.gov dec:

1. sign up by [creating an issue in the DevOps issue tracker](https://github.com/18F/DevOps/issues/new) and assigning it to @dlapiduz or @ozzyjohnson.
2. once you have an account, visit the deck at console.cloud.gov.

other links:

- cloud.gov documentation: https://docs.cloud.gov/
- cloud.gov deck repo: https://github.com/18F/cg-deck
- cloud.gov slack room #cloud-gov, and support #cloud-gov-support