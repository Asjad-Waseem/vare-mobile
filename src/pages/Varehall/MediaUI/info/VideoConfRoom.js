import React, {Fragment, useEffect, useRef, useState} from "react";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import {Row, Col, Card, CardBody} from "reactstrap";

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

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  width: 90%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    flexDirection:'row',
    height: 40%;
    width: 100%;
`;

const Video = props => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <div
      style={{
        margin: 3
      }}
    >
      <StyledVideo playsInline controls autoPlay ref={ref} />{" "}
    </div>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

const VideoCofRoom = props => {
  const [peers, setPeers] = useState([]);
  const [guestUsers, setGuestUsers] = useState([]);
  const [videoStarted, setVideoStarted] = useState(false);
  const [showComments, setShowComments] = useState(false);
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

  const [uniqueName, setUniqueName] = useState([props.user.user_id]);

  const videoStatus = useRef(false);
  const audioStatus = useRef(true);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomDetails = {
    roomID: props.roomID,
    guestID: props.activeUser.userId,
    vareName: props.user.name,
    vareID: props.user.user_id
  };

  useEffect(() => {
    const info =
      guestUsersIndex && guestUsersIndex.length && guestUsersIndex.length > 0
        ? guestUsersIndex.map((rep, index) => {
            return {
              name: rep,
              myIndex: index
            };
          })
        : [];
    props.latestGuestUsersIndex(info);
    // console.log("xxguestUsersIndex", guestUsersIndex);
  }, [guestUsersIndex]);

  useEffect(() => {
    if (props.initialVideoStatus) {
      videoStatus.current = false;
    }
  }, []);

  useEffect(() => {
    // console.log("inViewVideoIndex", props.inViewVideoIndex);
  }, [props]);

  const moveCardViewVideoStyle = {
    position: "absolute",
    top: 120
  };

  const updatChatList = chat => {
    // msg.unshift([chat])
    // const newChats = [...msg,...chat]
    const newChats = [...chat];
    newChats.sort((a, b) => {
      var dateA = new Date(a.date).getTime();
      var dateB = new Date(b.date).getTime();
      return dateA > dateB ? -1 : 1;
    });
    setMsg(newChats);
    // console.log('xxx',newChats)
  };

  const getMonthFromString = mon => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  };

  const saveChatList = chat => {
    // console.log('msgzzz',chat)
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current.emit("save chat", chat);
    socketRef.current.on("chat message", chat => {
      const newChats = [...chat];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMsg(newChats);
      // console.log('newChats',newChats)
    });
  };

  const deleteChat = chat => {
    // console.log('msg',chat)

    chat.id = chat._id;
    chat.resource = "vare_web_chat";
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current.emit("delete chat", chat);
    socketRef.current.on("chat message", chat => {
      const newChats = [...chat];
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
    // props.parentVideoStatus(true)
    // socketRef.current = io.connect("https://meeting.varehall.com", { origins: '*:*'});
    if (!props.roomID) return;
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({
        video: videoStatus.current,
        audio: true
      })
      .then(stream => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomDetails);
        socketRef.current.on("all users", response => {
          const users = response.users;
          const guests = response.guests;

          const peers = [];
          users.forEach(userID => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer
            });
            peers.push(peer);
          });
          setPeers(peers);
          sendInfo(users, guests);
        });

        socketRef.current.on("user joined", payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer
          });
          setPeers(users => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal);
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
    console.log("handleDataAvailable", event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.current.push(event.data);
    }
  };

  const stopRecording = () => {
    console.log("stop recording");
    mediaRecorder.current.stop();
  };

  const downloadRecording = () => {
    // console.log('downloadRecording');
    const blob = new Blob(recordedBlobs.current, {
      type: "video/mp4"
    });
    const url = window.URL.createObjectURL(blob);
    console.log("downloadxx", url);
    const a = download.current; //document.createElement('a');
    // a.style.display = 'none';
    a.href = url;
    a.download = "test.mp4";

    // download.current.props.href =
    // document.body.appendChild(a);
    // a.click();
    // setTimeout(() => {
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // }, 100);
  };

  const sendInfo = async (users, guests) => {
    // console.log('guestsIndex',users,guests)

    const newGuest = await users.map((userID, index) => {
      const tempGuest =
        guests[props.meetingId] &&
        guests[props.meetingId][userID] &&
        guests[props.meetingId][userID].split("__") &&
        guests[props.meetingId][userID].split("__")[1]
          ? guests[props.meetingId][userID].split("__")[1]
          : "NA";
      return tempGuest;
    });
    if (guestUsersIndex.length > 0) {
      setGuestUsersIndex([...guestUsersIndex, ...newGuest]);
    } else {
      setGuestUsersIndex([...newGuest]);
    }
    // console.log('yyguestsIndex',newGuest,guestUsersIndex)
  };

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
        vareName: props.user.name,
        vareID: props.user.user_id
      });
    });
    // console.log('peer',peer)
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
        callerID
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function muteVideo() {
    if (videoStarted == false) {
      startVideoSession();
    } else {
      navigator.mediaDevices
        .getUserMedia({
          video: videoStatus.current,
          audio: audioStatus.current
        })
        .then(stream => {
          userVideo.current.srcObject = stream;
        });
    }
  }

  // console.log('userVideo',userVideo.current && userVideo.current.srcObject)

  return (
    <Fragment>
      <VideoControls
        {...props}
        // setInViewVideoIndex={props.setInViewVideoIndex}
        audioStatus={audioStatus.current}
        downloadLink={downloadLink}
        user={props.user}
        videoToggle={() => {
          if (audioStatus.current == false && videoStatus.current) {
            alert(
              "You are about to exit this meeting since. At least one of audio and video must be requested"
            );
          } else {
            videoStatus.current == true
              ? (videoStatus.current = false)
              : (videoStatus.current = true);
            muteVideo();
          }
        }}
        audioToggle={() => {
          if (videoStatus.current == false && audioStatus.current) {
            alert(
              "You are about to exit this meeting since. At least one of audio and video must be requested"
            );
          } else {
            audioStatus.current == true
              ? (audioStatus.current = false)
              : (audioStatus.current = true);
            muteVideo();
          }
        }}
        videoStatus={videoStatus.current}
        showComments={() => {
          setShowComments(true);
        }}
        disconnectVideo={() => {
          window.location.reload(false);
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
      <Card
        className="mb-6"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500
          // backgroundColor:'red',
          // paddingBottom:350,
          // marginBottom:300
        }}
      >
        <div
          style={{
            display: "flex",
            minheight: 300,
            overflowY: "auto",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div
              style={{
                paddingTop: props.inViewVideoIndex == null ? 0 : 420
              }}
              className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
            >
              <div>
                <StyledVideo
                  muted
                  ref={userVideo}
                  controls
                  autoPlay
                  playsInline
                  poster={`https://varefiles.s3.us-east-2.amazonaws.com/${props.user.user_id.replace(
                    ".com",
                    ".jpg"
                  )}`}
                />{" "}
                <span
                  style={{
                    color: "red"
                  }}
                  className="align-middle d-inline-block"
                >
                  {" "}
                  {userVideo.current && userVideo.current.srcObject
                    ? props.user.name
                    : ""}{" "}
                </span>{" "}
                <div
                  style={{
                    paddingTop: 50
                  }}
                />{" "}
                {!isMobile ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap"
                    }}
                  >
                    {" "}
                    {peers && peers.length > 0
                      ? peers.map((peer, index) => {
                          const inViewVideoStyle =
                            props.inViewVideoIndex == index
                              ? {
                                  position: "absolute",
                                  top: 20,
                                  left: 0
                                }
                              : {};
                          return (
                            <div
                              style={{
                                ...inViewVideoStyle
                              }}
                              key={"jhgh" + index}
                            >
                              <Video
                                style={{
                                  height: "100%"
                                }}
                                key={"vvvxss" + index}
                                peer={peer}
                              />{" "}
                              {guestUsersIndex && (
                                <div>
                                  {" "}
                                  {guestUsersIndex && guestUsersIndex[0]
                                    ? guestUsersIndex[0]
                                    : "Guest User"}{" "}
                                </div>
                              )}{" "}
                            </div>
                          );
                        })
                      : null}{" "}
                  </div>
                ) : peers && peers.length > 0 ? (
                  peers.map((peer, index) => {
                    // console.log('xxxccc',guestUsersIndex && )
                    return (
                      <div
                        style={{
                          paddingTop: 50
                        }}
                        key={"jhgh" + index}
                      >
                        <Video
                          style={{
                            height: "100%"
                          }}
                          key={"vvvxss" + index}
                          peer={peer}
                        />{" "}
                        {guestUsersIndex && (
                          <div>
                            {" "}
                            {guestUsersIndex && guestUsersIndex[0]
                              ? guestUsersIndex[0]
                              : "Guest User"}{" "}
                          </div>
                        )}{" "}
                      </div>
                    );
                  })
                ) : null}{" "}
              </div>{" "}
            </div>{" "}
          </CardBody>{" "}
        </div>{" "}
      </Card>{" "}
    </Fragment>
  );
};

export default VideoCofRoom;
