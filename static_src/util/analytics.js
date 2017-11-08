export function trackAction(action) {
  if (!window.ga) return;

  window.ga("send", {
    hitType: "event",
    eventCategory: action.source,
    eventAction: action.type
  });
}

export function trackPageView(url) {
  if (!window.ga) return;

  window.ga("send", {
    hitType: "pageview",
    page: url
  });
}

export function noticeError(err) {
  if (!window.NREUM) return;

  window.NREUM.noticeError(err);
}
