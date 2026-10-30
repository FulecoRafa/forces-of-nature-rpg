import type { Lang } from '../i18n';
import * as pt from './lore';
import * as en from './lore.en';

export const lore = (lang: Lang) => ({ pt, en })[lang];
