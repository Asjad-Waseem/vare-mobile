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
import {ExternalLink} from "react-external-link";
import addDefaultSrc from "./addDefaultSrc";
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import UserAvatar from "react-user-avatar";

import RESTCall from "../../../../redux/actions/restApi";
import {parseURL} from "../../helpers/Utils";
import {useHistory} from "react-router-dom";

import ReactDOM from "react-dom";
import Modal from "react-modal";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import styled from "styled-components";

import io from "socket.io-client";

import Loader from "react-loader-spinner";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import Doughnut from "../../mycomponents/charts/Doughnut";

//Import Section Title
import UserProfile from "./UserProfile";
import ActiveUserProfile from "./ActiveUserProfile";
import SummaryDetailCard from "./SummaryDetailCard";
import CommentsMobile from "./CommentsMobile";
import VideoConfRoom from "./VideoConfRoom";
import ImageUploader from "react-images-upload";
import Axios from "axios";

import useLocalStorage from "./localStorage";

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

const Home = () => {
  const history = useHistory();

  const [storeUser, setStoreUser] = useState({
    user:
      window.localStorage && window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : ""
  });
  const [meetingDetails, setMeetingDetails] = useState([]);
  const [meetingId, setMeetingId] = useState("");

  const handleMeetingDetails = async () => {
    const urlParams = parseURL(history.location.search);
    const formData = {
      request: "get",
      resource: "vare_meetings"
    };
    RESTCall.axiosQuery(formData).then(res => {
      if (res && res.data) {
        console.log("formData", res.data);
        setMeetingDetails(res.data);
      }
    });
  };

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  return (
    <React.Fragment>
      <PageMenu />
      <PageFooter />
      <Container></Container>
      )}
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

export default Home;
