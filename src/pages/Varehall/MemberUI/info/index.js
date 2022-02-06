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
  Progress
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";

import {AvForm, AvField} from "availity-reactstrap-validation";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {useLocation, Link} from "react-router-dom";
import {ExternalLink} from "react-external-link";
import addDefaultSrc from "./addDefaultSrc";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import moment from "moment";

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
import GradientWithRadialProgressCard from "../../mycomponents/cards/GradientWithRadialProgressCard";
import DemographyCard from "../../containers/dashboards/DemographyCard";
import AdvancedSearch from "../../containers/dashboards/AdvancedSearch";
import ListCard from "../../containers/dashboards/ListCard";
import BestSellers from "../../containers/dashboards/BestSellers";

import SurveyQuota from "../../mycomponents/applications/SurveyQuota";
import MessageCard from "../../mycomponents/applications/MessageCard";
import Line from "../../mycomponents/charts/Line";
import SmallLine from "../../mycomponents/charts/SmallLine";
import Pie from "../../mycomponents/charts/Pie";
import PolarArea from "../../mycomponents/charts/PolarArea";
import Scatter from "../../mycomponents/charts/Scatter";
import Bar from "../../mycomponents/charts/Bar";
import {
  lineChartData,
  smallChartData1,
  // doughnutChartData,
  pieChartData,
  polarAreaChartData,
  scatterChartData,
  barChartData
} from "../../data/charts";
import {ThemeColors} from "../../helpers/ThemeColors";

//Import Section Title
import UserProfile from "./UserProfile";
import ActiveUserProfile from "./ActiveUserProfile";
import DataListItem from "./DataListItem";
import SummaryDetailCard from "./SummaryDetailCard";
import CommentsMobile from "./CommentsMobile";
import VideoConfRoom from "./VideoConfRoom";
import ImageUploader from "react-images-upload";
import Axios from "axios";

import useLocalStorage from "./localStorage";

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const reportData = [
  {
    id: 1,
    date: "02/07/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 15,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 2,
    date: "03/07/21",
    bill_id: "H.R.1273",
    img: "/assets/img/products/fat-rascal-thumb.jpg",
    vote: "yes",
    followers: 30,
    support: 30,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "01.04.2018",
    status: "PROCESSED",
    statusColor: "secondary",
    description:
      "To direct the Secretary of Veterans Affairs to study and report on the prevalence of cholangiocarcinoma in veterans who served in the Vietnam theater of operations during the Vietnam era, and for other purposes",
    reactions: 1240,
    messages: 48
  },
  {
    id: 3,
    bill_id: "H.R.1274",
    category: "Cupcakes",
    img: "/assets/img/products/fat-rascal-thumb.jpg",
    vote: "yes",
    followers: 70,
    support: 60,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "01.04.2018",
    status: "PROCESSED",
    statusColor: "secondary",
    description:
      "To direct the Secretary of Veterans Affairs to study and report on the prevalence of cholangiocarcinoma in veterans who served in the Vietnam theater of operations during the Vietnam era, and for other purposes",
    reactions: 1240,
    messages: 48
  },
  {
    id: 4,
    date: "01/03/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 80,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 5,
    date: "01/01/21",
    bill_id: "H.R.1260",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 40,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 6,
    date: "01/01/21",
    bill_id: "H.R.1263",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 44,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 7,
    date: "01/08/21",
    bill_id: "H.R.1233",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 55,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 8,
    date: "01/15/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 20,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 9,
    date: "01/22/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 30,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 10,
    date: "01/29/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 90,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 11,
    date: "02/05/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 90,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  },
  {
    id: 12,
    date: "02/12/21",
    bill_id: "H.R.1272",
    img: "/assets/img/products/marble-cake-thumb.jpg",
    vote: "no",
    followers: 10,
    support: 30,
    demography: {
      party: {
        democrat: 20,
        republican: 10
      },
      race: {
        white: 20,
        black: 10,
        asian: 40,
        "hispanic or latino": 20,
        "american indian": 10,
        "native hawaiian": 12
      },
      age: {
        "20": 23,
        "30": 33,
        "40": 32,
        "50": 57,
        "60": 44,
        "70": 45,
        "80": 30,
        "90": 32
      }
    },
    createDate: "02.04.2018",
    status: "ON HOLD",
    statusColor: "primary",
    description:
      "To require Federal agencies to conduct a benefit-cost analysis on relocations involving the movement of employment positions to different areas, and for other purposes.",
    reactions: 1647,
    messages: 62
  }
];
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

const selectData = [
  {label: "Race", value: "Race", key: 0},
  {label: "Party", value: "Party", key: 1},
  {label: "Age Group", value: "Age", key: 2}
];

const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

const Home = ({
  meetingKey,
  user,
  host,
  messages,
  meetingId,
  updateMeetingStatus,
  // attendees,
  height,
  width,
  memberDetails,
  meetingRSVP,
  meetingComments,
  saveMeetingComment,
  meetingCommentUpdate,
  billVotes,
  setUser
}) => {
  // console.log('',)
  // const myRef = useRef(null)

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPartyOptions, setPartyOptions] = useState([]);
  const [selectedRaceOptions, setRaceOptions] = useState([]);
  const [selectedAgeOptions, setAgeOptions] = useState([]);

  const [selectedOptionsType, setSelectedOptionsType] = useState([]);

  const [period, setPeriod] = useState(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState("VareHall");
  const [initialVideoStatus, setInitialVideoStatus] = useState(false);
  const [pictures, setPictures] = useState([]);

  // const [selectedLike, setSelectedLike] = useState(-1);
  const [navItems, setNavItems] = useState([
    {
      id: 1,
      idnm: "VareHall",
      navheading: "VareHall"
    },
    // { id: 2 , idnm : "Comments", navheading: "Comments" },
    {
      id: 3,
      idnm: "https://play.google.com/store/apps/details?id=com.vote.keyVoteApp",
      navheading: "Android"
    },
    {
      id: 4,
      idnm: "https://apps.apple.com/app/id1503031565",
      navheading: "IOS"
    }
  ]);

  const [activeFooterNav, setActiveFooterNav] = useState("Home");

  const [navFooterItems, setNavFooterItems] = useState([
    {
      id: 1,
      idnm: "Home",
      navheading: "Home",
      icon: "fas fa-home"
    },
    {
      id: 2,
      idnm: "Comments",
      navheading: "Comments",
      icon: "fas fa-comment"
    },
    {
      id: 3,
      idnm: "Video",
      navheading: "Video",
      icon: "fas fa-video"
    }
    // { id: 4 , idnm : "Meeting", navheading: "Details", icon: 'fas fa-handshake' },
    // { id: 5 , idnm : "Poll", navheading: "Poll", icon: 'fas fa-poll' },
    // { id: 5 , idnm : "Login", navheading: "Login", icon: 'fas fa-poll' }
  ]);

  const validateEmail = mail => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    alert("You have entered an invalid email address!");
    return false;
  };

  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [viewLevel, setViewLevel] = useState("charts"); //charts,bills,demography
  const [demographyData, setDemographyData] = useState("charts"); //charts,bills,demography

  const [logedUser, setLogedUser] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("logedUser", "");
  const [hostSecret, setHostSecret] = useState("");
  const [reports, setReports] = useState(reportData);

  const [groupByData, setGroupByData] = useState(null);

  const avgVoterData = {
    party: {
      "Week 1/1/21": [12, 30, 50, 21, 10, 60, 10],
      "Week  1/8/21": [12, 30, 50, 21, 10, 60, 90],
      "Week 1/15/21": [12, 30, 50, 21, 10, 60, 40],
      "Week 1/22/21": [12, 30, 50, 21, 10, 60, 80],
      "Week 1/29/21": [12, 30, 50, 21, 10, 60, 20],
      "Week 2/5/21": [12, 30, 50, 21, 10, 60, 20],
      "Week 2/12/21": [12, 30, 50, 21, 10, 60, 90]
    },
    race: {
      "Week 1/1/21": [40, 40, 50, 21, 10, 20, 40],
      "Week  1/8/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/15/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/22/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/29/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 2/5/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 2/12/21": [12, 30, 50, 21, 10, 60, 10]
    },
    age: {
      "Week 1/1/21": [90, 10, 50, 21, 10, 20, 90],
      "Week  1/8/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/15/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/22/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 1/29/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 2/5/21": [12, 30, 50, 21, 10, 60, 10],
      "Week 2/12/21": [12, 30, 50, 21, 10, 60, 10]
    }
  };
  const [avgVoterBillSupport, setAvgVoterBillSupport] = useState(null);
  useEffect(() => {
    const dateRange = [
      "1/1/21",
      "1/8/21",
      "1/15/21",
      "1/22/21",
      "1/29/21",
      "2/5/21",
      "2/12/21"
    ];
    const groupedData = reportData && groupBy(reportData, "date");
    const groupedSupport = [];
    var a = moment(dateRange[0]);
    var b = moment(dateRange[1]);
    const groupSupportByDate = {};
    const groupByDataTemp = {};

    dateRange.map(dateInfo => {
      Object.keys(groupedData).map(res => {
        if (!res) return;
        var a = moment(res);
        var b = moment(dateInfo);
        if (b.diff(a) < 604800000 && b.diff(a) >= 0) {
          const groupDateVals = groupBy(groupedData[res], "support");
          const addDateVals =
            Object.keys(groupDateVals).reduce((a, b) => a * 1 + b * 1, 0) /
            Object.keys(groupDateVals).length;
          // console.log("addDateVals", dateInfo, groupedData[res]);
          groupSupportByDate[dateInfo] = addDateVals;
          groupByDataTemp[dateInfo] = groupedData[res];

          // groupSupportByVal.push(addDateVals);
        }
      });
    });

    setGroupByData(groupByDataTemp);

    const groupSupportByVal =
      groupSupportByDate &&
      Object.keys(groupSupportByDate) &&
      Object.keys(groupSupportByDate).map(res => {
        return groupSupportByDate[res];
      });
    // console.log("groupSupportByVal", groupSupportByVal);

    const filteredVal =
      period && avgVoterData && selectedOptions && selectedOptions.value
        ? avgVoterData[selectedOptions.value.toLowerCase()][period]
        : avgVoterData["party"][Object.keys(avgVoterData["party"])[0]];

    // setAvgVoterBillSupport({
    //   labels: Object.keys(avgVoterData["party"]),
    //   datasets: [
    //     {
    //       label: "Bill Support",
    //       borderColor: colors.themeColor1,
    //       pointBorderColor: colors.themeColor1,
    //       pointHoverBackgroundColor: colors.themeColor1,
    //       pointHoverBorderColor: colors.themeColor1,
    //       pointRadius: 2,
    //       pointBorderWidth: 3,
    //       pointHoverRadius: 2,
    //       fill: false,
    //       borderWidth: 2,
    //       data: filteredVal,
    //       datalabels: {
    //         align: "end",
    //         anchor: "end"
    //       }
    //     }
    //   ]
    // });

    setAvgVoterBillSupport({
      labels: Object.keys(groupSupportByDate),
      datasets: [
        {
          label: "Bill Support",
          borderColor: colors.themeColor1,
          pointBorderColor: colors.themeColor1,
          pointHoverBackgroundColor: colors.themeColor1,
          pointHoverBorderColor: colors.themeColor1,
          pointRadius: 2,
          pointBorderWidth: 3,
          pointHoverRadius: 2,
          fill: false,
          borderWidth: 2,
          data: groupSupportByVal,
          datalabels: {
            align: "end",
            anchor: "end"
          }
        }
      ]
    });

    // console.log("selectedOptions", selectedOptions, period, filteredVal);
  }, [selectedOptions]);

  useEffect(() => {
    // console.log("periodyy", period);
    // console.log("reports", groupByData && groupByData[period]);
    if (period && groupByData && groupByData[period]) {
      setReports(groupByData[period]);
    }
  }, [period]);

  useEffect(() => {
    console.log("periodxx", period);

    console.log("groupByData", groupByData);

    if (selectedOptions) {
      // console.log("selectedOptionsXX", selectedOptions);
    }
    // console.log("groupedData", groupedData);
    if (period) {
      // const billListing = groupByData[period];
      // console.log("period", period);
      //
      // console.log("billListing", billListing);
    }
  }, [groupByData, selectedOptions]);

  const [avgVareMessages, setAvgVareMessages] = useState({
    labels: [
      "Week 1/1/21",
      "Week  1/8/21",
      "Week 1/15/21",
      "Week 1/22/21",
      "Week 1/29/21",
      "Week 2/5/21",
      "Week 2/12/21"
    ],
    datasets: [
      {
        label: "Vare Messages",
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: "end",
          anchor: "end"
        }
      }
    ]
  });

  const [avgVareFollowers, setAvgVareFollowers] = useState({
    labels: [
      "Week 1/1/21",
      "Week  1/8/21",
      "Week 1/15/21",
      "Week 1/22/21",
      "Week 1/29/21",
      "Week 2/5/21",
      "Week 2/12/21"
    ],
    datasets: [
      {
        label: "Vare Followers",
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: "end",
          anchor: "end"
        }
      }
    ]
  });

  // console.log('storeUser',storeUser)
  const [comments, setComments] = useState([
    {
      avatarUrl: "images/author.jpg",
      authorUrl: "string",
      fullName: "string",
      createdAt: new Date(),
      text: "string"
    }
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [guestUsers, setGuestUsers] = useState([]);

  let eventCalendar = {
    title: "Sample Event",
    description: "This is the sample event provided as an example only",
    location: "Portland, OR",
    startTime: "2016-09-16T20:15:00-04:00",
    endTime: "2016-09-16T21:45:00-04:00"
  };

  const videoTag = useRef(false);
  const meetingTag = useRef(false);
  const pollTag = useRef(false);
  const homeTag = useRef(false);
  const loginTag = useRef(false);
  const calendar = useRef(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const myEmailRef = useRef();
  const myNameRef = useRef();
  const myMeetngRef = useRef();

  // const inViewVideoIndex = useRef(null);

  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const result = billVotes && groupBy(billVotes, "vote");
  // console.log("result", user);

  const doughnutChartData = {
    labels: ["Support", "Reject", "No Vote"],
    datasets: [
      {
        label: "",
        color: ["white", "white", "white"],
        borderColor: ["gray", "gray", "gray"],
        backgroundColor: ["green", "#FA8072", "#2096F3"],
        borderWidth: 2,
        data: [20, 30, 30]
      }
    ]
  };
  const memberDetail = memberDetails && memberDetails[0];
  const eventDetail = {
    title:
      memberDetail && memberDetail.bill_id
        ? "Discuss Bill " + memberDetail.bill_id
        : "Discuss Upcoming Bill",
    createDate:
      memberDetail && memberDetail.publishedAt
        ? memberDetail.publishedAt
        : "2020-06-01",
    status: "Introduced",
    bill_id:
      memberDetail && memberDetail.bill_id ? memberDetail.bill_id : "H.R. 7994",
    labelColor: "#4F6577",
    label: "Townhall",
    check: true,
    eventCalendar: {
      title: "Sample Event",
      description:
        memberDetail && memberDetail.description
          ? memberDetail.description
          : "This is the sample event provided as an example only",
      location: "Zoom",
      startTime:
        memberDetail && memberDetail.publishedAt
          ? memberDetail.publishedAt
          : "2016-09-16T20:15:00-04:00",
      endTime: ""
    }
  };

  // useEffect(() => {
  // if(meetingKey && memberDetail && memberDetail.meeting_key == meetingKey){

  const myMeetngStatus = useRef(null);
  myMeetngStatus.current =
    meetingKey && memberDetail && memberDetail.meeting_key == meetingKey;
  // console.log('xxstoreUser',myMeetngStatus.current)

  useEffect(() => {
    if (myMeetngStatus.current) {
      updateMeetingStatus({
        status: true,
        meeting_id: memberDetail.meeting_id,
        member_id: memberDetail.member_id
      });
      setLogedUser({
        name: memberDetail.author,
        email: memberDetail.member_id,
        user_id: memberDetail.member_id,
        meeting_id: memberDetail.meeting_id
      });
      setStoreUser({
        name: memberDetail.author,
        email: memberDetail.member_id,
        user_id: memberDetail.member_id,
        meeting_id: memberDetail.meeting_id
      });
    }
  }, []);

  const logout = () => {
    setUser({
      name: "Login",
      user_id: "test@login.com",
      msg: true
    });
    setLogedUser("");
    setStoreUser("");
    setShowLogin(false);
    if (storeUser && storeUser.meeting_key) {
      updateMeetingStatus({
        status: false,
        meeting_id:
          storeUser && storeUser.meeting_id ? storeUser.meeting_id : "",
        member_id: storeUser && storeUser.user_id ? storeUser.user_id : ""
      });
    }
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    "https://meeting.varehall.com/upload/myUpload"
  );

  const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
    return new Promise(resolve => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const onImage = async (failedImages, successImages) => {
    if (!myEmailRef.current.value) {
      alert("You must add email first");
      return;
    }
    // console.log("xxx");
    if (!url) {
      // console.log("missing Url");
      setErrorMessage("missing a url to upload to");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");
    try {
      const imageString = await resizeImage(successImages, 200, 200);
      const image = await [imageString];

      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];
      const name =
        myEmailRef.current &&
        myEmailRef.current.value &&
        myEmailRef.current.value.split(".com") &&
        myEmailRef.current.value.split(".com")[0] + ".jpg"; //parts[1].split("=")[1];
      const data = parts[2];
      const res = await Axios.post(url, {
        mime,
        name,
        image: image[0]
      });
      // console.log("successImages", res);
      // setImageURL(res.data.imageURL);
      setProgress("uploaded");
    } catch (error) {
      console.log("error in upload", error);
      setErrorMessage(error.message);
      setProgress("uploadError");
    }
  };

  let subtitle = {};
  const [modalIsOpen, setIsOpen] = React.useState(true);

  function openModal() {
    setIsOpen(true);
  }
  //modal start
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const PageFooter = () => {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          zIndex: 999
          // width: 100%,
          // text-align: center;
        }}
        className="toolbar tabbar tabbar-labels toolbar-bottom"
      >
        <div className="toolbar-inner">
          {" "}
          {navFooterItems && navFooterItems.length && navFooterItems.length > 0
            ? navFooterItems.map((res, index) => {
                return (
                  <span
                    onClick={() => {
                      // alert(res.idnm)
                      setActiveFooterNav(res.idnm);
                      setActiveNav(
                        res.idnm == "Home"
                          ? "VareHall"
                          : res.idnm == "Comments"
                          ? "Comments"
                          : res.idnm == "Video"
                          ? "Video"
                          : "VareHall"
                      );
                    }}
                    key={"sjhhggdh" + index}
                    style={{
                      color: activeFooterNav == res.idnm ? "red" : "#cfcfc4"
                    }}
                    href=""
                    className={`tab-link ${
                      activeFooterNav == res.idnm ? "tab-link-active" : null
                    }`}
                  >
                    <i className={`fas ${res.icon}`}> </i>{" "}
                    <span className="tabbar-label"> {res.navheading} </span>{" "}
                  </span>
                );
              })
            : null}
        </div>{" "}
      </div>
    );
  };

  const PageMenu = () => {
    return (
      <div
        style={{
          height: 10
        }}
        className="navbar navbar-home"
      >
        <div className="navbar-inner">
          <div className="subnavbar">
            <div className="subnavbar-inner">
              <div className="toolbar tabbar tabbar-scrollable toolbar-category">
                <div className="toolbar-inner">
                  <div className="right">
                    <a
                      href=""
                      onClick={() => {
                        loginTag.current.scrollIntoView({
                          behavior: "smooth"
                        });
                        if (
                          (storeUser && storeUser.name) ||
                          (logedUser && logedUser.name)
                        ) {
                          setShowLogin(false);
                        } else {
                          setShowLogin(true);
                        }
                      }}
                    >
                      <h4>
                        {" "}
                        {storeUser && storeUser.name
                          ? storeUser.name
                          : logedUser && logedUser.name
                          ? logedUser.name
                          : user && user.name
                          ? user.name
                          : "Jonathan"}{" "}
                      </h4>{" "}
                    </a>{" "}
                    <i
                      ref={loginTag}
                      onClick={() => {
                        if (
                          (storeUser && storeUser.name) ||
                          (logedUser && logedUser.name)
                        ) {
                          setShowLogin(false);
                          logout();
                        } else {
                          setShowLogin(true);
                        }
                      }}
                      className={`fas fa-${
                        storeUser && storeUser.name ? "user-lock" : "unlock-alt"
                      }`}
                      style={{
                        marginLeft: 5,
                        width: 40,
                        height: 40,
                        backgroundColor: "#FA8072",
                        borderRadius: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    />{" "}
                  </div>{" "}
                  <img
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 100
                    }}
                    // onError={(e)=>addDefaultSrc(e)}
                    src={
                      "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    }
                    alt=""
                  />
                  {navItems && navItems.length && navItems.length > 0
                    ? navItems.map((res, index) => {
                        return (
                          <span
                            key={"sjdh" + index}
                            onClick={() => {
                              if (
                                res.idnm == "Comments" ||
                                res.idnm == "VareHall"
                              ) {
                                setActiveNav(res.idnm);
                              } else {
                                window.open(res.idnm);
                              }
                            }}
                            href="#"
                            className={`tab-link ${activeNav == res.idnm &&
                              "tab-link-active"}`}
                          >
                            {/*<i className={`fas fa-user-lock`}></i>*/}{" "}
                            {res.navheading}{" "}
                          </span>
                        );
                      })
                    : null}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>{" "}
      </div>
    );
  };

  const HeaderFilter = () => {
    return (
      <div
        style={
          {
            // paddingTop: 30,
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            // width: "100%"
          }
        }
        className="form-container mb-2"
      >
        <FormGroup>
          <Colxx
            style={{
              paddingTop: 30,
              display: "flex",
              flexDirection: "row",
              width: "100%"
            }}
            sm={12}
            lg={12}
          >
            <Colxx style={{width: "100%"}} sm={4} lg={4}>
              <Select
                components={{Input: CustomSelectInput}}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                placeholder={"Party"}
                value={selectedPartyOptions}
                onChange={val => {
                  setPartyOptions(val);
                  setSelectedOptions({...selectedOptions, party: val.value});
                }}
                options={[
                  {label: "Democrat", value: "democrat", key: 0},
                  {label: "Republican", value: "republican", key: 1}
                ]}
              />
            </Colxx>
            <Colxx style={{width: "100%"}} sm={4} lg={4}>
              <Select
                components={{Input: CustomSelectInput}}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                placeholder={"Race"}
                value={selectedRaceOptions}
                onChange={val => {
                  setRaceOptions(val);
                  setSelectedOptions({...selectedOptions, race: val.value});
                }}
                options={[
                  {label: "Black", value: "black", key: 0},
                  {label: "White", value: "white", key: 1},
                  {label: "Asian", value: "Asian", key: 3},
                  {
                    label: "Hispanic or Latino",
                    value: "hispanic or latino",
                    key: 4
                  },
                  {label: "American Indian", value: "american indian", key: 5},
                  {label: "Native Hawaiian", value: "native hawaiian", key: 6}
                ]}
              />
            </Colxx>
            <Colxx style={{width: "100%"}} sm={4} lg={4}>
              <Select
                components={{Input: CustomSelectInput}}
                className="react-select"
                classNamePrefix="react-select"
                name="form-field-name"
                placeholder={"Age"}
                value={selectedAgeOptions}
                onChange={val => {
                  setAgeOptions(val);
                  setSelectedOptions({...selectedOptions, age: val.value});
                }}
                options={[
                  {label: "20's", value: "20", key: 0},
                  {label: "30's", value: "30", key: 1},
                  {label: "40's", value: "40", key: 3},
                  {label: "50's", value: "50", key: 4},
                  {label: "60's", value: "60", key: 5},
                  {label: "70's", value: "70", key: 6},
                  {label: "80's", value: "80", key: 6},
                  {label: "90's", value: "90", key: 6}
                ]}
              />
            </Colxx>
          </Colxx>
        </FormGroup>
      </div>
    );
  };

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          paddingTop: 50,
          backgroundColor: activeNav == "Comments" ? "white" : "#f2f3f5"
          // height:height,
          // overflowY:'auto',
        }}
      >
        <div
          className="borderSolid"
          style={{
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 99,
            position: "absolute",
            backgroundColor: "#D6DBDF"
          }}
        >
          <PageMenu />

          {showLogin ? (
            <div
              // isOpen={modalIsOpen}
              // onAfterOpen={afterOpenModal}
              // onRequestClose={closeModal}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 999,
                backgroundColor: "rgba(0,0,0,.89)",
                height: "100%",
                width: "100%"
              }}
              // contentLabel="Example Modal"
            >
              <div
                className=""
                style={{
                  position: "absolute",
                  top: "25%",
                  zIndex: 99,
                  borderWidth: 0,
                  paddingLeft: 5,
                  display: "flex",
                  margin: 15,
                  // flexWrap:'wrap',
                  flexDirection: "column"
                }}
              >
                <div
                  style={{
                    overflowY: "auto",
                    height: 600,
                    width: 300,
                    paddingBottom: 400
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontSize: 20
                    }}
                  >
                    Host Login{" "}
                  </div>{" "}
                  <input
                    placeholder={"Host Meeting Code (Host)"}
                    ref={myMeetngRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5
                    }}
                  />
                  <div
                    style={{
                      color: "white",
                      fontSize: 20
                    }}
                  >
                    Guest Login{" "}
                  </div>
                  <input
                    placeholder={"Guest Name"}
                    ref={myNameRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5
                    }}
                  />
                  <input
                    placeholder={"Guest Email"}
                    ref={myEmailRef}
                    style={{
                      width: "100%",
                      padding: 5,
                      margin: 5,
                      marginBottom: 15
                    }}
                  />
                  {showLogin ? (
                    <ImageUploader
                      key="image-uploader"
                      withIcon={true}
                      singleImage={true}
                      withPreview={
                        myEmailRef.current && myEmailRef.current.value
                          ? true
                          : false
                      }
                      label="Maximum size file: 5MB"
                      buttonText="Add Avatar Image"
                      onChange={onImage}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={250242880}
                    />
                  ) : null}
                  <div
                    className="button"
                    onClick={() => {
                      if (
                        myMeetngRef &&
                        memberDetail &&
                        memberDetail.meeting_key &&
                        myMeetngRef.current &&
                        myMeetngRef.current.value.toLowerCase() ==
                          memberDetail.meeting_key.toLowerCase()
                      ) {
                        setLogedUser({
                          name: memberDetail.author,
                          email: memberDetail.member_id,
                          user_id: memberDetail.member_id,
                          meeting_id: memberDetail.meeting_id
                        });
                        setStoreUser({
                          name: memberDetail.author,
                          email: memberDetail.member_id,
                          user_id: memberDetail.member_id,
                          meeting_id: memberDetail.meeting_id
                        });
                        setUser({
                          name: memberDetail.author,
                          email: memberDetail.member_id,
                          user_id: memberDetail.member_id,
                          meeting_id: memberDetail.meeting_id
                        });
                        setShowLogin(false);
                        updateMeetingStatus({
                          status: true,
                          meeting_id: memberDetail.meeting_id,
                          member_id: memberDetail && memberDetail.member_id
                        });
                      } else if (
                        myNameRef &&
                        myNameRef.current &&
                        myNameRef.current.value != "" &&
                        myEmailRef &&
                        myEmailRef.current &&
                        myEmailRef.current.value != ""
                      ) {
                        if (
                          validateEmail(
                            myEmailRef &&
                              myEmailRef.current &&
                              myEmailRef.current.value
                          ) == false
                        ) {
                          return;
                        }
                        setLogedUser({
                          name:
                            myNameRef &&
                            myNameRef.current &&
                            myNameRef.current.value,
                          email:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          user_id:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          member_id: memberDetail && memberDetail.member_id
                        });
                        setStoreUser({
                          name:
                            myNameRef &&
                            myNameRef.current &&
                            myNameRef.current.value,
                          email:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          user_id:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          member_id: memberDetail && memberDetail.member_id
                        });
                        setUser({
                          name:
                            myNameRef &&
                            myNameRef.current &&
                            myNameRef.current.value,
                          email:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          user_id:
                            myEmailRef &&
                            myEmailRef.current &&
                            myEmailRef.current.value,
                          member_id: memberDetail && memberDetail.member_id
                        });
                        setShowLogin(false);
                      } else {
                        alert("All fields must be completed.");
                      }
                    }}
                    style={{
                      width: "100%",
                      margin: 5,
                      marginBottom: 10
                    }}
                  >
                    Submit{" "}
                  </div>
                  <div
                    onClick={() => setShowLogin(false)}
                    className="button"
                    style={{
                      width: "100%",
                      backgroundColor: "#ff9700",
                      color: "white",
                      margin: 5
                    }}
                  >
                    Cancel{" "}
                  </div>
                </div>
              </div>{" "}
            </div>
          ) : null}
        </div>{" "}
        {/*viewLevel == "demography" ? <HeaderFilter /> : null*/}
        <HeaderFilter />
        <PageFooter />
        <Container>
          <Row className="mt-4">
            <Fragment>
              {!isMobile || viewLevel == "charts" ? (
                <div lg={12} sm={12} className="row" style={{color: "#922c88"}}>
                  <Colxx lg={4} sm={12} className="glide__slide--active">
                    <div className="card">
                      <div className="text-center card-body">
                        {avgVoterBillSupport ? (
                          <SmallLine
                            updatePeriod={e => {
                              setPeriod(e);
                              setViewLevel("bills");
                            }}
                            data={avgVoterBillSupport}
                            selectedOptions={selectedOptions}
                            selectedPartyOptions={selectedPartyOptions}
                            selectedRaceOptions={selectedRaceOptions}
                            selectedAgeOptions={selectedAgeOptions}
                          />
                        ) : null}
                      </div>
                    </div>
                  </Colxx>
                  <Colxx lg={4} sm={12} className="glide__slide--active">
                    <div className="card">
                      <div className="text-center card-body">
                        <SmallLine
                          updatePeriod={e => {
                            setPeriod(e);
                            setViewLevel("bills");
                          }}
                          data={avgVareMessages}
                        />
                      </div>
                    </div>
                  </Colxx>
                  <Colxx lg={4} sm={12} className="glide__slide--active">
                    <div className="card">
                      <div className="text-center card-body">
                        <SmallLine
                          updatePeriod={e => {
                            setPeriod(e);
                            setViewLevel("bills");
                          }}
                          data={avgVareFollowers}
                        />
                      </div>
                    </div>
                  </Colxx>
                </div>
              ) : null}
              {!isMobile || viewLevel == "demography" ? (
                <DemographyCard
                  selectedOptions={selectedOptions}
                  selectedPartyOptions={selectedPartyOptions}
                  selectedRaceOptions={selectedRaceOptions}
                  selectedAgeOptions={selectedAgeOptions}
                  title={
                    demographyData && demographyData ? demographyData : "NA"
                  }
                  backMenu={() => {
                    setViewLevel("bills");
                  }}
                  cardClass="dashboard-progress"
                />
              ) : null}
              {!isMobile || viewLevel == "bills" ? (
                <ListCard
                  backMenu={() => {
                    setViewLevel("charts");
                  }}
                  setDemographyData={e => {
                    setViewLevel("demography");
                    setDemographyData(e);
                    console.log("demographyData", demographyData);
                  }}
                  period={period}
                  width={width}
                  reports={reports}
                  title="dashboards.top-viewed-posts"
                />
              ) : null}

              {!viewLevel ? (
                <div
                  style={{
                    paddingTop: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                  }}
                >
                  <span
                    style={{
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "bold"
                    }}
                  >
                    {" "}
                    {"Loading Report"}
                  </span>
                  <Loader
                    type="Bars"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    // timeout={3000} //3 secs
                  />
                </div>
              ) : null}
            </Fragment>{" "}
          </Row>{" "}
        </Container>{" "}
      </div>{" "}
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
