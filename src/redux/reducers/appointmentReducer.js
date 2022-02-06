import { combineReducers } from 'redux'
//import entityById from './entityById'
import {
  APPOINTMENT_ORIGINAL,
} from '../actions'


/** Reduces a Login Forms Actions */
//const members = (state = initialPersons, action = {}) => {
const appointmentData = (state = [], action = {}) => {
  switch (action.type) {
  case APPOINTMENT_ORIGINAL: {
    return {
      response:action.payload.response
      ? action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  default:
    return state
  }
}


const combined = combineReducers({
  appointmentData
})

export default combined
