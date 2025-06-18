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
  deploy: {
    production: {
      key: './cert/SEY-WEB01.pem',
      user: 'sey-web',
      host: 'ec2-18-228-62-195.sa-east-1.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:leoruhland/seyconel-nx.git',
      path: '/home/sey-web/seyconel-app',
      'pre-deploy': 'git reset --hard',
      'post-deploy': 'export NODE_OPTIONS=--max_old_space_size=4096 && pnpm install && pnpm exec nx build api --prod && pnpm exec nx build admin --prod && pm2 reload ecosystem.config.js --env production'
    }
  }
};
