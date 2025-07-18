module.exports = {
  apps: [{
    name: 'api',
    script: './dist/apps/api/main.js',
    namespace: 'seyconel',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '8G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'admin',
    script: 'serve',
    namespace: 'seyconel',
    env: {
      NODE_ENV: 'development',
      PM2_SERVE_PATH: './dist/apps/admin',
      PM2_SERVE_PORT: 4200,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
    },
    env_production: {
      NODE_ENV: 'production',
      PM2_SERVE_PATH: './dist/apps/admin',
      PM2_SERVE_PORT: 4200,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
    }
  }],
};
