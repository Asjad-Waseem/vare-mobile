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
import {groupBy, getDatePeriod} from "../../helpers";
import HoverVideoPlayer from "react-hover-video-player";
import ControlItems from "./ControlItems";
import LiveChats from "./LiveChats";

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

const CommentControls = () => {
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
          onClick={() => {}}
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
            // item.bill_id && item.bill_id != "tbd"
            //   ? this.props.updateState(item.bill_id, "yes")
            //   : alert("Bill ID is needed to vote.");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // margin: 10,
            height: 20,
            width: 45,
            borderRadius: 100
            // flexDirection: "row"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3,
              textAlign: "center"
            }}
            name={"check"}
            className={`fas fa-thumbs-down`}
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
            <span style={{paddingLeft: 4}}>4k</span>
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
              textAlign: "center"
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
            <span style={{paddingLeft: 4}}>15</span>
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
      </div>
    </>
  );
};

export default CommentControls;
