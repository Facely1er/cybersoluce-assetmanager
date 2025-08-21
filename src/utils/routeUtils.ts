import { NAVIGATION_ROUTES } from '../data';

export const isValidRoute = (path: string): boolean => {
  const validPaths = Object.values(NAVIGATION_ROUTES);
  return validPaths.includes(path as any);
};

export const getRouteFromPath = (path: string): string => {
  // Remove leading slash and convert to route key
  const cleanPath = path.replace(/^\//, '');
  
  // Handle root path
  if (!cleanPath) return 'dashboard';
  
  // Handle kebab-case to camelCase conversion
  const routeKey = cleanPath.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  
  return routeKey;
};

export const getPathFromRoute = (route: string): string => {
  const routeMap: Record<string, string> = {
    dashboard: '/',
    workflow: '/workflow',
    assets: '/assets',
    analytics: '/analytics',
    compliance: '/compliance',
    vulnerabilities: '/vulnerabilities',
    organizations: '/organizations',
    users: '/users',
    activity: '/activity',
    userManual: '/user-manual',
    settings: '/settings',
    help: '/help'
  };
  
  return routeMap[route] || '/';
};

export const buildUrl = (baseUrl: string, path: string, params?: Record<string, string>): string => {
  let url = `${baseUrl}${path}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

export const parseUrlParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};