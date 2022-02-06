// import axios from 'axios'
// import thunk from 'redux-thunk'
// import axiosQuery from './axiosQuery'
import RESTCall from './restApi'

export const GENERAL_REQUEST = 'GENERAL_REQUEST'
export const GENERAL_SUCCESS = 'GENERAL_SUCCESS'
export const GENERAL_FAILURE = 'GENERAL_FAILURE'

export const DRIVER_REQUEST = 'DRIVER_REQUEST'
export const DRIVER_SUCCESS = 'DRIVER_SUCCESS'
export const DRIVER_FAILURE = 'DRIVER_FAILURE'

export const UNITS_REQUEST = 'UNITS_REQUEST'
export const UNITS_SUCCESS = 'UNITS_SUCCESS'
export const UNITS_FAILURE = 'UNITS_FAILURE'

export const TRIPREPORT_REQUEST = 'TRIPREPORT_REQUEST'
export const TRIPREPORT_SUCCESS = 'TRIPREPORT_SUCCESS'
export const TRIPREPORT_FAILURE = 'TRIPREPORT_FAILURE'

export const LOAD_REQUEST = 'LOAD_REQUEST'
export const LOAD_SUCCESS = 'LOAD_SUCCESS'
export const LOAD_FAILURE = 'LOAD_FAILURE'

export const DRUGTEST_REQUEST = 'DRUGTEST_REQUEST'
export const DRUGTEST_SUCCESS = 'DRUGTEST_SUCCESS'
export const DRUGTEST_FAILURE = 'DRUGTEST_FAILURE'


export const IMPORTANTFILINGS_REQUEST = 'IMPORTANTFILINGS_REQUEST'
export const IMPORTANTFILINGS_SUCCESS = 'IMPORTANTFILINGS_SUCCESS'
export const IMPORTANTFILINGS_FAILURE = 'IMPORTANTFILINGS_FAILURE'

export const ISSUES_REQUEST = 'ISSUES_REQUEST'
export const ISSUES_SUCCESS = 'ISSUES_SUCCESS'
export const ISSUES_FAILURE = 'ISSUES_FAILURE'

export const MAINTENANCE_REQUEST = 'MAINTENANCE_REQUEST'
export const MAINTENANCE_SUCCESS = 'MAINTENANCE_SUCCESS'
export const MAINTENANCE_FAILURE = 'MAINTENANCE_FAILURE'

export const MAINTENANCERECORD_REQUEST = 'MAINTENANCERECORD_REQUEST'
export const MAINTENANCERECORD_SUCCESS = 'MAINTENANCERECORD_SUCCESS'
export const MAINTENANCERECORD_FAILURE = 'MAINTENANCERECORD_FAILURE'

export const MILEAGERECORD_REQUEST = 'MILEAGERECORD_REQUEST'
export const MILEAGERECORD_SUCCESS = 'MILEAGERECORD_SUCCESS'
export const MILEAGERECORD_FAILURE = 'MILEAGERECORD_FAILURE'

export const PAYROLL_REQUEST = 'PAYROLL_REQUEST'
export const PAYROLL_SUCCESS = 'PAYROLL_SUCCESS'
export const PAYROLL_FAILURE = 'PAYROLL_FAILURE'

export const CALENDAR_REQUEST = 'CALENDAR_REQUEST'
export const CALENDAR_SUCCESS = 'CALENDAR_SUCCESS'
export const CALENDAR_FAILURE = 'CALENDAR_FAILURE'

const ENV = process.env



/** General Form Actions */
export const generalRequested = (request) => {
  console.log('appointmentRequested',request)
  return {
    type: GENERAL_REQUEST,
    payload: { request }
  }
}
export const generalSuccess = (response, resource) => {
  if (resource.includes('vare_'))
    return {
      type: DRIVER_SUCCESS,
      payload: { response, resource }
    }
  else if (resource=='truck_units') {
    return {
      type: UNITS_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_tripReport') {
    return {
      type: TRIPREPORT_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_load') {
    return {
      type: LOAD_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_drugTest') {
    return {
      type: DRUGTEST_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_importantFilings') {
    return {
      type: IMPORTANTFILINGS_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_issues') {
    return {
      type: ISSUES_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_load') {
    return {
      type: LOAD_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_maintenance') {
    return {
      type: MAINTENANCE_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_maintenanceRecord') {
    return {
      type: MAINTENANCERECORD_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_mileageRecord') {
    return {
      type: MILEAGERECORD_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_payroll') {
    return {
      type: PAYROLL_SUCCESS,
      payload: { response, resource }
    }
  }
  else if (resource=='truck_calendar') {
    return {
      type: CALENDAR_SUCCESS,
      payload: { response, resource }
    }
  }
  else {
    return {
      type: GENERAL_SUCCESS,
      payload: { response, resource }
    }
  }
}

export const generalFailure = (error) => {
  return {
    type: GENERAL_FAILURE,
    error
  }
}


export const handleQuery = (formData,callBack) => {

  return (dispatch, getState) => {
    console.log('myRequest',formData)
    RESTCall.axiosQuery(formData)
    .then(response => {
      // console.log('kkkkdispatch',formData,response)

      const callDispatcher= {
        general: generalSuccess(response.data,formData.resource)
      }
      response.data &&
        dispatch(callDispatcher.general)
    })
    .catch(error => {
        console.log('error',error)
        dispatch(generalFailure(error))
        return error
    })
  }
}
