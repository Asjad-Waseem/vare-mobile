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
import VideoConfRoom from "./VideoConfRoom-LiveChat";
import HoverVideoPlayer from "react-hover-video-player";
import ScrollMenuPills from "./ScrollMenuPills";
import TextInput from "react-autocomplete-input";
import ReactSwipe from "react-swipe";

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

import io from "socket.io-client";

import Loader from "react-loader-spinner";

import {Browserdiv, Mobilediv, isBrowser, isMobile} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";
import {groupBy} from "../../helpers";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

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

const Home = ({
  loginUser,
  meetingKey,
  user,
  host,
  meetingId,
  height,
  width,
  setUser,
  item,
  myVote,
  billId,
  favMessage,
  details,
  meetingIndex,
  meetingComments,
  meetingRSVP,
  meetingDetails,
  saveMeetingComment,
  meetingCommentUpdate,
  messages
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [status, setStatus] = useState({gospel: true});
  const [seaarchOptions, setSeaarchOptions] = useState([
    {
      colorPill: "",
      info: "comedy"
    },
    {
      colorPill: "",
      info: "gospel"
    },
    {
      colorPill: "",
      info: "news"
    },
    {
      colorPill: "",
      info: "politics"
    },
    {
      colorPill: "",
      info: "popular"
    }
  ]);

  const [activeNav, setActiveNav] = useState("VareHall");

  const [inViewVideoIndex, setInViewVideoIndex] = useState(null);
  const [guestUsers, setGuestUsers] = useState([]);
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const meetingDetail = meetingDetails && meetingDetails[0];
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

  const [activeFooterNav, setActiveFooterNav] = useState("Home");

  const [navFooterItems, setNavFooterItems] = useState([
    {
      id: 1,
      idnm: "Home",
      navheading: "Home",
      icon: "fas fa-home"
    },
    // {
    //   id: 2,
    //   idnm: "Comments",
    //   navheading: "Comments",
    //   icon: "fas fa-comment"
    // },
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

  const [showLogin, setShowLogin] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);

  const [viewLevel, setdivLevel] = useState("charts"); //charts,bills,demography

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("logedUser", "");
  const [hostSecret, setHostSecret] = useState("");

  const loginTag = useRef(false);

  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myPWRef = useRef();

  // const indivVideoIndex = useRef(null);

  // const groupByCat = function(xs, key) {
  //   return xs.reduce(function(rv, x) {
  //     // console
  //     //   .log(Object.keys(status))
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // };

  const groupByCat = ({data, key}) => {
    return data.filter(rep => {
      return (
        rep["hashtag"] &&
        rep["hashtag"].toLowerCase().includes(
          Object.keys(status)
            .toString()
            .toLowerCase()
        )
      );
    });
  };

  const logout = () => {
    setUser({
      name: "Login",
      user_id: "test@login.com",
      msg: true
    });
    setLogedUser("");
    setStoreUser("");
    setShowLogin(false);
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://meeting.varehall.com/upload/myUpload"
  );

  const [videos, setVedeos] = useState([1, 2, 3, 4]);
  const [contentGroup, setContentGroup] = useState("");
  const contentFilterByStatus = useRef([]);
  const [contentSearch, setContentSearch] = useState([]);
  const [contents, setContents] = useState([
    {
      id_: "1desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User2",
      user_id: "test@test2.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/1.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,comedy"
    },
    {
      id_: "2desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User2",
      user_id: "test@test2.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/2.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,news,politics"
    },
    {
      id_: "3desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User2",
      user_id: "test@test2.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/3.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,comedy"
    },
    {
      id_: "4desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User3",
      user_id: "test@test3.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/3.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,comedy"
    },
    {
      id_: "5desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User3",
      user_id: "test@test3.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/3.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,comedy"
    },
    {
      id_: "6desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User4",
      user_id: "test@test4.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/3.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,gospel"
    },
    {
      id_: "7desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User5",
      user_id: "test@test5.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/3.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,comedy"
    },
    {
      id_: "8desdsdds",
      date: "2021-3-6 23:34:8",
      message_id: "2",
      author: "Guest User6",
      user_id: "test@test6.com",
      title: "Proverbs 6:20",
      message:
        "My son, keep thy father's commandment, and forsake not the law of thy mother.",
      name: "Guest User",
      likes: "",
      audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
      video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
      img: "https://varefiles.s3.us-east-2.amazonaws.com/church/2.jpg",
      comments: "2",
      avatar: "test@test2.jpg",
      hashtag: "gospel,news"
    }
  ]);

  const [comments, setComments] = useState([
    {
      _id: {$oid: "604465d21b269956a6fdb85d"},
      date: "2021-3-6 23:34:8",
      meeting_id: "2",
      sender_id: "deetester@test.com",
      author: "Deetester",
      author_id: "deetester@test.com",
      comment: "Sssssssssssss",
      likes: "",
      name: "Deetester",
      reply:
        '[{"date":"2021-03-07T05:34:08.629Z","name":"Deetester","user_id":"deetester@test.com","comment":"Sssssssssssss"}]',
      reply_id: "604465c91b269956a6fdb745"
    }
  ]);

  useEffect(() => {
    const myContents =
      contentSearch && contentSearch.length > 0 ? contentSearch : contents;
    const userContent = groupByCat({data: myContents, key: "hashtag"});
    contentFilterByStatus.current = userContent;
    // console.log("userContent", userContent);
  }, [status]);

  useEffect(() => {
    const userContent = groupBy({
      data: contentFilterByStatus.current,
      key: "user_id"
    });
    setContentGroup(userContent);
  }, [contentFilterByStatus.current]);

  useEffect(() => {
    const data = contents.filter(rep => {
      return rep.hashtag
        .toString()
        .toLowerCase()
        .includes(Object.keys(status)[0].toLowerCase());
    });
    setContentSearch(data);
  }, [status]);

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

  function filterData(text) {
    const {status, members, localMembers, texasMembers, tabIndex} = this.state;

    if (text && text.length > 0) {
      let combinedListData =
        status && status["others"]
          ? localMembers
          : status && status["my state"]
          ? texasMembers
          : members;

      const combinedList = combinedListData.sort((a, b) =>
        a.id > b.id ? 1 : -1
      );

      const defaultVal =
        combinedList && combinedList.length > 0
          ? combinedList.map(rep => {
              return rep.name;
            })
          : [];
      this.setState({
        queryResult: defaultVal.filter(res => {
          return (
            res &&
            text &&
            res
              .toString()
              .toLowerCase()
              .includes(text.toString().toLowerCase())
          );
        })
      });
    } else {
      this.setState({
        searchMatchResult: [],
        searchMatchTextLength: 0,
        queryResult: [],
        query: ""
      });
    }
  }

  const ControlItems = ({message, author, hashtag, rep}) => {
    // const message =
    //   "LATEST NAIJA AFROBEAT 2021 NONSTOP PARTY MIX BY DJ FINEX FT REMA JOEBOY TEKNO OMAH reretretretertretretertret ";
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            color: "#1c1e21",
            fontSize: 12,
            width: 390
          }}
        >
          <div
            style={{
              paddingRight: 5
            }}
          >
            {rep ? (
              <div
                style={{
                  width: 100,
                  height: 100
                }}
              >
                <HoverVideoPlayer
                  videoSrc={rep.video}
                  pausedOverlay={
                    <>
                      <img
                        src={rep.img}
                        alt=""
                        style={{
                          // Make the image expand to cover the video's dimensions
                          width: 100,
                          height: 100,
                          objectFit: "cover"
                        }}
                      />
                    </>
                  }
                  volume={0.5}
                  muted={true}
                  loop={false}
                  loadingOverlay={<div className="loading-spinner-overlay" />}
                  controls
                />
              </div>
            ) : (
              <UserAvatar
                size="48"
                name="Will Binns-Smith"
                src="https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                paddingBottom: 5,
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              {hashtag ? `#${hashtag.replace(",", " #")}` : ""}
            </div>
            <div
              style={{
                paddingBottom: 5,
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              {author}
            </div>
            <div
              style={{
                fontSize: 12,
                paddingBottom: 5
              }}
            >
              {`${message.substring(0, 70)} ${
                message.length > 70 ? "..." : ""
              }`}
            </div>

            <div
              style={{
                paddingTop: 10,
                color: "#1c1e21",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div
                onClick={() => {
                  // item.bill_id && item.bill_id != "tbd"
                  //   ? this.props.updateState(item.bill_id, "no")
                  //   : alert("Bill ID is needed to vote.");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  width: 45,
                  borderRadius: 100,
                  flexDirection: "column"
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#cfcfc4"
                  }}
                  // name={"times"}
                  className={`fas fa-2x fa-thumbs-up`}
                />
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#1c1e21"
                  }}
                >
                  22k
                </div>
              </div>

              <div
                onClick={() => {
                  // item.bill_id && item.bill_id != "tbd"
                  //   ? this.props.updateState(item.bill_id, "yes")
                  //   : alert("Bill ID is needed to vote.");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // margin: 10,
                  height: 20,
                  width: 45,
                  borderRadius: 100,
                  flexDirection: "column"
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#cfcfc4"
                  }}
                  name={"check"}
                  className={`fas fas fa-2x fa-thumbs-down`}
                />
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#1c1e21"
                  }}
                >
                  4k
                </div>
              </div>

              <div
                onClick={() => {
                  // this.props.updateState(
                  //   "bill_notice_" + billId,
                  //   myVote && !myVote["bill_notice_" + billId]
                  //     ? "yes"
                  //     : myVote["bill_notice_" + billId] == "no"
                  //     ? "yes"
                  //     : "no"
                  // ) && alert(favMessage);
                }}
                style={{
                  // backgroundColor:
                  //   myVote &&
                  //   myVote["bill_notice_" + billId] &&
                  //   myVote["bill_notice_" + billId] == "yes"
                  //     ? "#ff4D4D"
                  //     : "white",
                  // margin: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  width: 45,
                  borderRadius: 100,
                  flexDirection: "column"
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#cfcfc4"
                  }}
                  name={"heart"}
                  className={`fas fas fa-2x fa-heart`}
                />
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#1c1e21"
                  }}
                >
                  Fav
                </div>
              </div>

              <div
                onClick={() => {
                  // this.shareMessage({
                  //   message: `${`Welcome to VARE townhall to discuss bill: ${item.bill_id} with your Representative.`}`,
                  //   title: `${`${item.bill_id}  ${item.bill_title}`}`,
                  //   url: ""
                  // });
                }}
                style={{
                  // backgroundColor: "white",
                  // margin: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  width: 45,
                  borderRadius: 100,
                  flexDirection: "column"
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#cfcfc4"
                  }}
                  // name={"share"}
                  className={`fas fas fa-2x fa-share`}
                />
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#1c1e21"
                  }}
                >
                  Share
                </div>
              </div>

              <div
                onClick={() => {
                  // this.shareMessage({
                  //   message: `${`Welcome to VARE townhall to discuss bill: ${item.bill_id} with your Representative.`}`,
                  //   title: `${`${item.bill_id}  ${item.bill_title}`}`,
                  //   url: ""
                  // });
                }}
                style={{
                  // backgroundColor: "white",
                  // margin: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 20,
                  width: 45,
                  borderRadius: 100,
                  flexDirection: "column"
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center",
                    color: "rgb(135, 206, 250)"
                  }}
                  // name={"share"}
                  className={`fas fas fa-2x fa-comment-dots`}
                />
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 3,
                    textAlign: "center",
                    color: "#1c1e21"
                  }}
                >
                  comments
                </div>
              </div>

              {/*      <VotePolicy
          item={item.bill_id}
          num={tempCount && tempCount[0] ? tempCount[0]["pst"] : 0}
          pct={tempCount && tempCount[0] ? tempCount[0]["pst"] : 0}
        />*/}
            </div>
          </div>
        </div>
      </>
    );
  };

  const PageFooter = () => {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          zIndex: 11
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
                        loginTag.current.scrollIntodiv({
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

  var audio = new Audio(
    "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3"
  );

  var myDate = new Date();

  const Slide = props => {
    let reactSwipeEl;
    return (
      <div
        style={{
          top: 30,
          position: "absolute",
          width: 400
          // overflowY: "auto"
        }}
      >
        {" "}
        <ReactSwipe
          className="carousel"
          swipeOptions={{continuous: false}}
          ref={el => (reactSwipeEl = el)}
        >
          {props.children}
        </ReactSwipe>
        <i
          onClick={() => {
            reactSwipeEl.prev();
          }}
          style={{
            position: "absolute",
            zIndex: 15,
            top: 350,
            left: 0,
            color: "#cfcfc4"
          }}
          className={`fas fa-3x fa-chevron-left`}
        >
          {" "}
        </i>
        <i
          onClick={() => {
            reactSwipeEl.next();
          }}
          style={{
            position: "absolute",
            zIndex: 15,
            top: 350,
            right: 0,
            color: "gray"
          }}
          className={`fas fa-3x fa-chevron-right`}
        >
          {" "}
        </i>
      </div>
    );
  };

  const Scripture = props => {
    return (
      <div
        style={{
          top: 40,
          // width: "100%",
          left: 111,
          position: "absolute",
          zIndex: 6,
          padding: 10,
          backgroundColor: "rgba(0,0,0,.54)",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <div>
          <h2 style={{color: "green"}}>Proverbs 6:20 </h2>
        </div>
        <div
          style={{
            fontWeight: "bold",
            width: 150,
            display: "flex",
            flexWrap: "wrap",
            color: "white"
          }}
        >
          {props.message}
        </div>
      </div>
    );
  };

  const MediaCard = ({
    data,
    user,
    index,
    setPlayIndex,
    playIndex,
    thumbnail
  }) => {
    const [play, setPlay] = useState(false);
    const [myIndex, setMyIndex] = useState(0);

    useEffect(() => {
      if (play) {
        audio.play();
      } else {
        audio.pause();
      }
      // console.log("playIndex", playIndex, play);
    }, [play]);

    return (
      <Colxx key={"jghfgft" + index} sm={12} lg={4}>
        <div
          style={{
            marginTop: 20,
            width: 450,
            backgroundColor: "#f2f3f5",
            borderRadius: 5,
            height: 470,
            paddingBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Slide>
            {data && data.length > 0
              ? data.map((rep, id) => {
                  // id_: "1desdsdds",
                  // date: "2021-3-6 23:34:8",
                  // message_id: "2",
                  // author: "Guest User",
                  // user_id: "test@test2.com",
                  // title: "Proverbs 6:20",
                  // message:
                  //   "My son, keep thy father's commandment, and forsake not the law of thy mother.",
                  // name: "Guest User",
                  // likes: "",
                  // audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
                  // video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
                  // comments: "2",
                  // avatar: "test@test2.jpg"
                  return (
                    <div
                      key={id + "ssjchhshhz"}
                      // style={{
                      //   borderBottomRightRadius: 5,
                      //   borderBottomLeftRadius: 5,
                      //   // width: "100%",
                      //   display: "flex",
                      //   alignItems: "center",
                      //   justifyContent: "center"
                      //   // height: 450
                      // }}
                      className="each-slide"
                    >
                      <div
                        style={{
                          borderRadius: 5,
                          height: 470,
                          position: "relative",
                          // top: 81,
                          // left: 15,
                          width: 430
                        }}
                      >
                        <HoverVideoPlayer
                          videoSrc={rep.video}
                          pausedOverlay={
                            <>
                              <img
                                src={rep.img}
                                alt=""
                                style={{
                                  // Make the image expand to cover the video's dimensions
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                              <Scripture message={rep.message} />
                            </>
                          }
                          volume={0.5}
                          muted={false}
                          loop={false}
                          loadingOverlay={
                            <div className="loading-spinner-overlay" />
                          }
                          controls
                        />
                      </div>
                      <div
                        style={{
                          top: 260,
                          left: 10,
                          position: "fixed",
                          zIndex: 8,
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <ControlItems
                          hashtag={rep.hashtag}
                          author={rep.author}
                          message={rep.message ? rep.message : rep.title}
                        />
                      </div>{" "}
                    </div>
                  );
                })
              : null}
          </Slide>
        </div>
        {/*<VideoMenu />*/}
      </Colxx>
    );
  };

  const MediaCardMobile = ({
    data,
    user,
    setPlayIndex,
    playIndex,
    thumbnail
  }) => {
    const [myIndex, setMyIndex] = useState(0);

    const id = "test@test2.com";
    const index = id;
    const userVideos = data[id]; //id)
    const rep = userVideos[myIndex];

    console.log("playIndex", id, rep, data);

    return (
      <Colxx key={"jghfgft" + index} sm={12} lg={4}>
        <div
          key={"jghfgjjhft" + index}
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            marginTop: 70,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="">
            <div
              style={{
                width: 450,
                // marginRight: "10%",
                // marginLeft: "10%",
                //  backgroundColor: "rgba(0,0,0,.03)",
                backgroundColor: "#f2f3f5",
                borderRadius: 5,
                height: 430,
                paddingBottom: 10
              }}
            >
              <div
                style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  height: 100,
                  // maxMidth: 250,
                  width: "100%",
                  // padding: 20,
                  color: "#1c1e21",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    width: "90%",
                    zIndex: 5,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  className="slide-container"
                >
                  <div
                    key={id + "ssjchhshhz"}
                    style={{
                      borderBottomRightRadius: 5,
                      borderBottomLeftRadius: 5,
                      // width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                      // height: 450
                    }}
                    className="each-slide"
                  >
                    <div
                      style={{
                        borderRadius: 5,
                        height: 470
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          top: 81,
                          // left: 15,
                          width: 430
                        }}
                      >
                        <HoverVideoPlayer
                          videoSrc={rep.video}
                          pausedOverlay={
                            <>
                              <img
                                src={rep.img}
                                alt=""
                                style={{
                                  // Make the image expand to cover the video's dimensions
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                              <Scripture message={rep.message} />
                            </>
                          }
                          volume={0.5}
                          muted={false}
                          loop={false}
                          loadingOverlay={
                            <div className="loading-spinner-overlay" />
                          }
                          controls
                        />
                      </div>
                    </div>
                    <ControlItems
                      rep={rep}
                      hashtag={rep.hashtag}
                      author={rep.author}
                      message={rep.message ? rep.message : rep.title}
                    />
                  </div>
                  );
                </div>
                <MediaCardList data={userVideos} />
                {/*<VideoMenu />*/}
              </div>
            </div>
          </div>
        </div>
      </Colxx>
    );
  };

  const MediaCardList = ({
    data,
    user,
    index,
    setPlayIndex,
    playIndex,
    thumbnail
  }) => {
    const [play, setPlay] = useState(false);
    const [myIndex, setMyIndex] = useState(0);

    useEffect(() => {
      if (play) {
        audio.play();
      } else {
        audio.pause();
      }
      // console.log("playIndex", playIndex, play);
    }, [play]);

    return (
      <Colxx key={"jghfgft" + index} sm={12} lg={4}>
        <div>
          <div className="">
            <div
              style={{
                width: 450,
                // marginRight: "10%",
                // marginLeft: "10%",
                //  backgroundColor: "rgba(0,0,0,.03)",
                backgroundColor: "#f2f3f5",
                borderRadius: 5,
                // height: 430,
                paddingBottom: 10
              }}
            >
              <div
                style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  height: 100,
                  // maxMidth: 250,
                  width: "100%",
                  // padding: 20,
                  color: "#1c1e21",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    width: "90%",
                    zIndex: 5,
                    // position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  className="slide-container"
                >
                  {data && data.length > 0
                    ? data.map((rep, id) => {
                        return (
                          <div
                            key={id + "ssjchhshhz"}
                            style={{
                              borderBottomRightRadius: 5,
                              borderBottomLeftRadius: 5,
                              // width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row"
                              // height: 450
                            }}
                            className="each-slide"
                          >
                            <ControlItems
                              hashtag={rep.hashtag}
                              author={rep.author}
                              message={rep.message ? rep.message : rep.title}
                            />
                          </div>
                        );
                      })
                    : null}
                </div>
                {/*<VideoMenu />*/}
              </div>
            </div>
          </div>
        </div>
      </Colxx>
    );
  };

  const VideoList = () => {
    const filterAction = () => {
      // console.log("fff d");
    };
    return (
      <>
        <TextInput
          style={{
            backgroundColor: "#f2f3f5",
            width: "90%",
            borderRadius: 25,
            marginLeft: 10,
            paddingTop: 10,
            textAlign: "center"
            // cursor: "pointer"
          }}
          placeholder={"Search"}
          onChange={text => {
            console.log(text);
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 17
          }}
        >
          <ScrollMenuPills
            status={status}
            filterAction={res => {
              setStatus({[res]: !status[res]});
              // console.log(status);
            }}
            data={seaarchOptions}
            searchTextLength={0}
            // filterStatus={this.filterStatus.bind(this)}
          />
        </div>
        <div
          className="borderSolid"
          style={{
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 10,
            position: "absolute",
            backgroundColor: "#D6DBDF"
          }}
        >
          <PageMenu />
        </div>
        <Row
          style={{
            paddingTop: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {contentGroup &&
            Object.keys(contentGroup).map((real, index) => {
              return (
                <div key={index + "sdsjsjhvew"}>
                  <MediaCard
                    playIndex={playIndex}
                    setPlayIndex={setPlayIndex}
                    data={contentGroup[real]}
                    user={real}
                    index={index}
                  />
                </div>
              );
            })}
          {/*contentGroup && <MediaCardMobile data={contentGroup} />*/}
        </Row>
      </>
    );
  };

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          overflowY: "auto",
          paddingTop: 100,
          paddingBottom: 300,
          // backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5",
          backgroundColor: "#fffffff",

          // background:
          //   "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
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
        ) : activeNav == "Video" && !isMobile ? (
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
                meetingId={
                  meetingId ? meetingId : "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
                }
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
                roomID={
                  meetingId ? meetingId : "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
                }
                activeUser={"host.user_id"}
              />{" "}
            </div>{" "}
          </Col>
        ) : activeNav == "Video" ? (
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
              meetingId={
                meetingId ? meetingId : "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
              }
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
              roomID={
                meetingId ? meetingId : "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
              }
              activeUser={host.user_id}
            />{" "}
          </div>
        ) : (
          <VideoList />
        )}
      </div>{" "}
      {/*viewLevel == "demography" ? <HeaderFilter /> : null*/}
      {}
      <PageFooter />
    </React.Fragment>
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

export default Home;
