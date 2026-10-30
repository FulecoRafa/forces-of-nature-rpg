import { ui } from '../i18n/ui';
import type { Lang } from '../i18n';

export const repoUrl = 'https://github.com/fulecorafa/forces-of-nature-rpg';

/** Contato para artistas: abre uma issue já preenchida no GitHub. */
export const artContactUrl = (lang: Lang) => {
  const p = new URLSearchParams({ title: ui[lang].art.issueTitle, body: ui[lang].art.issueBody, labels: 'arte' });
  return `${repoUrl}/issues/new?${p}`;
};
