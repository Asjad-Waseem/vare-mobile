import { applyMiddleware, compose, createStore } from 'redux'
import ReduxPromise from 'redux-promise'
import thunk from 'redux-thunk'
import rootReducer from '../rootReducer'

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose (
      applyMiddleware(thunk, ReduxPromise)
    )
  )

  return store
}

export default configureStore
