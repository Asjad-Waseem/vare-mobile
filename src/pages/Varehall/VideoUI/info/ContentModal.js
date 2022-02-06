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
import TextInput from "react-autocomplete-input";
import ScrollMenuPills from "./ScrollMenuPills";
import PageMenu from "./PageMenu";
import useLocalStorage from "./localStorage";
import LiveChats from "./LiveChats";
import PageFooter from "./PageFooter";
import ScrollMenu from "react-horizontal-scrolling-menu";
import UserAvatar from "react-user-avatar";
import MediaCard from "./MediaCard";
import "../../info.css";
import styled from "styled-components";
import {useHistory} from "react-router-dom";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

const ContentModal = ({info, onHandleQuery}) => {
  const history = useHistory();

  const [commentStatus, setCommentStatus] = useState(false);
  const [activeFooterNav, setActiveFooterNav] = useState("Home");

  const [contents, setContents] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("logedUser", "");
  const [logedUser, setLogedUser] = useState("");
  const [activeNav, setActiveNav] = useState("VareHall");
  const [user, setUser] = useState({
    name: "Login",
    user_id: "test@login.com",
    msg: true
  });
  const [host, setHost] = useState({
    name: "Non",
    user_id: "test@test6.com",
    msg: true
  });
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

  // const memberId = useRef("");

  useEffect(() => {
    // console.log(
    //   "history",
    //   history.location.search.replace("?", "").split("=")[1]
    // );
    const memberId =
      history.location.search &&
      history.location.search.replace("?", "") &&
      history.location.search.replace("?", "").split("=") &&
      history.location.search.replace("?", "").split("=")[1] &&
      history.location.search.replace("?", "").split("=")[1];

    const formData4 = {
      request: "search",
      query: {
        user_id: memberId ? memberId : "lljljlj"
      },
      resource: "tube_contents",
      id: ""
    };
    onHandleQuery(formData4);
  }, []);

  useEffect(() => {
    setContents(
      info &&
        info["tube_contents"] &&
        info["tube_contents"].response &&
        info["tube_contents"].response
    );
  }, [info, contents]);

  return (
    <>
      <div
        className=""
        id="contact"
        style={{
          overflowY: "auto",
          backgroundColor: "#fffffff",
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
        <PageMenu
          storeUser={storeUser}
          logedUser={logedUser}
          user={user}
          navItems={navItems}
          activeNa={activeNav}
        />
        <div
          style={{
            position: "absolute",
            // height: 500,
            marginTop: 60,
            width: "100%",
            // backgroundColor: "#f2f3f5",
            borderRadius: 5,
            // height: 470,
            paddingBottom: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <MediaCard
            commentStatus={commentStatus}
            setCommentStatus={setCommentStatus}
            linkedMedia={true}
            data={contents}
            user={user}
            index={0}
          />
        </div>
      </div>
      {commentStatus ? (
        <LiveChats
          saveChatList={chat => {
            // saveChatList(chat);
          }}
          updatChatList={chat => {
            // updatChatList(chat);
          }}
        />
      ) : null}
      <PageFooter />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const storeData = state;
  // console.log("xxxyyy", state);
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

export default connect(mapStateToProps, mapDispatchToProps)(ContentModal);
