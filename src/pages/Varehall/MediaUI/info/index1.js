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
  FormGroup
} from "reactstrap";
import {AvForm, AvField} from "availity-reactstrap-validation";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {useLocation, Link} from "react-router-dom";
import {ExternalLink} from "react-external-link";
import addDefaultSrc from "./addDefaultSrc";

import ReactDOM from "react-dom";
import Modal from "react-modal";

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
import Doughnut from "../../mycomponents/charts/Doughnut";

//Import Section Title
import UserProfile from "./UserProfile";
import ActiveUserProfile from "./ActiveUserProfile";
import DataListItem from "./DataListItem";
import SummaryDetailCard from "./SummaryDetailCard";
import CommentsMobile from "./CommentsMobile";
import VideoConfRoom from "./VideoConfRoom";
import ImageUploader from "react-images-upload";
import Axios from "axios";

import useLocalStorage from "./localStorage";

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

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
  meetingDetails,
  meetingRSVP,
  meetingComments,
  saveMeetingComment,
  meetingCommentUpdate,
  billVotes
}) => {
  // console.log('',)
  // const myRef = useRef(null)
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

  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("logedUser", "");
  const [hostSecret, setHostSecret] = useState("");

  // console.log('storeUser',storeUser)
  const [comments, setComments] = useState([
    {
      avatarUrl: "images/author.jpg",
      authorUrl: "string",
      fullName: "string",
      createdAt: new Date(),
      text: "string"
    }
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [guestUsers, setGuestUsers] = useState([]);

  let eventCalendar = {
    title: "Sample Event",
    description: "This is the sample event provided as an example only",
    location: "Portland, OR",
    startTime: "2016-09-16T20:15:00-04:00",
    endTime: "2016-09-16T21:45:00-04:00"
  };

  const videoTag = useRef(false);
  const meetingTag = useRef(false);
  const pollTag = useRef(false);
  const homeTag = useRef(false);
  const loginTag = useRef(false);
  const calendar = useRef(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myMeetngRef = useRef();

  // const inViewVideoIndex = useRef(null);
  const [inViewVideoIndex, setInViewVideoIndex] = useState(null);

  useEffect(() => {
    // console.log(inViewVideoIndex);
  }, [inViewVideoIndex]);

  // const dataInfo = info;
  // const meetingId = useRef();
  // billVotes
  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const result = billVotes && groupBy(billVotes, "vote");
  // console.log("result", result);

  const doughnutChartData = result
    ? {
        labels: ["Support", "Reject", "No Vote"],
        datasets: [
          {
            label: "",
            color: ["white", "white", "white"],
            borderColor: ["gray", "gray", "gray"],
            backgroundColor: ["green", "#FA8072", "#2096F3"],
            borderWidth: 2,
            data: [
              result["yes"] ? result["yes"].length : 0,
              result["no"] ? result["no"].length : 0,
              result["vote"] ? result["vote"].length : 0
            ]
          }
        ]
      }
    : null;
  const meetingDetail = meetingDetails && meetingDetails[0];
  const eventDetail = {
    title:
      meetingDetail && meetingDetail.bill_id
        ? "Discuss Bill " + meetingDetail.bill_id
        : "Discuss Upcoming Bill",
    createDate:
      meetingDetail && meetingDetail.publishedAt
        ? meetingDetail.publishedAt
        : "2020-06-01",
    status: "Introduced",
    bill_id:
      meetingDetail && meetingDetail.bill_id
        ? meetingDetail.bill_id
        : "H.R. 7994",
    labelColor: "#4F6577",
    label: "Townhall",
    check: true,
    eventCalendar: {
      title: "Sample Event",
      description:
        meetingDetail && meetingDetail.description
          ? meetingDetail.description
          : "This is the sample event provided as an example only",
      location: "Zoom",
      startTime:
        meetingDetail && meetingDetail.publishedAt
          ? meetingDetail.publishedAt
          : "2016-09-16T20:15:00-04:00",
      endTime: ""
    }
  };

  // useEffect(() => {
  // if(meetingKey && meetingDetail && meetingDetail.meeting_key == meetingKey){

  const myMeetngStatus = useRef(null);
  myMeetngStatus.current =
    meetingKey && meetingDetail && meetingDetail.meeting_key == meetingKey;
  // console.log('xxstoreUser',myMeetngStatus.current)

  useEffect(() => {
    if (myMeetngStatus.current) {
      updateMeetingStatus({
        status: true,
        meeting_id: meetingDetail.meeting_id,
        member_id: meetingDetail.member_id
      });
      setLogedUser({
        name: meetingDetail.author,
        email: meetingDetail.member_id,
        user_id: meetingDetail.member_id,
        meeting_id: meetingDetail.meeting_id
      });
      setStoreUser({
        name: meetingDetail.author,
        email: meetingDetail.member_id,
        user_id: meetingDetail.member_id,
        meeting_id: meetingDetail.meeting_id
      });
    }
  }, []);

  const logout = () => {
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

  // const onUrlChange = e => {
  //     setImageURL(e.target.value);
  // };

  const onImage = async (failedImages, successImages) => {
    // console.log("xxx");
    if (!url) {
      // console.log("missing Url");
      setErrorMessage("missing a url to upload to");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");
    try {
      // console.log('successImages',successImages)
      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];
      const name = parts[1].split("=")[1];
      const data = parts[2];
      const res = await Axios.post(url, {
        mime,
        name,
        image: successImages[0]
      });
      // const res = await postInfo(url, { mime, name, image: data })
      // console.log('res',res)

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
  //modal end

  // const addDefaultSrc = (ev) => {
  //   ev.target.src = "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
  // }

  // console.log('callAccepted',callAccepted)
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
                    src={"https://varefiles.s3.us-east-2.amazonaws.com/icon.png"}
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
          paddingTop: 50,
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

          {showLogin ? (
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
                backgroundColor: "rgba(0,0,0,.89)",
                height: "100%",
                width: "100%"
              }}
              // contentLabel="Example Modal"
            >
              <div
                className=""
                style={{
                  position: "absolute",
                  top: "25%",
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
                      color: "white",
                      fontSize: 20
                    }}
                  >
                    Host Login{" "}
                  </div>{" "}
                  <input
                    placeholder={"Host Meeting Code (Host)"}
                    ref={myMeetngRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5
                    }}
                  />
                  <div
                    style={{
                      color: "white",
                      fontSize: 20
                    }}
                  >
                    Guest Login{" "}
                  </div>
                  <input
                    placeholder={"Guest Name"}
                    ref={myNameRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5
                    }}
                  />
                  <input
                    placeholder={"Guest Email"}
                    ref={myEmailRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5,
                      marginBottom: 15
                    }}
                  />
                  <div
                    className="button"
                    onClick={() => {
                      if (
                        myMeetngRef &&
                        meetingDetail &&
                        meetingDetail.meeting_key &&
                        myMeetngRef.current &&
                        myMeetngRef.current.value.toLowerCase() ==
                          meetingDetail.meeting_key.toLowerCase()
                      ) {
                        setLogedUser({
                          name: meetingDetail.author,
                          email: meetingDetail.member_id,
                          user_id: meetingDetail.member_id,
                          meeting_id: meetingDetail.meeting_id
                        });
                        setStoreUser({
                          name: meetingDetail.author,
                          email: meetingDetail.member_id,
                          user_id: meetingDetail.member_id,
                          meeting_id: meetingDetail.meeting_id
                        });
                        setShowLogin(false);
                        updateMeetingStatus({
                          status: true,
                          meeting_id: meetingDetail.meeting_id,
                          member_id: meetingDetail && meetingDetail.member_id
                        });
                      } else if (
                        myNameRef &&
                        myNameRef.current &&
                        myNameRef.current.value != "" &&
                        myEmailRef &&
                        myEmailRef.current &&
                        myEmailRef.current.value != ""
                      ) {
                        setLogedUser({
                          name:
                            myNameRef &&
                            myNameRef.current &&
                            myNameRef.current.value,
                          email:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          user_id:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          member_id: meetingDetail && meetingDetail.member_id
                        });
                        setStoreUser({
                          name:
                            myNameRef &&
                            myNameRef.current &&
                            myNameRef.current.value,
                          email:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          user_id:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          member_id: meetingDetail && meetingDetail.member_id
                        });
                        setShowLogin(false);
                      } else {
                        alert("All fields must be completed.");
                      }
                    }}
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
                  {showLogin ? (
                    <ImageUploader
                      key="image-uploader"
                      withIcon={true}
                      singleImage={true}
                      withPreview={true}
                      label="Maximum size file: 5MB"
                      buttonText="Choose an image"
                      onChange={onImage}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={250242880}
                    />
                  ) : null}
                </div>
              </div>{" "}
            </div>
          ) : null}
        </div>{" "}
        <PageFooter />
        <Container>
          <Row className="mt-4">
            {/*<div style={{
                        borderWidth:0,
                        paddingLeft:20,
                        display:'flex',
                        flexDirection:'row',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingRight:20
                        }}  className="fb-login-button"
                            data-width=""
                            data-size="small"
                            data-button-type="continue_with"
                            data-layout="default"
                            data-auto-logout-link="false"
                            data-use-continue-as="false">
                        </div>
                      </div>*/}
            {activeNav == "Comments" ? (
              <Col lg={12} sm={12}>
                <Col className={"commenstField mb-3"}>
                  <CommentsMobile
                    meetingComments={meetingComments}
                    meetingRSVP={meetingRSVP}
                    meetingDetails={meetingDetails}
                    host={host}
                    user={
                      storeUser && storeUser.name
                        ? storeUser
                        : logedUser && logedUser.name
                        ? logedUser
                        : user
                    }
                    saveMeetingComment={saveMeetingComment}
                    meetingCommentUpdate={meetingCommentUpdate}
                    setActiveUser={setActiveUser}
                    // selectedLike={selectedLike}
                    // setSelectedLike={setSelectedLike}
                    messages={messages}
                    meetingId={meetingId}
                    // attendees={attendees}
                    activeUser={activeUser}
                  />{" "}
                </Col>{" "}
              </Col>
            ) : activeNav == "Video" ? (
              <Col lg={12} sm={12}>
                <Col className={"commenstField mb-3"}>
                  <ActiveUserProfile
                    setInViewVideoIndex={e => {
                      setInViewVideoIndex(e);
                    }}
                    inViewVideoIndex={inViewVideoIndex}
                    guestUsers={guestUsers}
                    user={
                      storeUser && storeUser.name
                        ? storeUser
                        : logedUser && logedUser.name
                        ? logedUser
                        : user
                    }
                    host={host}
                    meetingId={meetingId}
                    setActiveUser={setActiveUser}
                    meetingComments={meetingComments}
                    meetingRSVP={meetingRSVP}
                    meetingDetails={meetingDetails}
                    // attendees={attendees}
                    callAccepted={callAccepted}
                    stream={stream}
                    yourID={yourID}
                  />

                  {!isMobile ? (
                    <Col
                      sm={12}
                      lg={12}
                      style={{
                        left: 0,
                        width: "100%",
                        paddingBottom: 100
                      }}
                    >
                      <div>
                        <VideoConfRoom
                          setInViewVideoIndex={e => {
                            setInViewVideoIndex(e);
                          }}
                          inViewVideoIndex={inViewVideoIndex}
                          latestGuestUsersIndex={e => {
                            // console.log("zzguestUsersIndex", e);
                            setGuestUsers(e);
                          }}
                          meetingDetail={meetingDetail}
                          meetingId={meetingId}
                          saveMeetingComment={saveMeetingComment}
                          user={
                            storeUser && storeUser.name
                              ? storeUser
                              : logedUser && logedUser.name
                              ? logedUser
                              : user
                          }
                          host={host}
                          initialVideoStatus={initialVideoStatus}
                          roomID={meetingId}
                          activeUser={host.user_id}
                        />{" "}
                      </div>{" "}
                    </Col>
                  ) : (
                    <div
                      style={{
                        left: 0,
                        width: "100%",
                        paddingBottom: 100
                      }}
                    >
                      <VideoConfRoom
                        setInViewVideoIndex={e => {
                          setInViewVideoIndex(e);
                        }}
                        inViewVideoIndex={inViewVideoIndex}
                        latestGuestUsersIndex={e => {
                          setGuestUsers(e);
                        }}
                        meetingId={meetingId}
                        saveMeetingComment={saveMeetingComment}
                        user={
                          storeUser && storeUser.name
                            ? storeUser
                            : logedUser && logedUser.name
                            ? logedUser
                            : user
                        }
                        host={host}
                        initialVideoStatus={initialVideoStatus}
                        roomID={meetingId}
                        activeUser={host.user_id}
                      />{" "}
                    </div>
                  )}
                </Col>{" "}
              </Col>
            ) : meetingDetail && meetingDetail.publishedAt ? (
              <Col lg={12} sm={12}>
                <div
                  lg={12}
                  sm={12}
                  style={{
                    width: "100%"
                  }}
                  ref={homeTag}
                >
                  <Card
                    style={{
                      padding: 20,
                      display: "flex",
                      overflowY: "auto",
                      height: isMobile ? "100%" : 220,
                      backgroundColor: "rgba(0,0,0,.79)"
                    }}
                  >
                    <video
                      // height={isMobile ? '100%' : 220}
                      autoPlay
                      loop="loop"
                      muted="muted"
                      volume="0"
                    >
                      <source
                        src={require("../../../../assets/images/video2.mp4")}
                        type="video/mp4"
                      />
                      <source src="movie.ogg" type="video/ogg" />
                      Your browser does not support the video tag.{" "}
                    </video>{" "}
                    <div
                      style={{
                        color: "white",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        padding: 30,
                        fontSize: 14,
                        backgroundColor: "rgba(0,0,0,.79)"
                      }}
                    >
                      <p> Hello, </p>{" "}
                      {meetingDetail && meetingDetail.description ? (
                        <p>
                          {" "}
                          {meetingDetail.author}
                          is inviting you to a Townhall / VareHall meeting.{" "}
                        </p>
                      ) : null}{" "}
                      <p>
                        {" "}
                        {meetingDetail.description}
                        This Varehall meeting is your opportunity to influence
                        your Representative by taking a stance on their actions
                        or inactions concerning legislations that affect you.{" "}
                      </p>{" "}
                      <p> </p>{" "}
                    </div>{" "}
                  </Card>{" "}
                </div>

                <UserProfile
                  user={
                    storeUser && storeUser.name
                      ? storeUser
                      : logedUser && logedUser.name
                      ? logedUser
                      : user
                  }
                  host={host}
                  meetingId={meetingId}
                  setActiveUser={setActiveUser}
                  meetingComments={meetingComments}
                  meetingRSVP={meetingRSVP}
                  meetingDetails={meetingDetails}
                  // attendees={attendees}
                  callAccepted={callAccepted}
                  stream={stream}
                  yourID={yourID}
                />

                <div
                  style={{
                    paddingBottom: 50
                  }}
                >
                  <Fragment>
                    {showCalendar ? (
                      <div
                        // ref={calendar}
                        style={{
                          height: 40
                        }}
                        className={"d-flex flex-row mt-3"}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            // justifyContent: 'space-between',
                            paddingLeft: 30
                            // paddingRight:30,
                            // width:'80%'
                          }}
                        >
                          <div
                            className="button"
                            onClick={() => {
                              // console.log('sss',meetingDetail && meetingDetail != null && meetingDetail.publishedAt ? meetingDetail.publishedAt.replace(/[&-\/\\#,+()$~%. '":*?<>{}]/g,'') : '')
                              const detail = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${"Bithday"}&dates=${
                                meetingDetail &&
                                meetingDetail != null &&
                                meetingDetail.publishedAt
                                  ? meetingDetail.publishedAt.replace(
                                      /[&-\/\\#,+()$~%. '":*?<>{}]/g,
                                      ""
                                    ) + "/20201231T223000Z"
                                  : "20220120T135850250Z/20201231T223000Z"
                              }&details=${
                                meetingDetail && meetingDetail != null
                                  ? meetingDetail.description.toString()
                                  : "Meeting Invitation"
                              }&location=${window.location}`;
                              window.open(detail) && setShowCalendar(false);
                              //https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bithday&dates=20201231T193000Z/20201231T223000Z&details=With%20clowns%20and%20stuff&location=North%20Pole
                            }}
                          >
                            {" "}
                            Google{" "}
                          </div>{" "}
                          <div
                            style={{
                              marginLeft: 10
                            }}
                            className="button"
                            onClick={() => {
                              const detail = `http://calendar.live.com/calendar/calendar.aspx?rru=addevent&dtstart=${
                                meetingDetail &&
                                meetingDetail != null &&
                                meetingDetail.publishedAt
                                  ? meetingDetail.publishedAt
                                  : ""
                              }&dtend=&summary=${
                                meetingDetail && meetingDetail != null
                                  ? meetingDetail.description.toString()
                                  : "Meeting Invitation"
                              }&location=${window.location}`;
                              window.open(detail) && setShowCalendar(false);
                              //http://calendar.live.com/calendar/calendar.aspx?rru=addevent&dtstart=2015-12-07T20:00:00+00:00&dtend=2015-12-07T22:00:00+00:00&summary=Weekly Planning&location=BigCoHQ
                            }}
                          >
                            {" "}
                            Outlook{" "}
                          </div>{" "}
                          {/*<div style={{marginLeft:10}} className="button" onClick={()=>{
                                       window.open("https://calendar.yahoo.com/?v=60&amp;view=d&amp;type=20&amp;title=Sample%20Event&amp;st=20160917T001500Z&amp;dur=NaNInvalid date&amp;desc=This%20is%20the%20sample%20event%20provided%20as%20an%20example%20only&amp;in_loc=Zoom")
                                       && setShowCalendar(false)
                                     }} >Yahoo</div>*/}{" "}
                        </div>{" "}
                      </div>
                    ) : null}
                    <DataListItem
                      meetingDetail={meetingDetail}
                      item={eventDetail ? eventDetail : {}}
                      handleCheckChange={() => {
                        // alert(6)
                      }}
                      isSelected={false}
                      handleShowCalendars={() => {
                        if (meetingDetail && meetingDetail != null) {
                          setShowCalendar(!showCalendar);
                          // calendar.current.scrollIntoView({ behavior: 'smooth' })
                        } else {
                          alert(
                            "Invalid meeting link.  Please contact the meeting organizer for the correct link."
                          );
                        }
                      }}
                    />
                    <div
                      style={{
                        width: "100%"
                      }}
                      ref={pollTag}
                    >
                      <Card className="card">
                        <div className="">
                          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                            <div className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
                              <span
                                style={{
                                  color: "red"
                                }}
                                className="align-middle d-inline-block"
                              >
                                {" "}
                                {"Vare Polling Results:"}{" "}
                              </span>{" "}
                            </div>{" "}
                            {doughnutChartData ? (
                              <Colxx className={""}>
                                <Doughnut data={doughnutChartData} />{" "}
                              </Colxx>
                            ) : null}{" "}
                          </CardBody>{" "}
                        </div>{" "}
                      </Card>{" "}
                    </div>
                    <div ref={meetingTag}>
                      <SummaryDetailCard
                        survey={meetingDetails}
                        handleCheckChange={() => {}}
                        isSelected={false}
                      />{" "}
                    </div>{" "}
                  </Fragment>{" "}
                </div>
              </Col>
            ) : (
              <Col>
                {" "}
                <div
                  lg={12}
                  sm={12}
                  style={{
                    width: "100%"
                  }}
                  ref={homeTag}
                >
                  <Card
                    style={{
                      padding: 20,
                      display: "flex",
                      overflowY: "auto",
                      height: isMobile ? "100%" : 220,
                      backgroundColor: "rgba(0,0,0,.79)"
                    }}
                  >
                    <video
                      // height={isMobile ? '100%' : 220}
                      autoPlay
                      loop="loop"
                      muted="muted"
                      volume="0"
                    >
                      <source
                        src={require("../../../../assets/images/video2.mp4")}
                        type="video/mp4"
                      />
                      <source src="movie.ogg" type="video/ogg" />
                      Your browser does not support the video tag.{" "}
                    </video>{" "}
                    <div
                      style={{
                        color: "white",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        padding: 30,
                        fontSize: 14,
                        backgroundColor: "rgba(0,0,0,.79)"
                      }}
                    >
                      <p> Hello, </p>{" "}
                      <p>
                        {" "}
                        Welcome to VareHall meeting center. Please download the
                        Android or IOS Vare App to your device to join a meeting
                        or request your meeting link from your host.{" "}
                      </p>{" "}
                      <p></p>
                    </div>{" "}
                  </Card>{" "}
                </div>{" "}
              </Col>
            )}{" "}
          </Row>{" "}
        </Container>{" "}
      </div>{" "}
      {meetingDetail && meetingDetail.publishedAt ? null : (
        <div
          style={{
            paddingTop: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <span
            style={{
              color: "gray",
              fontSize: 15,
              fontWeight: "bold"
            }}
          >
            {" "}
            {!meetingId
              ? "This URL has no active meeting"
              : "Loading Meeting Details..."}
          </span>
          <Loader
            type="Bars"
            color="#00BFFF"
            height={100}
            width={100}
            // timeout={3000} //3 secs
          />
        </div>
      )}
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
