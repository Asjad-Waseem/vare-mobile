import React, {Fragment, useState, useEffect, useRef} from "react";
import {
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggl,
  Container,
  Col,
  Media,
  FormGroup,
  Progress,
  CardTitle,
  Label,
  Button
} from "reactstrap";
import {Formik, Form, Field} from "formik";
import {useHistory} from "react-router-dom";
import cookie from "react-cookies";
import useLocalStorage from "./localStorage";
import {parseURL} from "../../helpers";
import PageFooter from "./PageFooter";

import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";
import RESTCall from "../../../../redux/actions/restApi";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import "../../../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

import PageMenu from "./PageMenu";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";

//Import Section Title

import Axios from "axios";

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");
const loader = require("../../../../assets/images/loading1.gif");
const {innerWidth: width, innerHeight: height} = window;

const Login = ({info, onHandleQuery, urlQuery, setLoginUser}) => {
  const history = useHistory();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState("VareHall");
  const [refreshing, setRefreshing] = useState(false);

  // const [selectedLike, setSelectedLike] = useState(-1);
  const [navItems, setNavItems] = useState([
    {
      id: 1,
      idnm: "VareHall",
      navheading: "VareHall"
    },
    // { id: 2 , idnm : "Comments", navheading: "Comments" },
    {
      id: 3,
      idnm: "https://play.google.com/store/apps/details?id=com.vote.keyVoteApp",
      navheading: "Android"
    },
    {
      id: 4,
      idnm: "https://apps.apple.com/app/id1503031565",
      navheading: "IOS"
    }
  ]);

  const [errors, setErrors] = useState({});

  const validateEmail = mail => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    alert("You have entered an invalid email address!");
    return false;
  };

  const [showLogin, setShowLogin] = useState(false);
  const [appToken, setAppToken] = useState("");

  const [viewLevel, setViewLevel] = useState("charts"); //charts,bills,demography
  const [storeUser, setStoreUser] = useLocalStorage("user", "");
  const loginTag = useRef(false);
  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myPWRef = useRef();

  const allRoutes = useRef([
    "/apps",
    "/meeting",
    "/video",
    "/schedule",
    "/stats",
    "/profile",
    "/add",
    "/calendar",
    "/media"
  ]);

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://media.varehall.com/upload/myUpload"
    // "http://localhost:5000/upload/myUpload"
  );
  const [userSource, setUserSource] = useState("");
  const [userEmail, setUserEmail] = useState(false);

  // const inViewVideoIndex = useRef(null);

  useEffect(() => {
    const urlParams = parseURL(history.location.search);
    // console.log("jjj", history);
    cookie.remove("vare", {path: "/"});
    setUserSource(urlParams.app ? "app" : "web");

    if (urlParams.id && urlParams.app) {
      getUserEmail(urlParams.id);
    }

    // if (urlParams && urlParams.app) {
    // console.log("jjj", urlParams.app);
    // cookie.save("vare", urlParams.app, {path: "/"});
    // setAppToken(urlParams.app);
    // console.log("appToken", appToken);
    // }
  }, []);

  useEffect(() => {
    console.log("userEmail", userEmail);
  }, [userSource, userEmail]);

  const getUserEmail = async id => {
    const formData = {
      request: "search",
      query: {
        user_id: id
      },
      resource: "vare_user",
      id: ""
    };
    await RESTCall.axiosQuery(formData).then(response => {
      const data = response && response.data && response.data[0];
      if (data && data.email) {
        setUserEmail(data.email);
      }
    });
  };

  const loginAppUser = () => {
    if (!userEmail && !myEmailRef.current.value) {
      return;
    }
    const formData = {
      request: "vareappprofile",
      query: {
        email: userEmail ? userEmail : myEmailRef.current.value.toLowerCase()
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData)
      .then(response => {
        if (response && response.token) {
          cookie.save("vare", response.token, {path: "/"});
          // setLoginUser("/");
          response["name"] = response.fullName
            ? response.fullName
            : response.name;
          setStoreUser(response);
          setRefreshing(false);
          alert("You have successfully logged in");
          const urlHistory = history.location && history.location.pathname;
          // window.location.reload();
          history.push("/podcast");
        } else {
          setRefreshing(false);
          alert(
            response && response.message
              ? response.message
              : "Please verify your Email and Password or Register your account."
          );
        }
      })
      .catch(err => {
        setRefreshing(false);
        cookie.remove("vare", {path: "/"});
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setStoreUser("");
          alert(
            err &&
              err.response &&
              err.response.data &&
              err.response.data.message
          );
        }
      });
  };

  const handleLogin = () => {
    if (myEmailRef.current.value && myPWRef.current.value) {
      const formData = {
        request: "login",
        query: {
          email:
            myEmailRef.current.value && myEmailRef.current.value.toLowerCase(),
          password: myPWRef.current.value
        },
        resource: "vare_user",
        id: ""
      };
      RESTCall.axiosQuery(formData)
        .then(response => {
          console.log("dd", response);
          if (response && response.token) {
            cookie.save("vare", response.token, {path: "/"});
            // setLoginUser("/");
            response["name"] = response.fullName
              ? response.fullName
              : response.name;
            setStoreUser(response);
            setRefreshing(false);
            alert("You have successfully logged in");
            const urlHistory = history.location && history.location.pathname;
            history.push("/podcast");
            // window.location.reload();
          } else {
            setRefreshing(false);
            alert(
              response && response.message
                ? response.message
                : "Please verify your Email and Password or Register your account."
            );
          }
          // history.push("/apps");
        })
        .catch(err => {
          setRefreshing(false);
          cookie.remove("vare", {path: "/"});
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            setStoreUser("");
            alert(
              err &&
                err.response &&
                err.response.data &&
                err.response.data.message
            );
          }
        });
    }
  };

  const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
    return new Promise(resolve => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const onImage = async (failedImages, successImages) => {
    if (!myEmailRef.current.value) {
      alert("You must add email first");
      return;
    }
    // console.log("xxx");
    if (!url) {
      // console.log("missing Url");
      setErrorMessage("missing a url to upload to");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");
    try {
      const imageString = await resizeImage(successImages, 200, 200);
      const image = await [imageString];

      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];
      const name =
        myEmailRef.current &&
        myEmailRef.current.value &&
        myEmailRef.current.value.split(".com") &&
        myEmailRef.current.value.split(".com")[0] + ".jpg"; //parts[1].split("=")[1];
      const data = parts[2];
      const res = await Axios.post(url, {
        mime,
        name,
        image: image[0]
      });
      // console.log("successImages", res);
      // setImageURL(res.data.imageURL);
      setProgress("uploaded");
    } catch (error) {
      console.log("error in upload", error);
      setErrorMessage(error.message);
      setProgress("uploadError");
    }
  };

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          // paddingTop: 100,
          // paddingBottom: 300,
          backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5",
          background:
            "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      >
        <Row
          style={{
            // marginTop: 90,
            // marginBottom: 500,
            paddingTop: 100,
            paddingBottom: 300,
            height: "100%",
            // width: "100%",
            overflow: "hidden",
            overflow: "auto",
            alignItems: "center"
            // overflow: "auto"
            // display: "none"
          }}
        >
          <div className="mx-auto my-auto col-12 col-md-10">
            <div
              style={{
                marginRight: 25,
                marginLeft: 25,
                backgroundColor: "white",
                borderRadius: 5,
                height: 400
              }}
            >
              <div
                style={{
                  background:
                    "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
                  backgroundColor: "red",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  height: 100,
                  width: "100%",
                  padding: 20,
                  color: "white"
                }}
                className=""
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row !important",
                    width: "100%"
                  }}
                >
                  <img
                    src="https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    alt=""
                    className=""
                    style={{width: 40, height: 40, borderRadius: 100}}
                  />
                  <div
                    style={{
                      paddingTop: 10,
                      paddingLeft: 10
                    }}
                  >
                    WELCOME TO VARE!
                  </div>
                  {refreshing ? (
                    <div>
                      <img src={loader} style={{width: 70}} />
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{padding: 20}} className="form-side">
                <div className="mb-4 card-title">
                  Please login to get started
                </div>

                <form action="#" className="av-tooltip tooltip-label-bottom">
                  <div className="form-group has-float-label form-group">
                    <label className="">E-mail</label>
                    <input
                      ref={myEmailRef}
                      name="email"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  {userSource != "app" ? (
                    <div className="form-group has-float-label form-group">
                      <label className="">Password</label>
                      <input
                        style={{
                          backgroundColor: "#f2f3f5"
                        }}
                        placeholder={"Password"}
                        ref={myPWRef}
                        name="password"
                        className="form-control"
                        type="password"
                      />
                    </div>
                  ) : null}
                </form>
              </div>
              <div
                style={{
                  // display: "flex",
                  // overflow: "scroll",
                  // right: 70,
                  paddingLeft: 10
                  // position: "absolute",
                  // top: 130
                }}
              >
                <Button
                  style={{
                    color: "white"
                  }}
                  onClick={() => {
                    // setLoginUser("register");
                    // handleLoginUser("register");
                    history.push("/register");
                  }}
                  href={"adminRoot"}
                  color="secondary"
                  className="btn-shadow"
                  size="lg"
                >
                  Register
                </Button>
                <Button
                  style={{
                    marginLeft: 10
                  }}
                  onClick={() => {
                    setRefreshing(true);
                    userSource != "app" ? handleLogin() : loginAppUser();
                  }}
                  href={"adminRoot"}
                  color="primary"
                  className="btn-shadow"
                  size="lg"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Row>
      </div>
      <PageFooter />

      {/*viewLevel == "demography" ? <HeaderFilter /> : null*/}
    </React.Fragment>
  );
};

const styleInfo = {
  wrapPadMyText: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMyText: {
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

const mapStateToProps = (state, ownProps) => {
  const storeData = state;
  // console.log("contentmapStateToProps", state);
  return {
    info: storeData.keyInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHandleQuery: formData => {
      dispatch(handleQuery(formData));
    },
    onLogoutFromView: () => {
      dispatch(logoutFromView());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
