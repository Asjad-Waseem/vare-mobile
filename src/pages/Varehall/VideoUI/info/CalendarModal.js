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

const CalendarModal = () => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [status, setStatus] = useState({gospel: true});
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [seaarchOptions, setSeaarchOptions] = useState([
    {
      colorPill: "",
      info: "all"
    },
    {
      colorPill: "",
      info: "meetings"
    },
    {
      colorPill: "",
      info: "events"
    },
    {
      colorPill: "",
      info: "health"
    }
  ]);

  return (
    <React.Fragment>
      <div
        className=""
        id="contact"
        style={{
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
          <div
            style={{
              marginTop: 90
            }}
          >
            <TextInput
              style={{
                backgroundColor: "#f2f3f5",
                width: "90%",
                borderRadius: 25,
                marginLeft: 10,
                paddingTop: 10,
                textAlign: "center"
                // cursor: "pointer"
              }}
              placeholder={"Search"}
              onChange={text => {
                console.log(text);
              }}
            />
            <ScrollMenuPills
              status={status}
              filterAction={res => {
                setStatus({[res]: !status[res]});
                // console.log(status);
              }}
              data={seaarchOptions}
              searchTextLength={0}
              // filterStatus={this.filterStatus.bind(this)}
            />
            <div
              style={{
                // paddingTop: 20,

                height: 355,
                paddingBottom: 150,
                overflowY: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  height: "100% !important",
                  display: "flex",
                  flexWrap: "wrap",
                  marginRight: -15,
                  marginLeft: -15,
                  marginTop: 10
                }}
                className="h-100 row"
              >
                <div className="mx-auto my-auto col-12 col-md-10">
                  <div
                    style={{
                      marginRight: 25,
                      marginLeft: 25,
                      backgroundColor: "white",
                      borderRadius: 5,
                      height: 400
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
                      <div
                        style={{flexDirection: "row !important", width: 200}}
                      >
                        <img
                          src="https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
                          alt=""
                          className=""
                          style={{width: 40, height: 40, borderRadius: 100}}
                        />
                        <div className="">ADD CALENDAR</div>
                      </div>
                      <div
                        style={{
                          height: 225,
                          overflowY: "auto",
                          margin: 10,
                          marginTop: 40
                        }}
                        className="form-side"
                      >
                        <SchedulerCalendar
                          availabilities={[
                            {
                              day: "mon",
                              slots: [
                                {from: "09:00", to: "10:30"},
                                {from: "11:30", to: "13:00"},
                                {from: "14:30", to: "17:00"}
                              ]
                            },
                            {
                              day: "2021-01-26",
                              slots: [
                                {from: "09:00", to: "10:30"},
                                {from: "11:30", to: "19:00"}
                              ]
                            }
                          ]}
                          availabilityType={"infinity"}
                          duration={10}
                          onIntervalChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default CalendarModal;
