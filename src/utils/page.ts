import config from '@/core/config';
export default function getPageTitle(pageTitle: unknown) {
  if (pageTitle) {
    return `${pageTitle} - ${config.appName}`;
  }
  return `${config.appName}`;
}
