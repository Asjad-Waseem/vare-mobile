import React, {Fragment, useState, useEffect, useRef} from "react";
import useLocalStorage from "./localStorage";
import RESTCall from "../../../../redux/actions/restApi";
import {groupBy} from "../../helpers";
import PageModal from "./PageModal";
import MultiTag from "./MultiTag";

const VoteChart = props => {
  const {real, chartId, setChartId} = props;
  // const [chartId, setChartId] = useState(false);

  const [data, setData] = useState(false);
  const [msg, setMsg] = useState(false);
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [voteMatch, setVoteMatch] = useState(0);

  useEffect(() => {
    const result = {
      voteMatch: voteMatch > 0 ? voteMatch : 50,
      colorPill: voteMatch <= 0.5 ? "" : "#2096F3",
      bgColor: voteMatch == 0 ? "rgba(192, 57, 43, 1)" : "",
      info:
        voteMatch > 0 ? Math.round(voteMatch) + "% Support" : "Add your vote"
    };

    const match = Math.round(voteMatch) + "%";
    setData({...result, ...props});
  }, [voteMatch]);

  useEffect(() => {
    setMsg(props.msg);
  }, []);

  useEffect(() => {
    // console.log("chartId", chartId);
  }, [chartId]);

  useEffect(() => {
    getVoteMatches(real);
  }, [real]);

  const getVoteMatches = async real => {
    const formData = {
      request: "search",
      resource: "vare_vote",
      query: {item_id: real.item_id}
    };
    const infVotes = await RESTCall.axiosQuery(formData).then(res => {
      return res && res.data;
    });
    const votes = infVotes;

    // console.log("votes", votes);
    if (votes && votes.length == 0) {
      return;
    }

    const voteGroup = await groupBy({data: votes, key: "vote"});

    if (voteGroup && Object.keys(voteGroup).length > 0) {
      const newVoteMatch =
        voteGroup["yes"] && !voteGroup["no"]
          ? 100
          : !voteGroup["yes"] && voteGroup["no"]
          ? 0
          : voteGroup["yes"] && voteGroup["no"]
          ? Math.round((voteGroup["yes"].length / votes.length) * 100)
          : 0;

      // console.log("newVoteMatch", newVoteMatch);

      setVoteMatch(newVoteMatch);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        textAlign: "center"
      }}
    >
      <div
        style={{
          width: "100%"
        }}
      >
        <div
          onClick={() => {
            // alert(real._id);
            if (!(storeUser && storeUser.email)) {
              return;
            }
            setChartId(real);
          }}
          style={{
            display: "flex",
            // backgroundColor: "red",
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 25,
            width: 200,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <div
            style={{
              position: "static",
              top: 20,
              left: 15,
              // width: data.voteMatch - 20 + "%",
              // backgroundColor: "#2096F3",
              // borderTopLeftRadius: 25,
              // borderBottomLeftRadius: 25,
              // // textAlign: "left",
              paddingRight: 5,
              color: "white",
              fontSize: 12
            }}
          >
            {`${data.voteMatch}%`}
          </div>

          <div
            style={{
              width: data.voteMatch + "%",
              backgroundColor: "#2096F3",
              borderTopLeftRadius: 25,
              borderBottomLeftRadius: 25,
              textAlign: "left",
              paddingLeft: 5,
              color: "white",
              fontSize: 15
            }}
          >
            {`.`}
          </div>
          <div
            style={{
              width: 100 - data.voteMatch * 1 + "%",
              backgroundColor: "red",
              borderTopRightRadius: 25,
              borderBottomRightRadius: 25,
              textAlign: "right",
              paddingRight: 5,
              color: "white",
              fontSize: 15
            }}
          >
            {`.`}
          </div>
          <div
            style={{
              position: "static",
              // top: 20,
              // right: 0,
              // // width: data.voteMatch - 20 + "%",
              // // backgroundColor: "#2096F3",
              // borderTopLeftRadius: 25,
              // borderBottomLeftRadius: 25,
              // textAlign: "left",
              paddingLeft: 5,
              color: "white",
              fontSize: 12
            }}
          >
            {`${100 - data.voteMatch}%`}
          </div>
          <div
            style={{
              position: "absolute",
              zIndex: 14,
              paddingLeft: 15
            }}
          >
            {
              // data.info
              "Add Vote"
            }
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            fontSize: 13
          }}
        >
          <div>{`Support`}</div>
          <div
            style={{
              marginLeft: 120
            }}
          >{`Reject`}</div>
        </div>
      </div>
    </div>
  );
};
export default VoteChart;
