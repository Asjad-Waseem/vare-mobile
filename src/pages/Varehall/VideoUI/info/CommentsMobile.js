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
import ScrollMenu from "react-horizontal-scrolling-menu";
import UserAvatar from "react-user-avatar";

//Import Images

// import VideoApp from "./video";

import "../../info.css";
import styled from "styled-components";

import io from "socket.io-client";
import Peer from "simple-peer";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

const CommentsMobile = ({
  user,
  meetingId,
  setActiveUser,
  // selectedLike,
  // setSelectedLike,
  activeUser,
  meetingDetails,
  meetingRSVP,
  meetingComments,
  meetingCommentUpdate
}) => {
  const [selectedLike, setSelectedLike] = useState(-1);
  const [selectedComments, setSelectedComments] = useState(-1);
  const [selectedReply, setSelectedReply] = useState(-1);
  const [meetingState, setMeetingState] = useState(null);
  const [saveType, setSaveType] = useState(null);
  const [imageURL, setImageURL] = useState({});

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [emoji, setEmoji] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setEmoji(false);
  };
  // console.log("imageURL", imageURL);

  const textInput = useRef(null);
  const textCommmentInput = useRef(null);
  const userTextInput = useRef(null);
  // const [newMessage, setNewMessage] = useState({})

  const host =
    meetingDetails &&
    meetingDetails[0] &&
    meetingDetails[0].author &&
    meetingDetails[0].member_id
      ? {
          name: meetingDetails[0].author,
          user_id: meetingDetails[0].member_id
        }
      : {};
  // console.log('host',host)
  const socketRef = useRef();

  useEffect(() => {
    // console.log('selectedLike',meetingState)
    // socketRef.current = io.connect("http://localhost:5000", {origins: "*:*"});
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    socketRef.current.emit("comment message", [
      {
        meeting_id: meetingId
      }
    ]);
    socketRef.current.on("comment message", chat => {
      const newChats = [...chat];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMeetingState(newChats);
      socketRef.current.emit("comment message", [
        {
          meeting_id: meetingId
        }
      ]);
      // console.log("lll", meetingState);
    });
  }, [meetingId]);

  const getMonthFromString = mon => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  };

  // console.log('selectedLike',index,selectedLike)
  const saveNewMessagetoDB = props => {
    setSaveType("newMessage");
    const oldTime =
      props.date && props.date.toString().split(":")
        ? props.date.toString().split(" ")
        : "";
    const newTime = oldTime
      ? oldTime[3] +
        "-" +
        getMonthFromString(oldTime[1]) +
        "-" +
        oldTime[2] +
        " " +
        oldTime[4]
      : "";

    const newMessage = {
      ...props,
      date: newTime,
      meeting_id: meetingId
    };
    if (props.comment && props.comment.length > 0) {
      saveMeetingComment({
        ...newMessage
      });
    } else {
      alert("Message is empty");
    }
    textCommmentInput.current.value = "";
  };

  const saveReplyMessagetoDB = props => {
    setSaveType("replyMessage");
    // const oldTime = props.date
    const replyMessage = {
      ...props,
      meeting_id: meetingId
    };
    if (textInput.current.value) {
      saveMeetingComment({
        ...replyMessage
      });
    } else {
      alert("Message is empty");
    }
    textInput.current.value = "";
  };

  const saveLikeMessagetoDB = props => {
    setSaveType("likeMessage");
    // const oldTime = props.date
    const likeMessage = {
      ...props,
      meeting_id: meetingId
    };
    // console.log('likeMessage',likeMessage)
    saveMeetingComment({
      ...likeMessage
    });
  };

  const saveMeetingComment = chat => {
    // console.log("msgzzz", chat);
    // socketRef.current = io.connect("http://localhost:5000", {origins: "*:*"});
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current.emit("save comment", chat);
    socketRef.current.on("comment message", chat => {
      const newChats = [...chat];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMeetingState(newChats);
      // console.log('newChats',newChats)
    });
  };

  const deleteCommentDB = chat => {
    // console.log('msg',chat)
    chat.id = chat._id;
    chat.resource = "vare_meeting_comments";
    // socketRef.current = io.connect("http://localhost:5000", {origins: "*:*"});
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    socketRef.current.emit("delete comment", chat);
    socketRef.current.on("comment message", chat => {
      const newChats = [...chat];
      newChats.sort((a, b) => {
        var dateA = new Date(a.date).getTime();
        var dateB = new Date(b.date).getTime();
        return dateA > dateB ? -1 : 1;
      });
      setMeetingState(newChats);
      // console.log('msg',chat)
    });
  };

  const deleteReplyCommentDB = props => {
    // const oldTime = props.date
    const deleteMessage = {
      ...props,
      meeting_id:
        meetingDetails && meetingDetails[0].meeting_id
          ? meetingDetails[0].meeting_id
          : ""
    };

    // console.log('deleteMessage',deleteMessage)
    saveMeetingComment({
      ...deleteMessage
    });
    // textInput.current.value = "";
  };

  const addDefaultSrc = ev => {
    ev.target.src = "https://varefiles.s3.us-east-2.amazonaws.com/icon.png";
  };

  // console.log('newMessage',newMessage)

  return (
    <div
      style={{
        backgroundColor: "#f2f3f5",
        width: "100%"
        // paddingBottom: 200
        // height:300,
        // overflow:'auto'
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          paddingBottom: 5,
          marginBottom: 5
        }}
      >
        <div className="body">
          <span
            onClick={e => {
              if (user && user.name == "Login") {
                alert("Please sign in as guest to continue.");
                return;
              } else if (
                meetingDetails &&
                meetingDetails[0] &&
                !meetingDetails[0].status
              ) {
                alert("Please Wait for the Host to Start this Meeting.");
                return;
              } else if (!meetingId) {
                alert(
                  "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                );
                return;
              }
              saveNewMessagetoDB({
                name: user && user.name,
                comment:
                  textCommmentInput.current && textCommmentInput.current.value
                    ? textCommmentInput.current.value
                    : "",
                date: new Date(),
                reply: "",
                sender_id: user && user.user_id,
                likes: ""
              });
            }}
            style={{
              backgroundColor: "#cfcfc4",
              borderRadius: 5,
              color: "white",
              margin: 5,
              // display: 'none',
              fontSize: 18,
              float: "right",
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            {" "}
            {"Save"}{" "}
          </span>

          <textarea
            ref={textCommmentInput}
            style={{
              fontSize: 16,
              // backgroundColor:'#f2f3f5',
              padding: 3,
              width: "100%"
            }}
            type="text"
            name="name"
            placeholder="Add your comment"
          />
        </div>{" "}
      </div>
      <ul style={{}} className="">
        {" "}
        {meetingState && meetingState.length && meetingState.length > 0
          ? meetingState.map((res, index) => {
              const replyArray =
                res.reply && typeof res.reply === "string"
                  ? JSON.parse(res.reply)
                  : res.reply
                  ? res.reply
                  : "";

              res.reply =
                res.reply && typeof res.reply === "string"
                  ? JSON.parse(res.reply)
                  : res.reply
                  ? res.reply
                  : "";

              res.likes =
                res.likes && typeof res.likes === "string"
                  ? JSON.parse(res.likes)
                  : res.likes
                  ? res.likes
                  : "";

              // console.log('replyArray',res.reply,replyArray)
              const likeArray = res.likes && res.likes;
              const styleJumpToTextarea =
                selectedReply == index
                  ? {
                      backgroundColor: "#bebebe",
                      borderRadius: 15,
                      position: "absolute",
                      zIndex: 99,
                      top: 0,
                      width: "95%",
                      padding: 20
                    }
                  : {};
              return (
                <li
                  style={{
                    // paddingBottom:5,
                    marginBottom: 2,
                    backgroundColor: "white", //main sub com
                    ...styleJumpToTextarea
                  }}
                  key={"kbsxdffxx" + index}
                  className=""
                >
                  <div className="body">
                    <div
                      style={{
                        display: "flex",
                        float: "right",
                        flexDirection: "column"
                      }}
                    >
                      <span
                        onClick={() => {
                          if (user && user.name == "Login") {
                            alert("Please sign in as guest to continue.");
                            return;
                          } else if (
                            meetingDetails &&
                            meetingDetails[0] &&
                            !meetingDetails[0].status
                          ) {
                            alert(
                              "Please Wait for the Host to Start this Meeting."
                            );
                            return;
                          } else if (!meetingId) {
                            alert(
                              "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                            );
                            return;
                          }
                          if (index == selectedReply) {
                            saveReplyMessagetoDB({
                              ...res,
                              date: res.date,
                              reply:
                                res.reply &&
                                res.reply.length &&
                                res.reply.length > 0
                                  ? JSON.stringify([
                                      ...res.reply,
                                      {
                                        date: new Date(),
                                        name: user && user.name,
                                        user_id: user && user.user_id,
                                        comment:
                                          textInput.current &&
                                          textInput.current.value
                                            ? textInput.current.value
                                            : ""
                                      }
                                    ])
                                  : JSON.stringify([
                                      {
                                        date: new Date(),
                                        name: user && user.name,
                                        user_id: user && user.user_id,
                                        comment:
                                          textInput.current &&
                                          textInput.current.value
                                            ? textInput.current.value
                                            : ""
                                      }
                                    ]),
                              likes:
                                res.likes &&
                                res.likes.length &&
                                res.likes.length > 0
                                  ? JSON.stringify(res.likes)
                                  : "",
                              sender_id: user && user.user_id
                            });
                          } else {
                            setSelectedReply(
                              selectedReply == index ? -1 : index
                            );
                          }
                        }}
                        style={{
                          backgroundColor: "#cfcfc4",
                          borderRadius: 5,
                          color: "white",
                          // display: 'none',
                          fontSize: 18,
                          // float: 'right',
                          paddingLeft: 10,
                          paddingRight: 10,
                          margin: 5
                        }}
                      >
                        {" "}
                        {index == selectedReply ? "Save" : "Reply"}{" "}
                      </span>{" "}
                      <span
                        onClick={() => {
                          setSelectedReply(selectedReply == index ? -1 : index);
                          setSelectedComments(-1);
                          setSelectedLike(-1);
                        }}
                        style={{
                          backgroundColor: "#cfcfc4",
                          borderRadius: 5,
                          color: "white",
                          // display: 'none',
                          fontSize: 18,
                          // float: 'right',
                          paddingLeft: 10,
                          paddingRight: 10,
                          margin: 5
                        }}
                      >
                        {" "}
                        {index == selectedReply ? "Close" : ""}{" "}
                      </span>{" "}
                      {index != selectedReply &&
                      res.sender_id == user.user_id ? (
                        <span
                          onClick={() => {
                            if (user && user.name == "Login") {
                              alert("Please sign in as guest to continue.");
                              return;
                            } else if (
                              meetingDetails &&
                              meetingDetails[0] &&
                              !meetingDetails[0].status
                            ) {
                              alert(
                                "Please Wait for the Host to Start this Meeting."
                              );
                              return;
                            } else if (!meetingId) {
                              alert(
                                "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                              );
                              return;
                            }
                            deleteCommentDB(res);
                          }}
                          style={{
                            backgroundColor: "#cfcfc4",
                            borderRadius: 5,
                            color: "white",
                            // display: 'none',
                            fontSize: 18,
                            // float: 'right',
                            paddingLeft: 10,
                            paddingRight: 10,
                            margin: 5
                          }}
                        >
                          {" "}
                          {"Delete"}{" "}
                        </span>
                      ) : null}
                    </div>
                    <div
                      onClick={() =>
                        setSelectedReply(selectedReply == index ? -1 : index)
                      }
                      style={{
                        // backgroundColor:'#f2f3f5',
                        // height:50,
                        // borderRadius:5,
                        color: "black",
                        minHeight: 20,
                        padding: 5,
                        overflowWrap: "break-word",
                        fontSize: 12,
                        display: "flex",
                        flexDirection: "row"
                      }}
                      className="body"
                    >
                      <div>
                        <img
                          onError={() => {
                            if (res.sender_id)
                              setImageURL({
                                [res.sender_id]: true
                              });
                          }}
                          src={
                            res.sender_id &&
                            `https://varefiles.s3.us-east-2.amazonaws.com/${res.sender_id.replace(
                              ".com",
                              ".jpg"
                            )}`
                          }
                          style={{
                            display: "none",
                            height: 40,
                            width: 40,
                            borderRadius: 100
                          }}
                          alt=""
                        />{" "}
                        {imageURL[res.sender_id] ? (
                          <UserAvatar
                            size="40"
                            name={res.name}
                            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
                          />
                        ) : (
                          <img
                            src={
                              res.sender_id &&
                              `https://varefiles.s3.us-east-2.amazonaws.com/${res.sender_id.replace(
                                ".com",
                                ".jpg"
                              )}`
                            }
                            style={{
                              height: 40,
                              width: 40,
                              borderRadius: 100
                            }}
                            alt=""
                          />
                        )}{" "}
                        <div
                          style={{
                            marginLeft: 8,
                            color: "gray",
                            fontSize: 9
                          }}
                          className=""
                        >
                          {" "}
                          {res.name}{" "}
                        </div>{" "}
                      </div>{" "}
                      <span
                        style={{
                          paddingLeft: 10
                        }}
                      >
                        {" "}
                        {`  ${res.comment}`}{" "}
                      </span>{" "}
                    </div>{" "}
                    {index == selectedReply ? (
                      <textarea
                        ref={textInput}
                        style={{
                          backgroundColor: "#f2f3f5",
                          fontSize: 16,
                          paddingLeft: 50,
                          width: "100%"
                        }}
                        type="text"
                        name="name"
                        placeholder="Reply with your comment"
                      />
                    ) : null}{" "}
                  </div>

                  {index == selectedReply ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row"
                      }}
                    >
                      {" "}
                      {replyArray &&
                      replyArray.length &&
                      replyArray.length > 0 ? (
                        <div
                          style={{
                            width: "90%"
                          }}
                        >
                          <div
                            className="meta"
                            style={{
                              // color:'black',
                              fontSize: 10,
                              padding: 5
                            }}
                          >
                            {" "}
                            {"  Replied By: "}{" "}
                          </div>{" "}
                          {replyArray &&
                          replyArray.length &&
                          replyArray.length > 0 ? (
                            <ScrollMenu
                              alignCenter={false}
                              data={
                                replyArray &&
                                replyArray.length &&
                                replyArray.length > 0
                                  ? replyArray.map((info, i) => {
                                      return (
                                        <div
                                          key={"sdcvvvbv" + i}
                                          onClick={() =>
                                            setSelectedComments(
                                              selectedComments == index
                                                ? -1
                                                : index
                                            )
                                          }
                                          style={{
                                            paddingLeft: 10,
                                            paddingRight: 10
                                          }}
                                        >
                                          <img
                                            onError={() => {
                                              if (info.user_id)
                                                setImageURL({
                                                  [info.user_id]: true
                                                });
                                            }}
                                            src={
                                              info.user_id &&
                                              `https://varefiles.s3.us-east-2.amazonaws.com/${info.user_id.replace(
                                                ".com",
                                                ".jpg"
                                              )}`
                                            }
                                            style={{
                                              display: "none",
                                              height: 40,
                                              width: 40,
                                              borderRadius: 100
                                            }}
                                            alt=""
                                          />{" "}
                                          {imageURL[info.user_id] ? (
                                            <UserAvatar
                                              size="40"
                                              name={info.name}
                                              // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
                                            />
                                          ) : (
                                            <img
                                              src={
                                                info.user_id &&
                                                `https://varefiles.s3.us-east-2.amazonaws.com/${info.user_id.replace(
                                                  ".com",
                                                  ".jpg"
                                                )}`
                                              }
                                              style={{
                                                height: 40,
                                                width: 40,
                                                borderRadius: 100
                                              }}
                                              alt=""
                                            />
                                          )}
                                          <span
                                            style={{
                                              display: "flex",
                                              fontSize: 9,
                                              color: "#2096F3",
                                              maxWidth: 5,
                                              overflowWrap: "break-word"
                                            }}
                                            className="meta"
                                          >
                                            {" "}
                                            @ {info.name}{" "}
                                          </span>{" "}
                                        </div>
                                      );
                                    })
                                  : []
                              }
                            />
                          ) : null}
                        </div>
                      ) : null}{" "}
                    </div>
                  ) : null}

                  {selectedComments == index &&
                  replyArray &&
                  replyArray.length &&
                  replyArray.length > 0
                    ? replyArray.map((info, y) => {
                        // const commentIndex = y
                        // const deleteCommentArray = replyArray.splice(y, 1)

                        return (
                          <div
                            style={{
                              backgroundColor: "#f2f3f5",
                              borderRadius: 4,
                              padding: 3,
                              margin: 4
                            }}
                            key={"ljjjjj" + y}
                          >
                            <div
                              style={{
                                color: "#ff9700"
                              }}
                            >
                              {" "}
                              {`${info.name} (${
                                info.date ? info.date : res.date ? res.date : ""
                              }) `}{" "}
                            </div>{" "}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <span
                                style={{
                                  padding: 3,
                                  margin: 2
                                }}
                              >
                                <img
                                  onError={() => {
                                    if (info.user_id)
                                      setImageURL({
                                        [info.user_id]: true
                                      });
                                  }}
                                  src={
                                    info.user_id &&
                                    `https://varefiles.s3.us-east-2.amazonaws.com/${info.user_id.replace(
                                      ".com",
                                      ".jpg"
                                    )}`
                                  }
                                  style={{
                                    display: "none",
                                    height: 40,
                                    width: 40,
                                    borderRadius: 100
                                  }}
                                  alt=""
                                />{" "}
                                {imageURL[info.user_id] ? (
                                  <UserAvatar
                                    size="40"
                                    name={info.name}
                                    // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
                                  />
                                ) : (
                                  <img
                                    src={
                                      info.user_id &&
                                      `https://varefiles.s3.us-east-2.amazonaws.com/${info.user_id.replace(
                                        ".com",
                                        ".jpg"
                                      )}`
                                    }
                                    style={{
                                      height: 40,
                                      width: 40,
                                      borderRadius: 100
                                    }}
                                    alt=""
                                  />
                                )}
                              </span>{" "}
                              {` ${info.comment}`}{" "}
                              {info.user_id == user.user_id ? (
                                <span
                                  style={{
                                    position: "absolute",
                                    height: 30,
                                    width: 30,
                                    right: 30,
                                    marginRight: 20
                                  }}
                                >
                                  <i
                                    onClick={() => {
                                      deleteReplyCommentDB({
                                        ...res,
                                        date: res.date,
                                        reply:
                                          res.reply &&
                                          res.reply.length &&
                                          res.reply.length > 0
                                            ? JSON.stringify(
                                                replyArray.splice(0, y)
                                              )
                                            : "",
                                        sender_id: user && user.user_id
                                      });
                                    }}
                                    style={{
                                      color: "#FA8072"
                                    }}
                                    className="fas fa-2x fa-trash-alt"
                                  >
                                    {" "}
                                  </i>{" "}
                                </span>
                              ) : null}{" "}
                            </div>
                          </div>
                        );
                      })
                    : null}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      // paddingBottom:5,
                      // paddingLeft:5
                      padding: 5
                    }}
                    className=""
                  >
                    <i
                      onClick={() => {
                        const myLikeStatus =
                          res.likes && res.likes.length && res.likes.length > 0
                            ? res.likes.filter(like => {
                                return like.user_id == user.user_id;
                              })
                            : [];

                        const likesArray =
                          myLikeStatus && myLikeStatus.length > 0
                            ? JSON.stringify(
                                res.likes.filter(like => {
                                  return like.user_id != user.user_id;
                                })
                              )
                            : JSON.stringify([
                                ...res.likes,
                                {
                                  date: new Date(),
                                  name: user && user.name,
                                  user_id: user && user.user_id
                                }
                              ]);
                        // console.log('myLikeStatusxx',res)

                        saveLikeMessagetoDB({
                          ...res,
                          date: res.date,
                          likes: likesArray,
                          reply:
                            res.reply &&
                            res.reply.length &&
                            res.reply.length > 0
                              ? JSON.stringify(res.reply)
                              : "",
                          sender_id: user && user.user_id
                        });
                        // setSelectedReply(selectedReply == index ? -1 : index)
                      }}
                      style={{
                        color:
                          res.likes && res.likes.length && res.likes.length > 0
                            ? "#2096F3"
                            : "#f2f3f5"
                      }}
                      className="fas fa-1x fa-heart"
                    >
                      {" "}
                      {res.likes && res.likes.length && res.likes.length > 0
                        ? res.likes.length
                        : ""}{" "}
                    </i>{" "}
                    <i
                      style={{
                        paddingLeft: 5,
                        color:
                          res.reply && res.reply.length && res.reply.length > 0
                            ? "#2096F3"
                            : "#f2f3f5"
                      }}
                      className="fas fa-1x fa-comments"
                    >
                      {" "}
                      {res.reply && res.reply.length && res.reply.length > 0
                        ? res.reply.length
                        : ""}{" "}
                    </i>
                    <div
                      style={{
                        paddingLeft: 20,
                        fontSize: 12
                      }}
                      className="meta"
                    >
                      {" "}
                      {res.date}{" "}
                    </div>{" "}
                  </div>

                  {index == selectedReply &&
                  likeArray &&
                  likeArray.length &&
                  likeArray.length > 0 ? (
                    <div
                      style={{
                        borderRadius: 5,
                        backgroundColor: "#cfcfc4",
                        marginBottom: 5
                      }}
                    >
                      <div
                        style={{
                          color: "black",
                          fontSize: 10,
                          padding: 5
                        }}
                      >
                        {" "}
                        {"  Liked By: "}{" "}
                      </div>{" "}
                      {likeArray && likeArray.length && likeArray.length > 0 ? (
                        <ScrollMenu
                          alignCenter={false}
                          // arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
                          // arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
                          data={
                            likeArray &&
                            likeArray.length &&
                            likeArray.length > 0
                              ? likeArray.map((rep, index) => {
                                  return (
                                    <div
                                      key={"lvggssgnh" + index}
                                      onClick={() => setActiveUser(rep.user_id)}
                                      style={{
                                        // paddingTop:10,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                      }}
                                    >
                                      <img
                                        onError={() => {
                                          if (rep.user_id)
                                            setImageURL({
                                              [rep.user_id]: true
                                            });
                                        }}
                                        src={
                                          rep.user_id &&
                                          `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace(
                                            ".com",
                                            ".jpg"
                                          )}`
                                        }
                                        style={{
                                          display: "none",
                                          height: 40,
                                          width: 40,
                                          borderRadius: 100
                                        }}
                                        alt=""
                                      />{" "}
                                      {imageURL[rep.user_id] ? (
                                        <UserAvatar
                                          size="40"
                                          name={rep.name}
                                          // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
                                        />
                                      ) : (
                                        <img
                                          src={
                                            rep.user_id &&
                                            `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace(
                                              ".com",
                                              ".jpg"
                                            )}`
                                          }
                                          style={{
                                            height: 40,
                                            width: 40,
                                            borderRadius: 100
                                          }}
                                          alt=""
                                        />
                                      )}
                                      <span
                                        style={{
                                          fontSize: 9,
                                          color: "white"
                                        }}
                                      >
                                        {" "}
                                        {rep.name}{" "}
                                      </span>{" "}
                                    </div>
                                  );
                                })
                              : null
                          }
                        />
                      ) : null}{" "}
                    </div>
                  ) : null}
                </li>
              );
            })
          : null}{" "}
      </ul>{" "}
      <div
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "white"
        }}
      ></div>
    </div>
  );
};

export default CommentsMobile;
