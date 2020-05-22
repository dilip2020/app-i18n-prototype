import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import { i18nState } from 'redux-i18n';
import {
  TranslationsReducer
} from './modules';

const rootReducer = combineReducers({
  translations: TranslationsReducer,
  i18nState
});

if (typeof window === 'undefined') {
  global.window = {};
}

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

/* eslint-disable no-underscore-dangle */
const store = createStoreWithMiddleware(
  rootReducer,
  {}, // initial state
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

export default store;