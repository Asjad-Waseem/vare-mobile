import { combineReducers } from 'redux'
//import entityById from './entityById'
import {
  APPOINTMENT_REQUEST,
  APPOINTMENT_SUCCESS,
  APPOINTMENT_FAILURE,
  PERSON_REQUEST,
  PERSON_SUCCESS,
  PERSON_FAILURE,

  TRIP_REPORT_REQUEST,
  TRIP_REPORT_SUCCESS,
  TRIP_REPORT_FAILURE,

  HOSPITAL_REQUEST,
  HOSPITAL_SUCCESS,
  HOSPITAL_FAILURE,
  DISPATCHER_REQUEST,
  DISPATCHER_SUCCESS,
  DISPATCHER_FAILURE,
  VEHICLES_REQUEST,
  VEHICLES_SUCCESS,
  VEHICLES_FAILURE
} from '../actions'


const vehicleTypeOption=[
  'car',
  'suv'
]

const userTypeOption=[
  'patient',
  'driver',
  'doctor/nurse',
  'dispatcher',
  'admin'
]

const statusOption=[
  'Pending',
  'Completed',
  'Canceled'
]

const activeOption=[
  'active',
  'Not Active'
]

const sexOption=[
  'male',
  'female'
]

const specialNeedsOption=[
  'wheelchair',
  'spit bowl'
]

const initialAppointments = [
// {
//   id:0,
//   driver:3,
//   patient:1,
//   hospital:1,
//   dispatcher:1,
//   active:'',
//   pickUpTime:'',
//   pickUpAddress:'',
//   dropOffTime:'',
//   dropOffAddress:'',
//   miles:'',
//   status:0
// },
// {
//   id:1,
//   driver:2,
//   patient:2,
//   hospital:1,
//   dispatcher:1,
//   active:'',
//   pickUpTime:'',
//   pickUpAddress:'',
//   dropOffTime:'',
//   dropOffAddress:'',
//   miles:'',
//   status:1
// }
]

const initialPersons = [
  // {
  //   id: 0,
  //   firstName: 'PatientFname',
  //   lastName: 'PatientLname',
  //   title:'',
  //   hospital:1,
  //   dispatcher:'',
  //   userType: 0,
  //   email: 'admin@admin.com',
  //   password: 'admin',
  //   address: '12800 center lake dr, austin texas 78753',
  //   city: 'Austin',
  //   state: 'Texas',
  //   zip: '',
  //   phone: '5124685190',
  //   ssn: '',
  //   employer_ID: '0',
  //   avatar: 'image.jpg',
  //   sex: 0,
  //   active: 1,
  //   lat: '30.232211',
  //   lng: '-97.823298'
  // },
  // {
  //   id: 1,
  //   firstName: 'DriverFname',
  //   lastName: 'DriverLname',
  //   title:'',
  //   hospital:1,
  //   dispatcher:'',
  //   userType: 1,
  //   email: 'admin2@admin.com',
  //   password: 'admin2',
  //   address: '12800 center lake dr, austin texas 78753',
  //   city: 'Austin',
  //   state: 'Texas',
  //   zip: '',
  //   phone: '5124685190',
  //   ssn: '',
  //   employer_ID: '0',
  //   avatar: 'image.jpg',
  //   sex: 0,
  //   active: 1,
  //   lat: '30.232211',
  //   lng: '-97.823298'
  // },
  // {
  //   id: 2,
  //   firstName: 'NurseFName',
  //   lastName: 'NurseLName',
  //   title:'',
  //   hospital:1,
  //   dispatcher:'',
  //   userType: 2,
  //   email: 'admin3@admin.com',
  //   password: 'admin3',
  //   address: '12800 center lake dr, austin texas 78753',
  //   city: 'Austin',
  //   state: 'Texas',
  //   zip: '',
  //   phone: '5124685190',
  //   ssn: '',
  //   employer_ID: '0',
  //   avatar: 'image.jpg',
  //   sex: 0,
  //   active: 1,
  //   lat: '30.232211',
  //   lng: '-97.823298'
  // },
  // {
  //   id: 3,
  //   firstName: 'DispatcherFName',
  //   lastName: 'DispatcherLName',
  //   title:'',
  //   hospital:1,
  //   dispatcher:'',
  //   userType: 3,
  //   email: 'admin4@admin.com',
  //   password: 'admin4',
  //   address: '12800 center lake dr, austin texas 78753',
  //   city: 'Austin',
  //   state: 'Texas',
  //   zip: '',
  //   phone: '5124685190',
  //   ssn: '',
  //   employer_ID: '0',
  //   avatar: 'image.jpg',
  //   sex: 0,
  //   active: 1,
  //   lat: '30.232211',
  //   lng: '-97.823298'
  // }
]

const initialHospitals = [
// {
//   id:0,
//   name: 'Hospital1',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 1,
//   address:'5766 Balcones Dr, Austin, TX 78731'
//
// },
// {
//   id:1,
//   name: 'Hospital2',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 2,
//   address:'5766 Balcones Dr, Austin, TX 78731'
// },
// {
//   id:2,
//   name: 'Hospital3',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 2,
//   address:'5766 Balcones Dr, Austin, TX 78731'
// }
]


const initialDispatchers=[
// {
//   id:0,
//   name: 'Dispacher1',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 1,
//   address:'5766 Balcones Dr, Austin, TX 78731'
//
// },
// {
//   id:1,
//   name: 'Dispacher2',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 2,
//   address:'5766 Balcones Dr, Austin, TX 78731'
// },
// {
//   id:2,
//   name: 'Dispacher3',
//   accountNumber: 256276,
//   bank: 'Zenet Bank',
//   userType: 2,
//   address:'5766 Balcones Dr, Austin, TX 78731'
// }
]

const initialVehicles=[]

/** Reduces a Login Forms Actions */
const specialNeeds = (state = specialNeedsOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
const vehicleType = (state = vehicleTypeOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
const userType = (state = userTypeOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
const status = (state = statusOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
const active = (state = activeOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
const sex = (state = sexOption, action = {}) => {
  return state
}

/** Reduces a Login Forms Actions */
//const members = (state = initialPersons, action = {}) => {
const appointments = (state = initialAppointments, action = {}) => {
  switch (action.type) {
  case APPOINTMENT_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case APPOINTMENT_SUCCESS: {
    return {
      response:action.payload.response
      ? action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case APPOINTMENT_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}


/** Reduces a Login Forms Actions */
//const members = (state = initialPersons, action = {}) => {
const persons = (state = initialPersons, action = {}) => {
  switch (action.type) {
  case PERSON_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case PERSON_SUCCESS: {
    // console.log('payload',action.payload)
    return {
      response:action.payload.response
      ? action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case PERSON_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}

const trip_report = (state = initialPersons, action = {}) => {
  switch (action.type) {
  case TRIP_REPORT_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case TRIP_REPORT_SUCCESS: {
    return {
      response:action.payload.response
      ? action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case TRIP_REPORT_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}

/** Reduces a Login Forms Actions */
//const providers = (state = initialAppointments, action = {}) => {
const hospitals = (state = initialHospitals, action = {}) => {
  switch (action.type) {
  case HOSPITAL_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case HOSPITAL_SUCCESS: {
    return {
      response:action.payload.response ?
      action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case HOSPITAL_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}


/** Reduces a Login Forms Actions */
//const providers = (state = initialAppointments, action = {}) => {
const dispatchers = (state = initialDispatchers, action = {}) => {
  switch (action.type) {
  case DISPATCHER_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case DISPATCHER_SUCCESS: {
    return {
      response:action.payload.response ?
      action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case DISPATCHER_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}

/** Reduces a Login Forms Actions */
//const providers = (state = initialAppointments, action = {}) => {
const vehicles = (state = initialVehicles, action = {}) => {
  switch (action.type) {
  case VEHICLES_REQUEST: {
    return {
      ...state,
      isFetching: true,
      error: null
    }
  }
  case VEHICLES_SUCCESS: {
    return {
      response:action.payload.response ?
      action.payload.response : [],
      isFetching: false,
      error: null
    }
  }
  case VEHICLES_FAILURE: {
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  }
  default:
    return state
  }
}


const combined = combineReducers({
  // specialNeeds,
  // vehicleType,
  userType,
  // status,
  // active,
  // sex,
  // appointments,
  // hospitals,
  // dispatchers,
  persons,
  trip_report,
  // vehicles
})

export default combined
