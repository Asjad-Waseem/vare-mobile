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
import UserAvatar from "react-user-avatar";
import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";
import ContentModal from "./ContentModal";
import PageModal from "./PageModal";
import VideoModal from "./VideoModal";
import VoteChart from "./VoteChart";

import queryString from "query-string";

import MultiTag from "./MultiTag";

import {RWebShare} from "react-web-share";
import ReactSwipe from "react-swipe";
import ScrollMenu from "react-horizontal-scrolling-menu";

import CommentsMobile from "./CommentsMobile";
import PageMenu from "./PageMenu";
import MediaCard from "./MediaCard";
import PageFooter from "./PageFooter";
import RESTCall from "../../../../redux/actions/restApi";
import ModalVideo from "react-modal-video";

// import {Helmet} from "react-helmet";
import cookie from "react-cookies";
import PlaceholderMessage from "./PlaceholderMessage";

import {useHistory} from "react-router-dom";

import VideoConfRoom from "./VideoConfRoom";
import HoverVideoPlayer from "react-hover-video-player";
import ScrollMenuPills from "./ScrollMenuPills";
import TextInput from "react-autocomplete-input";
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

import io from "socket.io-client";

import Loader from "react-loader-spinner";

import {Browserdiv, Mobilediv, isBrowser, isMobile} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";
import {groupBy} from "../../helpers";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

// import "react-slideshow-image/dist/styles.css";
const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");
const StyledVideo = styled.video`
  /* flexDirection:'row', */
  height: 50%;
  width: 45%;
`;

const slideImages = [
  "images/slide_2.jpg",
  "images/slide_3.jpg",
  "images/slide_4.jpg"
];

var audio = new Audio();
// "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3"

const Slide = props => {
  return (
    <div style={{position: "absolute", width: "100%", left: -10}}>
      {props.children}
    </div>
  );
};

const PodcastModal = ({
  setLoginUser,
  loginUser,
  info,
  onHandleQuery,
  activeUser,
  setActiveUser
}) => {
  const history = useHistory();

  const [videos, setVedeos] = useState([1, 2, 3, 4]);
  const [playIndex, setPlayIndex] = useState(-1);

  const [sharedVideo, setSharedVideo] = useState(false);
  const [itemId, setItemId] = useState(false);
  const [userSource, setUserSource] = useState(false);

  const [chartId, setChartId] = useState(false);
  const [voteAlert, setVoteAlert] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fullView, setFullView] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(-1);
  const [showEchoIndex, setShowEchoIndex] = useState(-1);

  const [podcastMedia, setPodcastMedia] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [searchPodcastMedia, setSearchPodcastMedia] = useState([]);
  const [storedPodcastMedia, setStoredPodcastMedia] = useState(
    []
    // [
    //   {
    //     _id: "61605ed251f9b4149527778e",
    //     date: "2021-10-08T16:08:01+01:00",
    //     user_id: "",
    //     fileNameSub: "vare_content_na_1633705681308",
    //     installId: "tbd",
    //     item_id: "d72f5691-887d-48b4-aefa-fd06360da688",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633705681308.jpg",
    //     reply: false,
    //     story:
    //       "The Biden Administration mandated, some time ago, that all federal workers must receive the vaccine before the 22nd of November, 2021. On Monday, 4th October, 2021, the administration released the procedures by which an individual can apply to be exempted from recieving the COVID-19 vaccine.  Due to various reasons including medical and religious, workers can now apply to be exempted from taking the vaccine at their various agencies. Such applications will be subject to review by federal agencies which may deny medical or religious exemptions if they determine that no other safety protocol is adequate.\nThe Biden administration is drawing on Centers for Disease Control and Prevention guidance to determine approved medical exemptions, including a history of allergic reaction to the vaccines. Some other conditions, including being treated with monoclonal antibodies or having a history of multisystem inflammatory syndrome will require a 90-day delay in vaccination, in accordance with CDC advice.",
    //     title:
    //       "Executive Order on Requiring Coronavirus Disease 2019 Vaccination for Federal Employees\n\n",
    //     url:
    //       "https://www.whitehouse.gov/briefing-room/presidential-actions/2021/09/09/executive-order-on-requiring-coronavirus-disease-2019-vaccination-for-federal-employees/",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633705675278.mp4",
    //     likes: '["4d30512f54ea","a65248bf2a88","ab5c12cfd81b"]'
    //   },
    //   {
    //     _id: "61605e3251f9b41495275e9d",
    //     date: "2021-10-08T16:05:20+01:00",
    //     user_id: "",
    //     bill_id: "H.R. 3684",
    //     fileNameSub: "vare_content_na_1633705520165",
    //     installId: "tbd",
    //     item_id: "8632a544-2a5f-44ae-8c86-c122a4d87e61",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633705520165.jpg",
    //     reply: false,
    //     story:
    //       "H.R.3684\nThe 'INVEST in America Act', introduced on 4th June, 2021 was sponsored by Peter Defazio and cosponsored by 5 others. H.R.3684 seeks to authorize funds for Federal-aid highways, highway safety programs, and transit programs. it can also be cited as the  \"Investing in a New Vision for the Environment and Surface Transportation in America Act\". Due to the slight impairment in infrastructure maintenance in the U.S., there has been a huge albeit cumulative impact on Americans who have to bear the brunt of missed appointments, traffic delays and congestion and so on. This bill, if passed, would give the U.S. Department of Transportation the authority to carry out core programs that support investments in roads, bridges, safety, transit, rail, freight and also in research and innovation with a focus on safety, climate, equity, and good-paying jobs.",
    //     title: "Infrastructure Investment and Jobs Act\n\n",
    //     url: "https://www.congress.gov/bill/117th-congress/house-bill/3684",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633705507893.mp4",
    //     likes: '["a65248bf2a88","ab5c12cfd81b"]'
    //   },
    //   {
    //     _id: "61564e1db61c6fcf675ef098",
    //     date: "2021-10-01T00:54:02+01:00",
    //     user_id: "",
    //     bill_id: "H.R. 227",
    //     fileNameSub: "vare_content_na_1633046042387",
    //     installId: "tbd",
    //     item_id: "fc48a7b8-ec18-4a5b-a9c3-3846dac6fef1",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633046042387.jpg",
    //     reply: false,
    //     story:
    //       'H.R. 227\nThe bill To provide dedicated funding for the national infrastructure investment program and the capital investment grant program, and for other purposes was introduced by Mr. Hastings and Mrs. Hayes on 6th January 2021. This Act may also be cited as the "Build America Act of 2021" and is in the first stage of the legislative process. If enacted, the Secretary of transportation will be required to carry out and make funds available for a national infrastructure development programme, these will include projects that will have a significant impact on the Nation, a metropolitan area, or a region. 20% of this funds will be channeled towards the rural areas.',
    //     title: "Build America Act of 2021",
    //     url: "https://www.congress.gov/bill/117th-congress/house-bill/227",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633046036285.mp4",
    //     likes: '["a65248bf2a88"]'
    //   },
    //   {
    //     _id: "61564bdbb61c6fcf675e92c2",
    //     date: "2021-10-01T00:44:24+01:00",
    //     user_id: "",
    //     bill_id: "H.R. 666",
    //     fileNameSub: "vare_content_na_1633045464737",
    //     installId: "tbd",
    //     item_id: "1144c8fa-d6f9-4e3f-8ee6-5c705ca3a78f",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633045464737.jpg",
    //     reply: false,
    //     story:
    //       "H.R. 666\nThe 'Anti-Racism in Public Health Act of 2021' was introduced by Ms. Presley and others on 1st February, 2021 to amend the Public Health Service Act to provide for public health research and investment into understanding and eliminating structural racism and police violence. According to findings made by Congress, structural racism serves as a major barrier to achieving health equity and eliminating racial and ethnic inequities in health outcomes that exist at alarming rates and are determined by a wider set of forces and systems. Also, due to structural racism in the United States, people of color are more likely to suffer from chronic health conditions (such as heart disease, diabetes, asthma, hepatitis, and hypertension) and infectious diseases (such as HIV/AIDS, and COVID–19) compared to their White counterparts. As a result of these and other findings, this bill seeks to make adjustments to the Public Health Service Act so that racism is declared as a public health crisis and so that knowledge is developed and transferred into practice in the science and practise of antiracism thereby building a healthy society.",
    //     title: "The 'Anti-Racism in Public Health Act of 2021'",
    //     url: "https://www.congress.gov/bill/117th-congress/house-bill/666",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633045459337.mp4",
    //     likes: '["a65248bf2a88"]'
    //   },
    //   {
    //     _id: "61564a25b61c6fcf675e5c27",
    //     date: "2021-10-01T00:37:05+01:00",
    //     user_id: "",
    //     bill_id: "H.R. 748",
    //     fileNameSub: "vare_content_na_1633045025947",
    //     installId: "tbd",
    //     item_id: "9380e8dc-8ad2-4d27-b694-b02d6fe3a2f6",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633045025947.jpg",
    //     reply: false,
    //     story:
    //       "H.R. 748\n\"Ethan's Law\" was introduced by Ms. DeLauro and others on 3rd February 2021 to amend chapter 44  of title 18, United States Code, to require the safe storage of firearms, and for other purposes. According to Congress' findings, an estimated 4.6million minors live in homes with at least 1 unsecured firearm and a good number of these minors reported knowing where the firearm was kept in their homes. Also, the presence of unsecured firearms in the home increases the risk of unintentional and intentional shootings and have contributed significantly to suicides, school shootings, and so on. If this bill is passed, it will become unlawful for a person to store a firearm where a minor is likely to gain access to it without the permission of a parent or guardian. ",
    //     title: "Ethan's Law",
    //     url:
    //       "https://www.congress.gov/bill/117th-congress/house-bill/748?s=1&r=5",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633045019168.mp4",
    //     likes: '["a65248bf2a88"]'
    //   },
    //   {
    //     _id: "6156477db61c6fcf675e0872",
    //     date: "2021-10-01T00:25:47+01:00",
    //     user_id: "",
    //     bill_id: "SF 2263",
    //     fileNameSub: "vare_content_na_1633044346987",
    //     installId: "tbd",
    //     item_id: "cbaabcd1-7bf4-49c0-b267-183c86882091",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633044346987.jpg",
    //     reply: false,
    //     story:
    //       "SF 2263\nThe bill  for an act relating to health; authorizing health care providers to provide patients with health information and services that are medically accurate, evidence-based, and appropriate for the patient; repealing informed consent requirements before abortions may be performed; proposing coding for new law in Minnesota Statutes was proposed on 23rd March, 2021. This bill states the rights a female has to informed consent before an abortion is carried out and the also her rights to information on the process and the effects of carrying out or not carrying out an abortion.",
    //     title: "The bill  for an act relating to health",
    //     url: "NA",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633043935106.mp4",
    //     likes: '["a65248bf2a88"]'
    //   },
    //   {
    //     _id: "61564399b61c6fcf675d89b4",
    //     date: "2021-10-01T00:09:10+01:00",
    //     user_id: "",
    //     bill_id: "S. 937",
    //     fileNameSub: "vare_content_na_1633043350245",
    //     installId: "tbd",
    //     item_id: "1939a0df-69b8-424b-9475-c9c6e50c5395",
    //     name: "Vare Media",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1633043350245.jpg",
    //     reply: false,
    //     story:
    //       'S. 937\nThe "COVID–19 Hate Crimes Act" was introduced on 23rd May, 2021 by Ms. Hirono and others to facilitate the expedited review of COVID–19 hate crimes, and for other purposes. This bill was enacted after being signed by the President on 19th May, 2021. In general, Congress finds that following the spread of COVID–19 in 2020, there has been a dramatic increase in hate crimes and violence against Asian-Americans and Pacific Islanders and that more than 1,900,000 Asian-American and Pacific Islander older adults, particularly those older adults who are recent immigrants or have limited English proficiency, may face even greater challenges in dealing with the COVID–19 pandemic, including discrimination, economic insecurity, and language isolation. Due to these and other findings, Not later than 7 days after the date of enactment of this Act, the Attorney General shall designate an officer or employee of the Department of Justice whose responsibility shall be to facilitate the expedited review of hate crimes. He shall also issue guidance on how to establish online reporting of hate crimes or incidents anexpand public education campaigns aimed at raising awareness of hate crimes.',
    //     title: 'The "COVID–19 Hate Crimes Act"',
    //     url: "https://www.congress.gov/bill/117th-congress/senate-bill/937/",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1633043343928.mp4",
    //     likes: '["a65248bf2a88"]'
    //   },
    //   {
    //     _id: "6151ddd0b61c6fcf67d01f8a",
    //     date: "2021-03-20T16:05:50+01:00",
    //     user_id: "",
    //     fileNameSub: "vare_content_na_1632755150597",
    //     installId: "tbd",
    //     item_id: "71871e9d-72c2-4baa-8412-1f592a934eb4",
    //     name: "Oluwadamilola Sarah ",
    //     picture:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_na_1632755150597.jpg",
    //     reply: false,
    //     title: "H.R. 5323\nThe Iron Dome Supplemental Appropriations Act, 2022.",
    //     url:
    //       "https://www.congress.gov/bill/117th-congress/house-bill/5323,https://www.cnn.com/2021/09/23/politics/iron-dome-house-vote/index.html,https://www.foxnews.com/media/adl-dem-squad-israel-iron-dome",
    //     video:
    //       "https://varefiles.s3.us-east-2.amazonaws.com/vare_content_video_na_1632755074023.mp4",
    //     bill_id: "H.R. 5323",
    //     likes: '["a65248bf2a88"]'
    //   }
    // ]
  );
  const [storedEchoMedia, setStoredEchoMedia] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [activeNav, setActiveNav] = useState("VareHall");

  // const [selectedLike, setSelectedLike] = useState(-1);
  const [errors, setErrors] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState({});
  const [pictureUrl, setPictureUrl] = useState(false);

  const [shareItem, setShareItem] = useState({});

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");

  const [noticeUsers, setNoticeUsers] = useState([]);
  const myTitleRef = useRef("");
  const myMessageRef = useRef("");
  const echoInfo = useRef();

  // const echoId = useRef("");

  // const inViewVideoIndex = useRef(null);
  const pathurl = useRef(history.location);

  useEffect(() => {
    // echoId.current.value = "33333";
  }, []);

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    // console.log("INFO", pathurl.current);
    if (query && query.app && query.app == "vare") setUserSource("app");

    if (
      !cookie.load("vare") &&
      query &&
      query.app &&
      query.app == "vare" &&
      query.id
      // pathurl.current.pathname.includes("podcast")
    ) {
      // console.log("INFO", query.id);

      getUserEmail(query.id);
    }
  }, []);

  useEffect(() => {
    getContent();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      setPodcastMedia(
        searchPodcastMedia.length > 0 ? [...searchPodcastMedia] : []
      );
    } else {
      setPodcastMedia([...storedPodcastMedia]);
    }
  }, [storedPodcastMedia, searchPodcastMedia, searchText]);

  useEffect(() => {
    // console.log("selectedValue", selectedValue);
  }, [selectedValue, videoUrl, storedEchoMedia]);

  useEffect(() => {
    // console.log("storeUser", storeUser);
    // alert(JSON.stringify(storeUser));
  }, [storeUser, podcastMedia, shareItem, chartId]);

  const getUserEmail = async id => {
    const formData = {
      request: "search",
      query: {
        user_id: id
      },
      resource: "vare_user",
      id: ""
    };
    await RESTCall.axiosQuery(formData).then(response => {
      // console.log("dddd", response);
      const data = response && response.data && response.data[0];
      if (data && data.email) {
        loginAppUser(data.email);
      }
    });
  };

  const loginAppUser = userEmail => {
    if (!userEmail) {
      return;
    }
    const formData = {
      request: "vareappprofile",
      query: {
        email: userEmail.toLowerCase()
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData)
      .then(response => {
        if (response && response.token) {
          cookie.save("vare", response.token, {path: "/"});
          // setLoginUser("/");
          response["name"] = response.fullName;
          setStoreUser(response);
          // setRefreshing(false);
          // alert("You have successfully logged in");
          // const urlHistory = history.location && history.location.pathname;
          window.location.reload();
          // history.push("/podcast");
        } else {
          // setRefreshing(false);
          alert(
            response && response.message
              ? response.message
              : "Please verify your Email and Password or Register your account."
          );
        }
      })
      .catch(err => {
        // setRefreshing(false);
        cookie.remove("vare", {path: "/"});
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setStoreUser("");
          alert(
            err &&
              err.response &&
              err.response.data &&
              err.response.data.message
          );
        }
      });
  };

  const getContent = async () => {
    const queryInfo = {
      reply: false,
      mediaType: null
    };

    // console.log(
    //   "pathurl",
    //   pathurl.current.search && queryString.parse(pathurl.current.search).forum
    // );

    if (
      pathurl.current.search &&
      queryString.parse(pathurl.current.search) &&
      queryString.parse(pathurl.current.search).forum
    ) {
      queryInfo["mediaType"] = "forum";
    }

    const formData = {
      request: "search",
      query: {...queryInfo},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              return rep;
            })
          : [];

      if (data.length > 0) {
        setStoredPodcastMedia([...data]);
      }
      // return data;
    });
  };

  const getEchoDetails = async item_id => {
    const formData = {
      request: "search",
      query: {
        reply: true,
        item_id: item_id
      },
      resource: "vare_contents",
      sortBy: "date",
      orderBy: "dsc",
      id: ""
    };
    await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              return rep;
            })
          : [];

      if (data.length > 0) {
        setStoredEchoMedia([...data]);
      } else {
        alert("No additional media available for this post");
      }
    });
  };

  const saveMessageLikes = async message => {
    const temp = {...message};
    delete temp["_id"];
    const formData = {
      request: "insert",
      query: {
        ...temp
      }, //add table key value to edit
      resource: "vare_contents", //add table name
      check: ["user_id", "item_id"]
    };
    return await RESTCall.axiosQuery(formData).then(contents => {
      // console.log("contents", contents);
      getContent();
      // const notice = contents && contents.data && contents.data;
      return contents;
    });
  };

  const databaseSaveVote = async props => {
    // alert(JSON.stringify(props.bill_id));
    // console.log("props", props);
    //TODO;
    // return;
    if (storeUser && storeUser.email) {
      const influencerInfo =
        !props.influencer_id || props.influencer_id == "NA"
          ? {}
          : {influencer_id: props.influencer_id};
      const dbVote = {
        ...influencerInfo,
        facebook: storeUser.facebook,
        instagram: storeUser.instagram,
        name: storeUser.name,
        img: storeUser.img,
        date: moment().format(),
        user_id: storeUser.user_id ? storeUser.user_id : storeUser.email,
        item_id: props["bill_id"] ? props["bill_id"] : props["item_id"],
        title: props["title"],
        vote: props["vote"],
        sex: storeUser.age,
        age: storeUser.age,
        race: storeUser.race,
        party: storeUser.party
      };
      // console.log("xxxx", props);

      const formData = {
        request: "insert",
        query: dbVote,
        resource: "vare_vote",
        check: ["item_id", "user_id"]
      };
      return await RESTCall.axiosQuery(formData)
        .then(response => {
          // console.log("postInfo", response);
          alert(
            'Your position has been saved.  Go to "My Reps" tab on the Vare App to see all your votes match with your Representatives.'
          );
          setVoteAlert(false);
          return response;
        })
        .catch(error => {
          return error;
        });
    }
  };

  const deleteMedia = async item => {
    const formData = {
      request: "delete",
      resource: "vare_contents",
      id: item._id
    };
    await RESTCall.axiosQuery(formData).then(response => {
      // handleRefresh();
    });
  };

  const ListContentInfo = props => {
    const {real, index} = props;

    return (
      <>
        <div
          onClick={() => {
            setPictureUrl(real.img);
          }}
        >
          <UserAvatar
            size="40"
            name={real.name ? real.name : "Guest"}
            src={
              real.img
                ? real.img
                : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
            }
            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
          />
        </div>
        <div
          style={{
            width: "70%",
            flexDirection: "column",
            paddingLeft: 10
          }}
        >
          <div
            style={{
              width: "70%",
              fontSize: 14,
              fontWeight: "bold",
              color: "gray",
              display: "flex",
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                paddingRight: 6
              }}
            >
              {" "}
              {real.user_id && real.user_id.replace(/\s/g, "").length > 0
                ? real.name
                : "Vare Media"}
            </div>

            <i
              className={`fas fa-link`}
              style={{
                paddingTop: 2,
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: "#2096F3"
              }}
            >
              {` ${
                real.bill_id
                  ? real.bill_id + "  (Bill ID)"
                  : real.item_id + "  (Bill ID)"
              }`}
            </i>
          </div>
          <div
            style={{
              fontSize: 14,
              width: "70%",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {real.title ? real.title : ""}
          </div>

          <div
            style={{
              width: "100%",
              fontSize: 12,
              color: "gray",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div>{`views: ${
              real.views
                ? real.views +
                  (real.likes && real.likes.length
                    ? real.likes.length * 1.5
                    : 0)
                : real.likes && real.likes.length
                ? real.likes.length * 3
                : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>{`   likes: ${
              real.likes && real.likes.length ? real.likes.length : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>
              {real.date ? moment(real.date || moment.now()).fromNow() : ""}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 10,
            paddingTop: 15
          }}
        >
          <div style={{paddingLeft: 15}}>
            <i
              onClick={() => {
                setVideoUrl(real);
                setModalIsOpen(true);
              }}
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 10
              }}
              className={`fas fa-play`}
            />
          </div>
          <div
            style={{
              // ...shareStyle,
              paddingLeft: 15
            }}
          >
            <RWebShare
              data={{
                text: "Podcast & Echo News Shared from Vare",
                url:
                  real.bill_id || real.item_id
                    ? `https://varehall.com/podcast?id=${real.bill_id}`
                    : window.location.href,
                title: real.title
              }}
              onClick={() => {
                // shareItem(real);
              }}
            >
              <i
                style={{
                  backgroundColor: "#f2f3f5",
                  padding: 10,
                  borderRadius: 10
                }}
                className={`fas fa-share-alt`}
              />
            </RWebShare>
          </div>
          <div
            onClick={() => {
              if (!(storeUser && storeUser.name)) {
                alert("Please login to use this feature");
                return;
              }
              saveMessageLikes({
                ...real,
                likes:
                  !real.likes && storeUser
                    ? JSON.stringify([storeUser.user_id])
                    : real.likes && real.likes.includes(storeUser.user_id)
                    ? JSON.stringify(
                        real.likes.filter(res => res != storeUser.user_id)
                      )
                    : JSON.stringify([...real.likes, storeUser.user_id])
              });
            }}
            style={{paddingLeft: 15}}
          >
            <i
              style={{
                backgroundColor: "#f2f3f5",
                padding: 10,
                borderRadius: 10,
                color:
                  real.likes &&
                  storeUser &&
                  storeUser.user_id &&
                  real.likes.includes(storeUser.user_id)
                    ? "#2096F3"
                    : "black"
              }}
              className={`fas fa-2x fa-heart`}
            />
          </div>
        </div>
      </>
    );
  };

  const CardListContentInfo = ({real, index}) => {
    return (
      <>
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 15,
            zIndex: 11
          }}
        >
          <div
            onClick={() => {
              setPictureUrl(
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              );
            }}
          >
            <UserAvatar
              size="40"
              name={real.name ? real.name : "Guest"}
              src={
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
              // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
            />
          </div>
        </div>
        {/*<div
          style={{
            position: "absolute",
            left: 15,
            top: 15,
            zIndex: 11
          }}
        >
          <div
            onClick={() => {
              if (real.item_id) setChartId(real);
            }}
          >
            <i
              style={{
                backgroundColor: "#f2f3f5",
                padding: 10,
                borderRadius: 10
              }}
              className={`fas fa-chart-pie`}
            />
          </div>
        </div>*/}

        {/* <div
          style={{
            position: "absolute",
            right: 10,
            bottom: "30%",
            zIndex: 11
          }}
        >
          <i
            className={`fas fa-2x fa-${
              detailsIndex == index ? "eye" : "eye-slash"
            }`}
            onClick={() => {
              real.bill_id &&
                window.open(
                  `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                    real.bill_id +
                    `"}`,
                  "_blank"
                );
            }}
            style={{
              color: "#2096F3"
            }}
          />
        </div>*/}
        {videoUrl.video && videoUrl._id == real._id ? (
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        ) : (
          <img
            onClick={() => {
              setItemId(itemId == real.item_id ? false : real.item_id);
              setSharedVideo(true);
              setVideoUrl({});
            }}
            width={"100%"}
            src={
              real.picture
                ? real.picture
                : "https://varefiles.s3.us-east-2.amazonaws.com/meetings.jpg"
            }
            // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
          />
        )}

        {detailsIndex == index ||
        (videoUrl.video && videoUrl._id == real._id) ? null : (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              backgroundColor: "rgba(0,0,0,.60)",
              width: "95%",
              flexDirection: "column",
              padding: 5,
              color: "white"
            }}
          >
            <div
              style={{
                width: "70%",
                fontSize: 14,
                fontWeight: "bold",
                color: "red",
                display: "flex",
                flexDirection: "row",
                display: "flex",
                flexWrap: "wrap"
              }}
            >
              <div
                onClick={() => {
                  // setItemId(itemId == real.item_id ? false : real.item_id);
                  // setSharedVideo(true);
                  // setVideoUrl({});
                }}
                style={{
                  flexDirection: "column"
                }}
              >
                {" "}
                <div
                  style={{
                    paddingRight: 6
                  }}
                >
                  {" "}
                  {real.user_id && real.user_id.replace(/\s/g, "").length > 0
                    ? real.name
                    : "Vare Media"}
                </div>
                <i
                  className={`fas fa-link`}
                  onClick={() => {
                    real.bill_id &&
                      window.open(
                        `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                          real.bill_id +
                          `"}`,
                        "_self"
                      );
                  }}
                  style={{
                    paddingTop: 2,
                    fontSize: 12,
                    // paddingLeft: 6,
                    // fontWeight: "bold",
                    color: "#2096F3"
                  }}
                >
                  {` ${
                    real.bill_id && real.bill_id
                      ? real.bill_id + "  (Bill Details)"
                      : ""
                  }`}
                </i>
              </div>
            </div>
            <div
              onClick={() => {
                setItemId(itemId == real.item_id ? false : real.item_id);
                setSharedVideo(true);
                setVideoUrl({});
              }}
              style={{
                fontSize: 14,
                width: "70%",
                display: "flex",
                flexWrap: "wrap"
              }}
            >
              {real.title ? real.title : ""}
            </div>

            <div
              style={{
                fontWeight: "bold",
                width: "100%",
                // fontSize: 16,
                color: "white",
                display: "flex",
                flexDirection: "row",
                // backgroundColor: "rgba(0,0,0,.50)",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12
              }}
            >
              <div>
                <i
                  onClick={() => {
                    real.bill_id &&
                      window.open(
                        `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                          real.bill_id +
                          `"}`,
                        "_blank"
                      );
                  }}
                  className={`fas fa-2x fa-eye`}
                />
                {`  ${
                  real.views
                    ? real.views +
                      (real.likes && real.likes.length
                        ? 239 + real.likes.length * 1.5
                        : 0)
                    : real.likes && real.likes.length
                    ? 239 + real.likes.length * 3
                    : 0
                }    views`}
              </div>

              <div
                onClick={() => {
                  saveMessageLikes({
                    ...real,
                    likes: !real.likes
                      ? JSON.stringify([storeUser.user_id])
                      : real.likes && real.likes.includes(storeUser.user_id)
                      ? JSON.stringify(
                          real.likes.filter(res => res != storeUser.user_id)
                        )
                      : JSON.stringify([...real.likes, storeUser.user_id])
                  });
                }}
                style={{paddingLeft: 20}}
              >
                <i
                  style={{
                    color:
                      real.likes &&
                      storeUser &&
                      storeUser.user_id &&
                      real.likes.includes(storeUser.user_id)
                        ? "#2096F3"
                        : "white"
                  }}
                  className={`fas fa-2x fa-heart`}
                />
                {`  `}
                <span
                  style={
                    {
                      // fontWeight: "normal"
                      // fontSize: 12
                    }
                  }
                >{`${
                  real.likes && real.likes.length ? 24 + real.likes.length : 0
                } likes  `}</span>
              </div>

              <div style={{paddingLeft: 30}}>
                {real.publishedAt
                  ? moment(real.publishedAt || moment.now()).fromNow()
                  : ""}
              </div>
              <div
                onClick={() => {
                  if (!(storeUser && storeUser.name)) {
                    alert("Please login to use this feature");
                    return;
                  }
                  if (real.item_id) setChartId(real);
                }}
              >
                <VoteChart
                  real={real}
                  innerFont={13}
                  width={210}
                  fontSize={13}
                />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 15,
            paddingTop: 5,
            paddingRight: !(videoUrl.video && videoUrl._id == real._id) ? 0 : 10
          }}
        >
          {storeUser.user_id == real.user_id && (
            <>
              <div
                style={{
                  // ...shareStyle,
                  paddingRight: 15
                }}
              >
                <i
                  onClick={() => {
                    if (!(storeUser && storeUser.name)) {
                      alert("Please login to use this feature");
                      return;
                    }
                    if (userSource && userSource == "app") {
                      window.open(
                        `${
                          pathurl.current.search.includes("edit=") &&
                          pathurl.current.search.split("edit=")[1]
                            ? "/podcast" +
                              pathurl.current.search.split("edit=")[0] +
                              "edit=" +
                              real.item_id
                            : "/podcast" +
                              pathurl.current.search +
                              "&edit=" +
                              real.item_id
                        }
                      `,
                        "_self"
                      );
                    }
                  }}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 10
                  }}
                  className={`fas fa-edit`}
                />
              </div>
              <div
                style={{
                  // ...shareStyle,
                  paddingRight: 15
                }}
              >
                <i
                  onClick={() => {
                    this.deleteMedia(real);
                  }}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 10
                  }}
                  className={`fas fa-trash`}
                />
              </div>
            </>
          )}
          {real.video && (
            <div>
              <i
                onClick={() => {
                  setVideoUrl(
                    !(videoUrl.video && videoUrl._id == real._id) ? real : {}
                  );
                }}
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 10
                }}
                className={`fas fa-${
                  !(videoUrl.video && videoUrl._id == real._id)
                    ? "play"
                    : "stop"
                }`}
              />
            </div>
          )}
          {!(videoUrl.video && videoUrl._id == real._id) && (
            <>
              <div style={{paddingLeft: 15}}>
                <i
                  onClick={() => {
                    if (!(storeUser && storeUser.name)) {
                      alert("Please login to use this feature");
                      return;
                    }
                    if (userSource && userSource == "app") {
                      window.open(
                        `${
                          pathurl.current.search.includes("add=") &&
                          pathurl.current.search.split("add=")[1]
                            ? "/podcast" +
                              pathurl.current.search.split("add=")[0] +
                              "add=" +
                              real.item_id
                            : "/podcast" +
                              pathurl.current.search +
                              "&add=" +
                              real.item_id
                        }
                      `,
                        "_self"
                      );
                    }
                  }}
                  style={{
                    backgroundColor: "#f2f3f5",
                    padding: 10,
                    borderRadius: 10,
                    color: "black"
                  }}
                  className={`fas fa-folder-plus`}
                />
              </div>
              <div
                style={{
                  // ...shareStyle,
                  paddingLeft: 15
                }}
              >
                <div>
                  <i
                    onClick={() => {
                      if (!(storeUser && storeUser.name)) {
                        alert("Please login to use this feature");
                        return;
                      }
                      if (userSource && userSource == "app") {
                        window.open(
                          `${
                            pathurl.current.search.includes("share=") &&
                            pathurl.current.search.split("share=")[1]
                              ? "/podcast" +
                                pathurl.current.search.split("share=")[0] +
                                "share=" +
                                real.item_id
                              : "/podcast" +
                                pathurl.current.search +
                                "&share=" +
                                real.item_id
                          }
                      `,
                          "_self"
                        );
                      }
                    }}
                    style={{
                      backgroundColor: "#f2f3f5",
                      padding: 10,
                      borderRadius: 10,
                      color: "black"
                    }}
                    className={`fas fa-share-alt`}
                  />
                </div>
                {/*<RWebShare
                  data={{
                    text: "Your Bill Updates Shared from Vare",
                    url: real.bill_id
                      ? `https://vare-meetingapp.herokuapp.com/podcast?id=${real.bill_id}`
                      : window.location.href,
                    title: real.title
                  }}
                  onClick={() => {
                    shareItem(index);
                  }}
                >
                  <i
                    style={{
                      backgroundColor: "#f2f3f5",
                      padding: 10,
                      borderRadius: 10
                    }}
                    className={`fas fa-share-alt`}
                  />
                </RWebShare>*/}
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const CardSubListContentInfo = ({pic, index}) => {
    // const [detailsIndex, setDetailsIndex] = useState(-1);

    return (
      <div>
        <img
          style={{
            borderRadius: 10
          }}
          width={200}
          height={200}
          src={pic}
        />
        <div
          style={{
            // position: "absolute",
            height: 120,
            width: 200,
            borderRadius: 10
            // backgroundImage: `url(${real.picture}`
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 15,
              padding: 2
            }}
            onClick={() => {
              setPictureUrl(pic);
            }}
          >
            <UserAvatar
              size="40"
              name={"Guest"}
              src={
                pic
                  ? pic
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
              // src={rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const PodcastContent = ({real, index}) => {
    return (
      <Colxx sm={12} lg={itemId ? 12 : 6}>
        <div
          style={{
            paddingLeft: 10,
            width: "100%"
            // display: "flex"
          }}
        >
          {/*<div
            style={{
              position: "absolute",
              right: 50,
              bottom: "50%",
              zIndex: 14
            }}
          >
            <i
              className={`fas fa-2x fa-${
                showEchoIndex == index ? "ellipsis-v" : "ellipsis-v"
              }`}
              onClick={() => {
                getEchoDetails(real.item_id);
                setShowEchoIndex(showEchoIndex == index ? -1 : index);
                if (showEchoIndex == index) {
                  setStoredEchoMedia(false);
                }
                setVideoUrl({});
              }}
              style={{
                color: "red"
              }}
            />
          </div>*/}
          {fullView ? (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                padding: 10,
                flexDirection: "row"
              }}
            >
              <ListContentInfo real={real} index={index} />
            </Card>
          ) : (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                height: 250,
                padding: 10,
                flexDirection: "row",
                overflowX: showEchoIndex == index ? "scroll" : "hidden",
                overflowY: "hidden"
              }}
            >
              {showEchoIndex == index &&
              real.pictures &&
              real.pictures.length > 0 ? (
                JSON.parse(real.pictures).map((pic, i) => {
                  // console.log("videoUrl", videoUrl, rep);
                  return (
                    <div
                      style={{
                        paddingRight: 20
                      }}
                      key={"sjhdhssh" + i}
                    >
                      <CardSubListContentInfo pic={pic} index={i} />
                    </div>
                  );
                })
              ) : (
                <CardListContentInfo real={real} index={index} />
              )}
            </Card>
          )}
        </div>
      </Colxx>
    );
  };

  return (
    <React.Fragment>
      {!(userSource && userSource == "app") ? (
        <PageMenu
          setLoginUser={setLoginUser}
          loginUser={loginUser}
          // handleRegisterUser={info => {
          //   setRegisterUser(info);
          // }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          marginTop: !(userSource && userSource == "app") ? 65 : 25,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"}`,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: 50,
            width: 380,
            height: 30,
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,.69)",
            // backgroundColor: "#f2f3f5",
            borderRadius: 25
          }}
        >
          <div>
            <TextInput
              value={searchText}
              style={{
                // backgroundColor: "rgba(0,0,0,.19)",
                borderWidth: 0,
                // height: 30,
                width: 300,
                textAlign: "center",
                // paddingTop: 10,
                fontSize: 18,
                color: "white"
              }}
              // placeholderTextColor="white"
              placeholder={"Search"}
              onChange={text => {
                const newItem =
                  podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.filter(rep => {
                    return JSON.stringify(rep)
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
                // console.log("newItem", newItem);
                setSearchPodcastMedia(newItem);
                setSearchText(text);
              }}
            />{" "}
          </div>
          <div>
            <i
              onClick={() => {
                setSearchText("");
                // alert("Not found");
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                color: "white"
              }}
              className={`fas fa-x fa-sync-alt`}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          // paddingTop: 90,
          width: "100%"

          // alignItems: "center",
          // justifyContent: "center"
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          {"Policy Podcast Collections"}
          <i
            onClick={() => {
              setFullView(!fullView);
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              color: "black"
            }}
            className={`fas fa-x fa-${fullView ? "arrows-alt" : "expand"}`}
          />
        </div>
      </div>
      <div
        style={{
          paddingBottom: 80
        }}
        className="row"
      >
        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setPictureUrl(false);
          }}
          modalIsOpen={pictureUrl ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <img
            width="100%"
            // height="240"
            key={pictureUrl}
            controls
            autoPlay
            src={pictureUrl}
          />
        </PageModal>

        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setVideoUrl({});
          }}
          modalIsOpen={videoUrl && videoUrl.video && modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        </PageModal>

        <PageModal
          header={`Member Votes `}
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setChartId(false);
          }}
          modalIsOpen={chartId ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <MultiTag setChartId={setChartId} chartId={chartId} />
        </PageModal>

        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setVoteAlert(false);
          }}
          modalIsOpen={voteAlert ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <div
            style={{
              height: 100,
              backgroundColor: "rgba(0,0,0,.70)",
              padding: 10,
              color: "white",
              overflow: "scroll"
            }}
          >
            {`Take a position on item ${voteAlert &&
              voteAlert.title} to let your Representative know where
          you stand.`}
          </div>
          <Button
            onClick={() => {
              voteAlert["vote"] = "yes";
              databaseSaveVote(voteAlert);
            }}
            style={{marginBottom: 20, marginTop: 20}}
          >
            Support Bill
          </Button>
          <Button
            onClick={() => {
              voteAlert["vote"] = "no";
              databaseSaveVote(voteAlert);
            }}
            style={{marginBottom: 20}}
          >
            Reject Bill
          </Button>
        </PageModal>

        <div
          style={{
            // paddingTop: 30,
            display: "inline-block",
            width: "100%",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Row
            style={{
              // paddingTop: 30,
              // display: "flex",
              width: "100%",
              // flexDirection: "row",
              // paddingLeft: "10%"
              justifyContent: "center",
              alignSelf: "center"
            }}
            sm={12}
            lg={12}
          >
            {itemId ? (
              <Colxx sm={12} lg={6}>
                <VideoModal
                  // setLoginUser={setLoginUser}
                  page={"podcast"}
                  saveMessageLikes={saveMessageLikes}
                  setSharedVideo={setSharedVideo}
                  sharedVideo={sharedVideo}
                  setItemId={setItemId}
                  item_id={itemId}
                />
              </Colxx>
            ) : null}
            {itemId ? (
              <Colxx sm={12} lg={6}>
                {podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.map((real, index) => {
                    // console.log("jjj", real);
                    return (
                      <PodcastContent
                        key={"fdkvldhsgjsd" + real._id}
                        real={real}
                        index={index}
                      />
                    );
                  })}
              </Colxx>
            ) : (
              podcastMedia &&
              podcastMedia.length > 0 &&
              podcastMedia.map((real, index) => {
                // console.log("jjj", real);
                return (
                  <PodcastContent
                    key={"fdkvldhsgjsd" + real._id}
                    real={real}
                    index={index}
                  />
                );
              })
            )}
          </Row>
        </div>
      </div>
      {/*<input ref={echoInfo} name={"echoInfo"} value={3333} />*/}
      {!(userSource && userSource == "app") ? (
        <PageFooter setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : null}
    </React.Fragment>
  );
};

const styleInfo = {
  wrapPadMydiv: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMydiv: {
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

export default PodcastModal;
