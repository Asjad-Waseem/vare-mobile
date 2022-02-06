/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, {useEffect, useRef, useState} from "react";
import {Chart} from "chart.js";
import moment from "moment";

import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import {smallLineChartOptions} from "./config";
import DemographyList from "../../containers/dashboards/DemographyList";

import {FormGroup, Progress} from "reactstrap";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import Select from "react-select";

const addCommas = nStr => {
  nStr += "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1,$2");
  }
  return x1 + x2;
};

const Scatter = ({
  data,
  updatePeriod,
  period,
  subLabel,
  // avgVoterBillDemography,
  sortedBuildData
}) => {
  const chartContainer = useRef(null);
  const [, setChartInstance] = useState(null);
  const [currentValue, setCurrentValue] = useState("");
  const [currentLabel, setCurrentLabel] = useState("");
  const [avgVoterBillDemography, setAvgVoterBillDemography] = useState(null);

  const changeState = (yLabel, xLabel) => {
    setCurrentValue(yLabel);
    setCurrentLabel(xLabel);
  };

  const [selectedPartyOptions, setPartyOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [moreDetails, setMoreDetails] = useState(null);

  // console.log("avgVoterBillDemography", avgVoterBillDemography);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      Chart.controllers.lineWithLine = Chart.controllers.line;
      Chart.controllers.lineWithLine = Chart.controllers.line.extend({
        draw(ease) {
          Chart.controllers.line.prototype.draw.call(this, ease);
          const {
            chart: {ctx, tooltip, scales}
          } = this;

          if (tooltip._active && tooltip._active[0]) {
            const activePoint = tooltip._active[0];
            const {x} = activePoint.tooltipPosition();
            const topY = scales["y-axis-0"].top;
            const bottomY = scales["y-axis-0"].bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.stroke();
            ctx.restore();
          }
        }
      });
      const context = chartContainer.current.getContext("2d");
      const newChartInstance = new Chart(context, {
        type: "lineWithLine",
        options: {
          ...smallLineChartOptions,
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)"
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: "rgba(0, 0, 0, 0)"
                }
              }
            ]
          },
          tooltips: {
            intersect: false,
            enabled: false,
            custom(tooltipModel) {
              if (tooltipModel && tooltipModel.dataPoints) {
                const {yLabel} = tooltipModel.dataPoints[0];
                const {xLabel} = tooltipModel.dataPoints[0];
                const label = tooltipModel.body[0].lines[0].split(":")[0];
                changeState(
                  `${
                    label.includes("bill") || label.includes("Bill")
                      ? addCommas(yLabel) + "%"
                      : addCommas(yLabel) + "%"
                  }`,
                  `${label}`
                );
                updatePeriod(xLabel);
              }
            }
          }
        },
        plugins: [
          {
            afterInit(chart, _options) {
              const yLabel = chart.data.datasets[0].data[0];
              const xLabel = chart.data.labels[0];
              const {label} = chart.data.datasets[0];
              changeState(
                `${
                  label == "Bill Support"
                    ? addCommas(yLabel) + "%"
                    : addCommas(yLabel) + "%"
                }`,
                `${label}`
              );
              updatePeriod(xLabel);
            }
          }
        ],
        data
      });
      setChartInstance(newChartInstance);
    }
  }, [chartContainer, data, selectedOptions]);

  useEffect(() => {
    // console.log("csss", sortedBuildData[selectedOptions.value]);
    if (sortedBuildData && selectedOptions && selectedOptions.value)
      setAvgVoterBillDemography(sortedBuildData[selectedOptions.value]);
  }, [selectedOptions]);

  const [startdate, setStartdate] = useState(null);
  useEffect(() => {
    let startdate = moment(period);
    startdate = startdate.subtract(7, "days");
    startdate = startdate.format("MM/DD/YY");
    setStartdate(startdate);
    // console.log("enddate", startdate);
  }, [period]);

  return (
    <>
      {moreDetails ? (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 55,
            fontSize: 14
          }}
          className={"card"}
        >
          {`${subLabel}`}
        </div>
      ) : null}
      <div
        onClick={() => {
          if (moreDetails) {
            setMoreDetails(null);
          } else {
            setMoreDetails(true);
          }
        }}
        style={{
          position: "absolute",
          right: 20,
          top: 15
        }}
        className="w-15 w-xs-100"
      >
        <span className="badge badge-primary badge-pill">
          {!moreDetails ? "Chart Details >" : "Close Details"}
        </span>
      </div>

      <div>
        <p className="lead color-theme-1 mb-1 value">{currentValue}</p>
        <p className="mb-0 label text-small">{currentLabel}</p>
      </div>
      <div className="chart">
        <canvas ref={chartContainer} />
      </div>
      <div></div>
      <FormGroup>
        <Colxx
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 30,
            display: "flex",
            flexDirection: "row",
            width: "100%"
          }}
          sm={12}
          lg={12}
        >
          <Colxx style={{width: "100%"}} sm={4} lg={4}>
            <Select
              components={{Input: CustomSelectInput}}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-name"
              placeholder={"Filter by Demography"}
              value={selectedPartyOptions}
              onChange={val => {
                setPartyOptions(val);
                setSelectedOptions({...selectedOptions, value: val.value});
              }}
              options={[
                {label: "None", value: "na", key: 0},
                {label: "Party", value: "party", key: 0},
                {label: "Age", value: "age", key: 1},
                {label: "Race", value: "race", key: 1},
                {label: "Gender", value: "gender", key: 1}
              ]}
            />
          </Colxx>
        </Colxx>
      </FormGroup>
      {avgVoterBillDemography ? (
        <DemographyList
          avgVoterBillDemography={avgVoterBillDemography}
          selectedOptions={selectedOptions}
          // selectedPartyOptions={selectedPartyOptions}
          // selectedRaceOptions={selectedRaceOptions}
          // selectedAgeOptions={selectedAgeOptions}
          title={"Demography"}
          subTitle={""}
          backMenu={() => {
            // setViewLevel("bills");
            // setDemographyData("party");
          }}
          cardClass="dashboard-progress"
        />
      ) : null}
    </>
  );
};

export default Scatter;
