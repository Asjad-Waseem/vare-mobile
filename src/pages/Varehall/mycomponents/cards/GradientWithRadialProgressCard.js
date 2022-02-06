import React from "react";
import {Card, CardBody} from "reactstrap";
import {CircularProgressbar} from "react-circular-progressbar";

const GradientWithRadialProgressCard = ({
  icon = "iconsminds-bell",
  title = "title",
  detail = "detail",
  percent = 80,
  progressText = "8/10"
}) => {
  return (
    <Card>
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
    </Card>
  );
};
export default React.memo(GradientWithRadialProgressCard);
