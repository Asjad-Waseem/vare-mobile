import React, {useState, useEffect, useRef} from "react";
import {Container, Row, Col, Media, FormGroup} from "reactstrap";
import {AvForm, AvField} from "availity-reactstrap-validation";
import ScrollMenu from "react-horizontal-scrolling-menu";
import RESTCall from "../../../redux/actions/restApi";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../style.css"; // Tell webpack that Button.js uses these styles
import Cards, {Card} from "react-swipe-card";
import CommentsBlock from "simple-react-comments";
import BrowserViewComp from "../browser";
import MobileViewComp from "./info";
// import "../../../assets/css/sass/main.scss";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../redux/actions/authActions";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

//Import Section Title
import SectionTitle from "../../../components/common/section-title";

//Import Images
import map from "../../../assets/images/features/map.png";
import pics from "../../../assets/images/04.jpg";
import pics5 from "../../../assets/images/05.jpg";
import VideoApp from "../video";

import "../info.css";

// require('dotenv').config()

const videoFeeds = {};

const data = ["Alexandre", "Thomas", "Lucien"];

const listItem = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Home = ({info, onHandleQuery}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [user, setUser] = useState({
    name: "Login",
    user_id: "test@login.com",
    msg: true
  });

  const [contents, setContents] = useState([]);

  useEffect(() => {
    setWindowHeight(window.innerHeight + "px");
    setWindowWidth(window.innerWidth + "px");

    const formData4 = {
      request: "get",
      resource: "tube_contents"
    };
    onHandleQuery(formData4);
  }, []);

  useEffect(() => {
    setContents(
      info &&
        info["tube_contents"] &&
        info["tube_contents"].response &&
        info["tube_contents"].response.data
    );
    console.log(
      "info",
      info &&
        info["tube_contents"] &&
        info["tube_contents"].response &&
        info["tube_contents"].response.data
    );
  }, [info]);

  const saveMeetingComment = e => {
    // console.log('newMessagexx',e)
    if (e["_id"]) {
      //alert(3)
      delete e._id;
      const replyMessage = {
        request: "insert",
        query: e,
        resource: "vare_meeting_comments",
        check: ["meeting_id", "date"]
      };
      onHandleQuery(replyMessage);
    } else {
      const newMessage = {
        request: "insert",
        query: e,
        resource: "vare_meeting_comments",
        check: ["date", "meeting_id"]
      };
      onHandleQuery(newMessage);
    }
  };

  const deleteCommentDB = id => {
    if (id) {
      const formData9 = {
        request: "delete",
        query: {},
        resource: "vare_meeting_comments",
        id: id
      };
    } else {
      alert("Comment id not available");
    }
  };

  const updateMeetingStatus = storeUser => {
    // const meetingDetail = await memberDetails && memberDetails[0]
    // console.log('info',storeUser)
    const updateMeeting = {
      request: "insert",
      query: {
        ...storeUser
      },
      resource: "vare_meetings",
      check: ["meeting_id", "member_id"]
    };
    onHandleQuery(updateMeeting);
  };

  return (
    <React.Fragment>
      <MobileViewComp
        setUser={setUser}
        contents={contents}
        // user={user}
        height={height}
        width={width}
      />{" "}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
