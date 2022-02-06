import React, {Fragment} from "react";
import {Button, Row, Col, Card, CardBody, Badge, CustomInput} from "reactstrap";
// import { NavLink } from 'react-router-dom';
import AddToCalendar from "react-add-to-calendar";

import {Colxx} from "../../mycomponents/common/CustomBootstrap";

const DataListItem = ({
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
      {" "}
      <Card className="card d-flex flex-row mb-3">
        <div className="d-flex flex-grow-1 min-width-zero">
          <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
            <div className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
              <span
                style={{
                  color: "red"
                }}
                className="align-middle d-inline-block"
              >
                {" "}
                {"Target Bill:"}{" "}
              </span>{" "}
            </div>{" "}
            <p className="mb-1 w-15 w-xs-100">
              Bill Details:{" "}
              <span className="text-muted text-small">
                <span
                  style={{
                    color: "#2096F3"
                  }}
                  onClick={() =>
                    item.bill_id
                      ? window.open(
                          `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                            item.bill_id +
                            `"}`
                        )
                      : {}
                  }
                >
                  {" "}
                  {item.bill_id}{" "}
                </span>{" "}
              </span>{" "}
            </p>{" "}
            <p className="mb-1 w-15 w-xs-100">
              Meeting Date:{" "}
              <span style={{}} className="text-muted text-small">
                {" "}
                {meetingDetail && meetingDetail.publishedAt
                  ? meetingDetail.publishedAt
                  : ""}{" "}
              </span>{" "}
            </p>{" "}
            <p className="mb-1 w-15 w-xs-100">
              Status:{" "}
              <span className="text-muted text-small">
                {" "}
                {meetingDetail && meetingDetail.status
                  ? "Live Now"
                  : "Pending"}{" "}
              </span>{" "}
            </p>{" "}
            <div className="w-15 w-xs-100">
              {" "}
              {/*<div style={{
                    }} color={item.labelColor} pill>
                      {item.label}
                    </div>*/}{" "}
            </div>{" "}
          </CardBody>{" "}
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
          {/*item.check
                  ? <div className="custom-control custom-checkbox pl-1 align-self-center mr-4">
                  <Button>
                    Yes
                  </Button>
                </div> : null*/}{" "}
        </div>{" "}
      </Card>
    </Fragment>
  );
};

export default React.memo(DataListItem);
