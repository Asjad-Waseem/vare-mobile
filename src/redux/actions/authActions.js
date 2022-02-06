import axios from "axios";
import RESTCall from './restApi'


export const LOGIN_VIEWER = "LOGIN_VIEWER";
export const SET_VIEWER_LOGGEDIN = "SET_VIEWER_LOGGEDIN";
export const SET_VIEWER_LOGGEDOUT = "SET_VIEWER_LOGGEDOUT";
export const LOGOUT_VIEWER = "LOGOUT_VIEWER";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_REENTER = "LOGIN_REENTER";
export const LOGIN_REQUEST_FAILURE = "LOGIN_REQUEST_FAILURE";
export const TOKEN_VALIDATE_REQUEST = "TOKEN_VALIDATE_REQUEST";
export const TOKEN_VALIDATE_SUCCESS = "TOKEN_VALIDATE_SUCCESS";
export const TOKEN_VALIDATE_FAILURE = "TOKEN_VALIDATE_FAILURE";

const ENV = process.env;

/** Login Form Actions */
const loginRequested = () => {
    return {
        type: LOGIN_REQUEST
    };
};
const logoutView = () => {
    return {
        type: SET_VIEWER_LOGGEDOUT
    };
};
const loginSuccess = (response) => {
    return {
        type: LOGIN_SUCCESS,
        payload: { response }
    };
};
const loginFailure = (error) => {
    return {
        type: LOGIN_FAILURE,
        error
    };
};
const loginReenter = (error) => {
    return {
        type: LOGIN_REENTER,
        error
    };
};


/** Token Validate Actions */
const tokenValidateRequested = () => {
    return {
        type: TOKEN_VALIDATE_REQUEST
    };
};
const tokenValidateSuccess = () => {
    return {
        type: TOKEN_VALIDATE_SUCCESS
    };
};
const tokenValidateFailure = (error) => {
    return {
        type: TOKEN_VALIDATE_FAILURE,
        error
    };
};

/** Viwewer Authentication Actions */
export const setViewerLoggedIn = () => {
    return {
        type: SET_VIEWER_LOGGEDIN,
    };
};
const setViewerLoggedOut = () => {
    return {
        type: SET_VIEWER_LOGGEDOUT,
    };
};
const setViewerAuthentication = (token, viewer) => {
    return {
        type: LOGIN_VIEWER,
        viewer,
        token
    };
};

const setViewerAsLoggedOut = () => {
    return {
        type: LOGOUT_VIEWER,
    };
};

const postLogin = (dispatch, formField)  => {
    // alert(formField.email+formField.password);
    // var instance = axios.create({
    // })
    // return  instance({
    //   method: 'post',
    //   url: 'https://localhost:3000/signin',
    //   data: {
    //       email: formField.email,
    //       password: formField.password
    //     }
    // }).then(response => {
    //     console.log('membersss',response)
    //     dispatch(handleLoginSuccess(dispatch,
    //        response.data))
    //   })
    }

const getViewerPermissions = (token) => {
    const url
  = ENV.IDENTITY_SVC_URI + "/_c/permissions";
    return axios.post(url, JSON.stringify({token}),
        { headers: { Authorization: token } }
    );
};

/**
 * Called once login queries have validated and needs to store data
 */
// const handleLoginSuccess = (dispatch, data => {
//     //storeViewerInfo(dispatch, token, viewer);
//
//   //  dispatch(loginSuccess(data));
// });

/**
 * Called when login queries failed and data needs cleared
 */
const handleLoginFailure = (dispatch, err) => {
    // remove viewer info from global state
    dispatch(setViewerAsLoggedOut());
    // set isAuthenticated to false
    dispatch(setViewerLoggedOut());
    // take error data and store in global state for display
    const errMessage = formatError(err);
    dispatch(loginFailure(errMessage));
};

const handleTokenAuthSuccess = (dispatch, token, viewer) => {
    storeViewerInfo(dispatch, token, viewer);
    dispatch(loginSuccess());
};
const handleTokenAuthFailure = (dispatch, err) => {
    formatError(err);
    logoutViewer();
};

export const logoutViewer = () => {
    removeLocalToken();
    window.location.href = "/login";
};

const formatError = (err) => {
    const errMessage = err.response
    && err.response.data
    && err.response.data.message
    || "Could not communicate with identity service";
    console.log(errMessage);
    return errMessage;
};

const removeUserData = (dispatch) => {
    dispatch(setViewerAsLoggedOut());
    dispatch(setViewerLoggedOut());
};

/**
 * Sets the token to local storage
 */
const setLocalToken = (token) => {
    localStorage.setItem("token", token);
};

/**
 * Gets a record from local storage
 */
const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

/**
 * Removes the token in local storage
 */
const removeLocalToken = () => {
    localStorage.removeItem("token");
};

const storeViewerInfo = (dispatch, token, viewer) => {
    // store token in local local storage
    setLocalToken(token);
    // update viewer identity in global state
    dispatch(setViewerAuthentication(token, viewer));
    // initiate isAuthenticated to true which will
    // be picked up at app load to bypass login
    dispatch(setViewerLoggedIn());
};


export const logoutFromView = (dispatch,formField) => {
    return (dispatch, getState) => {
        dispatch(logoutView())
        dispatch(logoutViewer());
    }
  }

// ====== THUNKS ===========
//
export const loginViewer = (dispatch,formField) => {
    var data={
      email:formField.email,
      password:formField.password
    }
    return (dispatch, getState) => {
      const myRequest = {
        request: 'search',
        resource:'fleet_persons',
        query:data,
      }
      RESTCall.axiosQuery(myRequest)
      .then(response => {
        // console.log(response.data)
        response.data ? dispatch(loginSuccess(response.data))
        : dispatch(loginReenter(response.data))
        return
        })
        .catch(err =>
          {
            console.log('err',err)
            dispatch(loginFailure(err))
          }
        );
             };
};

/**
 * Used at app load when a token is present and isAuthenticated is true
 */
export const authenticateToken = () => {
    return (dispatch, getState) => {
        const token = getLocalStorage("token");
        dispatch(tokenValidateRequested());
        getViewerPermissions(token)
            .then(res => handleTokenAuthSuccess(
                dispatch, token, res.data
            ))
            .catch(err => handleTokenAuthFailure(dispatch, err));
    };
};
