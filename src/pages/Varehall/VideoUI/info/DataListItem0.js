import React from "react";
import {Button, Row, Col, Card, CardBody, Badge, CustomInput} from "reactstrap";
// import { NavLink } from 'react-router-dom';
import AddToCalendar from "react-add-to-calendar";

import {Colxx} from "../../mycomponents/common/CustomBootstrap";

const CalendarButton = ({item, handleCheckChange, isSelected}) => {
  // let eventCalendar = {
  //     title: 'Sample Event',
  //     description: 'This is the sample event provided as an example only',
  //     location: 'Portland, OR',
  //     startTime: '2016-09-16T20:15:00-04:00',
  //     endTime: '2016-09-16T21:45:00-04:00'
  // };
  let icon = {"calendar-plus-o": "left"};

  return (
    <Card className="card d-flex flex-row mb-3">
      <div className="d-flex flex-grow-1 min-width-zero">
        <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
          <div className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
            <span
              style={{color: "red"}}
              className="align-middle d-inline-block"
            >
              {"Target Bill:"}
            </span>
          </div>
          <p className="mb-1 w-15 w-xs-100">
            Bill Id:{" "}
            <span className="text-muted text-small">
              <span
                style={{color: "#2096F3"}}
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
                {item.bill_id}
              </span>
            </span>
          </p>
          <p className="mb-1 w-15 w-xs-100">
            Vote Due Date:{" "}
            <span className="text-muted text-small">{item.createDate}</span>
          </p>
          <p className="mb-1 w-15 w-xs-100">
            Status: <span className="text-muted text-small">{item.status}</span>
          </p>
          <div className="w-15 w-xs-100">
            {/*<div style={{
              }} color={item.labelColor} pill>
                {item.label}
              </div>*/}
          </div>
        </CardBody>
        <div
          style={{
            backgroundColor: "#2096F3",
            borderRadius: 5,
            padding: 5,
            color: "white"
          }}
          className="custom-control custom-checkbox pl-1 align-self-center mr-4"
        >
          {item.eventCalendar && (
            <AddToCalendar buttonTemplate={icon} event={item.eventCalendar} />
          )}
        </div>

        <div>
          <a
            class="google-link"
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;dates=20160917T001500Z/Invalid date&amp;location=Zoom&amp;text=Sample%20Event&amp;details=This%20is%20the%20sample%20event%20provided%20as%20an%20example%20only"
            target="_blank"
          />
          <a
            class="outlookcom-link"
            href="https://outlook.live.com/owa/?rru=addevent&amp;startdt=20160917T001500Z&amp;enddt=Invalid date&amp;subject=Sample%20Event&amp;location=Zoom&amp;body=This%20is%20the%20sample%20event%20provided%20as%20an%20example%20only&amp;allday=false&amp;uid=1612358370993_481320155328&amp;path=/calendar/view/Month"
            target="_blank"
          />
          <a
            class="yahoo-link"
            href="https://calendar.yahoo.com/?v=60&amp;view=d&amp;type=20&amp;title=Sample%20Event&amp;st=20160917T001500Z&amp;dur=NaNInvalid date&amp;desc=This%20is%20the%20sample%20event%20provided%20as%20an%20example%20only&amp;in_loc=Zoom"
            target="_blank"
          />
          <a
            class="google-link"
            href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;dates=20160917T001500Z/Invalid date&amp;location=Zoom&amp;text=Sample%20Event&amp;details=This%20is%20the%20sample%20event%20provided%20as%20an%20example%20only"
            target="_blank"
          />
        </div>
        {/*item.check
            ? <div className="custom-control custom-checkbox pl-1 align-self-center mr-4">
            <Button>
              Yes
            </Button>
          </div> : null*/}
      </div>
    </Card>
  );
};

export default React.memo(CalendarButton);
