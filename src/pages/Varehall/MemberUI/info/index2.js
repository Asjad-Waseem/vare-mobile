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
  Progress
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import styled from "styled-components";

import io from "socket.io-client";

import Loader from "react-loader-spinner";

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

const Home = ({
  meetingKey,
  user,
  host,
  messages,
  meetingId,
  updateMeetingStatus,
  // attendees,
  height,
  width,
  memberDetails,
  meetingRSVP,
  meetingComments,
  saveMeetingComment,
  meetingCommentUpdate,
  billVotes,
  setUser
}) => {
  // console.log('',)
  // const myRef = useRef(null)
  const myMeetngRef = useRef();
  const [sortedBuildData, setSortedBuildData] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPartyOptions, setPartyOptions] = useState([]);
  const [selectedRaceOptions, setRaceOptions] = useState([]);
  const [selectedAgeOptions, setAgeOptions] = useState([]);

  const [selectedOptionsType, setSelectedOptionsType] = useState([]);

  const [period, setPeriod] = useState(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState("VareHall");
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const [pictures, setPictures] = useState([]);

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

  const [activeFooterNav, setActiveFooterNav] = useState("Home");

  const [navFooterItems, setNavFooterItems] = useState([
    {
      id: 1,
      idnm: "Home",
      navheading: "Home",
      icon: "fas fa-home"
    },
    {
      id: 2,
      idnm: "Comments",
      navheading: "Comments",
      icon: "fas fa-comment"
    },
    {
      id: 3,
      idnm: "Video",
      navheading: "Video",
      icon: "fas fa-video"
    }
    // { id: 4 , idnm : "Meeting", navheading: "Details", icon: 'fas fa-handshake' },
    // { id: 5 , idnm : "Poll", navheading: "Poll", icon: 'fas fa-poll' },
    // { id: 5 , idnm : "Login", navheading: "Login", icon: 'fas fa-poll' }
  ]);

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

  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [viewLevel, setViewLevel] = useState("charts"); //charts,bills,demography
  const [demographyData, setDemographyData] = useState("charts"); //charts,bills,demography

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("logedUser", "");
  const [hostSecret, setHostSecret] = useState("");

  const loginTag = useRef(false);

  const myEmailRef = useRef();
  const myNameRef = useRef();

  // const inViewVideoIndex = useRef(null);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  useEffect(() => {}, []);

  const logout = () => {
    setUser({
      name: "Login",
      user_id: "test@login.com",
      msg: true
    });
    setLogedUser("");
    setStoreUser("");
    setShowLogin(false);
    if (storeUser && storeUser.meeting_key) {
      updateMeetingStatus({
        status: false,
        meeting_id:
          storeUser && storeUser.meeting_id ? storeUser.meeting_id : "",
        member_id: storeUser && storeUser.user_id ? storeUser.user_id : ""
      });
    }
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://meeting.varehall.com/upload/myUpload"
  );

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

  let subtitle = {};
  const [modalIsOpen, setIsOpen] = React.useState(true);

  function openModal() {
    setIsOpen(true);
  }
  //modal start
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const PageFooter = () => {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          zIndex: 999
          // width: 100%,
          // text-align: center;
        }}
        className="toolbar tabbar tabbar-labels toolbar-bottom"
      >
        <div className="toolbar-inner">
          {" "}
          {navFooterItems && navFooterItems.length && navFooterItems.length > 0
            ? navFooterItems.map((res, index) => {
                return (
                  <span
                    onClick={() => {
                      // alert(res.idnm)
                      setActiveFooterNav(res.idnm);
                      setActiveNav(
                        res.idnm == "Home"
                          ? "VareHall"
                          : res.idnm == "Comments"
                          ? "Comments"
                          : res.idnm == "Video"
                          ? "Video"
                          : "VareHall"
                      );
                    }}
                    key={"sjhhggdh" + index}
                    style={{
                      color: activeFooterNav == res.idnm ? "red" : "#cfcfc4"
                    }}
                    href=""
                    className={`tab-link ${
                      activeFooterNav == res.idnm ? "tab-link-active" : null
                    }`}
                  >
                    <i className={`fas ${res.icon}`}> </i>{" "}
                    <span className="tabbar-label"> {res.navheading} </span>{" "}
                  </span>
                );
              })
            : null}
        </div>{" "}
      </div>
    );
  };

  const PageMenu = () => {
    return (
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
                  <div className="right">
                    <a
                      href=""
                      onClick={() => {
                        loginTag.current.scrollIntoView({
                          behavior: "smooth"
                        });
                        if (
                          (storeUser && storeUser.name) ||
                          (logedUser && logedUser.name)
                        ) {
                          setShowLogin(false);
                        } else {
                          setShowLogin(true);
                        }
                      }}
                    >
                      <h4>
                        {" "}
                        {storeUser && storeUser.name
                          ? storeUser.name
                          : logedUser && logedUser.name
                          ? logedUser.name
                          : user && user.name
                          ? user.name
                          : "Jonathan"}{" "}
                      </h4>{" "}
                    </a>{" "}
                    <i
                      ref={loginTag}
                      onClick={() => {
                        if (
                          (storeUser && storeUser.name) ||
                          (logedUser && logedUser.name)
                        ) {
                          setShowLogin(false);
                          logout();
                        } else {
                          setShowLogin(true);
                        }
                      }}
                      className={`fas fa-${
                        storeUser && storeUser.name ? "user-lock" : "unlock-alt"
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
                    />{" "}
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
                                setActiveNav(res.idnm);
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
                    : null}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>{" "}
      </div>
    );
  };

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          paddingTop: 100,
          paddingBottom: 300,
          backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5"
          // height:height,
          // overflowY:'auto',
        }}
      >
        <div
          className="borderSolid"
          style={{
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 99,
            position: "absolute",
            backgroundColor: "#D6DBDF"
          }}
        >
          <PageMenu />

          <div
            // isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            // onRequestClose={closeModal}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 999,
              // backgroundColor: "rgba(0,0,0,.89)",
              height: "100%",
              width: "100%"
            }}
            // contentLabel="Example Modal"
          >
            <div
              className=""
              style={{
                position: "absolute",
                top: "10%",
                zIndex: 99,
                borderWidth: 0,
                paddingLeft: 5,
                display: "flex",
                margin: 15,
                // flexWrap:'wrap',
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  overflowY: "auto",
                  height: 600,
                  width: 300,
                  paddingBottom: 400
                }}
              >
                <div
                  style={{
                    color: "gray",
                    fontSize: 20
                  }}
                >
                  Host Login{" "}
                </div>{" "}
                <input
                  placeholder={"Host Meeting Code (Host)"}
                  ref={myMeetngRef}
                  style={{
                    borderColor: "white",
                    width: "100%",
                    padding: 5,
                    margin: 5
                  }}
                />
                <div
                  style={{
                    color: "gray",
                    fontSize: 20
                  }}
                >
                  Guest Login{" "}
                </div>
                <input
                  placeholder={"Guest Name"}
                  ref={myNameRef}
                  style={{
                    borderColor: "white",
                    width: "100%",
                    padding: 5,
                    margin: 5
                  }}
                />
                <input
                  placeholder={"Guest Email"}
                  ref={myEmailRef}
                  style={{
                    borderColor: "white",
                    width: "100%",
                    padding: 5,
                    margin: 5,
                    marginBottom: 15
                  }}
                />
                <ImageUploader
                  key="image-uploader"
                  withIcon={true}
                  singleImage={true}
                  withPreview={
                    myEmailRef.current && myEmailRef.current.value
                      ? true
                      : false
                  }
                  label="Maximum size file: 5MB"
                  buttonText="Add Avatar Image"
                  onChange={onImage}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={250242880}
                />
                <div
                  className="button"
                  onClick={() => {}}
                  style={{
                    width: "100%",
                    margin: 5,
                    marginBottom: 10
                  }}
                >
                  Submit{" "}
                </div>
                <div
                  onClick={() => setShowLogin(false)}
                  className="button"
                  style={{
                    width: "100%",
                    backgroundColor: "#ff9700",
                    color: "white",
                    margin: 5
                  }}
                >
                  Cancel{" "}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>{" "}
      {/*viewLevel == "demography" ? <HeaderFilter /> : null*/}
      <PageFooter />
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

export default Home;
