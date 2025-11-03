export const ISO2_TO_NAME = {
  US:'United States', GB:'United Kingdom', CN:'China', KZ:'Kazakhstan', DE:'Germany', FR:'France', TR:'Turkey', AE:'United Arab Emirates',
  RU:'Russia', CA:'Canada', AU:'Australia', JP:'Japan', SG:'Singapore', NL:'Netherlands', IT:'Italy', ES:'Spain', PL:'Poland', SE:'Sweden',
  NO:'Norway', FI:'Finland', DK:'Denmark', CZ:'Czech Republic'
};
export function isoToFlag(i){ if(!i) return ''; return i.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt(0))); }

export const LANG_FULL = { en:'English', zh:'Chinese', ru:'Russian', tr:'Turkish', ar:'Arabic', ja:'Japanese', es:'Spanish', de:'German', fr:'French', it:'Italian', nl:'Dutch', pl:'Polish', sv:'Swedish', no:'Norwegian', fi:'Finnish', da:'Danish', cs:'Czech' };
export function fullLang(list){ return (list||[]).map(c=>LANG_FULL[c]||c).join(', '); }

export function safeUrl(url){
  if(!url) return '#';
  if(/^https?:\/\//i.test(url)) return url;
  return 'https://' + url;
}
