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
    resource,
    query,
    real,
    setSharedVideo,
    sharedVideo
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
  const [mediaDetails, setMediaDetails] = useState(false);
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const [replyId, setReplyId] = useState("");
  const [replyArray, setReplyArray] = useState("");

  const [shareItem, setShareItem] = useState({});
  const [videoUrl, setVideoUrl] = useState({});

  const socketRef = useRef();
  const videoRef = useRef();

  const pathurl = useRef(history.location);

  useEffect(() => {
    if (query && resource) getMediaInfo();
  }, []);

  const getMediaInfo = async () => {
    const formData = {
      request: "search",
      query: {
        ...query
      },
      resource: resource
    };
    const eventDetails = await RESTCall.axiosQuery(formData).then(response => {
      const data = response && response.data && response.data[0];
      setMediaDetails(data);
      return data;
    });
  };

  useEffect(() => {
    console.log("mediaDetails", mediaDetails);
    //     _id:'604465c91b269956a6fdb745'
    // date:"2021-3-6 23:34:0",
    // meeting_id:"2",
    // sender_id:"deetester@test.com",
    // comment:"Ggggggggggg",
    // likes:"",
    // name:"Deetester",
    // reply:"[{"date":"2021-03-07T05:34:00.063Z","name":"Deetester","user_id":"deet..."
    // if (mediaDetails && Object.keys(mediaDetails).length > 0) loadMessages();
  }, [mediaDetails]);

  const loadMessages = async () => {
    socketRef.current = io.connect(myURL, {
      origins: "*:*"
    });
    socketRef.current.emit("general message", [
      {item_id: mediaDetails.item_id}
    ]);
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
    let chat = {...mediaDetails, ...data};
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
        top: 0,
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,.80)",
        zIndex: 99999,
        marginBottom: 200
      }}
    >
      <div
        style={{
          paddingTop: 150,
          marginBottom: 150,
          overflowY: "scroll",
          // height: 400,
          width: 400,
          top: 260,
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <div
          style={{
            // display: "flex",
            // width: 300,
            marginTop: 80,
            backgroundColor: "#f2f3f5",

            // backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            onClick={() => {
              setSharedVideo(!sharedVideo);
            }}
            style={{
              // top: 5,
              // position: "absolute",
              display: "flex",
              backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            close
          </div>
          <div>
            <div
              style={{
                position: "absolute",
                right: 10,
                paddingLeft: 15
              }}
            >
              <div
                style={{
                  display: "flex",
                  paddingTop: 15
                }}
              >
                <div>
                  <i
                    onClick={() => {
                      // real.bill_id &&
                      //   window.open(
                      //     `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                      //       real.bill_id +
                      //       `"}`,
                      //     "_blank"
                      //   );
                      setVideoUrl(real);
                      // setModalIsOpen(true);
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
                    paddingLeft: 15
                  }}
                >
                  <RWebShare
                    data={{
                      text: "News Updates Shared from Vare",
                      url: window.location.href,
                      title: real.title
                    }}
                    onClick={() => {
                      shareItem();
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
                <div style={{paddingLeft: 15, paddingRight: 10}}>
                  <i
                    onClick={() => {
                      saveMessageLikes({
                        ...real,
                        likes: !real.likes
                          ? JSON.stringify([storeUser.user_id])
                          : real.likes && real.likes.includes(storeUser.user_id)
                          ? JSON.stringify(
                              real.likes.filter(res => res != storeUser.user_id)
                            )
                          : JSON.stringify([...real.likes, storeUser.user_id])
                      });
                    }}
                    style={{
                      backgroundColor: "#f2f3f5",
                      padding: 10,
                      borderRadius: 10,
                      color:
                        real.likes &&
                        storeUser.user_id &&
                        real.likes.includes(storeUser.user_id)
                          ? "#2096F3"
                          : "black"
                    }}
                    className={`fas fa-heart`}
                  />
                </div>
              </div>
            </div>
            {videoUrl && videoUrl.video && videoUrl._id ? (
              <StyledVideo
                playsInline
                // controls
                ref={videoRef}
                autoPlay
                poster={`https://varefiles.s3.us-east-2.amazonaws.com/meeting1.jpg`}
              />
            ) : (
              <video
                autoplay
                muted
                loop
                id="myVideo"
                width={"100%"}
                // height={300}
                data-lazyload="images/2-2.jpg"
                data-bgposition="center top"
                data-bgfit="cover"
                data-bgrepeat="no-repeat"
              >
                <source
                  src="http://vareapp.com/videos/vare.mp4"
                  type="video/mp4"
                />
              </video>
            )}
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              paddingBottom: 15
            }}
          >
            {videoUrl.video && videoUrl._id == real._id ? null : (
              <div
                style={{
                  // position: "absolute",
                  bottom: 10,
                  // backgroundColor: "rgba(0,0,0,.2)",
                  width: "95%",
                  flexDirection: "column",
                  paddingLeft: 10,
                  color: "white"
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
                    {real.name}
                  </div>

                  <i
                    className={`fas fa-link`}
                    onClick={() => {
                      real.bill_id &&
                        window.open(
                          `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                            real.bill_id +
                            `"}`,
                          "_blank"
                        );
                    }}
                    style={{
                      paddingTop: 2,
                      fontSize: 12,
                      // paddingLeft: 6,
                      // fontWeight: "bold",
                      color: "gray"
                    }}
                  >
                    {` ${
                      real.date
                        ? real.date
                        : real.publishedAt
                        ? real.publishedAt
                        : ""
                    }
                    }`}
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
                  {real.title ? real.title : ""}
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
                    real.views
                      ? real.views +
                        (real.likes && real.likes.length
                          ? real.likes.length * 1.5
                          : 0)
                      : real.likes && real.likes.length
                      ? real.likes.length * 3
                      : 0
                  }`}</div>
                  <div style={{paddingLeft: 20}}>{`   likes: ${
                    real.likes && real.likes.length ? real.likes.length : 0
                  }`}</div>
                  <div style={{paddingLeft: 20}}>
                    {real.date
                      ? moment(real.date || moment.now()).fromNow()
                      : real.publishedAt
                      ? moment(real.publishedAt || moment.now()).fromNow()
                      : ""}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              height: 400,
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "white",

              marginLeft: 25,
              marginRight: 25
            }}
          >
            {msg && msg.length > 0
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
