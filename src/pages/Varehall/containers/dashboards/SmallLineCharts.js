import React from "react";
import {Row, Card, CardBody} from "reactstrap";

import {Colxx} from "../../mycomponents/common/CustomBootstrap";
import {SmallLineChart} from "../../mycomponents/charts";

import {
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4
} from "../../data/charts";

const SmallLineCharts = ({itemClass = "dashboard-small-chart"}) => {
  return (
    <Row>
      <Colxx xxs="6" className="mb-4">
        <Card className={itemClass}>
          <CardBody>
            <SmallLineChart data={smallChartData1} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="6" className="mb-4">
        <Card className={itemClass}>
          <CardBody>
            <SmallLineChart data={smallChartData2} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="6" className="mb-4">
        <Card className={itemClass}>
          <CardBody>
            <SmallLineChart data={smallChartData3} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="6" className="mb-4">
        <Card className={itemClass}>
          <CardBody>
            <SmallLineChart data={smallChartData4} />
          </CardBody>
        </Card>
      </Colxx>
    </Row>
  );
};

export default SmallLineCharts;
