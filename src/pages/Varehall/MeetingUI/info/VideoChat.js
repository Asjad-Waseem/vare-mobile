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
import {AvForm, AvField} from "availity-reactstrap-validation";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {useLocation, Link} from "react-router-dom";
import SectionTitle from "../../../../components/common/section-title";

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

const VideoComponent = ({
  host,
  meetingId,
  height,
  attendees,
  activeUser,
  stream,
  userVideo,
  partnerVideo,
  incomingCall,
  users,
  yourID,
  callPeer,
  callAccepted
}) => {
  const userData =
    activeUser &&
    activeUser &&
    attendees.length > 0 &&
    attendees.filter(res => {
      return res.userId == activeUser;
    });
  // console.log('userData',userData)
  let UserVideo;
  if (stream) {
    UserVideo = (
      <Fragment>
        <div>
          <Video playsInline muted ref={userVideo} autoPlay />
          <audio controls>
            <source src="" type="audio/ogg" />
            <source src={""} type="audio/mpeg" />
          </audio>{" "}
        </div>{" "}
      </Fragment>
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = <Video playsInline ref={partnerVideo} autoPlay />;
  }

  const callPeer = id => {
    //alert(id)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "DEEAJIBOLA@GMAIL.COM",
            credential: "2813101942"
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "DEEAJIBOLA@GMAIL.COM",
            credential: "2813101942"
          }
        ]
      },
      stream: stream
    });

    peer.on("signal", data => {
      //alert(55)
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID
      });
    });

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", {
        signal: data,
        to: caller
      });
    });

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>
          {" "}
          {caller}
          is calling you{" "}
        </h1>{" "}
        <button onClick={acceptCall}> Accept </button>{" "}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "black",
        padding: 20,
        borderRadius: 10,
        overflow: "auto"
      }}
    >
      <FormGroup className="">
        <Row>
          <div
            style={{
              position: "absolute",
              paddingLeft: 2,
              color: "gray"
            }}
          >
            <Row>
              <Col sm={4} lg={4}>
                <img
                  src={
                    userData
                      ? require(`../../../../assets/images/${userData[0].image}`)
                      : pics
                  }
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 100
                  }}
                  alt=""
                />
              </Col>{" "}
              <Col sm={8} lg={8}>
                <div> {userData ? userData[0].name : "Temp"} </div>{" "}
              </Col>{" "}
            </Row>
            Oct 20, 2020
          </div>{" "}
          <div
            style={{
              // height:400,
              width: 500,
              marginBottom: 30
            }}
          >
            <div
              style={{
                paddingLeft: 50,
                display: "flex",
                flexDirection: "row"
              }}
            >
              <div
                style={{
                  color: "gray",
                  paddingLeft: 10
                }}
              >
                video description information{" "}
              </div>{" "}
            </div>{" "}
            {UserVideo ? (
              UserVideo
            ) : userData && userData.length > 0 ? (
              <img
                src={require(`../../../../assets/images/${userData[0].image}`)}
                style={{
                  width: "100%",
                  height: "240",
                  borderRadius: 25
                }}
                alt=""
              />
            ) : (
              <video width="100%" height="240" controls>
                <source src={tempVideo} type="video/mp4" />
                Your browser does not support the video tag.{" "}
              </video>
            )}
            {PartnerVideo && PartnerVideo}
            <CommenstFieldHeader />
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              {" "}
              {Object.keys(users).map((key, index) => {
                if (key === yourID) {
                  return null;
                }
                return (
                  <button key={"fklisshg" + index} onClick={callPeer(key)}>
                    {" "}
                    Add Guest {key}{" "}
                  </button>
                );
              })}{" "}
            </div>{" "}
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              {" "}
              {incomingCall}{" "}
            </div>{" "}
          </div>{" "}
        </Row>

        <hr />
      </FormGroup>{" "}
    </div>
  );
};

export default VideoComponent;
