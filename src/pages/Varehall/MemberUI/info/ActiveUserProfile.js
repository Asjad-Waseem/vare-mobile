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
import addDefaultSrc from "./addDefaultSrc";
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

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

const UserProfile = ({
  meetingId,
  user,
  host,
  yourID,
  setActiveUser,
  meetingDetails,
  meetingRSVP,
  meetingComments,
  guestUsers,
  setInViewVideoIndex,
  inViewVideoIndex
}) => {
  const [uniqueName, setUniqueName] = useState([user.user_id]);
  const [imageActive, setImageActive] = useState({});
  const [activeGuest, setActiveGuest] = useState([]);

  // console.log("meetingRSVP", meetingRSVP);

  // attending: "yes"
  // meeting_id: "880A0DDD-F65A-4DC3-9BE6-42AB2EFC7EF5"
  // name: "Guest User2"
  // publishedAt: "2020-09-12T11:00:00Z"
  // user_id: "test@test2.com"
  // _id: "6011c021173342cedfa94b64"

  useEffect(() => {
    setActiveGuest(guestUsers);
    // console.log("guestUsers", guestUsers);
  }, [guestUsers]);

  let listData =
    activeGuest &&
    activeGuest.map((item, index) => {
      const unique = uniqueName.indexOf(item.myIndex);
      if (unique == -1) {
        setUniqueName([...uniqueName, item.myIndex]);
      }
      return (
        <div
          key={"ljfrj" + index}
          onClick={() =>
            setInViewVideoIndex(
              inViewVideoIndex == item.myIndex ? null : item.myIndex
            )
          }
        >
          <div
            style={{
              flexDirection: "column"
            }}
          >
            {" "}
            {item.msg ? (
              <span
                style={{
                  position: "absolute",
                  top: 50,
                  // left:1,
                  height: 25,
                  width: 25,
                  borderRadius: "100%"
                  // borderWidth:2,
                  // backgroundColor:'green',
                }}
              >
                <i
                  className="fas fa-comments"
                  style={{
                    color: "#FA8072"
                  }}
                >
                  {" "}
                </i>{" "}
              </span>
            ) : null}{" "}
            <img
              onError={e => {
                setImageActive({
                  ...imageActive,
                  [item.myIndex]: true
                });
              }}
              src={
                item.myIndex &&
                `https://varefiles.s3.us-east-2.amazonaws.com/${item.myIndex.replace(
                  ".com",
                  ".jpg"
                )}`
              }
              className="mb-2"
              style={{
                display: "none",
                border: "1px solid #FA8072",
                // marginTop:20,
                padding: 5,
                height: 50,
                width: 50,
                marginTop: 10,
                marginRight: 10,
                marginLeft: 10,
                borderRadius: 100
              }}
              alt=""
            />{" "}
            {imageActive[item.myIndex] ? (
              <UserAvatar
                size="48"
                name={item.name}
                // src={item.myIndex && `https://varefiles.s3.us-east-2.amazonaws.com/${item.myIndex.replace('.com','.jpg')}`}
                style={{
                  border: "1px solid #FA8072",
                  // marginTop:20,
                  padding: 5,
                  height: 60,
                  width: 60,
                  margin: 10,
                  // marginRight:10,
                  // marginLeft:10,
                  borderRadius: 100
                }}
              />
            ) : (
              <UserAvatar
                size="48"
                name={item.name}
                src={
                  item.myIndex &&
                  `https://varefiles.s3.us-east-2.amazonaws.com/${item.myIndex.replace(
                    ".com",
                    ".jpg"
                  )}`
                }
                style={{
                  border: "1px solid #FA8072",
                  // marginTop:20,
                  padding: 5,
                  height: 60,
                  width: 60,
                  margin: 10,
                  // marginRight:10,
                  // marginLeft:10,
                  borderRadius: 100
                }}
              />
            )}
            <p
              style={{
                fontSize: 10,
                marginRight: 10,
                marginLeft: 10,
                overflowWrap: "break-word",
                width: 50
              }}
            >
              {" "}
              {item.name && item.name.length && item.name.length > 14
                ? `${item.name.substring(0, 14)}...`
                : item.name}{" "}
            </p>{" "}
          </div>{" "}
        </div>
      );
    });

  listData &&
    listData.unshift(
      <div
        key={"sdljfrj"}
        onClick={() => {
          setInViewVideoIndex(null);
        }}
        // onClick={()=>{
        // setActiveUser('')
        // }}
      >
        {/*PartnerVideo ? PartnerVideo : */}{" "}
        <img
          onError={addDefaultSrc}
          src={
            user &&
            host.user_id &&
            `https://varefiles.s3.us-east-2.amazonaws.com/${host.user_id.replace(
              ".com",
              ".jpg"
            )}`
          }
          className="mb-2"
          style={{
            border: "1px solid #FA8072",
            // marginTop:20,
            padding: 5,
            height: 100,
            width: 100,
            margin: 10,
            borderRadius: 100
          }}
          alt=""
        />
        <p
          style={{
            fontSize: 10,
            // marginRight:10,
            // marginLeft:10,
            overflowWrap: "break-word",
            width: "100%",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          <span
            style={{
              color: "#FA8072"
            }}
          >
            {" "}
            Host:{" "}
          </span>{" "}
          {user ? host.name : ""}{" "}
        </p>{" "}
        {/*<video
                        style={{
                       height:100,
                       width:100,
                       margin:10
                     }} controls>
                        <source src={tempVideo} type="video/mp4"/>
                      Your browser does not support the video tag.
                      </video>*/}{" "}
      </div>
    );

  return (
    <Row>
      <Col lg={12} sm={12}>
        <ScrollMenu
          alignCenter={false}
          // arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
          // arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
          data={listData}
        />{" "}
      </Col>{" "}
    </Row>
  );
};

export default UserProfile;
