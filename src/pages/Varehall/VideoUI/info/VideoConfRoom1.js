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

  const [audioPeerSatus, setAudioPeerSatus] = useLocalStorage([]);
  const [videoPeerSatus, setVideoPeerSatus] = useLocalStorage([]);

  const [displayVideo, setDisplayVideo] = useState("");

  const [fullView, setFullView] = useState(false);

  const [loginUser, setLoginUser] = useState("");
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
  const [uniqueName, setUniqueName] = useState([user.user_id]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const videoStatus = useRef(true);
  const audioStatus = useRef(true);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomDetails = useRef({});

  const emptyVideo = useRef();

  const mySearchRef = useRef();

  useEffect(() => {
    // console.log("loginUser", loginUser);
  }, [loginUser, storeUser]);

  useEffect(() => {
    // console.log("user", user);
  }, [inViewVideoIndex, user, replyId]);
  useEffect(() => {
    // console.log("displayVideoOuter", displayVideo);
  }, [displayVideo]);

  useEffect(() => {
    const userDetail =
      window.localStorage && window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : "";
    if (userDetail) delete user.token;
    meetingDetails &&
      setUser({
        ...user,
        roomID: meetingDetails.meeting_id
        // vareName: userDetail.name,
        // vareID: userDetail.user_id,
        // img: userDetail.img
      });
  }, [meetingDetails]);

  useEffect(() => {
    // console.log("ReplyId", msg[replyId]);
    replyId &&
      msg &&
      msg.length > 0 &&
      setReplyArray(
        msg && msg.filter(rep => rep.replyId == replyId || rep._id == replyId)
      );
  }, [replyId]);

  useEffect(() => {
    if (activeUser && activeUser.name) {
      // console.log("activeUser", activeUser);

      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  }, [activeUser]);

  useEffect(() => {
    // console.log("activeUser", peers, peerUsers);
  }, [peers, peerUsers]);

  useEffect(() => {
    const pathname = history.location;
    const query = queryString.parse(pathname.search);
    // console.log("INFO", query, storeUser);
    if (
      !cookie.load("vare") &&
      query &&
      query.app &&
      query.app.toLowerCase() == "vare"
    ) {
      setLoginUser("login");
    }

    if (query && query.id) setUrlQuery(query);
    if (query && query.id) setMeetingId(query.id);
    if (query && query.key) setMeetingKeyId(query.key);
    if (query && query.id) getMeetingRSVP(query.id);
    if (
      query &&
      query.id &&
      cookie.load("vare") &&
      storeUser &&
      (storeUser.fullName || storeUser.name)
    ) {
      // console.log("INFOxx", query, storeUser);
      getMeetingInfo(query.id);
    }
  }, [meetingId]);

  const getMeetingRSVP = async id => {
    const formData = {
      request: "search",
      query: {
        meeting_id: id
      },
      resource: "vare_meeting_rsvp"
    };
    await RESTCall.axiosQuery(formData).then(response => {
      const data = response && response.data;
      // console.log("data", storeUser, data);

      setMetingRSVP(
        meetingRSVP && meetingRSVP.length > 0
          ? [...meetingRSVP, ...data, storeUser]
          : [storeUser]
      );
      // return data;
    });
  };

  const getMeetingInfo = async id => {
    const formData = {
      request: "search",
      query: {
        meeting_id: id
      },
      resource: "vare_meetings"
    };
    const eventDetails = await RESTCall.axiosQuery(formData).then(response => {
      const data = response && response.data && response.data[0];
      // console.log("kkkkk", data);
      setMeetingDetails(data);
      data &&
        sethost({
          name: data.author,
          user_id: data.user_id,
          img: data.img,
          msg: true
        });
      return data;
    });

    eventDetails && loadMessages(id);

    // roomDetails.current = {
    //   roomID: eventDetails.meeting_id,
    //   vareName: eventDetails.author,
    //   vareID: eventDetails.user_id
    // };

    const info =
      guestUsersIndex && guestUsersIndex.length && guestUsersIndex.length > 0
        ? guestUsersIndex.map((rep, index) => {
            return {
              name: rep,
              myIndex: index
            };
          })
        : [];
    setGuestUsers(info);
    // console.log("xxguestUsersIndex", guestUsersIndex);
  };

  useEffect(() => {
    if (initialVideoStatus) {
      videoStatus.current = false;
    }
  }, []);

  const moveCardViewVideoStyle = {
    position: "absolute",
    top: 120
  };

  const loadMessages = async id => {
    socketRef.current = io.connect(myURL, {
      origins: "*:*"
    });
    socketRef.current.emit("meeting message", [{meeting_id: id}]);
    socketRef.current.on("meeting message", chat => {
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

  const getMonthFromString = mon => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
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
        .indexOf(user.user_id);
    // console.log("pos", pos);

    const newLike =
      pos && pos >= 0
        ? parseLikes.splice(0, pos)
        : parseLikes && parseLikes.length > 0
        ? parseLikes.push({
            name: user.name,
            user_id: user.user_id,
            img: user.img
          })
        : [
            {
              name: user.name,
              user_id: user.user_id,
              img: user.img
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
    let chat = {...meetingDetails, ...data};
    chat["img"] = user.img;
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

      mySearchRef.current.value = "";
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

  // const addDefaultSrc = (ev) => {
  //    ev.target.src = "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
  // }

  function startVideoSession() {
    setVideoStarted(true);
    // socketRef.current = io.connect("https://meeting.varehall.com", { origins: '*:*'});
    if (!user.roomID) return;
    navigator.mediaDevices
      .getUserMedia({
        video: videoStatus.current,
        audio: audioStatus.current
      })
      .then(stream => {
        userVideo.current.srcObject = stream;

        socketRef.current.emit("join room", user);

        //create room
        socketRef.current.on("all users", response => {
          const users = response.users;
          const userProps = response.userProps;

          const peers = [];
          if (users && Array.isArray(users) && users.length > 0) {
            // alert("Peers");
            users.map((userID, index) => {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer
              });
              peers.push({
                ...userProps,
                peer,
                callerID: socketRef.current.id
                // vareName: userProps.name,
                // vareId: userProps.user_id,
                // vareImg: userProps.img
              });
            });
            const filterPeer =
              peers &&
              peers.length > 0 &&
              peers.filter(rep => rep.callerID != socketRef.current.id);
            setPeers(users => {
              return [...users, ...filterPeer];
            });
            // console.log("all users");
          } else {
            // alert("No Peers");
            setPeers([]);
          }
        });

        socketRef.current.on("user joined", payload => {
          // console.log("user joined", payload);

          if (!payload.activeStatus && peers.length > 0) {
            const items = peers.filter(p => p.callerID != payload.callerID);
            setPeers([...items]);
          } else {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            if (!Array.isArray(peersRef.current)) {
              peersRef.current = [];
            }
            peersRef.current.push({
              peerID: payload.callerID,
              peer
            });
            setPeers(users => {
              return [
                ...users,
                {
                  ...payload,
                  peer,
                  callerID: payload.callerID
                  // vareName: payload.vareName,
                  // vareId: payload.vareId,
                  // vareImg: payload.vareImg
                }
              ];
            });
            setMetingRSVP(
              meetingRSVP && meetingRSVP.length > 0
                ? [...meetingRSVP, payload]
                : [storeUser]
            );
          }
          // console.log("user joinedAA", payload);
        });

        socketRef.current.on("receiving returned signal", payload => {
          // console.log("receiving returned signal", payload);

          const item = peersRef.current.find(p => p.peerID === payload.id);
          item && item.peer && item.peer.signal(payload.signal);

          const peer = item.peer;
          peersRef.current.push({
            peerID: payload.callerID,
            peer
          });
          setPeers(users => {
            return [
              ...users,
              {
                ...payload,
                peer
                // callerID: payload.callerID,
                // vareName: payload.vareName
              }
            ];
          });
          setMetingRSVP(
            meetingRSVP && meetingRSVP.length > 0
              ? [...meetingRSVP, payload]
              : [storeUser]
          );

          // console.log("receiving returned signal", item);
        });

        socketRef.current.on("user left", id => {
          const peerObj = peersRef.current.find(p => p.peerID === id);
          if (peerObj && peerObj.length > 0) {
            peerObj.peer.destroy();
          }
          // console.log("user left", peerObj && peerObj.length);

          const peersRefFilter = peersRef.current.find(p => p.peerID !== id);
          peersRef.current = peersRefFilter ? peersRefFilter : [];
          const peersFilter = peers.find(p => p.callerID !== id);
          setPeers(peersFilter ? peersFilter : []);
          // console.log("user left", peersRefFilter, peersFilter);
        });

        socketRef.current.on("audio muted", payload => {
          // console.log("audio muted", payload);

          const peerObj =
            audioPeerSatus && audioPeerSatus.length > 0
              ? audioPeerSatus.find(p => p.peerID === payload.callerID)
              : "";

          if (peerObj) {
            setAudioPeerSatus([...audioPeerSatus, payload]);
          } else {
            setAudioPeerSatus([payload]);
          }
        });

        socketRef.current.on("video muted", payload => {
          // console.log("video muted", payload);
          // const item = peersRef.current.find(
          //   p => p.peerID === payload.callerID
          // );

          stream
            .getVideoTracks()
            .forEach(track => (track.enabled = !track.enabled));

          const peerObjBB =
            videoPeerSatus && videoPeerSatus.length > 0
              ? videoPeerSatus.find(p => p.peerID === payload.callerID)
              : "";

          if (peerObjBB) {
            setVideoPeerSatus([...videoPeerSatus, payload]);
          } else {
            setVideoPeerSatus([payload]);
          }
        });
      });
  }

  const shouldStop = useRef(false); //setShouldStop] = useState(false);
  const [stopped, setStopped] = useState(true);
  const downloadLink = useRef(); //document.getElementById('download');
  const stopButton = document.getElementById("stop");

  const mediaRecorder = useRef();
  const recordedBlobs = useRef([]);
  const download = useRef(null);

  const startAudioRecord = async () => {
    // alert(1)
    // https://developers.google.com/web/fundamentals/media/recording-audio
    const options = {
      mimeType: "audio/webm"
    };
    // const recordedChunks = [];
    mediaRecorder.current = new MediaRecorder(
      userVideo.current.srcObject,
      options
    );
    // console.log('startAudioRecord',mediaRecorder.current)
    mediaRecorder.current.onstop = event => {
      // console.log('Recorder stopped: ', event);
      // console.log('Recorded Blobs: ', recordedBlobs.current);
    };
    mediaRecorder.current.ondataavailable = handleDataAvailable;
    mediaRecorder.current.start();
  };

  const handleDataAvailable = event => {
    // console.log("handleDataAvailable", event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.current.push(event.data);
    }
  };

  const stopRecording = () => {
    // console.log("stop recording");
    mediaRecorder.current.stop();
  };

  const downloadRecording = () => {
    // console.log('downloadRecording');
    const blob = new Blob(recordedBlobs.current, {
      type: "video/mp4"
    });
    const url = window.URL.createObjectURL(blob);
    // console.log("downloadxx", url);
    const a = download.current; //document.createElement('a');
    // a.style.display = 'none';
    a.href = url;
    a.download = "test.mp4";
  };

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        meetingId,
        ...user
        // vareName: user.name,
        // vareID: user.user_id
      });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socketRef.current.emit("returning signal", {
        signal,
        callerID,
        meetingId,
        ...user
        // vareName: user.name,
        // vareID: user.user_id
      });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  function removePeer() {
    socketRef.current.emit("disconnectVideo", {
      roomID: meetingId
    });
    window.location.reload(false);
  }

  function mutePeerAudio() {
    socketRef.current.emit("muteAudio", {
      audioStatus: audioStatus.current ? "on" : "off"
    });
  }

  function mutePeerVideo() {
    socketRef.current.emit("muteVideo", {
      videoStatus: videoStatus.status ? "on" : "off"
    });
  }

  function disconnectPeer() {
    socketRef.current.emit("disconnectVideo", {
      roomID: meetingId
    });
    // window.location.reload(false);
  }

  function toggleVideo(info) {
    if (videoStarted == false) {
      // alert(222);
      startVideoSession();
    } else {
      // alert(333);
      // console.log("videoStatus", videoStatus.current);
      // navigator.mediaDevices
      //   .getUserMedia({
      //     video: videoStatus.current,
      //     audio: audioStatus.current
      //   })
      //   .then(stream => {
      // stream.getVideoTracks()[0].enabled = info;

      //   .enabled;
      // userVideo.current.srcObject = stream;
      // const peer = new Peer({
      //   initiator: true,
      //   trickle: false,
      //   stream
      // });

      // peer.on("signal", signal => {
      socketRef.current.emit("muteVideo", {
        meetingId,
        ...user,
        videoStatus: info
        // vareName: user.name,
        // vareID: user.user_id
        //   });
        //   // });
        //   // mutePeerVideo();
      });
    }
  }

  // console.log('userVideo',userVideo.current && userVideo.current.srcObject)

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
                    return e.user_id == user.user_id;
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

          {msg.user_id == user.user_id ? (
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
      ) : loginUser && loginUser == "Profile" ? (
        <Profile setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : (
        <div>
          <div
            style={{
              paddingTop: 70,
              paddingBottom: 100
            }}
          >
            <PageModal
              activeUser={activeUser}
              setActiveUser={setActiveUser}
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
            >
              <div
                style={{
                  paddingTop: 10,
                  textAlign: "center",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <UserAvatar
                  size="90"
                  name={activeUser.name ? activeUser.name : "NA"}
                  src={activeUser.img}
                  style={{
                    // border: "1px solid #FA8072",
                    // marginTop:20,
                    paddingTop: 5,
                    // paddingBottom: 5,
                    // height: 50,
                    // width: 50,
                    // margin: 10,
                    // marginRight:10,
                    // marginLeft:10,
                    borderRadius: 100
                  }}
                />
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,.74)",
                    fontWeight: "bold"
                  }}
                >
                  {activeUser && activeUser.name ? activeUser.name : "hhh"}
                </div>
                <div>
                  {activeUser && activeUser.bio
                    ? activeUser.bio
                    : "Bio not available"}
                </div>
              </div>
            </PageModal>
            <div
              className="row"
              style={
                {
                  // marginBottom: 280
                  // backgroundColor: "red"
                }
              }
            >
              <Colxx lg={12} sm={12}>
                <Card
                  style={{
                    // marginTop: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 100,
                    margin: 20,
                    padding: 20
                    // backgroundColor: "red"
                    // paddingBottom:350,
                    // marginBottom:300
                  }}
                >
                  <div
                    style={{
                      // borderTopWidth: "solid",
                      // borderBottom: "3px solid rgb(212, 212, 212)",
                      // borderBottomColor: "red",
                      width: "100%",
                      padding: 3,
                      display: "flex",
                      flexDirection: "row",
                      // backgroundColor: "#f2f3f5",
                      marginBottom: 3
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row"
                      }}
                    >
                      <div
                        onClick={() => {
                          window.open(meetingDetails.img, "_self");
                        }}
                        style={{
                          // width: 300,
                          padding: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center"
                        }}
                      >
                        <UserAvatar
                          size="40"
                          name={
                            meetingDetails && meetingDetails.author
                              ? meetingDetails.author
                              : "Guest"
                          }
                          src={meetingDetails && meetingDetails.img}
                          // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
                        />
                      </div>

                      <span>
                        <span
                          onClick={() => {
                            !(meetingDetails && meetingDetails.title) &&
                              setLoginUser("login");
                          }}
                          style={{
                            // paddingLeft: 10,
                            fontSize: 16,
                            fontWeight: "bold"
                          }}
                        >{` ${
                          meetingDetails && meetingDetails.author
                            ? meetingDetails.author + " (Host):"
                            : ""
                        }  `}</span>
                        {` ${
                          !meetingId
                            ? "There is no meeting tied to this URL, please contact your meeting admin form more details"
                            : !cookie.load("vare")
                            ? "You need to login to get meeting details."
                            : meetingDetails && meetingDetails.title
                            ? meetingDetails.title
                            : "You need to login to get meeting details."
                        }`}{" "}
                      </span>
                    </div>
                  </div>
                </Card>
              </Colxx>
              {peers && peers.length > 0 ? (
                <Colxx md={fullView ? 6 : 12} lg={fullView ? 6 : 12} sm={12}>
                  <Card
                    // className="mb-6"
                    style={{
                      // marginTop: 10,
                      // display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "black"
                      // paddingBottom: 50
                      // marginBottom:300
                    }}
                  >
                    <div
                      style={{
                        // backgroundColor: "#f2f3f5",
                        padding: 5,
                        // borderRadius: 25,
                        width: "100%",
                        // position: "absolute",
                        // top: "10%",
                        // left: 10,
                        display: "flex",
                        flexDirection: "row",
                        overflowX: "scroll",
                        overflow: "hidden"
                      }}
                    >
                      {peers && peers.length > 0
                        ? peers.map((data, index) => {
                            const audioFeedSatus =
                              audioPeerSatus && audioPeerSatus.length > 0
                                ? audioPeerSatus.filter(rep => {
                                    return rep.peerID == data.callerID;
                                  })
                                : "";
                            const guestAudioStatus =
                              audioFeedSatus &&
                              audioFeedSatus.length > 0 &&
                              audioFeedSatus[0].audioStatus &&
                              audioFeedSatus[0].audioStatus == "off"
                                ? false
                                : true;

                            const videoFeedSatus =
                              videoPeerSatus && videoPeerSatus.length > 0
                                ? videoPeerSatus.filter(rep => {
                                    return rep.peerID == data.callerID;
                                  })
                                : "";
                            const guestVideoStatus =
                              videoFeedSatus &&
                              videoFeedSatus.length > 0 &&
                              videoFeedSatus[0].videoStatus &&
                              videoFeedSatus[0].videoStatus == "off"
                                ? false
                                : true;

                            // console.log(
                            //   "guestVideoStatus",
                            //   videoPeerSatus,
                            //   guestVideoStatus
                            // );

                            // data.peer.getVideoTracks()[0].enabled = guestVideoStatus;
                            // console.log("enabledBB", data.peer);

                            return (
                              <div
                                style={{
                                  width: 100,
                                  height: 120,
                                  paddingLeft: 10,
                                  // backgroundColor: "#f2f3f5",
                                  borderRadius: 25,
                                  // borderBottomRightRadius: 25,
                                  // borderBottomLeftRadius: 25,
                                  // padding: 5,
                                  display: "flex",
                                  flexDirection: "column"
                                }}
                                key={"jhhgh" + data.callerID}
                              >
                                {data.peer && (
                                  <Video
                                    guestVideoStatus={guestVideoStatus}
                                    bgImage={data.img}
                                    name={data.name}
                                    displayVideo={displayVideo}
                                    setDisplayVideo={setDisplayVideo}
                                    style={{
                                      width: "100%",
                                      height: "100%"
                                    }}
                                    key={"vsdfvvxss" + data.callerID}
                                    peer={data.peer}
                                  />
                                )}

                                {data.name && (
                                  <div
                                    style={{
                                      // display: "flex",
                                      flexWrap: "wrap",
                                      textAlign: "center",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 12,
                                      paddingLeft: 3,
                                      backgroundColor: displayVideo
                                        ? "#FA8072"
                                        : "#cfcfc4",
                                      borderBottomRightRadius: 7,
                                      borderBottomLeftRadius: 7,
                                      color: "black"
                                    }}
                                  >
                                    <i
                                      className={`fas fa-${
                                        guestAudioStatus
                                          ? "microphone-alt"
                                          : "microphone-alt-slash"
                                      }`}
                                    >
                                      {`${" "}`}
                                      {data.name ? data.name : "Guest User"}
                                    </i>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </Card>
                </Colxx>
              ) : null}

              <Colxx md={fullView ? 6 : 12} lg={fullView ? 6 : 12} sm={12}>
                <Card
                  // className="mb-6"
                  style={{
                    // marginTop: 10,
                    // display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "black",
                    paddingBottom: 50
                    // marginBottom:300
                  }}
                >
                  <i
                    onClick={() => {
                      setFullView(!fullView);
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: 10,
                      textAlign: "center",
                      color: fullView ? "#2096F3" : "gray"
                    }}
                    // name={"times"}
                    className={`fas fa-2x fa-th-large`}
                  />
                  <div
                    style={{
                      display: "flex",
                      minheight: 300,
                      overflowY: "auto",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <div
                      style={{
                        paddingTop: 10
                      }}
                      className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          paddingBottom: 15,
                          marginBottom: 20
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column"
                          }}
                        >
                          <StyledVideo
                            muted
                            ref={
                              displayVideo && displayVideo.stream
                                ? displayVideo.stream
                                : userVideo
                            }
                            controls
                            autoPlay
                            playsInline
                            poster={`https://varefiles.s3.us-east-2.amazonaws.com/meeting1.jpg`}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 5,
                              paddingTop: 3,
                              color: "white",
                              textAlign: "center"
                            }}
                            className="align-middle d-inline-block"
                          >
                            {displayVideo && displayVideo.name
                              ? displayVideo.name
                              : user.name}
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                  </div>
                  <VideoControls
                    {...user}
                    setInViewVideoIndex={info => {
                      setInViewVideoIndex(info);
                    }}
                    audioStatus={audioStatus.current}
                    downloadLink={downloadLink}
                    user={user}
                    videoStatus={videoStatus.current}
                    videoToggle={info => {
                      if (audioStatus.current == false && videoStatus.current) {
                        alert(
                          "You are about to exit this meeting since. At least one of audio and video must be requested"
                        );
                      } else {
                        // videoStatus.current = info;
                        toggleVideo(info);
                      }
                    }}
                    audioToggle={() => {
                      audioStatus.current = audioStatus.current ? false : true;
                      mutePeerAudio();
                    }}
                    videoStarted={videoStarted}
                    showComments={() => {
                      setShowComments(true);
                    }}
                    disconnectVideo={() => {
                      if (videoStatus.current == false && audioStatus.current) {
                        alert(
                          "You are about to exit this meeting since. At least one of audio and video must be requested"
                        );
                      }
                      removePeer();
                      // window.location.reload(false);
                    }}
                    startAudioRecord={() => {
                      setStopped(false);
                      startAudioRecord();
                    }}
                    setShouldStop={() => {
                      setStopped(true);
                      stopRecording();
                    }}
                    downloadRecording={() => {
                      setStopped(false);
                      downloadRecording();
                    }}
                    stopped={stopped}
                  />
                </Card>
                <UserProfile
                  user={user && user.name ? user : ""}
                  host={host}
                  meetingId={meetingId}
                  activeUser={activeUser}
                  setActiveUser={setActiveUser}
                  meetingRSVP={meetingRSVP}
                  meetingDetails={meetingDetails}
                  yourID={user && user.user_id ? user.user_id : ""}
                />
              </Colxx>
              <Colxx lg={6} sm={12}>
                <Card>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 25,
                      marginRight: 25
                    }}
                  >
                    <div className="form-group has-float-label form-group">
                      <label className="">Search Message</label>
                      <input
                        style={{
                          paddingTop: 15,
                          paddingLeft: 10
                        }}
                        onChange={() => {
                          setReplyArray(
                            mySearchRef.current.value.length == 0
                              ? ""
                              : msg.filter(rep =>
                                  JSON.stringify(rep)
                                    .toLowerCase()
                                    .includes(mySearchRef.current.value)
                                )
                          );
                        }}
                        ref={mySearchRef}
                        name="search"
                        className="form-control"
                        type="text"
                      />
                    </div>
                    <i
                      onClick={() => {
                        mySearchRef.current.value = "";
                        setReplyId("");
                        setReplyArray("");
                      }}
                      style={{
                        position: "absolute",
                        right: 0,
                        padding: 10,
                        //marginBottom: 6,
                        marginTop: 3,
                        textAlign: "center",
                        color: replyId ? "#2096F3" : "gray"
                      }}
                      // name={"times"}
                      className={`fas fa-2x fa-sync-alt`}
                    />
                  </div>
                </Card>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // width: "90%",
                    height: 400,
                    overflowY: "auto",
                    overflowX: "hidden",
                    backgroundColor: "white",

                    marginLeft: 25,
                    marginRight: 25
                  }}
                >
                  {replyArray && replyArray.length >= 0
                    ? replyArray.map((rep, index) => {
                        return (
                          <div key={"ssjfghf" + index}>
                            <CommentsComponent
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

                <LiveChats
                  replyId={replyId}
                  msg={msg}
                  saveChatList={chat => {
                    chat["user_id"] = user.user_id;
                    chat["name"] = user.name;

                    // console.log("chat", chat);

                    saveChatList(chat);
                  }}
                  // updatChatList={chat => {
                  //   updatChatList(chat);
                  // }}
                />
              </Colxx>
            </div>
          </div>
        </div>
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
