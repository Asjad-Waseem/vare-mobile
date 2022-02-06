import React, {Fragment, useState, useEffect, useRef, Image} from "react";
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
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import UserAvatar from "react-user-avatar";
import TextInput from "react-autocomplete-input";
import NewsCardList from "./NewsCardList";

import RESTCall from "../../../../redux/actions/restApi";
import {parseURL} from "../../helpers/Utils";
import {useHistory} from "react-router-dom";

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

const Home = ({setLoginUser, loginUser}) => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchMeetingDetails, setSearchMeetingDetails] = useState([]);
  const [storedMeetingDetails, setStoredMeetingDetails] = useState([]);

  const [calendarId, setCalendarId] = useState(false);

  const [videoUrl, setVideoUrl] = useState({});
  const [detailsIndex, setDetailsIndex] = useState(-1);
  const [shareItem, setShareItem] = useState({});

  useEffect(() => {
    // console.log("dddss", storeUser, meetingDetails);
    handleMeetingDetails();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      setMeetingDetails(
        searchMeetingDetails.length > 0 ? [...searchMeetingDetails] : []
      );
    } else {
      setMeetingDetails([...storedMeetingDetails]);
    }
  }, [storedMeetingDetails, searchMeetingDetails, searchText]);

  const handleMeetingDetails = async () => {
    const urlParams = parseURL(history.location.search);
    // const formData = {
    //   request: "get",
    //   resource: "vare_meetings",
    //   sortBy: "date"
    // };
    const formData = {
      request: "search",
      query: {
        member_id: ""
      },
      resource: "vare_meetings",
      id: ""
    };
    RESTCall.axiosQuery(formData).then(response => {
      if (response && response.data) {
        // console.log("formData", response.data.data);
        const data =
          response && response.data && response.data.length > 0
            ? response.data.map(rep => {
                if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
                return rep;
              })
            : [];
        if (data) setStoredMeetingDetails([...data]);
      }
    });
  };

  const saveMessageLikes = async message => {
    // const temp = {...message};
    // console.log("hhhh", message);
    // delete message["_id"];
    const formData = {
      request: "insert",
      query: {
        author: message.author,
        meeting_id: message.meeting_id,
        likes: message.likes
      }, //add table key value to edit
      resource: "vare_meetings", //add table name
      check: ["author", "meeting_id"]
    };
    return await RESTCall.axiosQuery(formData).then(contents => {
      // console.log("contents", contents);
      // const notice = contents && contents.data && contents.data;
      handleMeetingDetails();
      // return contents;
    });
  };

  return (
    <div>
      <PageMenu />
      <div
        style={{
          display: "flex",
          marginTop: 65,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/meetings.jpg"}`,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: 50,
            width: 380,
            height: 30,
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,.69)",
            // backgroundColor: "#f2f3f5",
            borderRadius: 25
          }}
        >
          <div>
            <TextInput
              value={searchText}
              style={{
                // backgroundColor: "rgba(0,0,0,.19)",
                borderWidth: 0,
                // height: 30,
                width: 300,
                textAlign: "center",
                // paddingTop: 10,
                fontSize: 18,
                color: "white"
              }}
              // placeholderTextColor="white"
              placeholder={"Search"}
              onChange={text => {
                const newItem =
                  meetingDetails &&
                  meetingDetails.length > 0 &&
                  meetingDetails.filter(rep => {
                    return JSON.stringify(rep)
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
                // console.log("newItem", newItem);
                setSearchMeetingDetails(newItem);
                setSearchText(text);
              }}
            />{" "}
          </div>
          <div>
            <i
              onClick={() => {
                // inputRef.current.value = "";
                setSearchText("");
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                color: "white"
              }}
              className={`fas fa-x fa-sync-alt`}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          paddingTop: 10,
          width: "100%",
          paddingBottom: 80

          // alignItems: "center",
          // justifyContent: "center"
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          Vare Scheduled Meetings
        </div>
        <div className="row">
          {meetingDetails && meetingDetails.length > 0
            ? meetingDetails.map((real, index) => {
                if (0 <= index && index < 4) {
                  real[
                    "urlToImage"
                  ] = `https://varefiles.s3.us-east-2.amazonaws.com/meetingpic${index +
                    1}.jpg`;
                } else {
                  real[
                    "urlToImage"
                  ] = `https://varefiles.s3.us-east-2.amazonaws.com/meetingpic1.jpg`;
                }

                real["url"] = real.meeting_id
                  ? `/meeting?id=${real.meeting_id}`
                  : "";

                real[
                  "shareText"
                ] = `${real.description} | Author: ${real.author} | Topic: ${real.title} | Date: ${real.date}`;
                real["shareUrl"] = "";

                real["likes"] =
                  real.likes && Array.isArray(real.likes) ? real.likes : "";

                return (
                  <Colxx key={"jghfgft" + index} sm={12} lg={6}>
                    <div
                      key={"fdkvldhsgj" + index}
                      style={{
                        display: "flex"
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 40,
                          top: 30,
                          zIndex: 11
                        }}
                      >
                        <div
                          onClick={() => {
                            const detail = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${"Bithday"}&dates=${
                              real && real != null && real.publishedAt
                                ? real.publishedAt.replace(
                                    /[&-\/\\#,+()$~%. '":*?<>{}]/g,
                                    ""
                                  ) + "/20201231T223000Z"
                                : "20220120T135850250Z/20201231T223000Z"
                            }&details=${
                              real && real != null
                                ? "Title: " +
                                  real.title +
                                  " | " +
                                  real.description.toString()
                                : "Meeting Invitation"
                            }&location=${window.location}`;
                            if (
                              window.confirm("Add Schedule to your Calendar?")
                            ) {
                              window.open(detail);
                            }
                          }}
                        >
                          <i
                            style={{
                              backgroundColor: "#f2f3f5",
                              padding: 10,
                              borderRadius: 10
                            }}
                            className={`fas fa-calendar-alt`}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 60,
                          bottom: "15%",
                          zIndex: 11
                        }}
                      >
                        <i
                          className={`fas fa-2x fa-${
                            detailsIndex == index ? "eye" : "eye-slash"
                          }`}
                          onClick={() => {
                            setDetailsIndex(detailsIndex == index ? -1 : index);
                          }}
                          style={{
                            // paddingTop: 2,
                            // fontSize: 12,
                            // paddingLeft: 6,
                            // fontWeight: "bold",
                            color: "#2096F3"
                          }}
                        />
                      </div>
                      <NewsCardList
                        storeUser={storeUser}
                        saveMessageLikes={saveMessageLikes}
                        shareItem={shareItem}
                        detailsIndex={detailsIndex}
                        videoUrl={videoUrl}
                        real={real}
                        index={index}
                      />
                    </div>
                  </Colxx>
                );
              })
            : null}
        </div>
      </div>
      <PageFooter />
    </div>
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
