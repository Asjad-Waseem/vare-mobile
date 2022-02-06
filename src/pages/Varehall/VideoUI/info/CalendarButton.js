import React, {Fragment} from "react";
import {Button, Row, Col, Card, CardBody, Badge, CustomInput} from "reactstrap";
// import { NavLink } from 'react-router-dom';
import AddToCalendar from "react-add-to-calendar";

import {Colxx} from "../../mycomponents/common/CustomBootstrap";

const CalendarButton = ({
  counts,
  cardTitle,
  item,
  handleShowCalendars,
  handleCheckChange,
  isSelected,
  meetingDetail
}) => {
  // let eventCalendar = {
  //     title: 'Sample Event',
  //     description: 'This is the sample event provided as an example only',
  //     location: 'Portland, OR',
  //     startTime: '2016-09-16T20:15:00-04:00',
  //     endTime: '2016-09-16T21:45:00-04:00'
  // };
  let icon = {
    "calendar-plus-o": "left"
  };

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          onClick={() => alert(33)}
          style={{
            backgroundColor: "#2096F3",
            // backgroundColor: "rgba(0,0,0,.19)",
            borderRadius: 5,
            padding: 5,
            color: "white"
          }}
          className="custom-control custom-checkbox pl-1 align-self-center mr-4"
        >
          All Meetings
        </div>
        <div
          onClick={() => alert(33)}
          style={{
            backgroundColor: "#2096F3",
            borderRadius: 5,
            padding: 5,
            color: "white"
          }}
          className="custom-control custom-checkbox pl-1 align-self-center mr-4"
        >
          Join Meeting
        </div>
        <div
          onClick={() => handleShowCalendars()}
          style={{
            backgroundColor: "#2096F3",
            borderRadius: 5,
            padding: 5,
            color: "white"
          }}
          className="custom-control custom-checkbox pl-1 align-self-center mr-4"
        >
          Add to My Calendar{" "}
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(CalendarButton);
