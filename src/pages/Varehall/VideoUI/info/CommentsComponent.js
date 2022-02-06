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
import {groupBy} from "../../helpers";
import CommentControls from "./CommentControls";
import io from "socket.io-client";
//Import Images
import LiveChats from "./LiveChats";
import moment from "moment";
import useLocalStorage from "./localStorage";
import InfiniteScroll from "react-infinite-scroll-component";

// import VideoApp from "./video";

import "../../info.css";
import styled from "styled-components";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const CommentsComponent = ({contentId}) => {
  // useEffect(() => {
  // }, []);
  const [msg, setMsg] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const socketRef = useRef();
  const textChatInput = useRef([]);

  useEffect(() => {
    // console.log("contentId", contentId, user);
    loadMessages(contentId);
  }, [contentId]);

  const loadMessages = contentId => {
    // socketRef.current = io.connect("http://localhost:5000", {
    socketRef.current = io.connect("https://media.varehall.com", {
      cors: {
        origin: "*"
      }
    });
    // socketRef.current = io.connect("http://localhost:5000", {
    //   cors: {
    //     origin: "*"
    //   }
    // });
    socketRef.current.emit("chat message", [
      {
        content_id: contentId //"60e7352fed2411b4d91796c6"
      }
    ]);
    socketRef.current.on("chat message", chat => {
      // console.log("chat message", contentId, chat);
      setMsg(chat);
    });
  };

  const saveMessages = msg => {
    // if(replyMsg)
    socketRef.current.emit("save chat", msg);
    socketRef.current.on("chat message", chat => {
      setMsg(chat);
      textChatInput.current.value = "";
    });
  };

  const saveMsgReaction = chat => {
    const reaction = {
      ...chat,
      like: !chat.like
    };
    //console.log("reaction", reaction);
    const tempMsgs =
      msg && msg.length > 0 ? msg.filter(rep => rep._id != chat._id) : [];
    const newMsgs = [reaction, ...tempMsgs];

    // setMsg(newMsgs);
    delete reaction._id;
    socketRef.current.emit("save chat", reaction);
    socketRef.current.on("chat message", chat => {
      // console.log("xxxx", chat);
      setMsg(chat);
      textChatInput.current.value = "";
    });
  };

  const deleteMsgReaction = chat => {
    socketRef.current.emit("delete chat", chat);
    socketRef.current.on("chat message", chat => {
      // console.log("xxxx", chat);
      setMsg(chat);
    });
  };

  return (
    <>
      <InfiniteScroll
        dataLength={msg.length} //This is important field to render the next data
        next={loadMessages}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{textAlign: "center"}}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={this.refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{textAlign: "center"}}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{textAlign: "center"}}>&#8593; Release to refresh</h3>
        }
      >
        {msg && msg.length > 0
          ? msg.map(rep => {
              return (
                <div
                  style={{
                    width: "100%",
                    padding: 10,
                    // width: 430,
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "white",
                    marginBottom: 3
                  }}
                >
                  <UserAvatar
                    size="40"
                    name={"res.name"}
                    src="https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
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
                        fontSize: 9
                      }}
                      className=""
                    >
                      {rep.name} -{moment(rep.date).fromNow()}
                    </div>

                    <span
                      style={{
                        paddingLeft: 10,
                        fontSize: 9
                      }}
                    >
                      {`  ${rep.comment}`}{" "}
                    </span>
                    <CommentControls
                      rep={rep}
                      contentId={contentId}
                      saveMsgReaction={chat => {
                        saveMsgReaction(chat);
                      }}
                      handleReplyMsg={chat => {
                        setReplyMsg(chat);
                      }}
                      handleDelete={chat => {
                        // console.log("delete", chat);
                        if (
                          storeUser.user &&
                          storeUser.user.user_id == chat.user_id
                        ) {
                          deleteMsgReaction(chat);
                        } else {
                          alert(
                            "You are not authorized to delete this message"
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })
          : null}
      </InfiniteScroll>
    </>
  );
};

export default CommentsComponent;
