import { combineReducers } from 'redux'

import {
  keyInfoReducer,
  AuthReducer
} from './reducers'

const rootReducer = combineReducers({
  keyInfo:keyInfoReducer,
  auth: AuthReducer
})

export { rootReducer }
export default rootReducer
