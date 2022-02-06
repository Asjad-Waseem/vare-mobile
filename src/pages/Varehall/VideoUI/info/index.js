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
import ContentModal from "./ContentModal";
import CommentsMobile from "./CommentsMobile";
import PageMenu from "./PageMenu";
import MediaCard from "./MediaCard";
import PageFooter from "./PageFooter";
// import {Helmet} from "react-helmet";
import cookie from "react-cookies";
import PlaceholderMessage from "./PlaceholderMessage";

import {useHistory} from "react-router-dom";

import VideoConfRoom from "./VideoConfRoom";
import HoverVideoPlayer from "react-hover-video-player";
import ScrollMenuPills from "./ScrollMenuPills";
import TextInput from "react-autocomplete-input";
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
  contents,
  meetingKey,
  host,
  meetingId,
  height,
  width,
  setUser,
  saveComment,
  updateComment,
  messages
}) => {
  const history = useHistory();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [status, setStatus] = useState({gospel: true});
  const [seaarchOptions, setSeaarchOptions] = useState([
    {
      colorPill: "",
      info: "all"
    },
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

  const [viewLevel, setdivLevel] = useState("charts"); //charts,bills,demography

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useState({
    user:
      window.localStorage && window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : ""
  });
  const [hostSecret, setHostSecret] = useState("");
  const loginTag = useRef(false);

  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myPWRef = useRef();

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

  const [progress, setProgress] = useState("getUpload");

  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    // "http://localhost:5000"
    // "https://vare-varehall.herokuapp.com"
    "https://media.varehall.com"
    // "https://meeting.varehall.com/upload/myUpload"
  );

  const [contentGroup, setContentGroup] = useState("");
  const contentFilterByStatus = useRef([]);
  const [commentStatus, setCommentStatus] = useState(false);

  const [contentSearch, setContentSearch] = useState([]);
  // const [contents, setContents] = useState([]);
  // const urlLocation = useRef(history.location.pathname);

  useEffect(() => {
    // console.log("storeUser", history.location.pathname);
    const data =
      contents &&
      contents.length > 0 &&
      contents.filter(rep => {
        return rep.hashtag
          .toString()
          .toLowerCase()
          .includes(Object.keys(status)[0].toLowerCase());
      });
    setContentSearch(data);
  }, [status]);

  useEffect(() => {
    const myContents =
      contentSearch && contentSearch.length > 0 ? contentSearch : contents;
    const userContent = myContents
      ? groupByCat({data: myContents, key: "hashtag"})
      : [];
    contentFilterByStatus.current = status.all ? contents : userContent;
  }, [status, contents, contentSearch]);

  useEffect(() => {
    const userContent = groupBy({
      data: contentFilterByStatus.current,
      key: "user_id"
    });
    setContentGroup(userContent);
  }, [status, contents, contentFilterByStatus.current]);

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

  // var audio = new Audio(
  //   "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3"
  // );

  var myDate = new Date();

  const VideoList = () => {
    const filterAction = () => {
      // console.log("fff d");
    };
    return (
      <>
        <PageMenu
          logedUse={logedUser}
          navItems={navItems}
          activeNav={activeNav}
        />

        {cookie.load("vare") ? (
          <div>
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
            <Row
              style={{
                // paddingTop: 20,
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
                        commentStatus={commentStatus}
                        setCommentStatus={setCommentStatus}
                        data={contentGroup[real]}
                        index={index}
                      />
                    </div>
                  );
                })}
              {/*contentGroup && <MediaCardMobile data={contentGroup} />*/}
            </Row>
          </div>
        ) : (
          <PlaceholderMessage />
        )}
      </>
    );
  };

  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          // overflowY: "auto",
          marginTop: 30,
          marginBottom: 300,
          paddingBottom: 350,
          // backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5",
          backgroundColor: "#fffffff",

          // background:
          //   "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
          backgroundSize: "cover",
          // width: "100%",
          // height: "100%",
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      >
        {activeNav == "Video" && !isMobile ? (
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
                meetingDetail={[]}
                meetingId={
                  meetingId ? meetingId : "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
                }
                saveComment={saveComment}
                user={storeUser && storeUser.user.name ? storeUser.user : ""}
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
              saveComment={saveComment}
              user={storeUser.user && storeUser.user.name ? storeUser.user : ""}
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
