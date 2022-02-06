import React, {Fragment, useState, useEffect, useRef} from "react";

const VoteChart = props => {
  const [data, setData] = useState(false);
  const [msg, setMsg] = useState(false);

  useEffect(() => {
    const voteMatch = 0.6;
    const result = {
      colorPill: voteMatch <= 0.5 ? "" : "#2096F3",
      bgColor: voteMatch == 0 ? "rgba(192, 57, 43, 1)" : "",
      info:
        voteMatch > 0
          ? Math.round(voteMatch * 100) + "% Position Match"
          : voteMatch != 0
          ? "No match yet. Tap here to Vote."
          : "0% Position Match"
    };

    const match = Math.round(voteMatch * 100) + "%";
    setData({...result, ...props});
  }, []);

  useEffect(() => {
    setMsg(props.msg);
  }, [data]);

  return (
    <div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          // position: "absolute",
          // left: 0,
          // top: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "red"
        }}
      >
        <div
          style={{
            width: 120,
            // height: 18,
            borderRadius: 10,
            // borderWidth: 1,
            // padding: 4,
            margin: 2,
            textAlign: "center",
            borderColor: "white",
            // backgroundColor: "gray",
            // opacity: 0.7,
            // color: "white",
            flexShrink: 1,
            flexWrap: "wrap",
            backgroundColor: "red",
            width: data.width ? data.width : 120,
            borderWidth: 1
          }}
        >
          <div
            style={{
              width: 120,
              // height: 18,
              borderRadius: 10,
              // borderWidth: 1,
              // padding: 4,
              margin: 2,
              textAlign: "center",
              borderColor: "white",
              // backgroundColor: "gray",
              // opacity: 0.7,
              // color: "white",
              flexShrink: 1,
              flexWrap: "wrap",
              fontSize: data.fontSize ? data.fontSize : 12,
              backgroundColor: data.colorPill ? data.colorPill : "red",
              opacity: 0.7,
              width: data.match ? data.match : "40%"
            }}
          />
        </div>
      </div>
      <div
        style={{
          paddingTop: data.height ? 4 : 0,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: 120,
            // height: 18,
            borderRadius: 10,
            // borderWidth: 1,
            // padding: 4,
            margin: 2,
            textAlign: "center",
            borderColor: "white",
            // backgroundColor: "gray",
            // opacity: 0.7,
            // color: "white",
            flexShrink: 1,
            flexWrap: "wrap",
            width: data.width ? data.width : 120,
            fontSize: data.innerFont ? data.innerFont : 10,
            color: data.color ? data.color : "white"
            // fontWeight:'bold'
          }}
        >
          {data.info}
        </div>
      </div>
    </div>
  );
};
export default VoteChart;
