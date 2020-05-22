import React from "react"
import { Provider } from "react-redux"
import I18n from "redux-i18n"
import GlobalContextContainer from "./src/containers/global-context-container"
import store from './src/redux'

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  return (
    <Provider store={store}>
      <I18n translations={{}} useReducer>
        <GlobalContextContainer>{element}</GlobalContextContainer>
      </I18n>
    </Provider>
  )
}
