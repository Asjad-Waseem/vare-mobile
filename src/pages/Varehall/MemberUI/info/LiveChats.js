import React, {Fragment, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import addDefaultSrc from "./addDefaultSrc";

import RESTCall from "../../../../redux/actions/restApi";
import io from "socket.io-client";

import {Wave, Random} from "react-animated-text";

import {isIOS} from "react-device-detect";

const width = window.innerWidth;
const height = window.innerHeight;

const LiveChats = props => {
  // const videoStatus = useRef(true);
  // const audioStatus = useRef(true);
  const socketRef = useRef();
  // const userVideo = useRef();
  const textChatInput = useRef([]);

  //sockeio starts-----
  // const socket = io("https://vare-chatsocketRef..herokuapp.com/");
  useEffect(() => {
    loadMessages();
  }, [props.meetingId]);

  const loadMessages = () => {
    socketRef.current = io.connect("https://meeting.varehall.com", {
      origins: "*:*"
    });
    // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
    // console.log('chatMessages',[
    //   { "meeting_id": props.meetingId}
    // ])
    socketRef.current.emit("chat message", [
      {
        meeting_id: props.meetingId
      }
    ]);
    socketRef.current.on("chat message", chat => {
      props.updatChatList(chat);
    });
  };

  //sockeio end-----

  const getMonthFromString = mon => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  };

  const saveNewChat = () => {
    const oldTime = new Date().toString().split(" ");
    const newTime = oldTime
      ? oldTime[3] +
        "-" +
        getMonthFromString(oldTime[1]) +
        "-" +
        oldTime[2] +
        " " +
        oldTime[4]
      : "";

    const chat = {
      date: newTime,
      name: props.user && props.user.name,
      user_id: props.user && props.user.user_id,
      comment:
        textChatInput.current && textChatInput.current.value
          ? textChatInput.current.value
          : "",
      emoji: "",
      meeting_id: props.meetingId
    };
    props.saveChatList(chat);

    if (textChatInput.current && textChatInput.current.value)
      textChatInput.current.value = "";
    // console.log('chat',props.chats)
    // chatschats
  };

  const saveNewEmogi = emogi => {
    const oldTime = new Date().toString().split(" ");
    const newTime = oldTime
      ? oldTime[3] +
        "-" +
        getMonthFromString(oldTime[1]) +
        "-" +
        oldTime[2] +
        " " +
        oldTime[4]
      : "";

    const chat = {
      date: newTime,
      name: props.user && props.user.name,
      user_id: props.user && props.user.user_id,
      comment:
        textChatInput.current && textChatInput.current.value
          ? textChatInput.current.value
          : "",
      emoji: emogi ? emogi : "",
      meeting_id: props.meetingId
    };
    props.saveChatList(chat);
    // chatschats
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        zIndex: 10,
        width: "100%",
        height: 250,
        // position:'absolute',
        flexWrap: "wrap",
        // top:270,
        // zIndex: 10,
        backgroundColor: "#2096F3",
        paddingBottom: 10,
        // height:50,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: "row",
        display: "flex",
        paddingTop: 15,
        paddingLeft: 2,
        paddingBottom: 100
        // alignItems: 'center',
        // justifyContent: 'center'
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <img
          style={{
            borderRadius: 100,
            width: 40,
            height: 40
          }}
          onError={e => addDefaultSrc(e, props.user, 0)}
          src={
            props.user &&
            props.user.user_id &&
            `https://varefiles.s3.us-east-2.amazonaws.com/${props.user.user_id.replace(
              ".com",
              ".jpg"
            )}`
          }
          alt=""
        />
        <div
          style={{
            flexWrap: "wrap"
          }}
        >
          {" "}
          {/*props.user.name*/}{" "}
        </div>{" "}
      </div>

      <div
        style={{
          flexDirection: "column",
          display: "flex",
          width: 270
        }}
      >
        <div
          style={{
            marginTop: 3,
            height: 30,
            width: 250,
            marginLeft: 5,
            backgroundColor: "#f2f3f5",
            // backgroundColor:'#f2f3f5',
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 25,
            marginBottom: 20
          }}
        >
          {" "}
          {/*
        <img
          onClick={()=>{
            alert('Meeting must start before you can start chat.')
          }}
           style={{
             // borderRadius:100,
             width:22,
             height:22,
             paddingBottom:5
           }}
           onError={addDefaultSrc}
           src={require('../../../../assets/images/clapp.png')}
          alt=""
        />*/}{" "}
          <i
            onClick={() => {
              if (props.user && props.user.name == "Login") {
                alert("Please sign in as guest to continue.");
              } else if (props.meetingDetail && !props.meetingDetail.status) {
                alert("Please Wait for the Host to Start this Meeting.");
              } else if (!props.meetingId) {
                alert(
                  "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                );
              } else {
                // alert('Meeting must start before you can start chat.')
                saveNewEmogi("fa-heart");
              }
            }}
            style={{
              color: "#ff9700"
              // marginLeft:10,
              // paddingBottom:3
            }}
            className="fas fa-x fa-heart"
          >
            {" "}
          </i>{" "}
          <i
            onClick={() => {
              if (props.user && props.user.name == "Login") {
                alert("Please sign in as guest to continue.");
              } else if (props.meetingDetail && !props.meetingDetail.status) {
                alert("Please Wait for the Host to Start this Meeting.");
              } else if (!props.meetingId) {
                alert(
                  "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                );
              } else {
                saveNewEmogi("fa-thumbs-up");
              }
              // alert('Meeting must start before you can start chat.')
            }}
            style={{
              color: "green"
              // marginLeft:15
            }}
            className="fas fa-x fa-thumbs-up"
          >
            {" "}
          </i>{" "}
          <i
            onClick={() => {
              if (props.user && props.user.name == "Login") {
                alert("Please sign in as guest to continue.");
              } else if (props.meetingDetail && !props.meetingDetail.status) {
                alert("Please Wait for the Host to Start this Meeting.");
              } else if (!props.meetingId) {
                alert(
                  "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                );
              } else {
                saveNewEmogi("fa-thumbs-down");
              }
              // alert('Meeting must start before you can start chat.')
            }}
            style={{
              color: "#ff6961"
              // marginTop:8,
              // marginLeft:15,
              // marginRight:10
            }}
            className="fas fa-x fa-thumbs-down"
          >
            {" "}
          </i>
        </div>

        <div
          onClick={() => {
            if (props.user && props.user.name == "Login") {
              alert("Please sign in as guest to continue.");
            } else if (props.meetingDetail && !props.meetingDetail.status) {
              alert("Please Wait for the Host to Start this Meeting.");
            } else if (!props.meetingId) {
              alert(
                "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
              );
            } else {
              textChatInput.current.focus();
            }
          }}
          style={{
            margin: 2,
            borderRadius: 10,
            backgroundColor: "#f2f3f5",
            flexDirection: "row",
            display: "flex",
            width: 270,
            paddingBottom: 50
            // marginBottom:20
            // height: '90%',
          }}
        >
          <textarea
            ref={textChatInput}
            style={{
              marginLeft: 10,
              marginTop: 3,
              // backgroundColor:'#f2f3f5',
              width: "100%",
              height: 60,
              color: "black",
              paddingLeft: 20
              // paddingBottom:20
            }}
            placeholder={"    Leave Live Chats"}
            rows="5"
            type="text"
            id="name"
            name="name"
            minLength="4"
            maxLength="50"
            // size="10"
          />
          <i
            onClick={() => {
              if (props.user && props.user.name == "Login") {
                alert("Please sign in as guest to continue.");
              } else if (props.meetingDetail && !props.meetingDetail.status) {
                alert("Please Wait for the Host to Start this Meeting.");
              } else if (!props.meetingId) {
                alert(
                  "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
                );
              } else if (
                textChatInput &&
                textChatInput.current &&
                textChatInput.current.value != ""
              ) {
                saveNewChat();
              } else {
                alert("Field must not be empty.");
              }
            }}
            style={{
              color: "black",
              margin: 8,
              marginRight: 20,
              paddingBottom: 3
            }}
            className="fas fa-x fa-paper-plane"
          >
            {" "}
          </i>{" "}
        </div>
      </div>
    </div>
  );
};

export default LiveChats;
