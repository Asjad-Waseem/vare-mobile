// import axios from 'axios'
// import thunk from 'redux-thunk'
// import axiosQuery from './axiosQuery'
import RESTCall from "./restApi";

export const GENERAL_REQUEST = "GENERAL_REQUEST";
export const GENERAL_SUCCESS = "GENERAL_SUCCESS";
export const GENERAL_FAILURE = "GENERAL_FAILURE";

export const DRIVER_REQUEST = "DRIVER_REQUEST";
export const DRIVER_SUCCESS = "DRIVER_SUCCESS";
export const DRIVER_FAILURE = "DRIVER_FAILURE";

export const VARE_MEETINGS_REQUEST = "VARE_MEETINGS_REQUEST";
export const VARE_MEETINGS_SUCCESS = "VARE_MEETINGS_SUCCESS";
export const VARE_MEETINGS_FAILURE = "VARE_MEETINGS_FAILURE";

export const VARE_MEETING_RSVP_REQUEST = "VARE_MEETING_RSVP_REQUEST";
export const VARE_MEETING_RSVP_SUCCESS = "VARE_MEETING_RSVP_SUCCESS";
export const VARE_MEETING_RSVP_FAILURE = "VARE_MEETING_RSVP_FAILURE";

export const VARE_COMMENTS_UPDATE_REQUEST = "VARE_COMMENTS_UPDATE_REQUEST";
export const VARE_COMMENTS_UPDATE_SUCCESS = "VARE_COMMENTS_UPDATE_SUCCESS";
export const VARE_COMMENTS_UPDATE_FAILURE = "VARE_COMMENTS_UPDATE_FAILURE";

export const VARE_MEETING_COMMENTS_REQUEST = "VARE_MEETING_COMMENTS_REQUEST";
export const VARE_MEETING_COMMENTS_SUCCESS = "VARE_MEETING_COMMENTS_SUCCESS";
export const VARE_MEETING_COMMENTS_FAILURE = "VARE_MEETING_COMMENTS_FAILURE";

export const TUBE_CONTENTS_REQUEST = "TUBE_CONTENTS_REQUEST";
export const TUBE_CONTENTS_SUCCESS = "TUBE_CONTENTS_SUCCESS";
export const TUBE_CONTENTS_FAILURE = "TUBE_CONTENTS_FAILURE";

export const TUBE_CONTENTS_UPDATE_REQUEST = "TUBE_CONTENTS_UPDATE_REQUEST";
export const TUBE_CONTENTS_UPDATE_SUCCESS = "TUBE_CONTENTS_UPDATE_SUCCESS";
export const TUBE_CONTENTS_UPDATE_FAILURE = "TUBE_CONTENTS_UPDATE_FAILURE";

export const VARE_RSVP_UPDATE_REQUEST = "VARE_RSVP_UPDATE_REQUEST";
export const VARE_RSVP_UPDATE_SUCCESS = "VARE_RSVP_UPDATE_SUCCESS";
export const VARE_RSVP_UPDATE_FAILURE = "VARE_RSVP_UPDATE_FAILURE";

export const VARE_VOTE_REQUEST = "VARE_VOTE_REQUEST";
export const VARE_VOTE_SUCCESS = "VARE_VOTE_SUCCESS";
export const VARE_VOTE_FAILURE = "VARE_VOTE_FAILURE";

export const MAINTENANCE_REQUEST = "MAINTENANCE_REQUEST";
export const MAINTENANCE_SUCCESS = "MAINTENANCE_SUCCESS";
export const MAINTENANCE_FAILURE = "MAINTENANCE_FAILURE";

export const MAINTENANCERECORD_REQUEST = "MAINTENANCERECORD_REQUEST";
export const MAINTENANCERECORD_SUCCESS = "MAINTENANCERECORD_SUCCESS";
export const MAINTENANCERECORD_FAILURE = "MAINTENANCERECORD_FAILURE";

export const MILEAGERECORD_REQUEST = "MILEAGERECORD_REQUEST";
export const MILEAGERECORD_SUCCESS = "MILEAGERECORD_SUCCESS";
export const MILEAGERECORD_FAILURE = "MILEAGERECORD_FAILURE";

export const PAYROLL_REQUEST = "PAYROLL_REQUEST";
export const PAYROLL_SUCCESS = "PAYROLL_SUCCESS";
export const PAYROLL_FAILURE = "PAYROLL_FAILURE";

export const CALENDAR_REQUEST = "CALENDAR_REQUEST";
export const CALENDAR_SUCCESS = "CALENDAR_SUCCESS";
export const CALENDAR_FAILURE = "CALENDAR_FAILURE";

const ENV = process.env;

/** General Form Actions */
export const generalRequested = request => {
  // console.log('appointmentRequested',request)
  return {
    type: GENERAL_REQUEST,
    payload: {request}
  };
};
export const generalSuccess = (response, resource, request) => {
  // console.log('appointmentRequested',response,resource,request)

  // if (resource.includes('vare_'))
  //   return {
  //     type: DRIVER_SUCCESS,
  //     payload: { response, resource }
  //   }
  // else
  if (resource == "vare_meetings") {
    return {
      type: VARE_MEETINGS_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "vare_meeting_rsvp" && request == "search") {
    return {
      type: VARE_MEETING_RSVP_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "vare_meeting_rsvp") {
    return {
      type: VARE_RSVP_UPDATE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "vare_meeting_comments" && request == "search") {
    return {
      type: VARE_MEETING_COMMENTS_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "vare_meeting_comments") {
    return {
      type: VARE_COMMENTS_UPDATE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (
    resource == "tube_contents" &&
    (request == "search" || request == "get" || request == "find")
  ) {
    return {
      type: TUBE_CONTENTS_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "tube_contents_update") {
    return {
      type: TUBE_CONTENTS_UPDATE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "vare_vote" && request == "search") {
    return {
      type: VARE_VOTE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_load") {
    return {
      type: VARE_COMMENTS_UPDATE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_maintenance") {
    return {
      type: MAINTENANCE_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_maintenanceRecord") {
    return {
      type: MAINTENANCERECORD_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_mileageRecord") {
    return {
      type: MILEAGERECORD_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_payroll") {
    return {
      type: PAYROLL_SUCCESS,
      payload: {response, resource, request}
    };
  } else if (resource == "truck_calendar") {
    return {
      type: CALENDAR_SUCCESS,
      payload: {response, resource, request}
    };
  } else {
    return {
      type: GENERAL_SUCCESS,
      payload: {response, resource, request}
    };
  }
};

export const generalFailure = error => {
  return {
    type: GENERAL_FAILURE,
    error
  };
};

export const handleQuery = (formData, callBack) => {
  return (dispatch, getState) => {
    // console.log("myRequest", formData);
    RESTCall.axiosQuery(formData)
      .then(response => {
        // console.log('kkkkdispatch',formData,response)
        const callDispatcher = {
          general: generalSuccess(
            response.data,
            formData.resource,
            formData.request
          )
        };
        response.data && dispatch(callDispatcher.general);
      })
      .catch(error => {
        console.log("error", error);
        dispatch(generalFailure(error));
        return error;
      });
  };
};
