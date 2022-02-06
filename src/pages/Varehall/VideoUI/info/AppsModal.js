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
import SchedulerCalendar from "scheduler-calendar";
import "scheduler-calendar/dist/index.css";
import cookie from "react-cookies";
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import ScrollMenuPills from "./ScrollMenuPills";
import TextInput from "react-autocomplete-input";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

const AppsModal = () => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [status, setStatus] = useState({gospel: true});
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");

  const CardModal = props => {
    return (
      <div
        onClick={() => {
          history.push(`/${props.page}`);
        }}
        style={{
          width: 500,
          // height: 355,
          // paddingBottom: 150,
          // overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100% !important",
            display: "flex",
            flexWrap: "wrap",
            marginRight: -15,
            marginLeft: -15,
            marginTop: 10
          }}
          // className="h-100 row"
        >
          <div className="mx-auto my-auto col-12 col-md-10">
            <div
              style={{
                marginRight: 25,
                marginLeft: 25,
                backgroundColor: "white",
                borderRadius: 5,
                height: 200
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
                {" "}
                <div style={{flexDirection: "row !important", width: 200}}>
                  <img
                    src="https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                    alt=""
                    className=""
                    style={{width: 40, height: 40, borderRadius: 100}}
                  />
                  <div className="">{props.header}</div>
                </div>
                <div
                  style={{
                    color: "black",
                    height: 225,
                    overflowY: "auto",
                    margin: 10,
                    marginTop: 40
                  }}
                  className="form-side"
                >
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 100,
          paddingBottom: 300,
          backgroundColor: "#f2f3f5",
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

          <Row
            style={{
              marginTop: 90,
              marginBottom: 500,
              height: height,
              width: "100%",
              overflow: "hidden",
              overflow: "auto"
              // overflow: "auto"
              // display: "none"
            }}
          >
            <Colxx sm={12} lg={4}>
              <CardModal page={"video"} header={" VIDEOS"}>
                <div>Watch Vare Bills</div>
              </CardModal>
            </Colxx>
            <Colxx sm={12} lg={4}>
              <CardModal page={"schedule"} header={" MEETINGS"}>
                <div>Schedule Meeting</div>
              </CardModal>
            </Colxx>
            {/*<Colxx sm={12} lg={4}>
              <CardModal page={"meeting"} header={" MEETINGS"}>
                <div>Attend Meeting</div>
              </CardModal>
            </Colxx>*/}
            <Colxx sm={12} lg={4}>
              <CardModal page={"stats"} header={"REPORTS"}>
                <div>Votes & Statistics </div>
              </CardModal>
            </Colxx>
          </Row>
        </div>
      </div>
      <PageFooter />
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

export default AppsModal;
