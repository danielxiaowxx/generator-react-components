var i18nData = {
  zh_CN: {
    hi: '你好'
  },
  en: {
    hi: 'Hi'
  }
};

var use = function(lang) {
  switch (lang) {
    case 'en':
    case 'en_US':
      return i18nData.en;
      break;
    case 'zh_CN':
      return i18nData.zh_CN;
    default:
      return i18nData.en;
      break;
  }
};

module.exports = {
  use: use
};
