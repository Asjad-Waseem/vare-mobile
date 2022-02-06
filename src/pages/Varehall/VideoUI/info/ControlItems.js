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

const ControlItems = ({
  message,
  author,
  hashtag,
  rep,
  noAvatar,
  handleAction,
  handleComment,
  commentStatus
}) => {
  const [myReaction, setMyReaction] = useState({
    _id: "604465c91b269956a6fdb745",
    date: "2021-3-6 23:34:8",
    content_id: "gfgf",
    sender_id: "deetester@test.com",
    comment: "Sssssssssssss",
    sender_name: "Deetester",
    like: true,
    reply: [
      {
        sender_id: "deetester@test.com",
        comment: "Sssssssssssss",
        sender_name: "Deetester",
        like: ""
      }
    ]
  });

  useEffect(() => {
    // console.log(myReaction);
  }, [myReaction]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          color: "#1c1e21",
          fontSize: 12,
          width: 390
        }}
      >
        <div
          style={{
            paddingRight: 5
          }}
        >
          {!noAvatar ? (
            <UserAvatar
              size="48"
              name="Will Binns-Smith"
              src="https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg"
            />
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            {hashtag ? `#${hashtag.replace(",", " #")}` : ""}
          </div>
          <div
            style={{
              paddingBottom: 5,
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            {!noAvatar ? author : null}
          </div>
          <div
            style={{
              fontSize: 12,
              paddingBottom: 5
            }}
          >
            {`${message.substring(0, 70)} ${message.length > 70 ? "..." : ""}`}
          </div>

          <div
            style={{
              paddingTop: 10,
              color: "#1c1e21",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div
              onClick={() => {}}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 45,
                borderRadius: 100,
                flexDirection: "column"
              }}
            >
              <i
                style={{
                  //marginBottom: 6,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#2096F3"
                }}
                // name={"times"}
                className={`fas fa-2x fa-eye`}
              />
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#1c1e21"
                }}
              >
                22k
              </div>
            </div>

            <div
              onClick={() => {
                setMyReaction({...myReaction, like: !myReaction.like});
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 45,
                borderRadius: 100,
                flexDirection: "column"
              }}
            >
              <i
                style={{
                  //marginBottom: 6,
                  marginTop: 3,
                  textAlign: "center",
                  color: myReaction.like == true ? "#2096F3" : "#cfcfc4"
                }}
                name={"heart"}
                className={`fas fas fa-2x fa-heart`}
              />
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#1c1e21"
                }}
              >
                Like
              </div>
            </div>

            <div
              onClick={() => {
                // this.shareMessage({
                //   message: `${`Welcome to VARE townhall to discuss bill: ${item.bill_id} with your Representative.`}`,
                //   title: `${`${item.bill_id}  ${item.bill_title}`}`,
                //   url: ""
                // });
              }}
              style={{
                // backgroundColor: "white",
                // margin: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 45,
                borderRadius: 100,
                flexDirection: "column"
              }}
            >
              <i
                style={{
                  //marginBottom: 6,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#cfcfc4"
                }}
                // name={"share"}
                className={`fas fas fa-2x fa-share`}
              />
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#1c1e21"
                }}
              >
                Share
              </div>
            </div>

            <div
              onClick={() => {
                // this.shareMessage({
                //   message: `${`Welcome to VARE townhall to discuss bill: ${item.bill_id} with your Representative.`}`,
                //   title: `${`${item.bill_id}  ${item.bill_title}`}`,
                //   url: ""
                // });
              }}
              style={{
                // backgroundColor: "white",
                // margin: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 45,
                borderRadius: 100,
                flexDirection: "column"
              }}
            >
              <i
                onClick={() => {
                  handleComment(rep._id);
                }}
                style={{
                  //marginBottom: 6,
                  marginTop: 3,
                  textAlign: "center",
                  color: commentStatus ? "rgb(135, 206, 250)" : "#cfcfc4"
                  // color: "rgb(135, 206, 250)"
                }}
                // name={"share"}
                className={`fas fas fa-2x fa-comment-dots`}
              />
              <div
                style={{
                  fontSize: 10,
                  marginTop: 3,
                  textAlign: "center",
                  color: "#1c1e21"
                }}
              >
                44k
              </div>
            </div>

            {/*      <VotePolicy
        item={item.bill_id}
        num={tempCount && tempCount[0] ? tempCount[0]["pst"] : 0}
        pct={tempCount && tempCount[0] ? tempCount[0]["pst"] : 0}
      />*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default ControlItems;
