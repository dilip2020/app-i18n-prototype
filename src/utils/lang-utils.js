export const getLocale = lang => {
  switch (lang) {
    case "en":
      return "en-GB"
    case "zhtw":
      return "zh-TW"
    case "zhcn":
      return "zh-CN"
    default:
      return lang
  }
}

export const parseLanguage = language => {
  switch (language) {
    case "zhtw":
      return "zh-tw"
    case "zhcn":
      return "zh-cn"
    default:
      return language
  }
}
