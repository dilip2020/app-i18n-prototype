import axios from "axios"
import has from "lodash.has"
import { setTranslations, setLanguage } from "redux-i18n"
import { APP_NAMESPACE, SUCCESS } from "../../utils/redux-contstants"
import { setCookie, getCookie } from "../../utils/cookie-utils"
import { buildGenericInitialState, handleError } from "../../utils/store-utils"

const I18N_ENDPOINT_BASE = "i18n"
const typeBase = `${APP_NAMESPACE}/${I18N_ENDPOINT_BASE}/`

// Constants
export const LOAD_TRANSLATION = `${typeBase}LOAD_TRANSLATION`

/**
 * setLocale - Changes Locale
 * @param {String} lang interface language
 * @returns {Promise}
 */

export const setLocale = lang => async (dispatch, getState) => {
  console.log('set locale called')
  const state = getState()
  if (!lang) {
    lang = getCookie("_lang")
    if (!lang) {
      return
    }
  } else {
    setCookie("_lang", lang)
  }

  const isLoaded = has(state, `i18nState.translations.${lang}`)
  if (isLoaded) {
    await dispatch(setLanguage(lang))
  } else {
    try {
      const resp = await axios(`/i18n/${lang}.json`)
      // following dispatches should be done synchronously
      dispatch(setLanguage(lang))
      dispatch(
        setTranslations(resp.data, { preserveExisting: true, language: lang })
      )
      dispatch({
        type: LOAD_TRANSLATION,
        meta: { status: SUCCESS },
      })
    } catch (err) {
      await handleError(dispatch, err, LOAD_TRANSLATION)
    }
  }
}

const INITIAL_STATE = {
  ...buildGenericInitialState([LOAD_TRANSLATION]),
}

// Reducer
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state
  }
}
