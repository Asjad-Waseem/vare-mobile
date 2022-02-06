import React, {Fragment, useEffect, useRef, useState} from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import addDefaultSrc from "./addDefaultSrc";
import useLocalStorage from "./localStorage";
import moment from "moment";

import RESTCall from "../../../../redux/actions/restApi";
import io from "socket.io-client";

import {Wave, Random} from "react-animated-text";

import {isIOS} from "react-device-detect";

const width = window.innerWidth;
const height = window.innerHeight;

const LiveChats = props => {
  const {replyId, msg} = props;
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [emoji, setEmoji] = useState(false);

  const [chosenEmojiPosition, setChosenEmojiPosition] = useState(0);
  const socketRef = useRef();
  const textChatInput = useRef([]);

  useEffect(() => {
    let replyMsg = replyId && msg.filter(rep => rep._id == replyId)[0];
    // console.log("replyMsg", replyMsg);
    if (replyMsg && replyMsg.name) {
      textChatInput.current.value = `@${replyMsg.name}:  `;
    } else {
      textChatInput.current.value = "";
    }
  }, [replyId, textChatInput.current]);

  const onEmojiClick = (event, emojiObject) => {
    // console.log("emojiObject", emojiObject && emojiObject.emoji);
    if (emojiObject && emojiObject.emoji)
      textChatInput.current.value =
        chosenEmojiPosition > 0
          ? insertEmoji({
              index: chosenEmojiPosition,
              replace: emojiObject.emoji,
              text: textChatInput.current.value
            })
          : textChatInput.current.value + " " + emojiObject;
    setEmoji(false);
  };

  const insertEmoji = ({index, replace, text}) => {
    return (
      text.substr(0, index) +
      " " +
      replace +
      " " +
      text.substr(index + replace.length)
    );
  };

  //sockeio starts-----
  // const socket = io("https://vare-chatsocketRef..herokuapp.com/");

  //sockeio end-----
  const getMonthFromString = mon => {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  };

  const saveNewChat = () => {
    // const oldTime = new Date().toString().split(" ");
    // const newTime = moment( moment().utc().format( "YYYY-MM-DD HH:mm:ss" )).toDate()
    const chat = {
      date: new Date(moment()),
      name: storeUser.user && storeUser.user.name,
      user_id: storeUser.user && storeUser.user.user_id,
      comment:
        textChatInput.current && textChatInput.current.value
          ? textChatInput.current.value
          : ""
    };
    props.saveChatList(chat);
    // console.log("ddddzzz", textChatInput.current.value);
    if (textChatInput.current && textChatInput.current.value)
      textChatInput.current.value = "";
  };

  return (
    <div
      style={{
        height: 30,
        backgroundColor: "red !important"
      }}
    >
      <div>{emoji ? <Picker onEmojiClick={onEmojiClick} /> : null}</div>
      <div
        style={{
          borderStyle: "solid",
          borderWidth: 0.8,
          backgroundColor: "white",
          position: "fixed",
          bottom: 50,
          left: 0,
          zIndex: 10,
          width: "100%",
          height: 40,
          // marginBottom: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <div
          style={{
            // display: "flex",
            // // flexDirection: "row",
            // backgroundColor: "white",
            // borderStyle: "solid",
            // borderWidth: 0.3,
            width: "10%" //window.innerWidth
          }}
          onClick={() => {
            setEmoji(!emoji);
            // textChatInput.current.focus();
          }}
        >
          <i
            style={{
              color: "#f1a211",
              padding: 5,
              paddingTop: 3,
              marginBottom: 4
            }}
            className="fas fa-2x fa-laugh-wink"
          />
        </div>
        <div
          style={{
            display: "flex",
            // flexDirection: "row",

            width: "90%" //window.innerWidth
          }}
        >
          <textarea
            ref={textChatInput}
            onClick={selection => {
              setChosenEmojiPosition(textChatInput.current.selectionStart);
              // console.log("selection", textChatInput.current.selectionStart);
            }}
            onChange={selection => {
              setChosenEmojiPosition(textChatInput.current.selectionStart);
              // console.log("selection", textChatInput.current.selectionStart);
            }}
            style={{
              width: "100%",
              // marginLeft: 10,
              // backgroundColor: "white",
              borderRadius: 5,
              height: 60,
              color: "black",
              // marginBottom: 20,
              paddingTop: 18
              // paddingLeft: 50
            }}
            placeholder={"    Leave comments"}
            rows="5"
            type="text"
            id="name"
            name="name"
            minLength="4"
            maxLength="50"
          />
          <div>
            <i
              onClick={() => {
                if (
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
                paddingTop: 13,
                color: "black",
                margin: 8,
                marginRight: 20,
                paddingBottom: 3
              }}
              className="fas fa-x fa-paper-plane"
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChats;
