import React from 'react';

export { default as header } from './header';

import * as homePage from './home_page';

export { homePage };

import InfoLogs from 'dashboard/components/info_logs.jsx';

export const config = {
  footer: {
    author_note: <span>A dashboard for managing your Cloud Foundry apps</span>,
    code_note: <a href="https://github.com/18F/cg-dashboard/blob/master/LICENSE.md">Open source and in the public domain</a>,
    links: [
      {
        text: 'Cloud Foundry home page',
        url: 'https://www.cloudfoundry.org/'
      },
      {
        text: 'Want to make this better? Submit an issue',
        url: 'https://github.com/18F/cg-dashboard/issues'
      }
    ]
  },
  docs: {
    cli: 'https://cloud.gov/docs/getting-started/setup/',
    concepts_roles: 'https://docs.cloudfoundry.org/concepts/roles.html',
    concepts_spaces: 'https://cloud.gov/docs/getting-started/concepts/',
    deploying_apps: 'https://cloud.gov/docs/getting-started/your-first-deploy/',
    use: 'https://cloud.gov/overview/overview/using-cloudgov-paas/',
    invite_user: 'https://cloud.gov/docs/apps/managing-teammates/',
    roles: 'https://cloud.gov/docs/apps/managing-teammates/#give-roles-to-a-teammate',
    managed_services: 'https://cloud.gov/docs/apps/managed-services/',
    status: 'https://cloudgov.statuspage.io/',
    contact: 'https://cloud.gov/docs/help/'
  },
  snippets: {
    logs: {}
  },
  github: {
    url: 'https://github.com/18F/cg-dashboard'
  },
  platform: {
    name: 'cloud.gov',
    api_host: 'api.fr.cloud.gov'
  }
};
