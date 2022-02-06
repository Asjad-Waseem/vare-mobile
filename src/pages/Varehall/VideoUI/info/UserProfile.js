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
  activeUser,
  setActiveUser,
  meetingDetails,
  meetingRSVP,
  meetingComments,
  guestUsers
}) => {
  const [uniqueName, setUniqueName] = useState([user.user_id]);
  const [imageActive, setImageActive] = useState({});

  useEffect(() => {}, []);

  let listData =
    meetingDetails &&
    meetingRSVP &&
    meetingRSVP.map((item, index) => {
      // console.log("item", item);

      const unique = uniqueName.indexOf(item.user_id);
      if (unique == -1) {
        setUniqueName([...uniqueName, item.user_id]);
      }
      return (
        <div
          style={{
            // height: 130,
            width: 70,
            display: "flex",
            border: "1px solid #FA8072",
            borderRadius: 20,
            // paddingLeft: 5,
            marginLeft: 5,
            // paddingLeft: 20,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
          key={"fljfrj" + index}
          onClick={() => {
            setActiveUser(
              activeUser &&
                activeUser.user_id &&
                activeUser.user_id == item.user_id
                ? ""
                : item
            );
          }}
        >
          <UserAvatar
            size="50"
            name={item.name ? item.name : "NA"}
            src={item.img}
            style={{
              // border: "1px solid #FA8072",
              // marginTop:20,
              paddingTop: 5,
              // paddingBottom: 5,
              height: 50,
              width: 50,
              // margin: 10,
              // marginRight:10,
              // marginLeft:10,
              borderRadius: 100
            }}
          />
          <div
            style={{
              fontSize: 10,
              paddingTop: 5,
              // marginRight: 10,
              // marginLeft: 10,
              overflowWrap: "wrap"
              // width: 50
            }}
          >
            {item.name ? item.name : "Guest"}
          </div>
          <div>
            <i className="fas fa-info"></i>
          </div>
        </div>
      );
    });

  listData &&
    listData.unshift(
      <div
        style={{
          // height: 130,
          width: 70,
          display: "flex",
          border: "1px solid #FA8072",
          borderRadius: 20,
          // paddingLeft: 5,
          // marginLeft: 5,
          // paddingLeft: 20,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
        key={"flssjfrj"}
        onClick={() => {
          setActiveUser(
            activeUser &&
              activeUser.user_id &&
              activeUser.user_id == host.user_id
              ? ""
              : host
          );
        }}
      >
        <UserAvatar
          size="60"
          name={host.name ? host.name : "Host"}
          src={host.img ? host.img : ""}
          style={{
            // border: "1px solid #FA8072",
            // marginTop:20,
            paddingTop: 5,
            // paddingBottom: 5,
            height: 60,
            width: 60,
            // margin: 10,
            // marginRight:10,
            // marginLeft:10,
            borderRadius: 100
          }}
        />
        <div
          style={{
            fontSize: 10,
            paddingTop: 5,
            // marginRight: 10,
            // marginLeft: 10,
            overflowWrap: "wrap",
            fontWeight: "bold"
            // width: 50
          }}
        >
          {"Host"}
        </div>
        <div
          style={{
            fontSize: 10,
            paddingTop: 5,
            // marginRight: 10,
            // marginLeft: 10,
            overflowWrap: "wrap"
            // width: 50
          }}
        >
          {host.name ? host.name : "Host"}
        </div>
        <div>
          <i className="fas fa-info"></i>
        </div>
      </div>
    );

  return (
    <Row>
      <Col
        lg={12}
        sm={12}
        style={{
          marginLeft: 10
        }}
      >
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
