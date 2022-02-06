import React, {useState, useEffect, useRef, Fragment, Component} from "react";
import RESTCall from "../../../../redux/actions/restApi";
import useLocalStorage from "./localStorage";
import moment from "moment";
import {Button} from "reactstrap";

const fullWidth = window.screen.width;
const fullHeight = window.screen.height;
type Props = {
  behind: React.Component,
  front: React.Component,
  under: React.Component
};

const addObjectVals = obj => {
  let total = 0;
  Object.keys(obj).map(res => {
    total = obj[res] + total;
    // console.log("total", total);
  });
  return total;
};

// Show something on top of other
const MultiTag = props => {
  const {chartId, setChartId} = props;
  const [demography, setDemography] = useState(false);
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [startVote, setStartVote] = useState(false);

  useEffect(() => {
    if (demography) {
      setData(demography);
    }
  }, [demography]);

  const [data, setData] = useState({
    "Age Group": {20: 2, 30: 3, 40: 2, 50: 2, undefined: 6},
    "Party Group": {undefined: 10, republican: 2},
    "Sex Group": {male: 2, female: 3},
    "Race Group": {
      undefined: 6,
      Asian: 3,
      "American Indian": 2,
      White: 2,
      Black: 2
    }
  });

  useEffect(() => {
    getVoteMatches();
  }, [chartId]);

  const groupByCount = async ({data, key}) => {
    const info = {};
    let group = data.reduce((r, a) => {
      r[a[key]] = [...(r[a[key]] || []), a];
      // console.log("ddd", key, a[key], info[a[key]]);

      if (
        !(
          key == "sex" &&
          (a[key] == "20" ||
            a[key] == "30" ||
            a[key] == "40" ||
            a[key] == "50" ||
            a[key] == "60" ||
            a[key] == "70" ||
            a[key] == "80")
        )
      )
        info[a[key]] = [...(r[a[key]] || []), a].length;
      return r;
    }, {});
    // console.log("ddd", info);
    return info;
  };

  const getVoteMatches = async () => {
    if (!(chartId && chartId.item_id)) {
      alert("No Bill ID available for this content");
      return;
    }
    const formData = {
      request: "search",
      resource: "vare_vote",
      query: {item_id: chartId.item_id}
    };
    const infVotes = await RESTCall.axiosQuery(formData).then(res => {
      return res && res.data ? res.data : [];
    });
    const votes = infVotes.filter(
      rep =>
        rep.item_id &&
        rep.item_id.toLowerCase().substring(0, 2) &&
        (rep.item_id.toLowerCase().substring(0, 2) == "hr" ||
          rep.item_id.toLowerCase().charAt(0) == "s")
    );

    // console.log("votes", votes);
    if (votes && votes.length == 0) {
      setData(false);
      return;
    }

    // demography: {men: 40, dems: 24, "30-minus": 30, "40-plus": 80},
    const newVoteObeject = {};
    const ageGroup = await groupByCount({data: votes, key: "age"});
    const partyGroup = await groupByCount({data: votes, key: "party"});
    const sexGroup = await groupByCount({data: votes, key: "sex"});
    const raceGroup = await groupByCount({data: votes, key: "race"});

    newVoteObeject["Age Group"] = ageGroup;
    newVoteObeject["Party Group"] = partyGroup;
    newVoteObeject["Sex Group"] = sexGroup;
    newVoteObeject["Race Group"] = raceGroup;

    // console.log("sexGroup", votes, sexGroup);
    // console.log("ageGroup", ageGroup);
    // console.log("partyGroup", partyGroup);
    // console.log("sexGroup", sexGroup);
    // console.log("raceGroup", raceGroup);
    setDemography(newVoteObeject);
  };

  const databaseSaveVote = async props => {
    // alert(JSON.stringify(props.bill_id));
    // console.log("props", props);
    //TODO;
    // return;
    if (storeUser && storeUser.email) {
      const influencerInfo =
        !props.influencer_id || props.influencer_id == "NA"
          ? {}
          : {influencer_id: props.influencer_id};
      const dbVote = {
        ...influencerInfo,
        facebook: storeUser.facebook,
        instagram: storeUser.instagram,
        name: storeUser.name,
        img: storeUser.img,
        date: moment().format(),
        user_id: storeUser.user_id ? storeUser.user_id : storeUser.email,
        item_id: props["bill_id"] ? props["bill_id"] : props["item_id"],
        title: props["title"],
        vote: props["vote"],
        sex: storeUser.age,
        age: storeUser.age,
        race: storeUser.race,
        party: storeUser.party
      };
      // console.log("xxxx", props);

      const formData = {
        request: "insert",
        query: dbVote,
        resource: "vare_vote",
        check: ["item_id", "user_id"]
      };
      return await RESTCall.axiosQuery(formData)
        .then(response => {
          // console.log("postInfo", response);
          alert(
            'Your position has been saved.  Go to "My Reps" tab on the Vare App to see all your votes match with your Representatives.'
          );
          setChartId(false);
          return response;
        })
        .catch(error => {
          return error;
        });
    }
  };

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "rgba(0,0,0,.70)"
      }}
    >
      <div
        style={{
          height: 100,
          backgroundColor: "rgba(0,0,0,.70)",
          padding: 10,
          color: "white",
          overflow: "scroll"
        }}
      >
        {`Take a position on item ${chartId &&
          chartId.title} to let your Representative know where
you stand.`}
      </div>
      {setStartVote ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%"
          }}
        >
          {" "}
          <Button
            style={{
              width: "45%"
            }}
            onClick={() => {
              chartId["vote"] = "yes";
              databaseSaveVote(chartId);
            }}
            style={{marginBottom: 20, marginTop: 20}}
          >
            Support Bill
          </Button>
          <Button
            style={{
              width: "45%"
            }}
            onClick={() => {
              chartId["vote"] = "no";
              databaseSaveVote(chartId);
            }}
            style={{marginBottom: 20}}
          >
            Reject Bill
          </Button>
        </div>
      ) : null}
      {data && Object.keys(data) && Object.keys(data).length > 0
        ? Object.keys(data).map((res, indexA) => {
            const report = data[res];
            const total = addObjectVals(report);

            return (
              <div
                key={"gdfhggghfvf" + indexA}
                style={
                  {
                    // padding: 20
                    // alignItems: "center",
                    // justifyContent: "center"
                  }
                }
              >
                <div
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingBottom: 3
                  }}
                >
                  {res}
                </div>
                <div
                  style={{
                    display: "flex",
                    borderRadius: 10,
                    flexDirection: "row",
                    backgroundColor: "black",
                    padding: 10
                  }}
                >
                  {report &&
                    Object.keys(report) &&
                    Object.keys(report).map((rep, indexB) => {
                      const repVal = (report[rep] / total) * 100;
                      // console.log("cccc", report[rep], total, Math.round(repVal));

                      return (
                        <div
                          key={"ihhgfgf" + indexA + indexB}
                          style={{
                            flexDirection: "column"
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: "white",
                                paddingLeft: 10
                              }}
                            >
                              {`${
                                rep == "undefined" ? "OTHER" : rep.toUpperCase()
                              }`}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: "red",
                                paddingLeft: 10
                              }}
                            >
                              {`${Math.round(repVal)}%`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default MultiTag;
