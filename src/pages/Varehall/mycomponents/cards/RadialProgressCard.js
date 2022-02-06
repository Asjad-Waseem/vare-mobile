import React from "react";
import {Card, CardBody, CardTitle, CardHeader} from "reactstrap";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";

const RadialProgressCard = ({
  title = "title",
  percent = 50,
  isSortable = false,
  url = "https://www.congress.gov/bill/116th-congress/house-bill/7994"
}) => {
  return (
    <Card>
      {isSortable && (
        <CardHeader className="p-0 position-relative">
          <div className="position-absolute handle card-icon">
            <i className="simple-icon-shuffle" />
            ddfd
          </div>
        </CardHeader>
      )}
      <CardBody>
        <a href={url}>
          <CardTitle className="mb-0">{title}</CardTitle>
        </a>
        <div
          style={{
            float: "right",
            width: 70
          }}
          className="progress-bar-circle"
        >
          <CircularProgressbar
            value={percent}
            text={`${percent}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",

              // Text size
              textSize: "20px",

              // How long animation takes to go from one percent to another, in seconds
              pathTransitionDuration: 0.5,

              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',

              // Colors
              pathColor: `rgba(62, 152, 199, ${percent / 100})`,
              textColor: "#f88",
              trailColor: "#d6d6d6",
              backgroundColor: "#3e98c7",
              transformOrigin: "center center"
            })}
          />
        </div>
      </CardBody>
    </Card>
  );
};
export default React.memo(RadialProgressCard);
