import siteConfigJson from '../generated-content/site.json';
import type { SharedSiteConfig } from './types';

export const sharedSiteConfig = siteConfigJson as SharedSiteConfig;
