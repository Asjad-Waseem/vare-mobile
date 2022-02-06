/* eslint-disable react/no-array-index-key */
import React from "react";
import {Card, CardBody, CardTitle, Progress} from "reactstrap";

// import IntlMessages from '../../helpers/IntlMessages';
import data from "../../data/profileStatuses";

const ProfileStatuses = ({cardClass = "h-100", backMenu}) => {
  return (
    <Card className={cardClass}>
      <CardBody>
        <CardTitle>Profile Status</CardTitle>
        <div
          onClick={() => {
            backMenu();
          }}
          style={{
            position: "absolute",
            right: 20,
            top: 15
          }}
          class="w-15 w-xs-100"
        >
          <span class="badge badge-primary badge-pill">{"< Back"}</span>
        </div>
        {data.map((s, index) => {
          return (
            <div key={index} className="mb-4">
              <p className="mb-2">
                {s.title}
                <span className="float-right text-muted">
                  {s.status}/{s.total}
                </span>
              </p>
              <Progress value={(s.status / s.total) * 100} />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
export default ProfileStatuses;
