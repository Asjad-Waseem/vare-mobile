/* eslint-disable react/no-danger */
import React from "react";
import {Card, CardBody, Badge} from "reactstrap";
import {Colxx} from "../../mycomponents/common/CustomBootstrap";

const SummaryDetailCard = ({survey}) => {
  return (
    <div>
      <Card className="mb-6">
        <CardBody>
          <div className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
            <span
              style={{
                color: "red"
              }}
              className="align-middle d-inline-block"
            >
              {" "}
              {"Meeting Details:"}{" "}
            </span>{" "}
          </div>{" "}
          {survey &&
            survey[0] &&
            Object.keys(survey[0]) &&
            // && Object.keys(survey[0]).length > 0
            Object.keys(survey[0]).map((res, index) => {
              // console.log('survey',res)
              return res == "meeting_id" ||
                res == "author" ||
                res == "title" ||
                res == "description" ? (
                <p key={"jghg" + index} className="list-item-heading mb-4">
                  {" "}
                  {res}:
                  <span className="text-muted text-small mb-2">
                    {" "}
                    {survey[0][res]}{" "}
                  </span>{" "}
                </p>
              ) : null;
            })}{" "}
        </CardBody>{" "}
      </Card>{" "}
    </div>
  );
};

export default React.memo(SummaryDetailCard);
