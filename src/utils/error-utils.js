import isEmpty from 'lodash.isempty';

export const getError = err => {
  const error = { code: -1, message: '', status: 500 };

  // The request was made, but the server responded with a status code
  // that falls out of the range of 2xx
  if (err.response && !isEmpty(err.response.data)) {
    const errData = err.response.data;
    if (errData.errors) {
      const apiError = errData.errors[0];
      error.code = apiError.code;
      error.message = apiError.title;
      error.status = apiError.status;
    } else if (errData.error_description || errData.action_info) {
      error.status = err.response.status;
      error.code = undefined;
      // Authorization failure
      if (errData.error_description) {
        error.message = errData.error_description;
      }
      if (errData.action_info) {
        error.actionInfo = {
          url: errData.action_info.action_url,
          payload: errData.action_info.action_payload
        };
      }
    } else {
      // Incase of 500 internal server error, err.response.data = "Internal Server Error"
      error.message = err.response.statusText;
      error.status = err.response.status;
    }
  } else {
    // something else went wrong, typically during setting up the request
    error.message = err.message;
  }

  return error;
};