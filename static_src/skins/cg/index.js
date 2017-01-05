/**
 * This file provides deployment specific configuration and content for the
 * dashboard. If you wish to override anything in this file:
 *
 * * Create a new configuration file in `skins/<name>/index.js`
 * * Import this configuration
 * * Override any variables you wish to change
 * * Export the new configuration as a `const` called `config`
 * * Set the CF_SKIN environment variable to the name of your new skin directory
 *
 * Example
 *
 * ```
 * import merge from 'deepmerge';
 * import { config as baseConfig } from '../cg';
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

export const config = {
  footer: {
    author_note: <span>Built and maintained by <a href="https://18f.gsa.gov">18F</a></span>,
    code_note: <span><a href="https://cloud.gov/docs/ops/repos/">Open source</a> and in the public domain</span>,
    disclaimer: <span>A United States government platform</span>,
    links: [
      {
        text: 'cloud.gov home',
        url: 'https://cloud.gov'
      },
      {
        text: 'Contact',
        url: 'https://cloud.gov/docs/help/'
      },
      {
        text: 'Contribute to cloud.gov',
        url: 'https://cloud.gov/docs/ops/repos/'
      }
    ]
  },
  header: {
    disclaimer: 'An official website of the United States Government',
    show_flag: true,
    links: [
      {
        text: 'Documentation',
        url: 'https://cloud.gov/docs'
      },
      {
        text: 'Updates',
        url: 'https://cloud.gov/updates/'
      },
      {
        text: 'Status',
        url: 'https://cloudgov.statuspage.io/'
      }
    ]
  },
  docs: {
    cli: 'https://cloud.gov/docs/getting-started/setup/',
    concepts_spaces: 'https://cloud.gov/docs/getting-started/concepts/',
    deploying_apps: 'https://cloud.gov/docs/apps/deployment/',
    use: 'https://cloud.gov/docs/intro/overview/using-cloudgov-paas/'
  },
  github: {
    url: 'https://github.com/18F/cg-dashboard'
  },
  home: {
    tiles: [InfoActivities, InfoStructure, InfoSandbox, InfoEnvironments]
  }
};
