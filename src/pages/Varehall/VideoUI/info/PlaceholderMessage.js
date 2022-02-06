import React, {Fragment, useState, useEffect, useRef} from "react";

const PlaceholderMessage = ({info, onHandleQuery}) => {
  return (
    <div
      style={{
        marginRight: 25,
        marginLeft: 25,
        backgroundColor: "white",
        borderRadius: 5,
        height: 400
      }}
    >
      <div
        style={{
          background:
            "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
          backgroundColor: "red",
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          height: 100,
          width: "100%",
          padding: 20,
          color: "white"
        }}
        className=""
      >
        {" "}
        <div style={{flexDirection: "row !important", width: 200}}>
          <img
            src="https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
            alt=""
            class=""
            style={{width: 40, height: 40, borderRadius: 100}}
          />
          <div className="">Welcome to VARE</div>
        </div>
      </div>
      <div
        style={{height: 200, overflowY: "auto", padding: 20}}
        className="form-side"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            paddingBottom: 8
          }}
        >
          <div
            style={{
              marginRight: 10
            }}
            className="mb-4 card-title"
          >
            Please login to access this page
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMessage;
