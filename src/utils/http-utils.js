import axios from "axios"
import humps from "humps"
import get from "lodash.get"
import { PENDING, SUCCESS, POST, PUT, GET, DELETE } from "./redux-contstants"
import { parseLanguage } from "../utils/lang-utils"

/**
 * httpRequest - Generic action to make an http request with axios
 * @param {Function} dispatch     React-redux's dispatch function
 * @param {String} requestType    Type of http request to make
 * @param {String} actionType     Action type to be dispatched
 * @param {Object} opts           Object of options
 *                  endpoint        Api endpoint to hit (e.g., '/auth/login')
 *                  data            Data to be posted to the api
 *                  requiresAuth    Whether or not request needs to be authenticated
 *
 * @returns {Promise}
 */
const httpRequest = async (
  dispatch,
  requestType = GET,
  actionType = "",
  opts = {}
) => {
  try {
    dispatch &&
      dispatch({
        type: actionType,
        meta: { status: PENDING },
      })

    const reqArgs = [opts.endpoint || ""]

    // Add a data payload to the request if it's a POST or PUT
    if (requestType === POST || requestType === PUT) {
      reqArgs.push(opts.data || {})
    }

    // Add headers
    if (opts.headers) reqArgs.push(opts.headers || {})

    // Add timeout
    reqArgs.push({ timeout: 10000 })

    const response = opts.cancelableAxios
      ? await opts.cancelableAxios(requestType, reqArgs)
      : await axios[requestType](...reqArgs)
    const payload = opts.normalize ? normalize(response.data) : response

    dispatch &&
      dispatch({
        type: actionType,
        meta: { status: SUCCESS },
        payload,
      })

    return Promise.resolve(payload)
  } catch (err) {
    throw err
  }
}

/**
 * post - Generic action to make a POST request with axios
 * @param {Function} dispatch       React-redux's dispatch function
 * @param {String} type             Action type to be dispatched
 * @param {String} endpoint         Api endpoint to hit (e.g., '/auth/login')
 * @param {Object} data             Data to be posted to the api
 * @param {Object} headers          API headers
 * @param {Boolean} normalize       Whether or not response needs to be normalized
 * @param {Boolean} cancelableAxios Makes the request cancelable
 *
 * @returns {Promise}
 */
export const httpPost = (
  dispatch,
  type,
  endpoint,
  data,
  headers,
  normalize,
  cancelableAxios
) =>
  httpRequest(dispatch, POST, type, {
    endpoint,
    data,
    headers,
    normalize,
    cancelableAxios,
  })

/**
 * put - Generic action to make a PUT request with axios
 * @param {Function} dispatch      React-redux's dispatch function
 * @param {String} type            Action type to be dispatched
 * @param {String} endpoint        Api endpoint to hit (e.g., '/user/:id')
 * @param {Object} data            Data to be posted to the api
 * @param {Object} headers         API headers
 * @param {Function} normalize     Whether or not response needs to be normalized
 *
 * @returns {Promise}
 */
export const httpPut = async (
  dispatch,
  type,
  endpoint,
  data,
  headers,
  normalize
) => httpRequest(dispatch, PUT, type, { endpoint, data, headers, normalize })

/**
 * get - Generic action to make a GET request with axios
 * @param {Function} dispatch        React-redux's dispatch function
 * @param {String} type              Action type to be dispatched
 * @param {String} endpoint          Api endpoint to hit (e.g., '/user')
 * @param {Object} headers           API headers
 * @param {Boolean} normalize        Whether or not response needs to be normalized
 * @param {Function} cancelableAxios Makes the request cancelable
 *
 * @returns {Promise}
 */
export const httpGet = async (
  dispatch,
  type,
  endpoint,
  headers,
  normalize,
  cancelableAxios
) =>
  httpRequest(dispatch, GET, type, {
    endpoint,
    headers,
    normalize,
    cancelableAxios,
  })

/**
 * del - Generic action to make a DELETE request with axios
 * @param {Function} dispatch     React-redux's dispatch function
 * @param {String} type           Action type to be dispatched
 * @param {String} endpoint       Api endpoint to hit (e.g., '/user/:id')
 * @param {Boolean} requiresAuth  Whether or not request needs to be authenticated
 * @param {Boolean} normalize     Whether or not response needs to be normalized
 *
 * @returns {Promise}
 */
export const httpDel = async (dispatch, type, endpoint, headers, normalize) =>
  httpRequest(dispatch, DELETE, type, { endpoint, headers, normalize })

export const attachAccessToken = accessToken => ({
  Authorization: `Bearer ${accessToken}`,
})

export const attachLanguageHeaders = lang => ({
  "Accept-Language": parseLanguage(lang),
})

export const normalize = (data, path, doNotNormalizeArray) => {
  if (!data) return data
  const normalizedData = humps.camelizeKeys(data)
  const pathToProperty = path || "data.attributes"

  if (!doNotNormalizeArray && Array.isArray(normalizedData.data)) {
    return normalizedData.data
  }

  return get(normalizedData, pathToProperty, normalizedData)
}

export const cancelableAxios = () => {
  let source
  return (requestType, params) => {
    source && source.cancel("Operation canceled due to new request.")
    source = axios.CancelToken.source()
    const [url, ...configArray] = params
    const configObject = configArray.reduce(
      (a, b) => Object.assign(a, b.data ? { data: b } : b),
      {}
    )
    const config = {
      url,
      method: requestType,
      cancelToken: source.token,
      ...configObject,
    }
    return axios(config)
  }
}

export const isCancel = err => axios.isCancel(err)
