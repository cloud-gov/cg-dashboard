export function trackAction(action) {
  if (!window.ga) return;

  window.ga('send', {
    hitType: 'event',
    eventCategory: action.source,
    eventAction: action.type,
    eventLabel: action.type
  });
}

export function trackPageView(url) {
  if (!window.ga) return;

  window.ga('send', {
    hitType: 'pageview',
    page: url
  });
}
