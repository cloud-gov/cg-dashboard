export default function formatRoute(domain, host, path) {
  let url = domain;
  if (host) url = `${host}.${domain || ""}`;
  if (path) url = `${url}/${path}`;

  return url;
}
