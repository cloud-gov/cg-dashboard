import { appStates, entityHealth } from "../constants";

const HEALTHY_STATES = [entityHealth.inactive, entityHealth.ok];

const HEALTH_RANKED = [
  entityHealth.error,
  entityHealth.warning,
  entityHealth.ok,
  entityHealth.inactive
];

const APP_INSTANCE_STATE_RANKED = [
  appStates.down,
  appStates.crashed,
  appStates.flapping,
  appStates.restarting,
  appStates.running,
  appStates.started,
  appStates.stopped
];

export function appHealth(app) {
  if (!app) {
    throw new Error("`app` must be provided.");
  }

  if (
    app.state === appStates.started &&
    app.running_instances === app.instances
  ) {
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

  if (
    app.state === appStates.started &&
    app.running_instances !== app.instances
  ) {
    // Restarting
    return entityHealth.warning;
  }

  return entityHealth.unknown;
}

export function appInstanceHealth(state) {
  switch (state) {
    case appStates.crashed:
    case appStates.down:
    case appStates.flapping:
      return entityHealth.error;

    case appStates.stopped:
      return entityHealth.inactive;

    case appStates.running:
    case appStates.started:
      return entityHealth.ok;

    default:
      return entityHealth.unknown;
  }
}

// Lowest score is worst
function rank(ranked, value) {
  return ranked.indexOf(value);
}

export function isHealthyApp(app) {
  return HEALTHY_STATES.includes(appHealth(app));
}

// Unknown health is worst (-1)
export function rankWorseHealth(health) {
  return rank(HEALTH_RANKED, health);
}

export function worstHealth(healths) {
  if (!healths || !healths.length) {
    return entityHealth.unknown;
  }

  return healths.reduce((worst, health) => {
    if (!worst) {
      return health;
    }

    return rankWorseHealth(worst) > rankWorseHealth(health) ? health : worst;
  });
}

export function worstAppInstanceState(states) {
  if (!states || !states.length) {
    return appStates.unknown;
  }

  const score = rank.bind(null, APP_INSTANCE_STATE_RANKED);

  return states.reduce((worst, state) => {
    if (!worst) {
      return state;
    }

    return score(worst) > score(state) ? state : worst;
  });
}
