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
import UserAvatar from "react-user-avatar";
import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";
import CommentsMobile from "./CommentsMobile";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import {useHistory} from "react-router-dom";
import cookie from "react-cookies";
import {confirmAlert} from "react-confirm-alert"; // Import

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import "../../../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

import io from "socket.io-client";

import Loader from "react-loader-spinner";

import {Browserdiv, Mobilediv, isBrowser, isMobile} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

// import {Slide} from "react-slideshow-image";
// import "react-slideshow-image/dist/styles.css";

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");
const StyledVideo = styled.video`
  /* flexDirection:'row', */
  height: 50%;
  width: 45%;
`;

const slideImages = [
  "images/slide_2.jpg",
  "images/slide_3.jpg",
  "images/slide_4.jpg"
];

const PageMenu = ({setLoginUser, height, width, setUser, details}) => {
  const history = useHistory();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useLocalStorage("VareHall");
  // const storeUser = useRef({
  //   user:
  //     window.localStorage && window.localStorage.user
  //       ? JSON.parse(window.localStorage.user)
  //       : ""
  // });
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [inViewVideoIndex, setInViewVideoIndex] = useState(null);
  const [guestUsers, setGuestUsers] = useState([]);
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
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
  const [activeUser, setActiveUser] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
  const [playIndex, setPlayIndex] = useState(-1);

  const [viewLevel, setdivLevel] = useState("charts"); //charts,bills,demography

  const [hostSecret, setHostSecret] = useState("");
  const [logedStatus, setLogedStatus] = useState(false); //&& storeUser && storeUser.current.name

  const loginTag = useRef(false);

  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myPWRef = useRef();

  // const indivVideoIndex = useRef(null);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const logout = () => {
    setStoreUser("");
    setLogedStatus(false);
    cookie.remove("vare", {path: "/"});
    alert("You are about to logout");
    window.location.reload();
    // history.push("/login");
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://meeting.varehall.com/upload/myUpload"
  );

  useEffect(() => {
    // console.log("kkkkkk", storeUser);
  }, [storeUser]);

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

  useEffect(() => {
    // console.log("xxxx33", storeUser);
    if (cookie.load("vare")) {
      setLogedStatus(true);
    } else {
      setLogedStatus(false);
      setStoreUser("");
    }
  }, []);

  return (
    <div
      className="borderSolid"
      style={{
        position: "fixed",
        width: "100%",
        height: 50,
        top: 0,
        zIndex: 9999,
        // position: "absolute",
        backgroundColor: "#D6DBDF"
      }}
    >
      <div
        style={{
          height: 10
        }}
        className="navbar navbar-home"
      >
        <div className="navbar-inner">
          <div className="subnavbar">
            <div className="subnavbar-inner">
              <div className="toolbar tabbar tabbar-scrollable toolbar-category">
                <div className="toolbar-inner">
                  <div
                    className="right"
                    onClick={() => {
                      if (storeUser && storeUser && storeUser.token) {
                        if (
                          window.confirm("Are you sure you want to logout?")
                        ) {
                          logout();
                        } else {
                          // Do nothing!
                          // console.log("Thing was not saved to the database.");
                        }
                      } else {
                        history.push("/login");

                        // setLoginUser("login");
                      }
                    }}
                  >
                    <a href="">
                      <h4>
                        {" "}
                        {storeUser && storeUser.fullName && storeUser.token
                          ? storeUser.fullName
                          : storeUser && storeUser.name && storeUser.token
                          ? storeUser.name
                          : "Login"}
                      </h4>{" "}
                    </a>{" "}
                    {storeUser && storeUser && storeUser.img ? (
                      <img
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 100
                        }}
                        // onError={(e)=>addDefaultSrc(e)}
                        src={storeUser && storeUser.img}
                        alt=""
                      />
                    ) : (
                      <i
                        ref={loginTag}
                        className={`fas fa-${
                          logedStatus ? "user-lock" : "unlock-alt"
                        }`}
                        style={{
                          marginLeft: 5,
                          width: 40,
                          height: 40,
                          backgroundColor: "#FA8072",
                          borderRadius: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      />
                    )}{" "}
                  </div>{" "}
                  <img
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100
                    }}
                    // onError={(e)=>addDefaultSrc(e)}
                    src={
                      "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    }
                    alt=""
                  />
                  {navItems && navItems.length && navItems.length > 0
                    ? navItems.map((res, index) => {
                        return (
                          <span
                            key={"sjdh" + index}
                            onClick={() => {
                              if (
                                res.idnm == "Comments" ||
                                res.idnm == "VareHall"
                              ) {
                                window.open("https://varehall.com/", "_self");
                              } else {
                                window.open(res.idnm);
                              }
                            }}
                            href="#"
                            className={`tab-link ${activeNav == res.idnm &&
                              "tab-link-active"}`}
                          >
                            {/*<i className={`fas fa-user-lock`}></i>*/}{" "}
                            {res.navheading}{" "}
                          </span>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styleInfo = {
  wrapPadMydiv: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMydiv: {
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

export default PageMenu;
