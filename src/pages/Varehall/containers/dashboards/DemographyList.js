/* eslint-disable react/no-array-index-key */
import React, {useState, useRef, useEffect} from "react";
import {Card, CardBody, CardTitle, Progress} from "reactstrap";
import moment from "moment";

// import IntlMessages from '../../helpers/IntlMessages';
// import data from "../../data/profileStatuses";
const raceData = [
  {
    title: "White",
    total: 18,
    status: 12
  },
  {
    title: "Black",
    total: 8,
    status: 1
  },
  {
    title: "Asian",
    total: 6,
    status: 2
  },
  {
    title: "Hispanic or Latino",
    total: 10,
    status: 0
  },
  {
    title: "American Indian",
    total: 2,
    status: 1
  },
  {
    title: "Native Hawaiian",
    total: 2,
    status: 1
  }
];

const ageData = [
  {
    title: "20's",
    total: 28,
    status: 12
  },
  {
    title: "30's",
    total: 32,
    status: 18
  },
  {
    title: "40's",
    total: 92,
    status: 44
  },
  {
    title: "50's",
    total: 22,
    status: 15
  },
  {
    title: "60's",
    total: 32,
    status: 28
  },
  {
    title: "70's",
    total: 55,
    status: 34
  },
  {
    title: "80's",
    total: 32,
    status: 19
  },
  {
    title: "90's and Above",
    total: 22,
    status: 18
  }
];

const partyData = [
  {
    title: "Democrat",
    total: 18,
    status: 12
  },
  {
    title: "Republican",
    total: 22,
    status: 18
  }
];

const DemographyCard = ({
  cardClass = "h-100",
  backMenu,
  title,
  subTitle,
  selectedOptions,
  avgVoterBillDemography,
  period
}) => {
  const [data, setData] = useState(
    avgVoterBillDemography ? avgVoterBillDemography : []
  );

  useEffect(() => {
    // console.log("selectedOptions", selectedOptions);
    // if (selectedOptions && selectedOptions.value == "Party") {
    //   setData(partyData);
    // } else if (selectedOptions && selectedOptions.value == "Age") {
    //   setData(avgVoterBillDemography ? avgVoterBillDemography : raceData);
    // } else {
    setData(avgVoterBillDemography ? avgVoterBillDemography : []);
    // }
  }, [selectedOptions, avgVoterBillDemography]);

  const [startdate, setStartdate] = useState(null);
  useEffect(() => {
    let startdate = moment(period);
    startdate = startdate.subtract(7, "days");
    startdate = startdate.format("MM/DD/YY");
    setStartdate(startdate);
    // console.log("enddate", startdate);
  }, [period]);

  return (
    <div
      style={{
        width: "100%"
      }}
    >
      {selectedOptions.value != "na" ? (
        <CardBody>
          <div style={{paddingTop: 30}} />
          <CardTitle>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {`${selectedOptions.value.charAt(0).toUpperCase() +
                selectedOptions.value.slice(1)} Group`}
            </span>
            {subTitle}
          </CardTitle>
          {/*<div
            onClick={() => {
              backMenu();
            }}
            style={{
              position: "absolute",
              right: 20,
              top: 15
            }}
            className="w-15 w-xs-100"
          >
            <span className="badge badge-primary badge-pill">{"< Back"}</span>
          </div>*/}
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
      ) : null}
    </div>
  );
};
export default DemographyCard;
