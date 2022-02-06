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
import {RWebShare} from "react-web-share";
import moment from "moment";

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

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

const VideoModal = props => {
  const {
    saveMessageLikes,
    updateMessageLikes,
    query,
    page,
    setSharedVideo,
    sharedVideo,
    item_id,
    setItemId,
    setLoginUser
  } = props;
  const history = useHistory();

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
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [propsParam, setPropsParam] = useState({...props});
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const [replyId, setReplyId] = useState("");
  const [replyArray, setReplyArray] = useState("");
  const [showEcho, setShowEcho] = useState(true);
  const [echoVideoUrl, setEchoVideoUrl] = useState(true);

  const [shareItem, setShareItem] = useState({});
  const [videoUrl, setVideoUrl] = useState({});
  const [newLike, setNewLikes] = useState(false);

  const socketRef = useRef();
  const videoRef = useRef();

  const pathurl = useRef(history.location);

  useEffect(() => {
    if (item_id && page == "podcast") history.push(`/podcast?share=${item_id}`);
    getMediaInfo({resource: "vare_contents", query: {item_id: item_id}});
  }, [item_id]);

  useEffect(() => {
    // console.log("replyArray", replyArray, videoUrl);
    setNewLikes(videoUrl.likes);
  }, [replyArray, videoUrl]);

  const getMediaInfo = async ({resource, query}) => {
    const formData = {
      request: "search",
      query: {
        ...query
      },
      resource: resource
    };
    const eventDetails = await RESTCall.axiosQuery(formData).then(response => {
      // console.log("jjjj", response);
      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              if (rep.views) rep["views"] = JSON.parse(rep.views);
              return rep;
            })
          : [];

      if (data && data.length > 0) {
        const mainContent = data.filter(rep => !rep.reply);
        if (mainContent && mainContent.length > 0) {
          setVideoUrl(mainContent[0]);
        }
        setReplyArray([...data]);
      }
      // return data;
    });
  };

  const loadMessages = async () => {
    socketRef.current = io.connect(myURL, {
      origins: "*:*"
    });
    socketRef.current.emit("general message", [{item_id: videoUrl.item_id}]);
    socketRef.current.on("general message", chat => {
      // console.log("xxxx", chat);
      const newChats = chat && chat.length > 0 ? [...chat] : [...msg];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMsg(newChats);
    });
  };

  const likeChat = chat => {
    const parseLikes =
      chat.likes && Array.isArray(JSON.parse(chat.likes))
        ? JSON.parse(chat.likes)
        : "";
    const pos =
      parseLikes &&
      parseLikes
        .map(function(e) {
          return e.user_id;
        })
        .indexOf(storeUser.user_id);
    // console.log("pos", pos);

    const newLike =
      pos && pos >= 0
        ? parseLikes.splice(0, pos)
        : parseLikes && parseLikes.length > 0
        ? parseLikes.push({
            name: storeUser.name,
            user_id: storeUser.user_id,
            img: storeUser.img
          })
        : [
            {
              name: storeUser.name,
              user_id: storeUser.user_id,
              img: storeUser.img
            }
          ];

    chat["likes"] =
      newLike && Array.isArray(newLike) ? JSON.stringify(newLike) : "";
    delete chat["comment"];
    socketRef.current.emit("save chat", chat);
    socketRef.current.on("meeting message", chat => {
      // const oldChats = msg.filter(rep => rep._id != chat._id)
      const newChats = chat && chat.length > 0 ? [...chat] : [...msg];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMsg(newChats);
      // console.log('newChats',newChats)
    });
  };

  const saveChatList = data => {
    let chat = {...videoUrl, ...data};
    chat["img"] = storeUser.img;
    if (replyId != "" && chat.comment && chat.comment.includes("@")) {
      chat["replyId"] = replyId;
    }

    socketRef.current.emit("save chat", chat);
    socketRef.current.on("meeting message", chat => {
      const newChats = chat && chat.length > 0 ? [...chat] : [...msg];

      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });

      setReplyId("");
      setReplyArray("");
      setMsg(newChats);
      // console.log('newChats',newChats)
    });
  };

  const deleteChat = chat => {
    // console.log('msg',chat)
    chat.id = chat._id;
    chat.resource = "vare_meeting_rsvp";
    socketRef.current = io.connect(myURL, {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current.emit("delete chat", chat);
    socketRef.current.on("meeting message", chat => {
      // const newChats = [...chat, ...msg];
      const newChats = chat && chat.length > 0 ? [...chat] : [...msg];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMsg(newChats);
      // console.log('msg',chat)
    });
  };

  const EchoComponent = ({allMsg, msg, index, setReplyId}) => {
    useEffect(() => {
      // console.log("userVideo", msg);
    }, []);
    return (
      <div
        onClick={() => {
          setVideoUrl(msg);
        }}
        style={{
          // borderTopWidth: "solid",
          borderBottom: "1px solid rgb(212, 212, 212)",
          // borderBottomColor: "red",
          width: "100%",
          padding: 10,
          display: "flex",
          flexDirection: "row",
          // backgroundColor: "#f2f3f5",
          marginBottom: 3,
          backgroundColor: msg._id == videoUrl._id ? "#f2f3f5" : ""
        }}
      >
        {msg.picture ? (
          <img src={msg.picture} height={100} width={200} />
        ) : (
          <UserAvatar
            size="40"
            name={msg.name ? msg.name : "Guest"}
            src={
              msg.img
                ? msg.img
                : "https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
            }
            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
          />
        )}

        <div
          style={{
            width: 300,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              marginLeft: 8,
              color: "gray",
              fontSize: 12
              // fontWeight: "bold"
            }}
            className=""
          >
            {`${msg.name} -${msg.date ? getDatePeriod(msg.date) : moment()}`}
          </div>

          <div
            style={{
              margin: 10,
              // paddingLeft: 10,
              fontSize: 12
              // color: "#2096F3"
            }}
          >
            {`  ${msg.title && msg.title ? msg.title : ""}`}
          </div>
          <div
            style={{
              width: "100%",
              paddingLeft: 10,
              fontSize: 12,
              color: "gray",
              display: "flex",
              flexDirection: "row"
            }}
          >
            {/*  <div>{`views: ${
              msg.views && !msg.mediaType && msg.mediaType != "forum"
                ? msg.views.length + 3239
                : 0 + msg.likes && msg.likes.length
                ? msg.likes.length
                : 0
            }`}</div>*/}
            <div style={{paddingLeft: 20}}>
              {`   likes: ${
                msg.likes && msg.likes.length ? msg.likes.length : 0
              }`}
            </div>

            <div style={{paddingLeft: 20}}>
              {`   comments: ${
                msg.comments && msg.comments.length ? msg.comments.length : 0
              }`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CommentsComponent = ({allMsg, msg, index, setReplyId}) => {
    useEffect(() => {
      // console.log("userVideo", msg);
    }, []);
    return (
      <div
        style={{
          // borderTopWidth: "solid",
          borderBottom: "1px solid rgb(212, 212, 212)",
          // borderBottomColor: "red",
          width: "100%",
          padding: 10,
          display: "flex",
          flexDirection: "row",
          // backgroundColor: "#f2f3f5",
          marginBottom: 3
        }}
      >
        <UserAvatar
          size="40"
          name={msg.name ? msg.name : "Guest"}
          src={
            msg.img
              ? msg.img
              : "https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
          }
          // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
        />
        <div
          style={{
            width: 300,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              marginLeft: 8,
              color: "gray",
              fontSize: 12
              // fontWeight: "bold"
            }}
            className=""
          >
            {`${msg.name} ${msg.date ? "-" + getDatePeriod(msg.date) : ""}`}
          </div>

          <span
            style={{
              margin: 10,
              paddingLeft: 10,
              fontSize: 12,
              color: "#2096F3"
            }}
          >
            {`  ${
              msg.comment && msg.comment.includes(":")
                ? msg.comment.split(":")[0]
                : ""
            }`}
            <span
              style={{
                paddingLeft: 10,
                fontSize: 12,
                color: "black"
              }}
            >
              {`${
                msg.comment && msg.comment.includes(":")
                  ? msg.comment.split(":")[1]
                  : msg.comment
              }`}{" "}
            </span>
          </span>
          <CommentControls
            allMsg={allMsg}
            msg={msg}
            index={index}
            setReplyId={setReplyId}
          />
        </div>
      </div>
    );
  };

  const CommentControls = ({allMsg, msg, index, setReplyId}) => {
    // console.log("ppppp", msg);
    const replyCount = allMsg.filter(
      rep => rep.replyId && rep.replyId == msg._id
    ).length;
    const message =
      "LATEST NAIJA AFROBEAT 2021 NONSTOP PARTY MIX BY DJ FINEX FT REMA JOEBOY TEKNO OMAH reretretretertretretertret ";
    return (
      <>
        <div
          style={{
            color: "#1c1e21",
            flexDirection: "row",
            // flexWrap: "wrap",
            width: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            onClick={() => {
              likeChat(msg);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 20,
              width: 45,
              borderRadius: 100
            }}
          >
            <i
              style={{
                //marginBottom: 6,
                marginTop: 3,
                textAlign: "center",
                color:
                  msg.likes &&
                  Array.isArray(JSON.parse(msg.likes)) &&
                  JSON.parse(msg.likes).filter(function(e) {
                    return e.user_id == storeUser.user_id;
                  })
                    ? "#2096F3"
                    : "gray"
              }}
              // name={"times"}
              className={`fas fa-heart`}
            />
            <div
              onClick={() => {}}
              style={{
                fontSize: 10,
                marginTop: 3,
                textAlign: "center",
                color: "#1c1e21"
              }}
            >
              {" "}
              <span style={{paddingLeft: 4}}>
                {msg.likes && Array.isArray(JSON.parse(msg.likes))
                  ? JSON.parse(msg.likes).length
                  : ""}
              </span>
            </div>
          </div>

          <div
            onClick={() => {}}
            style={{
              // backgroundColor: "white",
              // margin: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 20,
              width: 45,
              borderRadius: 100
              // flexDirection: "column"
            }}
          >
            <i
              style={{
                marginTop: 3,
                textAlign: "center",
                color: "gray"
              }}
              className={`fas fa-comment-dots`}
            />
            <div
              style={{
                fontSize: 10,
                marginTop: 3,
                textAlign: "center",
                color: "#1c1e21"
              }}
            >
              {" "}
              <span style={{paddingLeft: 4}}>
                {msg.reply && JSON.parse(msg.reply)
                  ? JSON.parse(msg.reply).length
                  : ""}
              </span>
            </div>
          </div>

          <div
            onClick={() => {
              setReplyId(msg._id == replyId ? "" : msg._id);
              msg._id == replyId && setReplyArray();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 20,
              width: 45,
              borderRadius: 100
              // flexDirection: "row"
            }}
          >
            <i
              style={{
                marginTop: 3,
                textAlign: "center",
                color: replyId && replyId == msg._id ? "#2096F3" : "gray"
              }}
              className={`fas fa-reply`}
            />
            <div
              onClick={() => {}}
              style={{
                fontSize: 10,
                marginTop: 3,
                textAlign: "center",
                color: "#1c1e21"
              }}
            >
              {" "}
              <span style={{paddingLeft: 4}}>
                {replyCount > 0 ? replyCount : ""}
              </span>
            </div>
          </div>

          {msg.user_id == storeUser.user_id ? (
            <div
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this message?"
                  )
                ) {
                  // Save it!
                  deleteChat(msg);
                } else {
                  // Do nothing!
                  // console.log("Thing was not saved to the database.");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 45,
                borderRadius: 100
                // flexDirection: "row"
              }}
            >
              <i
                style={{
                  marginTop: 3,
                  textAlign: "center",
                  color: "gray"
                }}
                className={`fas fa-trash-alt`}
              />
            </div>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        // marginBottom: 100,
        // overflowY: "scroll",
        // height: 800,

        // display: "flex",
        width: "100%",
        backgroundColor: "#f2f3f5"
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center"
        // top: "55%",
        // position: "absolute",
        // left: "50%",
        // transform: "translate(-50%, -50%)"
      }}
    >
      <div
        style={{
          // display: "flex",
          padding: 30,

          backgroundColor: "#f2f3f5"

          // backgroundColor: "white",
        }}
      >
        <div>
          <div
            style={{
              margin: 10
            }}
          >
            {echoVideoUrl && echoVideoUrl.video && echoVideoUrl._id ? (
              <video
                width="100%"
                height="240"
                key={echoVideoUrl._id}
                controls
                // autoPlay
              >
                <source src={echoVideoUrl.video} />
              </video>
            ) : videoUrl && videoUrl.video && videoUrl._id ? (
              <video
                width="100%"
                height="240"
                key={videoUrl._id}
                controls
                // autoPlay
              >
                <source src={videoUrl.video} />
              </video>
            ) : null}
          </div>

          <div
            style={{
              // display: "flex",
              // position: "static",
              // left: 300,
              right: 0,
              zIndex: 999
            }}
          >
            <div
              style={{
                display: "flex",
                paddingTop: 15
              }}
            >
              <div
                style={{
                  // ...shareStyle,
                  paddingLeft: 15
                }}
              >
                <RWebShare
                  data={{
                    text: videoUrl.name,
                    url:
                      videoUrl.bill_id || videoUrl.item_id
                        ? window.location.href +
                          `https://www.varehall.com/podcast/?share=${
                            videoUrl.bill_id
                              ? videoUrl.bill_id
                              : videoUrl.item_id
                          }`
                        : window.location.href,
                    title: videoUrl.title
                  }}
                  onClick={() => {}}
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
                    ...videoUrl,
                    likes: !newLike
                      ? JSON.stringify([storeUser.user_id])
                      : newLike && newLike.includes(storeUser.user_id)
                      ? JSON.stringify(
                          newLike.filter(res => res != storeUser.user_id)
                        )
                      : JSON.stringify([...newLike, storeUser.user_id])
                  }).then(rex => {
                    setNewLikes(rex);
                    // xxconsole.log("rex", rex, newLike, videoUrl.likes);
                  });
                }}
                style={{paddingLeft: 15, paddingRight: 15}}
              >
                <i
                  style={{
                    backgroundColor: "#f2f3f5",
                    padding: 10,
                    borderRadius: 10,
                    color:
                      newLike &&
                      storeUser.user_id &&
                      newLike.includes(storeUser.user_id)
                        ? "#2096F3"
                        : "black"
                  }}
                  className={`fas fa-heart`}
                />
              </div>
              <div
                onClick={() => {
                  // history.push("/podcast");
                  setItemId(false);
                  setSharedVideo(false);
                  history.push("/podcast");

                  // setLoginUser("podcast");
                }}
                style={{padding: 8, color: "red"}}
              >
                {`  ${"Exit"}`}
              </div>
            </div>
          </div>

          <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
            <div style={{padding: 10}}>
              <UserAvatar
                size="60"
                name={videoUrl.name ? videoUrl.name : "Guest"}
                src={
                  videoUrl.img
                    ? videoUrl.img
                    : "https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
                }
                // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
              />
            </div>
            <div
              style={{
                // position: "absolute",
                bottom: 10,
                // backgroundColor: "rgba(0,0,0,.2)",
                width: "95%",
                flexDirection: "column",
                paddingLeft: 10,
                color: "white",
                padding: 10
              }}
            >
              <div
                style={{
                  width: "100%",
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
                  {videoUrl.name}
                </div>

                <i
                  className={`fas fa-link`}
                  onClick={() => {
                    videoUrl.bill_id
                      ? window.open(
                          `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                            videoUrl.bill_id +
                            `"}`,
                          "_blank"
                        )
                      : alert("No link Available");
                  }}
                  style={{
                    paddingTop: 2,
                    fontSize: 12,
                    // paddingLeft: 6,
                    // fontWeight: "bold",
                    color: "#2096F3"
                  }}
                >
                  {videoUrl.bill_id
                    ? videoUrl.bill_id
                    : videoUrl.date
                    ? videoUrl.date
                    : videoUrl.publishedAt
                    ? videoUrl.publishedAt
                    : ""}
                </i>
              </div>
              <div
                style={{
                  fontSize: 14,
                  width: "70%",
                  display: "flex",
                  flexWrap: "wrap",
                  color: "gray"
                }}
              >
                {videoUrl.title ? videoUrl.title : ""}
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  fontSize: 12,
                  color: "gray",
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <div>{`views: ${
                  videoUrl.views &&
                  !videoUrl.mediaType &&
                  videoUrl.mediaType != "forum"
                    ? videoUrl.views.length + 3239
                    : newLike && newLike.length
                    ? newLike.length
                    : 0
                }`}</div>
                <div style={{paddingLeft: 20}}>{`   likes: ${
                  newLike && newLike.length ? 24 + newLike.length * 1 : 0
                }`}</div>

                <div style={{paddingLeft: 20}}>
                  <i
                    onClick={() => {
                      setShowEcho(!showEcho);
                    }}
                    style={{
                      color:
                        videoUrl.comments && videoUrl.comments.length > 0
                          ? "#2096F3"
                          : ""
                    }}
                    className={`fas fa-comments`}
                  >
                    {`   comments: ${
                      videoUrl.comments && videoUrl.comments.length
                        ? videoUrl.comments.length
                        : 0
                    }`}
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            // display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            paddingBottom: 15
            // height: window.screen.height * 0.5
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              // height: window.innerHeight,
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "white",
              marginLeft: 25,
              marginRight: 25
            }}
          >
            {showEcho && replyArray && replyArray.length > 0
              ? replyArray.map((rep, index) => {
                  return (
                    <div key={"sssddewww" + index}>
                      <EchoComponent
                        setReplyId={setReplyId}
                        index={index}
                        msg={rep}
                        allMsg={msg}
                      />
                    </div>
                  );
                })
              : msg && msg.length > 0
              ? msg.map((rep, index) => {
                  return (
                    <div key={"sssddewww" + index}>
                      <CommentsComponent
                        setReplyId={setReplyId}
                        index={index}
                        msg={rep}
                        allMsg={msg}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default VideoModal;
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);
