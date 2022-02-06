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
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import ReactSwipe from "react-swipe";
import {useHistory} from "react-router-dom";
import {groupBy} from "../../helpers";
import HoverVideoPlayer from "react-hover-video-player";
import ControlItems from "./ControlItems";
import LiveChats from "./LiveChats";
import useLocalStorage from "./localStorage";

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

const CommentControls = ({
  saveMsgReaction,
  rep,
  handleReplyMsg,
  handleDelete
}) => {
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const message =
    "LATEST NAIJA AFROBEAT 2021 NONSTOP PARTY MIX BY DJ FINEX FT REMA JOEBOY TEKNO OMAH reretretretertretretertret ";

  const [replyMsg, setReplyMsg] = useState("");
  useEffect(() => {
    if (replyMsg) {
      handleReplyMsg(rep);
    } else {
      handleReplyMsg("");
    }
  }, [replyMsg]);

  return (
    <>
      <div
        style={{
          // color: rep.like ? "#2096F3" : "#1c1e21",
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
            saveMsgReaction(rep);
          }}
          style={{
            color: rep.like ? "#2096F3" : "#f2f3f5",
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
              textAlign: "center"
            }}
            // name={"times"}
            className={`fas fa-heart`}
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
            <span style={{paddingLeft: 4}}>22k</span>
          </div>
        </div>

        <div
          onClick={() => {
            setReplyMsg(!replyMsg);
          }}
          style={{
            color: replyMsg ? "#2096F3" : "#f2f3f5",
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
              textAlign: "center"
            }}
            className={`fas fa-reply`}
          />
        </div>

        {storeUser.user && storeUser.user.user_id == rep.user_id ? (
          <div
            onClick={() => {
              handleDelete(rep);
            }}
            style={{
              color: "#FA8072",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 20,
              width: 45,
              opacity: 0.2,
              borderRadius: 100
              // flexDirection: "row"
            }}
          >
            <i
              style={{
                marginTop: 3,
                textAlign: "center"
              }}
              className={`fas fa-trash-alt`}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CommentControls;
