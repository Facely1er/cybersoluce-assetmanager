import { NAVIGATION_ROUTES } from '../data/navigation';

/**
 * Validates if a given path is a valid route
 * @param path - The path to validate
 * @returns true if the path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  // Normalize path (remove trailing slash, handle both /dashboard/ and /dashboard)
  const normalizedPath = path.replace(/\/$/, '') || '/';
  
  // Check exact matches first
  const validPaths = Object.values(NAVIGATION_ROUTES);
  if (validPaths.includes(normalizedPath as any)) {
    return true;
  }
  
  // Check if it's a dashboard route
  if (normalizedPath.startsWith('/dashboard/')) {
    const view = normalizedPath.replace('/dashboard/', '');
    return Object.values(NAVIGATION_ROUTES).some(route => 
      route === `/dashboard/${view}`
    );
  }
  
  // Check root dashboard
  if (normalizedPath === '/dashboard') {
    return true;
  }
  
  return false;
};

/**
 * Converts a URL path to a route key
 * @param path - The URL path (e.g., '/dashboard/assets', '/dashboard/user-manual')
 * @returns The route key (e.g., 'assets', 'userManual')
 */
export const getRouteFromPath = (path: string): string => {
  // Normalize path (remove trailing slash)
  const normalizedPath = path.replace(/\/$/, '') || '/';
  
  // Handle root paths
  if (normalizedPath === '/' || normalizedPath === '/dashboard') {
    return 'dashboard';
  }
  
  // Handle dashboard routes
  if (normalizedPath.startsWith('/dashboard/')) {
    const view = normalizedPath.replace('/dashboard/', '');
    if (!view) return 'dashboard';
    
    // Handle kebab-case to camelCase conversion
    const routeKey = view.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return routeKey;
  }
  
  // Handle legacy paths (without /dashboard prefix) - for backwards compatibility
  const cleanPath = normalizedPath.replace(/^\//, '');
  if (!cleanPath) return 'dashboard';
  
  // Handle kebab-case to camelCase conversion
  const routeKey = cleanPath.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return routeKey;
};

/**
 * Converts a route key to a URL path
 * @param route - The route key (e.g., 'assets', 'userManual')
 * @returns The URL path (e.g., '/dashboard/assets', '/dashboard/user-manual')
 */
export const getPathFromRoute = (route: string): string => {
  // Check if route exists in NAVIGATION_ROUTES
  const routeKey = route as keyof typeof NAVIGATION_ROUTES;
  if (NAVIGATION_ROUTES[routeKey]) {
    return NAVIGATION_ROUTES[routeKey];
  }
  
  // Fallback: convert camelCase to kebab-case and add /dashboard prefix
  const path = route.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `/dashboard/${path}`;
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
