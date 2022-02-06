import React, {useState, useEffect, useRef} from "react";
import {Container, Row, Col, Media, FormGroup} from "reactstrap";
import {AvForm, AvField} from "availity-reactstrap-validation";
import ScrollMenu from "react-horizontal-scrolling-menu";

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
  const [host, setHost] = useState({
    name: "Non",
    user_id: "test@test6.com",
    msg: true
  });

  const billId = useRef(null);

  const [billVotes, setBillVotes] = useState(null);
  const [memberDetails, setMemberDetails] = useState([
    {
      followers: 200
    }
  ]);
  const [meetingRSVP, setMeetingRSVP] = useState(null);
  const [meetingComments, setMeetingComments] = useState(null);
  const [meetingCommentUpdate, setMeetingCommentUpdate] = useState(null);
  const [chats, setChats] = useState([
    {
      date: "1/22/20",
      name: "Guest User6",
      user_id: "test@test6.com",
      comment: "Good word ggffgf gfgffgf",
      emoji: "fa-heart"
    },
    {
      date: "1/22/20",
      name: "Guest User4",
      user_id: "test@test4.com",
      comment: "Good word gffgfh gfhgf",
      emoji: "fa-heart"
    },
    {
      date: "1/22/20",
      name: "Guest User3",
      user_id: "test@test3.com",
      comment: "Good word gfggfgf fgfgfgfgfgf"
    }
  ]);

  const memberId = useRef();
  const meetingKey = useRef();

  useEffect(() => {
    // if(info && info['vare_meetings'] && info['vare_meetings'].request == 'search')
    // setMemberDetails(
    //   info && info["vare_meetings"] && info["vare_meetings"].response
    // );
    memberDetails &&
      memberDetails[0] &&
      setHost({
        name: memberDetails[0].author,
        user_id: memberDetails[0].member_id,
        msg: true
      });
    // console.log("eee", billId.current);

    // if(info && info['vare_meeting_rsvp'] && info['vare_meeting_rsvp'].request == 'search')
    setMeetingRSVP(
      info && info["vare_meeting_rsvp"] && info["vare_meeting_rsvp"].response
    );

    // if(info && info['vare_meeting_comments'] && info['vare_meeting_comments'].request == 'search')
    setMeetingComments(
      info &&
        info["vare_meeting_comments"] &&
        info["vare_meeting_comments"].response
    );

    setMeetingCommentUpdate(
      info &&
        info["vare_comments_update"] &&
        info["vare_comments_update"].response
    );

    setBillVotes(info && info["vare_vote"] && info["vare_vote"].response);
  }, [info]);

  useEffect(() => {
    //alert(8)
    // socket.current = io.connect("/");
    setWindowHeight(window.innerHeight + "px");
    setWindowWidth(window.innerWidth + "px");

    const url = window.location.href;
    let urlV1 = "";
    if (url.includes("member?")) {
      urlV1 = url && url.split("member?");
      memberId.current = urlV1 && urlV1[1];
      // console.log('location',memberId.current);
    }
    if (url.includes("info/") && urlV1) {
      const urlV2 = urlV1[0].split("info/");
      meetingKey.current = urlV2 && urlV2[1] && urlV2[1].replace("/", "");
      // console.log('meetingKey',meetingKey.current);
    }

    const formData1 = {
      request: "insert",
      query: {},
      resource: "vare_elections_favs",
      check: ["key_id", "user_id"]
    };

    const formData2 = {
      request: "search",
      query: {
        meeting_id: memberId.current ? memberId.current : {}
      },
      resource: "vare_meetings",
      id: ""
    };

    const formData3 = {
      request: "get",
      resource: "vare_meetings"
    };

    const formData = {
      request: "insert",
      query: {},
      resource: "",
      check: ["key_id", "user_id"]
    };

    const formData4 = {
      request: "search",
      query: {
        meeting_id: memberId.current ? memberId.current : {}
      },
      resource: "vare_meeting_rsvp",
      id: ""
    };

    const formData5 = {
      request: "search",
      query: {
        meeting_id: memberId.current ? memberId.current : {}
      },
      resource: "vare_meeting_comments",
      id: ""
    };

    const formData9 = {
      request: "delete",
      query: {},
      resource: "vare_meeting_comments",
      id: ""
    };

    onHandleQuery(formData2);

    onHandleQuery(formData4);

    // onHandleQuery(formData5);
  }, [memberId.current]);

  useEffect(() => {
    // console.log("eee2", billId.current);
    billId.current =
      memberDetails &&
      memberDetails[0] &&
      memberDetails[0].bill_id &&
      memberDetails[0].bill_id != "null"
        ? memberDetails[0].bill_id
        : null;
    if (billId.current)
      onHandleQuery({
        request: "search",
        query: {
          item_id: billId.current ? billId.current : {}
        },
        resource: "vare_vote",
        id: ""
      });
  }, [memberDetails]);

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
        billVotes={billVotes}
        meetingKey={meetingKey.current}
        meetingRSVP={meetingRSVP}
        updateMeetingStatus={updateMeetingStatus}
        memberDetails={memberDetails}
        meetingComments={meetingComments}
        meetingCommentUpdate={meetingCommentUpdate}
        user={user}
        host={host}
        meetingId={memberId.current}
        // saveMeetingComment={saveMeetingComment}
        // attendees={attendees.data}
        // messages={attendees.messages}
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
  // console.log('contentmapStateToProps',state)
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
