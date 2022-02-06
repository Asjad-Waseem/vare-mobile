import {combineReducers} from "redux";
//import entityById from './entityById'
import {
  GENERAL_REQUEST,
  GENERAL_SUCCESS,
  GENERAL_FAILURE,
  DRIVER_REQUEST,
  DRIVER_SUCCESS,
  DRIVER_FAILURE,
  VARE_MEETINGS_REQUEST,
  VARE_MEETINGS_SUCCESS,
  VARE_MEETINGS_FAILURE,
  VARE_MEETING_RSVP_REQUEST,
  VARE_MEETING_RSVP_SUCCESS,
  VARE_MEETING_RSVP_FAILURE,
  VARE_COMMENTS_UPDATE_REQUEST,
  VARE_COMMENTS_UPDATE_SUCCESS,
  VARE_COMMENTS_UPDATE_FAILURE,
  VARE_MEETING_COMMENTS_REQUEST,
  VARE_MEETING_COMMENTS_SUCCESS,
  VARE_MEETING_COMMENTS_FAILURE,
  TUBE_CONTENTS_REQUEST,
  TUBE_CONTENTS_SUCCESS,
  TUBE_CONTENTS_FAILURE,
  TUBE_CONTENTS_UPDATE_REQUEST,
  TUBE_CONTENTS_UPDATE_SUCCESS,
  TUBE_CONTENTS_UPDATE_FAILURE,
  VARE_RSVP_UPDATE_REQUEST,
  VARE_RSVP_UPDATE_SUCCESS,
  VARE_RSVP_UPDATE_FAILURE,
  VARE_VOTE_REQUEST,
  VARE_VOTE_SUCCESS,
  VARE_VOTE_FAILURE,
  MAINTENANCE_REQUEST,
  MAINTENANCE_SUCCESS,
  MAINTENANCE_FAILURE,
  MAINTENANCERECORD_REQUEST,
  MAINTENANCERECORD_SUCCESS,
  MAINTENANCERECORD_FAILURE,
  MILEAGERECORD_REQUEST,
  MILEAGERECORD_SUCCESS,
  MILEAGERECORD_FAILURE,
  PAYROLL_REQUEST,
  PAYROLL_SUCCESS,
  PAYROLL_FAILURE,
  CALENDAR_REQUEST,
  CALENDAR_SUCCESS,
  CALENDAR_FAILURE
} from "../actions";
import InitialData from "../../data";

const vare_meeting_comments = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_MEETING_COMMENTS_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_MEETING_COMMENTS_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_MEETING_COMMENTS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const tube_contents = (state = [], action = {}) => {
  switch (action.type) {
    case TUBE_CONTENTS_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case TUBE_CONTENTS_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case TUBE_CONTENTS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const tube_contents_update = (state = [], action = {}) => {
  switch (action.type) {
    case TUBE_CONTENTS_UPDATE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case TUBE_CONTENTS_UPDATE_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case TUBE_CONTENTS_UPDATE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const vare_rsvp_update = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_RSVP_UPDATE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_RSVP_UPDATE_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_RSVP_UPDATE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const vare_vote = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_VOTE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_VOTE_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_VOTE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const vare_comments_update = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_COMMENTS_UPDATE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_COMMENTS_UPDATE_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_COMMENTS_UPDATE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const maintenance = (state = InitialData["maintenance"], action = {}) => {
  switch (action.type) {
    case MAINTENANCE_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case MAINTENANCE_SUCCESS: {
      return {
        ...state,
        tableModel: "maintenance",
        table: "truck_maintenance",
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case MAINTENANCE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const maintenanceRecord = (
  state = InitialData["maintenanceRecord"],
  action = {}
) => {
  switch (action.type) {
    case MAINTENANCERECORD_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case MAINTENANCERECORD_SUCCESS: {
      return {
        ...state,
        tableModel: "maintenanceRecord",
        table: "truck_maintenanceRecord",
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case MAINTENANCERECORD_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const mileageRecord = (state = InitialData["mileageRecord"], action = {}) => {
  switch (action.type) {
    case MILEAGERECORD_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case MILEAGERECORD_SUCCESS: {
      return {
        ...state,
        tableModel: "mileageRecord",
        table: "truck_mileageRecord",
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case MILEAGERECORD_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const payroll = (state = InitialData["payroll"], action = {}) => {
  switch (action.type) {
    case PAYROLL_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case PAYROLL_SUCCESS: {
      return {
        ...state,
        tableModel: "payroll",
        table: "truck_payroll",
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case PAYROLL_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const vare_meeting_rsvp = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_MEETING_RSVP_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_MEETING_RSVP_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_MEETING_RSVP_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const vare_meetings = (state = [], action = {}) => {
  switch (action.type) {
    case VARE_MEETINGS_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case VARE_MEETINGS_SUCCESS: {
      return {
        ...state,
        request: action.payload.request ? action.payload.request : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case VARE_MEETINGS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const driver = (state = [], action = {}) => {
  switch (action.type) {
    case DRIVER_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case DRIVER_SUCCESS: {
      return {
        ...state,
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case DRIVER_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const calendar = (state = InitialData["calendar"], action = {}) => {
  switch (action.type) {
    case CALENDAR_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case CALENDAR_SUCCESS: {
      return {
        ...state,
        tableModel: "calendar",
        table: "truck_calendar",
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case CALENDAR_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const generalData = (state = [], action = {}) => {
  switch (action.type) {
    case GENERAL_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case GENERAL_SUCCESS: {
      return {
        ...state,
        tableData: action.payload.response ? action.payload.response : "",
        response: action.payload.response ? action.payload.response : "",
        resource: action.payload.resource ? action.payload.resource : "",
        isFetching: false,
        error: null
      };
    }
    case GENERAL_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

const combined = combineReducers({
  tube_contents,
  tube_contents_update,
  driver,
  vare_meetings,
  vare_meeting_rsvp,
  vare_meeting_comments,
  vare_comments_update,
  vare_rsvp_update,
  vare_vote
  // drugTest,
  // importantFilings,
  // issues,
  // load,
  // maintenance,
  // maintenanceRecord,
  // mileageRecord,
  // payroll,
  // tripReport,
  // units,
  // calendar
});

export default combined;
