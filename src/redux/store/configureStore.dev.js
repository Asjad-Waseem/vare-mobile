import { createStore, compose, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import thunk from 'redux-thunk'
import rootReducer from '../rootReducer'
import logger from 'redux-logger'
import { connect, Provider } from 'react-redux'

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose (
      applyMiddleware(thunk, ReduxPromise, logger),
      window.devToolsExtension
        ? window.devToolsExtension()
        : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store

  // const store = createStore(
  //   rootReducer,
  //   applyMiddleware(thunk)
  // )
  // return store
}

export default configureStore
