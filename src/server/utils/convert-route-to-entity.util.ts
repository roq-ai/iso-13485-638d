const mapping: Record<string, string> = {
  'iso-certificates': 'iso_certificate',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
