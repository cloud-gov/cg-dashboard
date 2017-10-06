/**
 * This file provides deployment specific configuration and content for the
 * dashboard. If you wish to override anything in this file:
 *
 * * Create a new configuration file in `skins/<name>/index.js`
 * * Import this configuration
 * * Override any variables you wish to change
 * * Export the new configuration as a `const` called `config`
 * * Export a `lang` variable
 * * Set the SKIN_NAME environment variable to the name of your new skin directory
 * * If the skin contains translation files, set the SKIN_PROVIDES_TRANSLATIONS
 * * environment variable to true
 *
 * Example
 *
 * ```
 * import merge from 'deepmerge';
 * import { config as baseConfig } from '../cg';
 *
 * export const lang = 'en-GB';
 *
 * const newConfig = merge(baseConfig, {
 *   header: {
 *     disclaimer: 'My awesome disclaimer',
 *   },
 *   github: {
 *     url: 'https://github.com/best-username/cg-dashboard'
 *   }
 * });
 *
 * // override the entire list of links
 * newConfig.header.links = [
 *   {
 *     text: 'Help',
 *     url: 'http://google.com'
 *   }
 * ]
 * ;
 *
 * export const config = newConfig;
 * ```
 */

import React from 'react';

import InfoActivities from '../../components/info_activities.jsx';
import InfoEnvironments from '../../components/info_environments.jsx';
import InfoSandbox from '../../components/info_sandbox.jsx';
import InfoStructure from '../../components/info_structure.jsx';
import InfoLogs from '../../components/info_logs.jsx';

export const lang = 'en-US';

export const config = {
  footer: {
    author_note: <span>A United States government platform</span>,
    code_note: <a href="https://cloud.gov/docs/ops/repos/">Open source and in the public domain</a>,
    disclaimer_note: <a href="https://18f.gsa.gov/vulnerability-disclosure-policy/">Vulnerability disclosure policy</a>,
    links: [
      {
        text: 'cloud.gov home',
        url: 'https://cloud.gov'
      },
      {
        text: 'Get help for customer issues',
        url: 'https://cloud.gov/docs/help/#support-for-people-who-use-cloud-gov'
      },
      {
        text: 'Built and maintained by 18F',
        url: 'https://18f.gsa.gov/'
      }
    ]
  },
  header: {
    disclaimer_link_text: 'Here\'s how you know',
    disclaimer_reason_gov_header: 'The .gov means it’s official.',
    disclaimer_reason_gov_body: 'Federal government websites often end in .gov or .mil. ' +
      'Before sharing sensitive information, make sure you\'re on a federal government site.',
    disclaimer_reason_https_header: 'The site is secure. ',
    disclaimer_reason_https_body: 'The https:// ensures that you are connecting to the ' +
      'official website and that any information you provide is encrypted and transmitted ' +
      'securely.',
    disclaimer: 'An official website of the United States government',
    show_flag: true,
    links: [
      {
        text: 'Documentation',
        url: 'https://cloud.gov/docs/'
      },
      {
        text: 'Updates',
        url: 'https://cloud.gov/updates/'
      },
      {
        text: 'Status',
        url: 'https://cloudgov.statuspage.io/'
      },
      {
        text: 'Contact',
        url: 'https://cloud.gov/docs/help/'
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
    logs: InfoLogs
  },
  github: {
    url: 'https://github.com/18F/cg-dashboard'
  },
  platform: {
    name: 'cloud.gov',
    api_host: 'api.fr.cloud.gov',
    logs: {
      name: 'logs.fr.cloud.gov',
      url: 'https://logs.fr.cloud.gov'
    }
  },
  home: {
    tiles: [InfoActivities, InfoStructure, InfoSandbox, InfoEnvironments]
  }
};
