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
import RESTCall from "../../../../redux/actions/restApi";
import PageFooter from "./PageFooter";

import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";
import {useHistory} from "react-router-dom";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";

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

import useLocalStorage from "./localStorage";

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");
const loader = require("../../../../assets/images/loading1.gif");

const Register = ({info, onHandleQuery, urlQuery, setLoginUser}) => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [refreshing, setRefreshing] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState("VareHall");

  // const [selectedLike, setSelectedLike] = useState(-1);

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

  const isValidPhone = phoneNumber => {
    var found = phoneNumber.search(
      /^[\+]?\d{2,}?[(]?\d{2,}[)]?[-\s\.]?\d{2,}?[-\s\.]?\d{2,}[-\s\.]?\d{0,9}$/im
    );
    if (found > -1) {
      return true;
    } else {
      return false;
    }
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://media.varehall.com/upload/myUpload"
  );

  const [showLogin, setShowLogin] = useState(false);
  const [viewLevel, setViewLevel] = useState("charts"); //charts,bills,demography

  const loginTag = useRef(false);
  const myNameRef = useRef("");
  const myEmailRef = useRef("");
  const myPhoneRef = useRef("");
  // const myUserIdRef = useRef("");
  const myPWRef = useRef("");
  const myPWVerifyRef = useRef("");

  const fileImageName = useRef("");
  const fileImageData = useRef("");
  const fileImageMime = useRef("");
  // const inViewVideoIndex = useRef(null);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const handleRegister = () => {
    if (
      myNameRef.current.value == "" ||
      myEmailRef.current.value == "" ||
      // myPhoneRef.current.value == "" ||
      myPWVerifyRef.current.value == "" ||
      myPWRef.current.value == "" ||
      isValidPhone(myPhoneRef.current.value) == false ||
      validateEmail(myEmailRef.current.value) == false
    ) {
      alert("Please be sure to complete all fields");
      return;
    } else if (myPWRef.current.value != myPWVerifyRef.current.value) {
      alert("Please make sure Verified PW is the same as PW");
      return;
    }
    addRegister();
  };

  const addRegister = async () => {
    const formData = {
      request: "register",
      query: {
        // user_id: myUserIdRef.current.value,
        email: myEmailRef.current.value,
        // Timestamp: moment().format(),
        // date: moment().format(),
        address: "",
        fullName: myNameRef.current.value,
        phone: myPhoneRef.current.value,
        password: myPWVerifyRef.current.value,
        sex: "",
        party: "",
        age: "",
        race: "",
        installId: "",
        token: "",
        ambassador: "",
        notice: "",
        source: "web"
      },
      resource: "vare_user"
      // check: ["user_id", "video", "img"]
    };

    if (fileImageName.current) {
      const fileName = `tube_${fileImageName.current.toLowerCase()}`;

      const imageUploader = await Axios.post(url, {
        mime: fileImageMime.current,
        name: fileName,
        image: fileImageData.current
      })
        .then(img => {
          formData.query[
            "img"
          ] = `https://varefiles.s3.us-east-2.amazonaws.com/${
            img.data && img.data.key ? img.data.key : fileName
          }`;
          return true;
        })
        .catch(err => {
          return true;
        });
    }
    // if (imageUploader)
    RESTCall.axiosQuery(formData)
      .then(response => {
        // console.log("kkkkdispatch", formData, response);
        // history.push("/login");
        setRefreshing(false);
        // setLoginUser("login");
        history.push("/login");

        // handleRegisterUser
      })
      .catch(error => {
        console.log("error", error);
        return error;
      });
  };

  // const updateRegister = async () => {
  //   const formData = {
  //     request: "register",
  //     query: {
  //       // user_id: myUserIdRef.current.value,
  //       email: myEmailRef.current.value,
  //       address: "",
  //       fullName: myNameRef.current.value,
  //       phone: myPhoneRef.current.value,
  //       password: myPWVerifyRef.current.value,
  //       sex: "",
  //       party: "",
  //       age: "",
  //       race: "",
  //       installId: "",
  //       token: "",
  //       ambassador: "",
  //       notice: "",
  //       source: "web"
  //     },
  //     resource: "vare_user"
  //     // check: ["user_id", "video", "img"]
  //   };
  //
  //   const fileName = `tube_${fileImageName.current.toLowerCase()}`;
  //
  //   const imageUploader = await Axios.post(url, {
  //     mime: fileImageMime.current,
  //     name: fileName,
  //     image: fileImageData.current
  //   })
  //     .then(img => {
  //       formData.query["img"] = `https://varefiles.s3.us-east-2.amazonaws.com/${
  //         img.data && img.data.key ? img.data.key : fileName
  //       }`;
  //       return true;
  //     })
  //     .catch(err => {
  //       return true;
  //     });
  //
  //   if (imageUploader)
  //     RESTCall.axiosQuery(formData)
  //       .then(response => {
  //         // console.log("kkkkdispatch", formData, response);
  //         setRefreshing(false);
  //         setLoginUser("login");
  //         // history.push("/login");
  //       })
  //       .catch(error => {
  //         console.log("error", error);
  //         return error;
  //       });
  // };

  const onImageFile = async (failedImages, successImages) => {
    if (!url) {
      setErrorMessage("missing a url to upload to");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");
    try {
      const name =
        successImages[0].split(";") &&
        successImages[0].split(";")[1] &&
        successImages[0].split(";")[1].split("=") &&
        successImages[0].split(";")[1].split("=")[1] &&
        successImages[0].split(";")[1].split("=")[1];
      const imageString = await resizeImage(successImages, 200, 200);
      const image =
        name && (name.includes(".png") || name.includes(".jpg"))
          ? await [imageString]
          : successImages;

      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];

      fileImageName.current = name;
      fileImageData.current = image[0];
      fileImageMime.current = mime;
      setProgress("uploaded");
    } catch (error) {
      console.log("error in upload", error);
      setErrorMessage(error.message);
      setProgress("uploadError");
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

  const logout = () => {};

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
                // width: "100%",
                marginRight: 25,
                marginLeft: 25,
                backgroundColor: "white",
                borderRadius: 5,
                paddingBottom: 20
                // height: 400
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
                {" "}
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
                    className=""
                  >
                    REGISTER YOUR ACCOUNT
                  </div>
                  {refreshing ? (
                    <div>
                      <img src={loader} style={{width: 70}} />
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                style={{
                  // height: 200,
                  // overflowY: "auto",
                  padding: 20
                }}
                className="form-side"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: 8
                  }}
                >
                  <div
                    style={{
                      marginRight: 10
                    }}
                    className="mb-4 card-title"
                  >
                    Please register varehall user profile.
                  </div>
                </div>
                <form action="#" className="av-tooltip tooltip-label-bottom">
                  <div className="form-group has-float-label form-group">
                    <label className="">Full Name</label>
                    <input
                      ref={myNameRef}
                      name="name"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  <div className="form-group has-float-label form-group">
                    <label className="">E-mail</label>
                    <input
                      ref={myEmailRef}
                      name="email"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  <div className="form-group has-float-label form-group">
                    <label className="">Phone#</label>
                    <input
                      ref={myPhoneRef}
                      name="phone"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  {/*<div className="form-group has-float-label form-group">
                    <label className="">Profile Picture</label>
                    <ImageUploader
                      key="image-uploader"
                      withIcon={true}
                      singleImage={true}
                      withPreview={true}
                      label="Maximum size file: 5MB"
                      buttonText="Add Avatar Image"
                      onChange={onImageFile}
                      imgExtension={[
                        ".jpg",
                        ".gif",
                        ".png",
                        ".gif",
                        "mp3",
                        "mp4"
                      ]}
                      maxFileSize={250242880}
                    />
                  </div>*/}
                  {/*<div className="form-group has-float-label form-group">
                      <label className="">User Name</label>
                      <input
                        ref={myUserIdRef}
                        name="user_id"
                        className="form-control"
                        // placeholder="demo@gogo.com"
                      />
                    </div>*/}
                  <div className="form-group has-float-label form-group">
                    <label className="">Password</label>
                    <input
                      ref={myPWRef}
                      name="password"
                      className="form-control"
                      // type="password"
                    />
                  </div>
                  <div className="form-group has-float-label form-group">
                    <label className="">Verify Password</label>
                    <input
                      ref={myPWVerifyRef}
                      name="password_verify"
                      className="form-control"
                      // type="password"
                    />
                  </div>
                  <div
                    style={
                      {
                        // display: "flex",
                        // right: 70,
                        // position: "absolute",
                        // top: 330
                      }
                    }
                  >
                    <Button
                      style={{
                        color: "white"
                      }}
                      onClick={() => {
                        // setLoginUser("login");
                        history.push("/login");
                      }}
                      href={"adminRoot"}
                      color="secondary"
                      className="btn-shadow"
                      size="lg"
                    >
                      Login
                    </Button>
                    <Button
                      style={{
                        marginLeft: 10
                      }}
                      onClick={() => {
                        setRefreshing(true);
                        handleRegister();
                      }}
                      href={"adminRoot"}
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
