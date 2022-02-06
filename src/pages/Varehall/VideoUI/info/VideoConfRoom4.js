import React, {Fragment, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import queryString from "query-string";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import {Row, Col, Card, CardBody} from "reactstrap";
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import CommentsModal from "./CommentsModal";
import UserProfile from "./UserProfile";
import ActiveUserProfile from "./ActiveUserProfile";
import {groupBy, getDatePeriod} from "../../helpers";
import {v4 as uuidv4} from "uuid";
import LoginUI from "./login";
import RegisterUI from "./Register";
import Profile from "./Profile";
import Notice from "./Notice";
import PodcastModal from "./PodcastModal";
import NewsModal from "./NewsModal";
import VideoModal from "./VideoModal";
import MeetingModal from "./MeetingModal";

import ScheduleModal from "./ScheduleModal";

import PageModal from "./PageModal";
import useLocalStorage from "./localStorage";

import InfiniteScroll from "react-infinite-scroll-component";
import cookie from "react-cookies";
import {transitions, positions, Provider as AlertProvider} from "react-alert";

import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import ScrollMenu from "react-horizontal-scrolling-menu";
import VideoControls from "./VideoControls";
import Draggable from "react-draggable-component";
import LiveChats from "./LiveChats";
import addDefaultSrc from "./addDefaultSrc";
import ReactPlayer from "react-player";

import UserAvatar from "react-user-avatar";
import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";
import RESTCall from "../../../../redux/actions/restApi";
import Modal from "react-modal";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const pics5 = require("../../../../assets/images/05.jpg");

const myURL = window.location.href.includes("localhost")
  ? "http://localhost:5000"
  : "/";

// const myURL = "https://media.varehall.com";

// const myURL = window.location.href.includes("localhost")
//   ? "http://localhost:5000"
//   : "https://media.varehall.com";

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  width: 90%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  /* flexDirection:'row', */
  height: 100%;
  width: 100%;
`;

const Video = props => {
  const {
    displayVideo,
    setDisplayVideo,
    name,
    audioStatus,
    bgImage,
    guestVideoStatus
  } = props;
  const ref = useRef();
  const refData = useRef();

  useEffect(() => {
    // console.log("bgImage", bgImage);
  }, []);

  useEffect(() => {
    props.peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div
      onClick={() => {
        // alert(22);
        setDisplayVideo(
          displayVideo
            ? ""
            : {
                stream: ref,
                name: name
              }
        );
      }}
      style={{
        margin: 3
      }}
    >
      <StyledVideo
        playsInline
        // controls
        ref={ref}
        autoPlay
        poster={`https://varefiles.s3.us-east-2.amazonaws.com/meeting1.jpg`}
      />
    </div>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

const VideoConfRoom = () => {
  const history = useHistory();

  const [propsParam, setPropsParam] = useState({});
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);

  const [user, setUser] = useState(
    window.localStorage && window.localStorage.user
      ? JSON.parse(window.localStorage.user)
      : {
          name: "Guest",
          user_id: "test@login.com",
          msg: true
        }
  );
  const [meetingId, setMeetingId] = useState("");
  const [host, sethost] = useState("");
  const [meetingKeyId, setMeetingKeyId] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetingRSVP, setMetingRSVP] = useState([]);
  const [activeUser, setActiveUser] = useState("");
  const [urlQuery, setUrlQuery] = useState({});
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [sharedVideo, setSharedVideo] = useState(false);

  const [audioPeerSatus, setAudioPeerSatus] = useState([]);
  const [videoPeerSatus, setVideoPeerSatus] = useState([]);

  const [displayVideo, setDisplayVideo] = useState("");

  const [fullView, setFullView] = useState(false);

  const [loginUser, setLoginUser] = useLocalStorage("");
  const [registerUser, setRegisterUser] = useState(false);

  const [inViewVideoIndex, setInViewVideoIndex] = useState(0);
  const [peers, setPeers] = useState([]);
  const [guestUsers, setGuestUsers] = useState([]);
  const [peerUsers, setPeerUsers] = useState([]);
  const [videoStarted, setVideoStarted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [replyId, setReplyId] = useState("");
  const [replyArray, setReplyArray] = useState("");

  const [msg, setMsg] = useState([
    {
      date: "1/22/20",
      name: "Guest User6",
      user_id: "test@test6.com",
      comment: "Looking fwd to using this platform",
      emoji: "fa-heart"
    },
    {
      date: "1/22/20",
      name: "Guest User4",
      user_id: "test@test4.com",
      comment: "Awsome idea.. Very timely!",
      emoji: "fa-heart"
    },
    {
      date: "1/22/20",
      name: "Guest User3",
      user_id: "test@test3.com",
      comment: "Good job!"
    }
  ]);
  const [guestUsersIndex, setGuestUsersIndex] = useState([]);

  const pathurl = useRef(history.location);
  useEffect(() => {
    if (loginUser == "login") {
      history.push("/login");
    }
    console.log("loginUser", loginUser);
  }, [loginUser]);

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    console.log("INFO", pathurl.current.pathname);
    if (
      !cookie.load("vare") &&
      query &&
      query.app &&
      query.id &&
      pathurl.current.pathname.includes("podcast") &&
      query.app.toLowerCase() == "vare"
    ) {
      setLoginUser("login");
    }
    if (query && query.id && pathurl.current.pathname.length == 1) {
      setLoginUser("/");
    } else if (pathurl.current.pathname.length > 1) {
      setLoginUser(pathurl.current.pathname.split("/")[1]);
    }
  }, [pathurl.current]);

  return (
    <Fragment>
      <PageMenu
        setLoginUser={setLoginUser}
        loginUser={loginUser}
        // handleRegisterUser={info => {
        //   setRegisterUser(info);
        // }}
      />

      {loginUser && loginUser == "login" ? (
        <LoginUI setLoginUser={setLoginUser} urlQuery={urlQuery} />
      ) : loginUser && loginUser == "register" ? (
        <RegisterUI setLoginUser={setLoginUser} urlQuery={urlQuery} />
      ) : loginUser && loginUser == "profile" && cookie.load("vare") ? (
        <Profile setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : loginUser && loginUser == "notice" && cookie.load("vare") ? (
        <Notice setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : loginUser && loginUser == "schedule" ? (
        <ScheduleModal setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : loginUser && loginUser == "meeting" ? (
        <MeetingModal
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setLoginUser={setLoginUser}
          loginUser={loginUser}
        />
      ) : loginUser && loginUser == "news" ? (
        <NewsModal
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setLoginUser={setLoginUser}
          loginUser={loginUser}
        />
      ) : (
        <PodcastModal
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setLoginUser={setLoginUser}
          loginUser={loginUser}
        />
      )}

      <PageFooter setLoginUser={setLoginUser} loginUser={loginUser} />
    </Fragment>
  );
};

// export default VideoConfRoom;
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoConfRoom);
