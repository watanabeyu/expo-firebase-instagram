import I18n from 'ex-react-native-i18n';

const ja = require('./ja.json');
const en = require('./en.json');

I18n.fallbacks = true;
I18n.defaultLocale = 'ja';
I18n.translations = {
  ja,
  en,
};

export default I18n;
