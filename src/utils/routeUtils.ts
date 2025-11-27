import { NAVIGATION_ROUTES } from '../data/navigation';

/**
 * Validates if a given path is a valid route
 * @param path - The path to validate
 * @returns true if the path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  const validPaths = Object.values(NAVIGATION_ROUTES);
  return validPaths.includes(path as any);
};

/**
 * Converts a URL path to a route key
 * @param path - The URL path (e.g., '/assets', '/user-manual')
 * @returns The route key (e.g., 'assets', 'userManual')
 */
export const getRouteFromPath = (path: string): string => {
  // Remove leading slash and convert to route key
  const cleanPath = path.replace(/^\//, '');
  
  // Handle root path
  if (!cleanPath) return 'dashboard';
  
  // Handle kebab-case to camelCase conversion
  const routeKey = cleanPath.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  
  return routeKey;
};

/**
 * Converts a route key to a URL path
 * @param route - The route key (e.g., 'assets', 'userManual')
 * @returns The URL path (e.g., '/assets', '/user-manual')
 */
export const getPathFromRoute = (route: string): string => {
  // Check if route exists in NAVIGATION_ROUTES
  const routeKey = route as keyof typeof NAVIGATION_ROUTES;
  if (NAVIGATION_ROUTES[routeKey]) {
    return NAVIGATION_ROUTES[routeKey];
  }
  
  // Fallback: convert camelCase to kebab-case
  const path = route.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `/${path}`;
};

/**
 * Builds a complete URL with query parameters
 * @param baseUrl - The base URL
 * @param path - The path
 * @param params - Optional query parameters
 * @returns The complete URL with query string
 */
export const buildUrl = (baseUrl: string, path: string, params?: Record<string, string>): string => {
  let url = `${baseUrl}${path}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

/**
 * Parses URL search parameters into an object
 * @param search - The search string (e.g., '?key=value&key2=value2')
 * @returns An object with parsed parameters
 */
export const parseUrlParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

/**
 * Gets the route key from the current window location
 * @returns The current route key
 */
export const getCurrentRoute = (): string => {
  return getRouteFromPath(window.location.pathname);
};

/**
 * Checks if the current route matches a given route key
 * @param route - The route key to check
 * @returns true if the current route matches
 */
export const isCurrentRoute = (route: string): boolean => {
  return getCurrentRoute() === route;
};
