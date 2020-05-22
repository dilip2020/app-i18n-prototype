import { PENDING, SUCCESS, ERROR } from "./redux-contstants"
import { isCancel } from "./http-utils"
import { getError } from "./error-utils"
/**
 * updateStore  - Returns an object containing updated state. This helper
 *                builds generic state (messages, errors, loading)
 *
 * @param {Object} state                 Current state of the store
 * @param {Object} action                Redux action for the store to respond to
 * @param {Object} [extraValues]         Any additional state to be assigned
 * @param {Object} [extraPendingValues]  Any additional state to be assigned when pending
 * @returns {Object}
 */
export const updateStore = (
  state,
  action,
  extraValues = {},
  extraPendingValues = {}
) => {
  const { type = "", payload, meta = { status: "" } } = action
  switch (meta.status) {
    case SUCCESS:
      return {
        ...state,
        ...extraValues,
        loading: { ...state.loading, [type]: false },
        errors: { ...state.errors, [type]: null },
      }
    case ERROR:
      return {
        ...state,
        loading: { ...state.loading, [type]: false },
        errors: { ...state.errors, [type]: payload },
      }
    case PENDING:
    default:
      return {
        ...state,
        ...extraPendingValues,
        loading: { ...state.loading, [type]: true },
        errors: { ...state.errors, [type]: null },
      }
  }
}
/**
 * clearStore  - cleares the store based on the provided action types and values
 *
 * @param {Object} state            Current state of the store
 * @param {Object} [extraTypes]     extra action types to clear errors
 * @param {Object} [values]         state values to clear
 */
export const clearStore = (state, extraTypes, values = {}) => {
  const agregatedErrors = extraTypes.reduce((retObj, type) => {
    retObj[type] = null
    return retObj
  }, {})
  return {
    ...state,
    ...values,
    errors: { ...state.errors, ...agregatedErrors },
  }
}

/**
 * buildGenericInitialState  - Builds initial state for a set of constants
 *                             (loading, errors, messages)
 *
 * @param {Array} constants  Array of constants to build state around
 * @returns {Object}
 */
export const buildGenericInitialState = constants => ({
  errors: constants.reduce((retObj, constant) => {
    retObj[constant] = null
    return retObj
  }, {}),
  loading: constants.reduce((retObj, constant) => {
    retObj[constant] = false
    return retObj
  }, {}),
})

/**
 * handleError  - Dispatches error properly to Redux stores
 *
 * @param {Function} dispatch Redux dispatch function
 * @param {Object}   error    Error container
 * @param {String}   type     Action type constant for error received
 */
export const handleError = (dispatch, error, type) => {
  if (isCancel(error)) return true
  const payload = getError(error)
  return dispatch({
    type,
    payload,
    meta: { status: ERROR },
  })
}
