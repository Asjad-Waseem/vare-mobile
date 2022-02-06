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
import {ThemeColors} from "../../helpers/ThemeColors";
import {useHistory} from "react-router-dom";
import useLocalStorage from "./localStorage";
import cookie from "react-cookies";

// import "react-slideshow-image/dist/styles.css";
const colors = ThemeColors();

const PageFooter = ({setLoginUser, loginUser}) => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [activeFooterNav, setActiveFooterNav] = useLocalStorage("Home");
  const [activeNav, setActiveNav] = useLocalStorage("VareHall");

  const [navFooterItems, setNavFooterItems] = useState([
    {
      id: 1,
      idnm: "Home",
      navheading: "Home",
      icon: "fas fa-home"
    },
    {
      id: 2,
      idnm: "Stories",
      navheading: "Stories",
      icon: "fas fa-newspaper"
    },
    {
      id: 2,
      idnm: "Schedule",
      navheading: "Schedule",
      icon: "fas fa-flag"
    },
    {
      id: 2,
      idnm: "Meeting",
      navheading: "Meeting",
      icon: "fas fa-calendar-alt"
    },
    {
      id: 2,
      idnm: "News",
      navheading: "News",
      icon: "fas fa-newspaper"
    },
    {
      id: 2,
      idnm: "Notice",
      navheading: "Notice",
      icon: "fas fa-flag-checkered"
    },
    {
      id: 2,
      idnm: "Profile",
      navheading: "Profile",
      icon: "fas fa-photo-video"
    }
  ]);

  useEffect(() => {
    // console.log("storeUser", storeUser);
    if (!(storeUser && storeUser.name)) {
      setNavFooterItems(
        navFooterItems.filter(
          rep =>
            rep.idnm != "Profile" &&
            // rep.idnm != "Schedule" &&
            rep.idnm != "Notice"
          // rep.idnm != "Meeting"
        )
      );
    } else if (
      !(
        storeUser &&
        storeUser.email &&
        storeUser.email == "civicadmin@vareapp.com"
      )
    ) {
      setNavFooterItems(navFooterItems.filter(rep => rep.idnm != "Notice"));
    }
  }, [activeFooterNav]);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: 9999
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
                    if (res.idnm == "Home") {
                      // setLoginUser("");
                      setActiveFooterNav("Home");
                      history.push("/");
                    } else if (
                      res.idnm == "Add" &&
                      storeUser &&
                      storeUser.name &&
                      storeUser.name.toLowerCase().includes("admin")
                    ) {
                      setActiveFooterNav("Add");
                      history.push("/add");
                    } else if (res.idnm == "Apps") {
                      // setLoginUser("");
                      // setActiveFooterNav("Apps");
                      //   history.push("/video");
                      // } else if (res.idnm == "Cal") {
                      // setActiveFooterNav("Apps");
                      // history.push("/apps");
                    } else if (res.idnm == "Stats") {
                      // setActiveFooterNav("Stats");
                      // history.push("/stats");
                    } else if (
                      res.idnm == "Profile" //||
                      // (loginUser && loginUser["profile"])
                    ) {
                      // setLoginUser("profile");
                      setActiveFooterNav("Profile");
                      history.push("/profile");
                    } else if (
                      res.idnm == "Notice" &&
                      storeUser &&
                      storeUser.email &&
                      storeUser.email == "civicadmin@vareapp.com" //||
                      // (loginUser && loginUser["notice"])
                    ) {
                      // setLoginUser("notice");
                      setActiveFooterNav("Notice");
                      history.push("/notice");
                    } else if (
                      res.idnm == "Schedule" //||
                      // (loginUser && loginUser["schedule"])
                    ) {
                      // setLoginUser("schedule");
                      setActiveFooterNav("Schedule");
                      history.push("/schedule");
                    } else if (
                      res.idnm == "Meeting" //||
                      // (loginUser && loginUser["schedule"])
                    ) {
                      // setLoginUser("meeting");
                      setActiveFooterNav("Meeting");
                      history.push("/meeting");
                    } else if (
                      res.idnm == "News" //||
                      // (loginUser && loginUser["schedule"])
                    ) {
                      // setLoginUser("news");
                      setActiveFooterNav("News");
                      history.push("/news");
                    } else if (
                      res.idnm == "Stories" //||
                      // (loginUser && loginUser["schedule"])
                    ) {
                      // setLoginUser("news");
                      setActiveFooterNav("Stories");
                      history.push("/story");
                    }
                  }}
                  key={"sjhhggdh" + index}
                  style={{
                    color: res.idnm == activeFooterNav ? "red" : "#cfcfc4"
                  }}
                  href=""
                  className={`tab-link ${
                    res.idnm && activeFooterNav && activeFooterNav == res.idnm
                      ? "tab-link-active"
                      : null
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

export default PageFooter;
