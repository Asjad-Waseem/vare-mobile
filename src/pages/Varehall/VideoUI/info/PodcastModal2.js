import React, {Fragment, useState, useEffect, useRef} from "react";
import {Row, Card, Container, Col, Label, Button} from "reactstrap";
import UserAvatar from "react-user-avatar";
import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import PageModal from "./PageModal";
import VideoModal from "./VideoModal";
import VoteChart from "./VoteChart";

import queryString from "query-string";

import AppComments from "./comments";
import MultiTag from "./MultiTag";
import {RWebShare} from "react-web-share";
import ScrollMenu from "react-horizontal-scrolling-menu";

import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import RESTCall from "../../../../redux/actions/restApi";

// import {Helmet} from "react-helmet";
import cookie from "react-cookies";
import PlaceholderMessage from "./PlaceholderMessage";

import {useHistory} from "react-router-dom";

import TextInput from "react-autocomplete-input";

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
// import "../../style.css"; // Tell webpack that Button.js uses these styles

// import "../../info.css";
// import "../../../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

// import io from "socket.io-client";
import {Browserdiv, Mobilediv, isBrowser, isMobile} from "react-device-detect";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {groupBy} from "../../helpers";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

// import "react-slideshow-image/dist/styles.css";

const StyledVideo = styled.video`
  /* flexDirection:'row', */
  height: 50%;
  width: 45%;
`;

var audio = new Audio();
// "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3"

const Slide = props => {
  return (
    <div style={{position: "absolute", width: "100%", left: -10}}>
      {props.children}
    </div>
  );
};

const PodcastModal = ({
  setLoginUser,
  loginUser,
  info,
  onHandleQuery,
  activeUser,
  setActiveUser
}) => {
  const history = useHistory();
  const [keyUsers, setKeyUsers] = useState([
    "dafolo11@gmail.com",
    "larraking@test.com",
    "kristin@leetest.com",
    "civicadmin@vareapp.com"
  ]);

  const [sharedVideo, setSharedVideo] = useState(false);
  const [itemId, setItemId] = useState(false);
  const [userSource, setUserSource] = useState(false);

  const [chartId, setChartId] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fullView, setFullView] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(-1);
  const [showEchoIndex, setShowEchoIndex] = useState(-1);

  const [showMenuIndex, setShowMenuIndex] = useState(-1);

  const [podcastMedia, setPodcastMedia] = useState([]);
  const [searchPodcastMedia, setSearchPodcastMedia] = useState([]);
  const [storedPodcastMedia, setStoredPodcastMedia] = useState([]);
  const [storedEchoMedia, setStoredEchoMedia] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [activeNav, setActiveNav] = useState("VareHall");

  // const [selectedLike, setSelectedLike] = useState(-1);
  const [errors, setErrors] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState({});
  const [pictureUrl, setPictureUrl] = useState(false);

  const [shareItem, setShareItem] = useState({});

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");

  const [noticeUsers, setNoticeUsers] = useState([]);
  const myTitleRef = useRef("");
  const myMessageRef = useRef("");
  const echoInfo = useRef();

  // const echoId = useRef("");

  // const inViewVideoIndex = useRef(null);
  const pathurl = useRef(history.location);

  useEffect(() => {
    // alert(33);
    const query = queryString.parse(pathurl.current.search);
    // console.log("INFO", pathurl.current);
    if (query && query.app && query.app == "vare") setUserSource("app");
    if (query && query.share) {
      // console.log("ss", query.share);
      setItemId(query.share);
      setSharedVideo(true);
      setVideoUrl({});
    }
    if (
      !cookie.load("vare") &&
      query &&
      query.app &&
      query.app == "vare" &&
      query.id
      // pathurl.current.pathname.includes("podcast")
    ) {
      // alert(2);
      // console.log("INFO", query.id);
      getUserEmail(query.id);
    }
    getContent();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      setPodcastMedia(
        searchPodcastMedia.length > 0 ? [...searchPodcastMedia] : []
      );
    } else {
      setPodcastMedia([...storedPodcastMedia]);
    }
  }, [storedPodcastMedia, searchPodcastMedia, searchText]);

  const getUserEmail = id => {
    if (id.includes("@")) {
      loginAppUser(id);
      return;
    }
    const formData = {
      request: "search",
      query: {
        user_id: id
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData).then(response => {
      // console.log("dddd", response);
      const data = response && response.data && response.data[0];
      if (data && data.email) {
        loginAppUser(data.email);
      }
    });
  };

  const loginAppUser = userEmail => {
    if (!userEmail) {
      return;
    }
    const formData = {
      request: "vareappprofile",
      query: {
        email: userEmail.toLowerCase()
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData)
      .then(response => {
        if (response && response.token) {
          cookie.save("vare", response.token, {path: "/"});
          // setLoginUser("/");
          response["name"] = response.fullName;
          setStoreUser(response);
          // getContent();
          // setRefreshing(false);
          // alert("You have successfully logged in");
          // const urlHistory = history.location && history.location.pathname;
          window.location.reload();
          // history.push("/podcast");
        } else {
          // setRefreshing(false);
          alert(
            response && response.message
              ? response.message
              : "Please verify your Email and Password or Register your account."
          );
        }
      })
      .catch(err => {
        // setRefreshing(false);
        cookie.remove("vare", {path: "/"});
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setStoreUser("");
          alert(
            err &&
              err.response &&
              err.response.data &&
              err.response.data.message
          );
        }
      });
  };

  const getContent = () => {
    const queryInfo = {
      reply: false,
      mediaType: null
    };

    if (
      pathurl.current.search &&
      queryString.parse(pathurl.current.search) &&
      queryString.parse(pathurl.current.search).forum
    ) {
      queryInfo["mediaType"] = "forum";
    }

    const formData = {
      request: "search",
      query: {...queryInfo},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              if (rep.views) rep["views"] = JSON.parse(rep.views);
              return rep;
            })
          : [];

      if (data.length > 0) {
        // console.log("setStoredPodcastMedia", data);
        setStoredPodcastMedia([...data]);
      }
      // return data;
    });
  };

  const saveMessageLikes = async message => {
    const formData = {
      request: "insert",
      query: {
        likes: message.likes,
        user_id: message.user_id,
        item_id: message.item_id
      }, //add table key value to edit
      resource: "vare_contents", //add table name
      check: ["user_id", "item_id"]
    };
    const result = await RESTCall.axiosQuery(formData).then(contents => {
      return "done";
    });

    const info = result && (await updateMessageLikes(message));
    // console.log("likes", info);
    return info;
    // real["likes"] = info;
  };

  const updateMessageLikes = async message => {
    const formData = {
      request: "search",
      query: {item_id: message.item_id, date: message.date},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    return await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data
          : [];
      if (data.length > 0 && data[0].likes) {
        return JSON.parse(data[0].likes);
      }
    });
  };

  const saveMessageViews = async message => {
    const formData = {
      request: "insertstats",
      query: {
        views: message.views,
        user_id: message.user_id,
        item_id: message.item_id
      }, //add table key value to edit
      resource: "vare_contents", //add table name
      check: ["user_id", "item_id"]
    };
    const result = await RESTCall.axiosQuery(formData).then(contents => {
      return "done";
    });

    const info = result && (await updateMessageViews(message));
    // console.log("likes", info);
    return info;
    // real["likes"] = info;
  };

  const updateMessageViews = async message => {
    const formData = {
      request: "search",
      query: {item_id: message.item_id, user_id: message.user_id},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    return await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data
          : [];
      if (data.length > 0 && data[0].views) {
        return JSON.parse(data[0].views);
      }
    });
  };

  const databaseSaveVote = async props => {
    // alert(JSON.stringify(props.bill_id));
    // console.log("props", props);
    //TODO;
    // return;
    if (storeUser && storeUser.email) {
      const influencerInfo =
        !props.influencer_id || props.influencer_id == "NA"
          ? {}
          : {influencer_id: props.influencer_id};
      const dbVote = {
        ...influencerInfo,
        facebook: storeUser.facebook,
        instagram: storeUser.instagram,
        name: storeUser.name,
        img: storeUser.img,
        date: moment().format(),
        user_id: storeUser.user_id ? storeUser.user_id : storeUser.email,
        item_id: props["bill_id"] ? props["bill_id"] : props["item_id"],
        title: props["title"],
        vote: props["vote"],
        sex: storeUser.age,
        age: storeUser.age,
        race: storeUser.race,
        party: storeUser.party
      };
      // console.log("xxxx", props);

      const formData = {
        request: "insert",
        query: dbVote,
        resource: "vare_vote",
        check: ["item_id", "user_id"]
      };
      return await RESTCall.axiosQuery(formData)
        .then(response => {
          // console.log("postInfo", response);
          alert(
            'Your position has been saved.  Go to "My Reps" tab on the Vare App to see all your votes match with your Representatives.'
          );
          return response;
        })
        .catch(error => {
          return error;
        });
    }
  };

  const deleteMedia = async item => {
    if (window.confirm("Are you sure you want to delete?")) {
      const formData = {
        request: "delete",
        resource: "vare_contents",
        id: item._id
      };
      await RESTCall.axiosQuery(formData).then(response => {
        getContent();
      });
    }
  };

  const ListContentInfo = props => {
    const {real, index} = props;
    const [newLike, setNewLikes] = useState(false);
    const [newViews, setNewViews] = useState(false);

    useEffect(() => {
      // console.log("sss", real.likes);
      setNewLikes(real.likes);
      setNewViews(real.views);
    }, [real]);

    return (
      <>
        <div
          onClick={() => {
            setPictureUrl(real.img);
          }}
        >
          <UserAvatar
            size="40"
            name={real.name ? real.name : "Guest"}
            src={
              real.img
                ? real.img
                : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
            }
            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
          />
        </div>
        <div
          style={{
            width: "70%",
            flexDirection: "column",
            paddingLeft: 10
          }}
        >
          <div
            style={{
              width: "70%",
              fontSize: 14,
              fontWeight: "bold",
              color: "gray",
              display: "flex",
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                paddingRight: 6
              }}
            >
              {" "}
              {real.user_id && real.user_id.replace(/\s/g, "").length > 0
                ? real.name
                : "Vare Media"}
            </div>

            <i
              className={`fas fa-link`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: "#2096F3"
              }}
            >
              {` ${
                real.bill_id
                  ? real.bill_id + "  (Bill ID)"
                  : real.item_id + "  (Bill ID)"
              }`}
            </i>
          </div>
          <div
            style={{
              fontSize: 16,
              width: "70%",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {real.title ? real.title : ""}
          </div>

          <div
            style={{
              width: "100%",
              fontSize: 12,
              color: "gray",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div>{`views: ${
              newViews &&
              newViews.length &&
              !real.mediaType &&
              real.mediaType != "forum"
                ? newViews.length + 3239
                : newLike.length
                ? newLike.length
                : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>{`   likes: ${
              real.likes && real.likes.length ? real.likes.length : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>
              {real.date ? moment(real.date || moment.now()).fromNow() : ""}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 10,
            paddingTop: 15
          }}
        >
          <div style={{paddingLeft: 15}}>
            <i
              onClick={() => {
                setVideoUrl(real);
                setModalIsOpen(true);
              }}
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 10
              }}
              className={`fas fa-play`}
            />
          </div>
          <div
            style={{
              // ...shareStyle,
              paddingLeft: 15,
              marginBottom: 100
            }}
          >
            <RWebShare
              data={{
                text: real.name,
                url:
                  real.bill_id || real.item_id
                    ? window.location.href +
                      `https://www.varehall.com/podcast/?share=${
                        real.bill_id ? real.bill_id : real.item_id
                      }`
                    : window.location.href,
                title: real.title
              }}
              onClick={() => {
                alert(2);
                // shareItem(real);
              }}
            >
              <i
                style={{
                  backgroundColor: "#f2f3f5",
                  padding: 10,
                  borderRadius: 10
                }}
                className={`fas fa-share-alt`}
              />
            </RWebShare>
          </div>
          <div
            onClick={() => {
              if (!(storeUser && storeUser.email)) {
                alert("Please login to use this feature");
                return;
              }
              saveMessageLikes({
                ...real,
                likes:
                  !real.likes && storeUser
                    ? JSON.stringify([storeUser.user_id])
                    : real.likes && real.likes.includes(storeUser.user_id)
                    ? JSON.stringify(
                        real.likes.filter(res => res != storeUser.user_id)
                      )
                    : JSON.stringify([...real.likes, storeUser.user_id])
              }).then(rex => {
                setNewLikes(rex);
                // console.log("rex", rex, newLike, real.likes);
              });
            }}
            style={{paddingLeft: 15}}
          >
            <i
              style={{
                backgroundColor: "#f2f3f5",
                padding: 10,
                borderRadius: 10,
                color:
                  real.likes &&
                  storeUser &&
                  storeUser.user_id &&
                  real.likes.includes(storeUser.user_id)
                    ? "#2096F3"
                    : "black"
              }}
              className={`fas fa-2x fa-heart`}
            />
          </div>
        </div>
      </>
    );
  };

  const CardListContentInfo = ({real, index}) => {
    const [newLike, setNewLikes] = useState(false);
    const [newViews, setNewViews] = useState(false);

    useEffect(() => {
      // console.log("sss", real.likes);
      setNewLikes(real.likes);
      setNewViews(real.views);
    }, [real]);

    return (
      <>
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 15,
            zIndex: 11
          }}
        >
          <div
            onClick={() => {
              setPictureUrl(
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              );
            }}
          >
            <UserAvatar
              size="40"
              name={real.name ? real.name : "Guest"}
              src={
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
              // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
            />
          </div>
        </div>

        {videoUrl.video && videoUrl._id == real._id ? (
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        ) : (
          <img
            onClick={() => {
              setItemId(itemId == real.item_id ? false : real.item_id);
              setSharedVideo(true);
              setVideoUrl({});
              saveMessageViews({
                ...real,
                views: !newViews
                  ? JSON.stringify([storeUser.user_id])
                  : // : newViews && newViews.includes(storeUser.user_id)
                    // ? JSON.stringify(
                    //     newViews.filter(res => res != storeUser.user_id)
                    //   )
                    JSON.stringify([...newViews, storeUser.user_id])
              }).then(rex => {
                const newRex = rex.filter(rec => rec != null);
                // console.log("setNewViews", newRex);

                setNewViews(newRex);
                // xxconsole.log("rex", rex, newLike, real.likes);
              });
            }}
            width={"100%"}
            height={250}
            src={
              real.picture
                ? real.picture
                : "https://varefiles.s3.us-east-2.amazonaws.com/meetings.jpg"
            }
            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
          />
        )}

        <div
          style={{
            position: "relative",
            top:
              // detailsIndex == index ||
              videoUrl.video && videoUrl._id == real._id ? -25 : -35,
            borderRadius: 10,
            backgroundColor: "rgba(0,0,0,.80)",
            width: "90%",
            left: "5%",
            // height: "100%",
            // display: "flex",
            marginBottom: 10,
            flexDirection: "column",
            // backgroundColor: "rgba(0,0,0,.50)",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            color: "white"
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: 14,
              fontWeight: "bold",
              color: "red",
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div
              onClick={() => {
                // setItemId(itemId == real.item_id ? false : real.item_id);
                // setSharedVideo(true);
                // setVideoUrl({});
              }}
              style={{
                flexDirection: "column",
                width: "100%",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  // paddingRight: 6,
                  textAlign: "center",
                  height: 30
                }}
                onClick={() => {
                  setVideoUrl(
                    !(videoUrl.video && videoUrl._id == real._id) ? real : {}
                  );
                  setShowMenuIndex(real.item_id);
                }}
              >
                <i
                  className={`fas fa-2x fa-${
                    !(videoUrl.video && videoUrl._id == real._id)
                      ? "play-circle"
                      : "stop"
                  }`}
                  style={{
                    // position: "absolute",
                    // top: -5,
                    // fontSize: 12,
                    // marginRight: 70,
                    // fontWeight: "bold",
                    color: "red"
                  }}
                />
                {/*<div style={{paddingLeft: 30}}>
                  {`  ${
                    real.date ? moment(real.date || moment.now()).fromNow() : ""
                  }`}
                </div>*/}
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center"
            }}
          >
            <div
              onClick={() => {
                setShowMenuIndex(
                  showMenuIndex == real.item_id ? -1 : real.item_id
                );
                // setItemId(itemId == real.item_id ? false : real.item_id);
                // setSharedVideo(true);
                // setVideoUrl({});
              }}
              style={{
                padding: 10,
                fontSize: 18,
                fontWeight: "bold",
                width: "100%",
                // display: "flex",
                flexWrap: "wrap",
                textAlign: "center"
              }}
            >
              {real.title ? real.title + "..." : ""}
            </div>
            <div
              style={{
                fontSize: 13
              }}
            >
              {`Post By:  ${
                real.user_id &&
                real.user_id.replace(/\s/g, "").length > 0 &&
                real.name != "Oluwalowo Oluwadamilola"
                  ? real.name
                  : "Vare Media"
              }`}
            </div>
            {/*<i
              style={{
                paddingLeft: 15,
                color: "#2096F3"
              }}
              className={`fas fa-x fa-chart-pie`}
            >{`  ${"View Poll"}`}</i>*/}

            {real.bill_id && real.bill_id && (
              <div
                style={{
                  paddingTop: 10,
                  paddingLeft: 20,
                  paddingBottom: 10,
                  fontSize: 12,
                  // paddingLeft: 6,
                  // fontWeight: "bold",
                  color: "#2096F3"
                }}
              >
                {` ${
                  real.bill_id && real.bill_id
                    ? real.bill_id + "  (Bill Details)"
                    : "Bill Detail"
                }`}
              </div>
            )}

            <div
              style={{
                position: "relative",
                display: "flex",
                // width: "100%",
                // left: "20%",
                // alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",

                paddingTop: 10,
                paddingBottom: 10
              }}
              onClick={() => {
                if (!(storeUser && storeUser.email)) {
                  alert("Please login to use this feature");
                  return;
                }
                setChartId(chartId == real.item_id ? false : real);
                setShowMenuIndex(real.item_id);
              }}
            >
              <VoteChart
                setChartId={setChartId}
                chartId={chartId}
                real={real}
                innerFont={13}
                width={210}
                fontSize={13}
              />
            </div>
          </div>

          {showMenuIndex == real.item_id && (
            <>
              <div
                style={{
                  paddingTop: 10,
                  paddingLeft: 10,

                  fontWeight: "bold",
                  width: "100%",
                  // fontSize: 16,
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  // backgroundColor: "rgba(0,0,0,.50)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12
                }}
              >
                <div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <i
                    onClick={() => {
                      real.bill_id &&
                        window.open(
                          `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                            real.bill_id +
                            `"}`,
                          "_blank"
                        );
                    }}
                    className={`fas fa-2x fa-eye`}
                  />
                  <div>{`${
                    newViews &&
                    newViews.length &&
                    !real.mediaType &&
                    real.mediaType != "forum"
                      ? newViews.length + 3239
                      : newLike && newLike.length
                      ? newLike.length
                      : 0
                  }`}</div>
                </div>

                {/*<div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                  onClick={() => {
                    if (!(storeUser && storeUser.email)) {
                      alert("Please login to use this feature");
                      return;
                    }
                    saveMessageLikes({
                      ...real,
                      likes: !newLike
                        ? JSON.stringify([storeUser.user_id])
                        : newLike && newLike.includes(storeUser.user_id)
                        ? JSON.stringify(
                            newLike.filter(res => res != storeUser.user_id)
                          )
                        : JSON.stringify([...newLike, storeUser.user_id])
                    }).then(rex => {
                      setNewLikes(rex);
                      // xxconsole.log("rex", rex, newLike, real.likes);
                    });
                  }}
                >
                  ss
                  <i
                    style={{
                      color:
                        newLike &&
                        storeUser &&
                        storeUser.user_id &&
                        newLike.includes(storeUser.user_id)
                          ? "#2096F3"
                          : "white"
                    }}
                    className={`fas fa-2x fa-heart`}
                  />
                  <div>{`${
                    newLike && newLike.length ? 24 + newLike.length * 1 : 0
                  }`}</div>
                </div>}

                {/*<div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <i
                    onClick={() => {
                      setVideoUrl(
                        !(videoUrl.video && videoUrl._id == real._id)
                          ? real
                          : {}
                      );
                    }}
                    style={
                      {
                        // backgroundColor: "red"
                        // padding: 10,
                        // borderRadius: 10
                      }
                    }
                    className={`fas fa-2x fa-${
                      !(videoUrl.video && videoUrl._id == real._id)
                        ? "play"
                        : "stop"
                    }`}
                  />
                  <div>
                    {!(videoUrl.video && videoUrl._id == real._id)
                      ? "play"
                      : "stop"}
                  </div>
                </div>*/}

                {/*<div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <i
                    onClick={() => {
                      if (!(storeUser && storeUser.email)) {
                        alert("Please login to use this feature");
                        return;
                      }
                      if (userSource && userSource == "app") {
                        window.open(
                          `${
                            pathurl.current.search.includes("add=") &&
                            pathurl.current.search.split("add=")[1]
                              ? "/podcast" +
                                pathurl.current.search.split("add=")[0] +
                                "add=" +
                                real.item_id
                              : "/podcast" +
                                pathurl.current.search +
                                "&add=" +
                                real.item_id
                          }
                          `,
                          "_self"
                        );
                      } else {
                        alert(
                          "Please download app to add post.  Find links on menu bar."
                        );
                      }
                    }}
                    style={{}}
                    className={`fas fa-2x fa-folder-plus`}
                  />
                  <div>{"post"}</div>
                </div>*/}

                {(userSource &&
                  userSource == "app" &&
                  real.email == storeUser.email) ||
                (storeUser && keyUsers.includes(storeUser.email)) ? (
                  <>
                    {" "}
                    <div
                      style={{
                        width: "20%",
                        flexDirection: "column"
                      }}
                    >
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }
                          if (userSource && userSource == "app") {
                            window.open(
                              `${
                                pathurl.current.search.includes("edit=") &&
                                pathurl.current.search.split("edit=")[1]
                                  ? "/podcast" +
                                    pathurl.current.search.split("edit=")[0] +
                                    "edit=" +
                                    real.item_id
                                  : "/podcast" +
                                    pathurl.current.search +
                                    "&edit=" +
                                    real.item_id
                              }
                          `,
                              "_self"
                            );
                          } else {
                            alert("Edits only available on app at this time");
                          }
                        }}
                        style={{}}
                        className={`fas fa-2x fa-edit`}
                      />
                      <div>{"edit"}</div>
                    </div>
                    <div
                      style={{
                        width: "20%",
                        flexDirection: "column"
                      }}
                    >
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }
                          deleteMedia(real);
                          // window.open(
                          //   `${
                          //     pathurl.current.search.includes("delete=") &&
                          //     pathurl.current.search.split("delete=")[1]
                          //       ? "/podcast" +
                          //         pathurl.current.search.split("delete=")[0] +
                          //         "delete=" +
                          //         real._id
                          //       : "/podcast" +
                          //         pathurl.current.search +
                          //         "&delete=" +
                          //         real._id
                          //   }
                          //   `,
                          //   "_self"
                          // );
                        }}
                        style={{}}
                        className={`fas fa-2x fa-trash`}
                      />
                      <div>{"trash"}</div>
                    </div>
                  </>
                ) : null}

                <div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <div>
                    {userSource && userSource == "app" ? (
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }

                          window.open(
                            `${
                              pathurl.current.search.includes("share=") &&
                              pathurl.current.search.split("share=")[1]
                                ? "/podcast" +
                                  pathurl.current.search.split("share=")[0] +
                                  "share=" +
                                  real.item_id
                                : "/podcast" +
                                  pathurl.current.search +
                                  "&share=" +
                                  real.item_id
                            }
                          `,
                            "_self"
                          );
                        }}
                        style={{}}
                        className={`fas fa-2x fa-share-alt`}
                      />
                    ) : (
                      <div>
                        <RWebShare
                          data={{
                            text: real.name,
                            url:
                              real.bill_id || real.item_id
                                ? `https://www.varehall.com/podcast/?share=${
                                    real.bill_id ? real.bill_id : real.item_id
                                  }`
                                : window.location.href,
                            title: real.title
                          }}
                          style={{
                            position: "absolute",
                            zIndex: 20
                          }}
                          onClick={info => {
                            // console.log(info);
                          }}
                        >
                          <i style={{}} className={`fas fa-2x fa-share-alt`} />
                        </RWebShare>
                      </div>
                    )}

                    <div>{"share"}</div>
                  </div>
                  {/*<RWebShare
                      data={{
                        text: "Your Bill Updates Shared from Vare",
                        url: real.bill_id
                          ? `https://vare-meetingapp.herokuapp.com/podcast?id=${real.bill_id}`
                          : window.location.href,
                        title: real.title
                      }}
                      onClick={() => {
                        shareItem(index);
                      }}
                    >
                      <i
                        style={{
                          backgroundColor: "#f2f3f5",
                          padding: 10,
                          borderRadius: 10
                        }}
                        className={`fas fa-share-alt`}
                      />
                    </RWebShare>*/}
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const CardSubListContentInfo = ({pic, index}) => {
    // const [detailsIndex, setDetailsIndex] = useState(-1);

    return (
      <div>
        <img
          style={{
            borderRadius: 10
          }}
          width={200}
          height={200}
          src={
            pic
              ? pic
              : "https://varefiles.s3.us-east-2.amazonaws.com/meetingpic1.jpg"
          }
        />
        <div
          style={{
            // position: "absolute",
            height: 120,
            width: 200,
            borderRadius: 10
            // backgroundImage: `url(${real.picture}`
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 15,
              padding: 2
            }}
            onClick={() => {
              setPictureUrl(pic);
            }}
          >
            <UserAvatar
              size="40"
              name={"Guest"}
              src={
                pic
                  ? pic
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
              // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const PodcastContent = ({real, index}) => {
    return (
      <Colxx sm={12} lg={itemId ? 12 : 6}>
        <div
          style={{
            paddingLeft: 10,
            width: "100%"
            // display: "flex"
          }}
        >
          {/*<div
            style={{
              position: "absolute",
              right: 50,
              bottom: "50%",
              zIndex: 14
            }}
          >
            <i
              className={`fas fa-2x fa-${
                showEchoIndex == index ? "ellipsis-v" : "ellipsis-v"
              }`}
              onClick={() => {
                getEchoDetails(real.item_id);
                setShowEchoIndex(showEchoIndex == index ? -1 : index);
                if (showEchoIndex == index) {
                  setStoredEchoMedia(false);
                }
                setVideoUrl({});
              }}
              style={{
                color: "red"
              }}
            />
          </div>*/}
          {fullView ? (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                padding: 10,
                flexDirection: "row"
              }}
            >
              <ListContentInfo real={real} index={index} />
            </Card>
          ) : (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                minHeight: 450,
                padding: 10,
                // marginBottom: 120,
                flexDirection: "row",
                overflowX: showEchoIndex == index ? "scroll" : "hidden",
                overflowY: "hidden"
              }}
            >
              {showEchoIndex == index &&
              real.pictures &&
              real.pictures.length > 0 ? (
                JSON.parse(real.pictures).map((pic, i) => {
                  // console.log("videoUrl", videoUrl, rep);
                  return (
                    <div
                      style={{
                        paddingRight: 20
                      }}
                      key={"sjhdhssh" + i}
                    >
                      <CardSubListContentInfo pic={pic} index={i} />
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    position: "relative",
                    width: "100%"
                  }}
                >
                  <CardListContentInfo real={real} index={index} />
                </div>
              )}
            </Card>
          )}
        </div>
      </Colxx>
    );
  };

  return (
    <React.Fragment>
      {!(userSource && userSource == "app") ? (
        <PageMenu
          setLoginUser={setLoginUser}
          loginUser={loginUser}
          // handleRegisterUser={info => {
          //   setRegisterUser(info);
          // }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          marginTop: !(userSource && userSource == "app") ? 65 : 25,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"}`,
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
                  podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.filter(rep => {
                    return JSON.stringify(rep)
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
                // console.log("newItem", newItem);
                setSearchPodcastMedia(newItem);
                setSearchText(text);
              }}
            />{" "}
          </div>
          <div>
            <i
              onClick={() => {
                setSearchText("");
                // alert("Not found");
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
          // paddingTop: 90,
          width: "100%"

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
          {"Policy Podcast Collections"}
          <i
            onClick={() => {
              setFullView(!fullView);
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              color: "black"
            }}
            className={`fas fa-x fa-${fullView ? "arrows-alt" : "expand"}`}
          />
        </div>
      </div>
      <div
        style={{
          paddingBottom: 80
        }}
        className="row"
      >
        <PageModal
          header={`Member Votes `}
          activeUser={"activeUser"}
          setActiveUser={() => {
            // alert(2);
            // setModalIsOpen(false);
            setChartId(false);
          }}
          modalIsOpen={chartId ? true : false}
          setModalIsOpen={() => {}}
          myWidth={350}
          myHeight={300}
        >
          <MultiTag setChartId={setChartId} chartId={chartId} />
        </PageModal>
        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setPictureUrl(false);
          }}
          modalIsOpen={pictureUrl ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <img
            width="100%"
            // height="240"
            key={pictureUrl}
            controls
            autoPlay
            src={pictureUrl}
          />
        </PageModal>

        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setVideoUrl({});
          }}
          modalIsOpen={videoUrl && videoUrl.video && modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        </PageModal>

        {/*<PageModal
          header={`Member Votes `}
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setChartId(false);
          }}
          modalIsOpen={chartId ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <MultiTag setChartId={setChartId} chartId={chartId} />
        </PageModal>*/}

        <div
          style={{
            // paddingTop: 30,
            display: "inline-block",
            width: "100%",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Row
            style={{
              // paddingTop: 30,
              // display: "flex",
              width: "100%",
              // flexDirection: "row",
              // paddingLeft: "10%"
              justifyContent: "center",
              alignSelf: "center"
            }}
            sm={12}
            lg={12}
          >
            {itemId ? (
              <Colxx sm={12} lg={6}>
                <VideoModal
                  updateMessageLikes={updateMessageLikes}
                  // setLoginUser={setLoginUser}
                  page={"podcast"}
                  saveMessageLikes={saveMessageLikes}
                  setSharedVideo={setSharedVideo}
                  sharedVideo={sharedVideo}
                  setItemId={setItemId}
                  item_id={itemId}
                />
              </Colxx>
            ) : null}
            {itemId ? (
              <Colxx sm={12} lg={6}>
                {podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.map((real, index) => {
                    // console.log("jjj", real);
                    return (
                      <PodcastContent
                        key={"fdkvldhsgjsd" + real._id}
                        real={real}
                        index={index}
                      />
                    );
                  })}
              </Colxx>
            ) : (
              podcastMedia &&
              podcastMedia.length > 0 &&
              podcastMedia.map((real, index) => {
                // console.log("jjj", real);
                return (
                  <PodcastContent
                    key={"fdkvldhsgjsd" + real._id}
                    real={real}
                    index={index}
                  />
                );
              })
            )}
          </Row>
        </div>
      </div>
      {/*<input ref={echoInfo} name={"echoInfo"} value={3333} />*/}
      {!(userSource && userSource == "app") ? (
        <PageFooter setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : null}
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

export default PodcastModal;
