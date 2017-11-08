import React from "react";
import PropTypes from "prop-types";
import formatRoute from "../../util/format_route";

const urlPlaceholder = "url";
const propTypes = {
  actor: PropTypes.string,
  domain: PropTypes.shape({ name: PropTypes.string }),
  route: PropTypes.shape({ host: PropTypes.string, path: PropTypes.string }),
  unmapped: PropTypes.bool
};

const appRouteLink = (domain, route) => {
  if (!route || !domain) {
    return urlPlaceholder;
  }

  const href = formatRoute(domain.name, route.host, route.path);

  return <a href={`//${href}`}>{href}</a>;
};

const RouteEventItem = ({ actor, domain, route, unmapped }) => (
  <span>
    {actor} {unmapped || "mapped"} {appRouteLink(domain, route)} to the app.
  </span>
);

RouteEventItem.propTypes = propTypes;
export default RouteEventItem;
