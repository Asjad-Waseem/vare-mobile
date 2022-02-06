import { combineReducers } from "redux";
import {
    LOGIN_VIEWER,
    LOGOUT_VIEWER,
    SET_VIEWER_LOGGEDIN,
    SET_VIEWER_LOGGEDOUT,
    LOGIN_REQUEST,
    LOGIN_REQUEST_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REENTER,
    TOKEN_VALIDATE_REQUEST,
    TOKEN_VALIDATE_SUCCESS,
    TOKEN_VALIDATE_FAILURE,
} from "../actions";

const initialState = {
    // // users:[],
    // // isAuthenticated: false,
    // redirectUrl: null,
    // validateToken: {
    //     isFetching: false,
    //     error: null
    // },
    // login: {
    //     isFetching: false,
    //     error: null,
    // },
    // viewer: {
    //     email: null,
    //     token: null,
    //     id: null,
    //     roles: null,
    //     permissions: null
    // },
};

/** Reduces a Login Forms Actions */
function login (state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return action.payload.authForm;
        default:
            return state;
    }
}

/** Reduces a Login Forms Actions */
function loginInfo (state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS: { //alert(1)
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("token", "dgfdgfd#$#HFGDGF$$C&$$%HGHGHGH");
          localStorage.setItem("myUser", JSON.stringify(action.payload.response));
            return {
                isAuthenticated: true,
                myUser:action.payload.response,
                myToken: 'token',
                error: null
            };
        }
        case LOGIN_FAILURE: { //alert(2)
          localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("token");
                localStorage.removeItem("myUser");
                  localStorage.removeItem("userType");
            return {
                isAuthenticated:false,
                myUser:"",
                myToken: "",
                error: action.error
            };
        }
        case LOGIN_REENTER: { //alert(22)
            return {
              isAuthenticated:Boolean(localStorage.getItem("isAuthenticated"))
              ? Boolean(localStorage.getItem("isAuthenticated")) : false,
              myUser :localStorage.getItem("myUser")
              ? JSON.parse(localStorage.getItem("myUser"))
              : '',
              myToken: 'token',
              error: null
            };
        }
        case LOGIN_REQUEST_FAILURE: { //alert(3)
          localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("token");
                  localStorage.removeItem("myUser");
                          localStorage.removeItem("userType");
            return {
                isAuthenticated:false,
                myUser:"",
                myToken: "",
                error: action.error
            };
        }
        case SET_VIEWER_LOGGEDOUT: { //alert(4)
          localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
              localStorage.removeItem("userType");
            return {
                isAuthenticated:false,
                myUser:"",
                myToken: "",
                error: action.error
            };
        }
        default:
          //return state
          return {
              isAuthenticated:Boolean(localStorage.getItem("isAuthenticated"))
              ? Boolean(localStorage.getItem("isAuthenticated")) : false,
              myUser :localStorage.getItem("myUser")
              ? JSON.parse(localStorage.getItem("myUser"))
              : '',
              myToken: 'token',
              error: null
          };
    }
}

const combined = combineReducers({
    login,
    loginInfo
});

export default combined;
