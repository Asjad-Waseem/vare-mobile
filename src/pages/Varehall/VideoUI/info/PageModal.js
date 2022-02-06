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
import UserAvatar from "react-user-avatar";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const tempVideo = require("../../../../assets/images/video.mp4");

const PageModal = props => {
  const {
    modalIsOpen,
    setModalIsOpen,
    setActiveUser,
    activeUser,
    myHeight,
    myWidth
  } = props;
  useEffect(() => {
    // console.log("modalIsOpen", activeUser.img && encodeURI(activeUser.img));
  }, [activeUser, modalIsOpen]);

  return (
    <>
      {modalIsOpen ? (
        <Row>
          <div
            style={{
              backgroundImage:
                "url(" +
                "https://images.pexels.com/photos/34153/pexels-photo.jpg?" +
                "auto=compress&cs=tinysrgb&h=350" +
                ")",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: 15,
              zIndex: 99,
              display: "block",
              position: "fixed",
              top: -250,
              left: 0,
              right: 0,
              bottom: 0,
              width: myWidth ? myWidth : 300,
              height: myHeight ? myHeight : "",
              margin: "auto",
              // backgroundColor: "red",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              overflowY: "scroll"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              <i
                onClick={() => {
                  setActiveUser("");
                }}
                style={{
                  padding: 20,
                  color: "white"
                }}
                className="fas fa-window-close"
              ></i>{" "}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  paddingTop: 15,
                  color: "white"
                }}
              >
                {props.header}
              </div>
            </div>
            {props.children}
          </div>
        </Row>
      ) : null}
    </>
  );
};

export default PageModal;
