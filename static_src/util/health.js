
import { appStates, entityHealth } from '../constants';

const HEALTHY_STATES = [
  entityHealth.inactive,
  entityHealth.ok
];

const HEALTH_RANKED = [
  entityHealth.error,
  entityHealth.warning,
  entityHealth.ok,
  entityHealth.inactive
];


export function appHealth(app) {
  if (!app) {
    throw new Error('`app` must be provided.');
  }

  if (app.state === appStates.started && app.running_instances === app.instances) {
    return entityHealth.ok;
  }

  if (app.running_instances === 0) {
    if (app.state !== appStates.stopped) {
      // The CLI uses this condition to determined crashed
      // https://github.com/cloudfoundry/cli/blob/ffee70cca68ab15df71f48641f6fa3bb007c4a2b/cf/uihelpers/ui.go#L16
      return entityHealth.error;
    }

    // Stopped
    return entityHealth.inactive;
  }

  if (app.state === appStates.started && app.running_instances !== app.instances) {
    // Restarting
    return entityHealth.warning;
  }

  return entityHealth.unknown;
}

export function isHealthyApp(app) {
  return HEALTHY_STATES.includes(appHealth(app));
}

// Lowest score is worst
// Unknown health is worst (-1)
export function rankWorseHealth(health) {
  return HEALTH_RANKED.indexOf(health);
}

export function worstHealth(healths) {
  if (!healths || !healths.length) {
    return entityHealth.unknown;
  }

  return healths.reduce((worst, health) =>
    (rankWorseHealth(worst) > rankWorseHealth(health) ? health : worst)
  , entityHealth.inactive);
}
