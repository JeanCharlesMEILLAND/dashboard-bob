module.exports = {
  apps: [
    {
      name: 'bob-dashboard-prod',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/bob/dashboard',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      error_file: '/var/www/bob/logs/dashboard-error.log',
      out_file: '/var/www/bob/logs/dashboard-out.log',
      log_file: '/var/www/bob/logs/dashboard-combined.log',
      time: true,
      autorestart: true,
      watch: false,
    },
  ],
};
