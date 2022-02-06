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
import useLocalStorage from "./localStorage";
import PageMenu from "./PageMenu";
import {useHistory} from "react-router-dom";

import {parseURL} from "../../../../data/units.js";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";

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
import PageFooter from "./PageFooter";

//Import Section Title
import UserProfile from "./UserProfile";
import ActiveUserProfile from "./ActiveUserProfile";
import CalendarButton from "./CalendarButton";
import SummaryDetailCard from "./SummaryDetailCard";
import CommentsMobile from "./CommentsMobile";
import VideoConfRoom from "./VideoConfRoom";
import ImageUploader from "react-images-upload";
import Axios from "axios";

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

// const parse_query_string = query => {
//   var vars = query.split("&");
//   var query_string = {};
//   for (var i = 0; i < vars.length; i++) {
//     var pair = vars[i].split("=");
//     var key = decodeURIComponent(pair[0]);
//     var value = decodeURIComponent(pair[1]);
//     // If first entry with this name
//     if (typeof query_string[key] === "undefined") {
//       query_string[key] = decodeURIComponent(value);
//       // If second entry with this name
//     } else if (typeof query_string[key] === "string") {
//       var arr = [query_string[key], decodeURIComponent(value)];
//       query_string[key] = arr;
//       // If third or later entry with this name
//     } else {
//       query_string[key].push(decodeURIComponent(value));
//     }
//   }
//   return query_string;
// };

const MeetingModal = props => {
  const {info, onHandleQuery} = props;
  const history = useHistory();

  const [meetings, setMeetings] = useState("");
  const [host, setHost] = useState("");
  const [billVotes, setBillVotes] = useState("");
  const [messages, setMessages] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetingRSVP, setMeetingRSVP] = useState("");
  const [meetingComments, setMeetingComments] = useState("");
  const [meetingKey, setMeetingKey] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState("");
  const [activeNav, setActiveNav] = useState("VareHall");
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [meetingCommentUpdate, setMeetingCommentUpdate] = useState(null);
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");

  const [activeFooterNav, setActiveFooterNav] = useState("Home");

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

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [hostSecret, setHostSecret] = useState("");

  // console.log('storeUser.user',storeUser.user)
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

  const billId = useRef(null);

  const meetingTag = useRef(false);
  const pollTag = useRef(false);
  const homeTag = useRef(false);
  const loginTag = useRef(false);
  const calendar = useRef(false);
  const meetingId = useRef();
  const myEmailRef = useRef();

  // const inViewVideoIndex = useRef(null);
  const [inViewVideoIndex, setInViewVideoIndex] = useState(null);

  useEffect(() => {
    // console.log(inViewVideoIndex);
  }, [inViewVideoIndex]);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const result = billVotes && groupBy(billVotes, "vote");
  // console.log("result", user);
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
  // console.log('xxstoreUser.user',myMeetngStatus.current)

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
    if (storeUser.user && storeUser.user.meeting_key) {
      updateMeetingStatus({
        status: false,
        meeting_id:
          storeUser.user && storeUser.user.meeting_id
            ? storeUser.user.meeting_id
            : "",
        member_id:
          storeUser.user && storeUser.user.user_id ? storeUser.user.user_id : ""
      });
    }
  };

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

  useEffect(() => {
    // if(info && info['vare_meetings'] && info['vare_meetings'].request == 'search')
    setMeetingDetails(
      info && info["vare_meetings"] && info["vare_meetings"].response
    );

    if (
      info &&
      info["vare_meetings"] &&
      info["vare_meetings"].response &&
      info["vare_meetings"].response.data
    ) {
      console.log(
        "dddxx",
        info &&
          info["vare_meetings"] &&
          info["vare_meetings"].response &&
          info["vare_meetings"].response &&
          info["vare_meetings"].response.data
      );
      setMeetings(
        info &&
          info["vare_meetings"] &&
          info["vare_meetings"].response &&
          info["vare_meetings"].response &&
          info["vare_meetings"].response.data
      );
    }

    meetingDetails &&
      meetingDetails[0] &&
      setHost({
        name: meetingDetails[0].author,
        user_id: meetingDetails[0].member_id,
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

    const myUrl = parseURL(history.location.search);
    console.log("location", url);

    meetingId.current = myUrl && myUrl["?id"];

    const formData1 = {
      request: "insert",
      query: {},
      resource: "vare_elections_favs",
      check: ["key_id", "user_id"]
    };

    const formData2 = {
      request: "search",
      query: {
        meeting_id: meetingId.current ? meetingId.current : {}
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
        meeting_id: meetingId.current ? meetingId.current : {}
      },
      resource: "vare_meeting_rsvp",
      id: ""
    };

    const formData5 = {
      request: "search",
      query: {
        meeting_id: meetingId.current ? meetingId.current : {}
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

    const formDataV = {
      request: "get",
      resource: "vare_meetings"
    };

    if (meetingId.current) {
      onHandleQuery(formData2);
    } else {
      onHandleQuery(formDataV);
    }

    onHandleQuery(formData4);

    // onHandleQuery(formData5);
  }, [meetingId.current]);

  useEffect(() => {
    // console.log("eee2", billId.current);
    billId.current =
      meetingDetails &&
      meetingDetails[0] &&
      meetingDetails[0].bill_id &&
      meetingDetails[0].bill_id != "null"
        ? meetingDetails[0].bill_id
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
  }, [meetingDetails]);

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
        </div>{" "}
        <PageFooter />
        <Container>
          <Row className="mt-4">
            {activeNav == "Comments" ? (
              <Col lg={12} sm={12}>
                <Col className={"commenstField mb-3"}>
                  <CommentsMobile
                    meetingComments={meetingComments}
                    meetingRSVP={meetingRSVP}
                    meetingDetails={meetingDetails}
                    host={host}
                    user={
                      storeUser.user && storeUser.user.name
                        ? storeUser.user
                        : ""
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
                      storeUser.user && storeUser.user.name
                        ? storeUser.user
                        : ""
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
                            storeUser.user && storeUser.user.name
                              ? storeUser.user
                              : ""
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
                          storeUser.user && storeUser.user.name
                            ? storeUser.user
                            : ""
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
                      // overflowY: "auto",
                      height: isMobile ? "100%" : 220,
                      backgroundColor: "white"
                    }}
                  >
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
                      {" "}
                      <p> Hello, </p>{" "}
                      {meetingDetail && meetingDetail.description ? (
                        <p>
                          {" "}
                          {meetingDetail.author}
                          is inviting you to a Townhall / VareHall meeting.{" "}
                        </p>
                      ) : null}{" "}
                      <CalendarButton
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
                      {showCalendar ? (
                        <div
                          // ref={calendar}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
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
                    </div>{" "}
                  </Card>{" "}
                </div>

                <UserProfile
                  user={
                    storeUser.user && storeUser.user.name ? storeUser.user : ""
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
      {meetings && meetings.length > 0 //&& !meetingId
        ? meetings.map((meeting, index) => {
            console.log("xxxx", meeting);
            return (
              <div key={"sjsdshhjs" + index}>
                <Card
                  style={{
                    height: 40,
                    margin: 25
                  }}
                  className="card"
                ></Card>
              </div>
            );
          })
        : null}
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingModal);
