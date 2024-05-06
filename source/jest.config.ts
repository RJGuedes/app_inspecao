const { getJestProjects } = require('@nx/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/admin',
    '<rootDir>/apps/app',
  ],
};
