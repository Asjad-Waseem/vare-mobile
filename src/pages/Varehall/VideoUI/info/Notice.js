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
  FormGroup,
  Progress,
  CardTitle,
  Label,
  Button
} from "reactstrap";
import {Formik, Form, Field} from "formik";
import RESTCall from "../../../../redux/actions/restApi";
import cookie from "react-cookies";
import {parseURL} from "../../helpers";
import PageFooter from "./PageFooter";
import PageModal from "./PageModal";
import UserAvatar from "react-user-avatar";
import Multiselect from "multiselect-react-dropdown";

import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";
import {useHistory} from "react-router-dom";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import "../../../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

import PageMenu from "./PageMenu";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

const fetch = require("node-fetch");

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");
const loader = require("../../../../assets/images/loading1.gif");

const Register = ({setLoginUser, loginUser, info, onHandleQuery}) => {
  const history = useHistory();
  const [refreshing, setRefreshing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [usersToNotify, setUsersToNotify] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [activeNav, setActiveNav] = useState("VareHall");

  // const [selectedLike, setSelectedLike] = useState(-1);
  const [errors, setErrors] = useState({});

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");

  const [noticeUsers, setNoticeUsers] = useState([]);
  const myTitleRef = useRef("");
  const myMessageRef = useRef("");

  // const inViewVideoIndex = useRef(null);
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    // console.log("selectedValue", selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    // console.log("usersToNotify", usersToNotify);
  }, [usersToNotify]);

  const handleAllNotice = () => {};

  const getUsers = async () => {
    const formData = {
      request: "search",
      query: {notice: true},
      resource: "vare_user"
    };
    await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response &&
        response.data &&
        response.data.map((res, index) => {
          return {name: res.fullName, id: res.expoToken};
        });
      // console.log("data", data);
      setUsersToNotify([...data]);
      // return data;
    });
  };

  const handleNotice = () => {
    if (myTitleRef.current.value == "" || myMessageRef.current.value == "") {
      alert("Please be sure to complete all fields");
      return;
    }

    const noticeArray =
      selectedValue &&
      selectedValue.filter(rep => {
        return rep.id.toLowerCase().includes("exponentpushtoken");
      });

    noticeArray &&
      noticeArray.length > 0 &&
      Promise.all(
        selectedValue.map(reply => {
          const message = {
            to: reply.id,
            sound: "default",
            title: myTitleRef.current.value
              ? myTitleRef.current.value
              : "VARE Election Notification",
            body: myMessageRef.current.value
              ? myMessageRef.current.value
              : "New bills, messages and videos available on Echo for your review and voting",
            data: {data: "goes here"},
            _displayInForeground: true
          };
          return sendNotification(message);
        })
      );
  };

  const sendNotification = async message => {
    // console.log("message", message);
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });

    const formData = {
      request: "insert",
      query: {
        ...message,
        expoToken: message.to,
        date: new Date(),
        response: response
      }, //add table key value to edit
      resource: "vare_notices", //add table name
      check: ["expoToken"]
    };
    return await RESTCall.axiosQuery(formData).then(notices => {
      const notice = notices && notices.data && notices.data[0];
      myTitleRef.current.value = "";
      myMessageRef.current.value = "";
      setSelectedValue([]);
      return notice;
    });
  };

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <PageMenu />

      <div
        className=""
        id="contact"
        style={{
          // paddingTop: 100,
          // paddingBottom: 300,
          backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5",
          background:
            "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      >
        <Row
          style={{
            // marginTop: 90,
            // marginBottom: 500,
            paddingTop: 100,
            paddingBottom: 300,
            height: "100%",
            // width: "100%",
            overflow: "hidden",
            overflow: "auto",
            alignItems: "center"
            // overflow: "auto"
            // display: "none"
          }}
        >
          <div className="mx-auto my-auto col-12 col-md-10">
            <div
              style={{
                // width: "100%",
                marginRight: 25,
                marginLeft: 25,
                backgroundColor: "white",
                borderRadius: 5,
                paddingBottom: 20
                // height: 400
              }}
            >
              <div
                style={{
                  background:
                    "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
                  backgroundColor: "red",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  height: 100,
                  width: "100%",
                  padding: 20,
                  color: "white"
                }}
                className=""
              >
                <div
                  onClick={() => {
                    window.open(
                      storeUser && storeUser.img
                        ? storeUser.img
                        : "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    );
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "row !important",
                    width: "100%"
                  }}
                >
                  <img
                    src={
                      storeUser && storeUser.img
                        ? storeUser.img
                        : "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    }
                    style={{width: 40, height: 40, borderRadius: 100}}
                  />
                  <div
                    style={{
                      paddingTop: 10,
                      paddingLeft: 10
                    }}
                    className=""
                  >
                    SEND NOTICE
                  </div>
                  {refreshing ? (
                    <div>
                      <img src={loader} style={{width: 70}} />
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                style={{
                  // height: 200, overflowY: "auto",
                  padding: 20
                }}
                className="form-side"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingBottom: 8
                  }}
                >
                  <div
                    style={{
                      marginRight: 10
                    }}
                    className="mb-4 card-title"
                  >
                    Send Latest Notice to Vare Users.
                  </div>
                </div>
                <form action="#" className="av-tooltip tooltip-label-bottom">
                  <div className="form-group has-float-label form-group">
                    <label className="">Title</label>
                    <input
                      ref={myTitleRef}
                      name="title"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  <div className="form-group has-float-label form-group">
                    <label className="">Message</label>
                    <textarea
                      rows="2"
                      ref={myMessageRef}
                      name="message"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>

                  <div className="form-group has-float-label form-group">
                    <label className="">Select Users</label>
                    {usersToNotify && usersToNotify.length > 0 && (
                      <Multiselect
                        options={usersToNotify} // Options to display in the dropdown
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={item => {
                          setSelectedValue(item);
                        }} // Function will trigger on select event
                        onRemove={item => {
                          setSelectedValue(item);
                        }} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex"
                      // right: 70,
                      // position: "absolute",
                      // top: 330
                    }}
                  >
                    <Button
                      style={{
                        marginLeft: 10
                      }}
                      onClick={() => {
                        setRefreshing(true);
                        handleNotice();
                      }}
                      href={"adminRoot"}
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      Submit
                    </Button>
                  </div>
                </form>

                <PageModal
                  // activeUser={activeUser}
                  // setActiveUser={setActiveUser}
                  modalIsOpen={modalIsOpen}
                  setModalIsOpen={setModalIsOpen}
                >
                  <div
                    style={{
                      paddingTop: 10,
                      textAlign: "center",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(0,0,0,.74)",
                        fontWeight: "bold"
                      }}
                    >
                      {"hhh"}
                    </div>
                    <div>{"Bio not available"}</div>
                  </div>
                </PageModal>
              </div>
            </div>
          </div>
        </Row>
      </div>

      <PageFooter />
    </React.Fragment>
  );
};

const styleInfo = {
  wrapPadMyText: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMyText: {
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

const mapStateToProps = (state, ownProps) => {
  const storeData = state;
  // console.log("contentmapStateToProps", state);
  return {
    info: storeData.keyInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHandleQuery: formData => {
      dispatch(handleQuery(formData));
    },
    onLogoutFromView: () => {
      dispatch(logoutFromView());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
