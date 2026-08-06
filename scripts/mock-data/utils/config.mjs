export const ENVIRONMENT_CONFIG = {
  development: {
    cloudinaryFolder: 'mineboard_dev',
    cloudinaryTags: ['dev', 'mock-data'],
  },
  production: {
    cloudinaryFolder: 'mineboard',
    cloudinaryTags: ['prod', 'mock-data'],
  },
};

export function getRequiredEnv(...names) {
  const name = names.find((candidate) => process.env[candidate]);
  if (!name) {
    throw new Error(
      `Missing required environment variable: ${names.join(' or ')}`,
    );
  }
  return process.env[name];
}

export function getEnvironment() {
  const argument = process.argv.find((value) =>
    value.startsWith('--environment='),
  );
  const environment = argument?.split('=')[1];

  if (!(environment in ENVIRONMENT_CONFIG)) {
    throw new Error(
      'Pass --environment=development or --environment=production.',
    );
  }

  return environment;
}
