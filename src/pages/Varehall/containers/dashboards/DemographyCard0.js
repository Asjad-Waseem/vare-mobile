/* eslint-disable react/no-array-index-key */
import React, {useState, useRef, useEffect} from "react";
import {Card, CardBody, CardTitle, Progress} from "reactstrap";

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
  selectedOptions
}) => {
  const [data, setData] = useState(raceData);

  useEffect(() => {
    console.log("selectedOptions", selectedOptions);
    if (selectedOptions && selectedOptions.value == "Party") {
      setData(partyData);
    } else if (selectedOptions && selectedOptions.value == "Age") {
      setData(ageData);
    } else {
      setData(raceData);
    }
  }, [selectedOptions]);

  return (
    <div
      style={{
        width: "100%"
      }}
    >
      <Card className={cardClass}>
        <CardBody>
          <CardTitle>
            <span style={{fontWeight: "bold"}}>Bill ({title})</span>
            {" support by Demography"}
          </CardTitle>
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
    </div>
  );
};
export default DemographyCard;
