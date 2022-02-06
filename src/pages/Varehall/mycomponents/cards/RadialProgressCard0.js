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
          </div>
        </CardHeader>
      )}
      <CardBody className="d-flex justify-content-between align-items-center">
        <a href={url}>
          <CardTitle className="mb-0">{title}</CardTitle>
        </a>
        <div className="progress-bar-circle">
          <CircularProgressbar
            value={percent}
            text={`${percent}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",

              // Text size
              textSize: "16px",

              // How long animation takes to go from one percent to another, in seconds
              pathTransitionDuration: 0.5,

              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',

              // Colors
              pathColor: `rgba(62, 152, 199, ${percent / 100})`,
              textColor: "#f88",
              trailColor: "#d6d6d6",
              backgroundColor: "#3e98c7"
            })}
          />
          <CircularProgressbar
            value={percent}
            text={`${percent}%`}
            styles={{
              // Customize the root svg element
              root: {},
              // Customize the path, i.e. the "completed progress"
              path: {
                // Path color
                stroke: `rgba(62, 152, 199, ${percent / 100})`,
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                // Customize transition animation
                transition: "stroke-dashoffset 0.5s ease 0s",
                // Rotate the path
                transform: "rotate(0.25turn)",
                transformOrigin: "center center"
              },
              // Customize the circle behind the path, i.e. the "total progress"
              trail: {
                // Trail color
                stroke: "#d6d6d6",
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",
                // Rotate the trail
                transform: "rotate(0.25turn)",
                transformOrigin: "center center"
              },
              // Customize the text
              text: {
                // Text color
                fill: "#f88",
                // Text size
                fontSize: "16px"
              },
              // Customize background - only used when the `background` prop is true
              background: {
                fill: "#3e98c7"
              }
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
};
export default React.memo(RadialProgressCard);
