import versionInfo from './version.json';

export const getBuildNumber = (): number => {
  return versionInfo.buildNumber || 0;
};

