export const STACK = {
  BACKEND: 'backend',
  FRONTEND: 'frontend',
};

export const LEVEL = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

export const PACKAGE = {
  // Backend packages
  CACHE: 'cache',
  CONTROLLER: 'controller',
  CRON_JOB: 'cron_job',
  DB: 'db',
  DOMAIN: 'domain',
  HANDLER: 'handler',
  REPOSITORY: 'repository',
  ROUTE: 'route',
  SERVICE: 'service',
  
  // Frontend packages
  API: 'api',
  COMPONENT: 'component',
  HOOK: 'hook',
  PAGE: 'page',
  STATE: 'state',
  STYLE: 'style',

  // Shared packages
  AUTH: 'auth',
  CONFIG: 'config',
  MIDDLEWARE: 'middleware',
  UTILS: 'utils',
};