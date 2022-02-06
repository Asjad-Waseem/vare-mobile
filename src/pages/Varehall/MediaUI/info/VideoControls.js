import React, {Fragment, useEffect, useRef, useState} from "react";
import styled from "styled-components";

const Room = props => {
  const [myVote, setMyVote] = useState({});
  const [videoColor, setVideoColor] = useState(false);
  const [audioColor, setAudioColor] = useState(false);
  // const [meetingStatus,setMeetingStatus] = useState(false)
  // console.log("audioColor", audioColor);
  // console.log("videoColor", videoColor);
  // console.log("videoStatus", props.videoStatus);

  // const videoStatus = useRef(true);
  // const audioStatus = useRef(true);
  // const socketRef = useRef();
  // const userVideo = useRef();
  // const peersRef = useRef([]);

  useEffect(() => {
    // console.log("props", props.audioStatus);
  }, [props]);

  return (
    <div
      style={{
        width: "100%",
        position: "fixed",
        bottom: 50,
        left: 0,
        flexWrap: "wrap",
        zIndex: 10,
        backgroundColor: "#2096F3",
        paddingBottom: 10,
        // height:50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
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
            setVideoColor(!videoColor);
            props.videoToggle();
          }
        }}
        style={{
          backgroundColor: videoColor ? "#FA8072" : "white",
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
          marginLeft: 10,
          height: 20,
          width: 45,
          borderRadius: 100,
          flexDirection: "column",
          paddingTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {" "}
        <Fragment>
          <div
            style={{
              backgroundColor: "#FA8072",
              padding: 2,
              paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 20,
              position: "absolute",
              zIndex: 99,
              top: -30,
              color: "white"
            }}
          >
            {videoColor
              ? "Your video is on"
              : props.videoStatus && !audioColor
              ? "Your audio is on"
              : "Turn on Video to join meeting"}
          </div>
          <div
            style={{
              // backgroundColor: "red",
              position: "absolute",
              zIndex: 99,
              top: -30,
              width: 20
              // height: 20
              // borderBottomLeftRadius: 20,
              // borderBottomRightRadius: 20,
              // boxShadow: "0 0 0 0 #522d5b"
            }}
          >
            <i
              style={{
                color: "#FA8072",
                fontSize: 40
              }}
              className={"fas fa-sort-down"}
            />
          </div>
        </Fragment>
        <i
          style={{
            color: "black"
          }}
          className={`fas ${videoColor ? "fa-video" : "fa-video-slash"}`}
        >
          {" "}
        </i>{" "}
        <div
          style={{
            fontSize: 10,
            marginTop: 3,
            textAlign: "center",
            color: "white"
          }}
        >
          {" "}
          {videoColor ? "On" : "Off"}{" "}
        </div>{" "}
      </div>

      <div
        onClick={() => {
          // console.log(props.user.name)
          if (props.user && props.user.name == "Login") {
            alert("Please sign in as guest to continue.");
          } else if (props.meetingDetail && !props.meetingDetail.status) {
            alert("Please Wait for the Host to Start this Meeting.");
          } else if (!props.meetingId) {
            alert(
              "No meeting ID  found. You must add meeting ID to url or creat one from the VareApp"
            );
          } else {
            setAudioColor(!audioColor);
            props.audioToggle();
          }
        }}
        style={{
          backgroundColor: audioColor ? "#FA8072" : "white",
          margin: 10,
          height: 20,
          width: 45,
          borderRadius: 100,
          paddingTop: 20,
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <i
          style={{
            color: "black"
          }}
          className="fas fa-microphone-slash"
        >
          {" "}
        </i>{" "}
        <div
          style={{
            fontSize: 10,
            marginTop: 3,
            textAlign: "center",
            color: "white"
          }}
        >
          {" "}
          {audioColor ? "Unmute" : "Mute"}{" "}
        </div>{" "}
      </div>

      {props.videoStatus ? (
        <Fragment>
          <div
            onClick={() => {
              props.disconnectVideo();
            }}
            style={{
              backgroundColor: "white",
              margin: 10,
              height: 20,
              width: 45,
              borderRadius: 100,
              paddingTop: 20,
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <i
              style={{
                color: "black"
              }}
              className="fas fa-handshake"
            >
              {" "}
            </i>{" "}
            <div
              style={{
                fontSize: 10,
                marginTop: 3,
                textAlign: "center",
                color: "white",
                width: 60
              }}
            >
              {" "}
              {"Disconnect"}{" "}
            </div>{" "}
          </div>
          <div
            onClick={() => {
              props.setInViewVideoIndex(null);
            }}
            style={{
              backgroundColor: "white",
              margin: 10,
              height: 20,
              width: 45,
              borderRadius: 100,
              paddingTop: 20,
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <i
              style={{
                color: "black"
              }}
              className="fas fa-handshake"
            >
              {" "}
            </i>{" "}
            <div
              style={{
                fontSize: 10,
                marginTop: 3,
                textAlign: "center",
                color: "white",
                width: 60
              }}
            >
              {" "}
              {"Reset"}{" "}
            </div>{" "}
          </div>
        </Fragment>
      ) : null}
    </div>
  );
};

export default Room;
