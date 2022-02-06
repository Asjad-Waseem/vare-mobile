import React, {useState} from "react";
import {Card} from "reactstrap";
import moment from "moment";

import {RWebShare} from "react-web-share";

const CardNewsList = ({
  storeUser,
  saveMessageLikes,
  shareItem,
  detailsIndex,
  videoUrl,
  real,
  index
}) => {

  const [detailsIndex1, setDetailsIndex1] = useState(-1);

  return (
    <Card
      style={{
        borderColor: videoUrl == index ? "red" : "",
        width: 350,
        height: 300,
        padding: 10,
        flexDirection: "row",
      }}
    >
      <img
        onClick={() => {
          real.url && window.open(real.url, "_self");
        }}
        width={"100%"}
        src={
          real.urlToImage
            ? real.urlToImage
            : "https://varefiles.s3.us-east-2.amazonaws.com/meetingpic1.jpg"
        }
      />

      {detailsIndex == index ? null : (
        <div
          onClick={() => {
            real.url && window.open(real.url, "_self");
          }}
          style={{
            position: "absolute",
            bottom: 10,
            backgroundColor: "rgba(0,0,0,.80)",
            height: "90px",
            width: "94.2%",
            flexDirection: "column",
            paddingLeft: 10,
            paddingTop: "5px",
            paddingBottom: "5px",
            color: "white"
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: 14,
              fontWeight: "bold",
              color: "red",
              display: "flex",
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                paddingRight: 6
              }}
            >
              {" "}
              {real.author && real.author.length >= 25 ? real.author.substring(0, 25) + "..." : real.author && real.author.length < 25 ? real.author : ""}
            </div>

            <i
              className={`fas fa-link`}
              onClick={() => {
                real.url && window.open(real.url, "_self");
              }}
              style={{
                paddingTop: 2,
                fontSize: 12,

                color:
                  real.source && real.source.name
                    ? "#2096F3"
                    : real.meeting_id && real.meeting_id && real.date
                    ? "white"
                    : "white"
              }}
            >
              {` ${
                real.source && real.source.name
                  ? real.source.name
                  : real.meeting_id && real.meeting_id && real.date
                  ? real.date
                  : ""
              }`}
            </i>
          </div>
          <div
            style={{
              fontSize: 14,
              width: "85%",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {real.title ? real.title.substring(0, 70) + "..." : ""}
          </div>

          <div
            style={{
              fontWeight: "bold",
              width: "100%",
              fontSize: 12,
              color: "#FA8072",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div style={{paddingLeft: 20}}>
              {real.date
                ? moment(real.date || moment.now()).fromNow()
                : real.publishedAt
                ? moment(real.publishedAt || moment.now()).fromNow()
                : ""}
            </div>

            <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: "auto",
                          }}
                        >
                          <i
                            className={`fas fa-2x fa-${
                              detailsIndex1 == index ? "eye" : "eye-slash"
                            }`}
                            onClick={() => {
                              setDetailsIndex1(
                                detailsIndex == index ? -1 : index
                              );
                            }}
                            style={{
                              color: "#2096F3",
                              marginTop: "-45px",
                              marginRight: "10px"
                            }}
                          />
                        </div>


          </div>
        </div>
      )}
      {detailsIndex == index ? null : (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 10,
            paddingTop: 15
          }}
        >
          <div>
            <i
              onClick={() => {
                real.url && window.open(real.url, "_self");
              }}
              style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 10
              }}
              className={`fas fa-play`}
            />
          </div>
          <div
            style={{
              paddingLeft: 15
            }}
          >
            <RWebShare
              data={{
                text: real.shareText
                  ? real.shareText
                  : "News Updates Shared from Vare",
                url: real.shareUrl ? real.shareUrl : window.location.href,
                title: real.title
              }}
              onClick={() => {
                shareItem(index);
              }}
            >
              <i
                style={{
                  backgroundColor: "#f2f3f5",
                  padding: 10,
                  borderRadius: 10
                }}
                className={`fas fa-share-alt`}
              />
            </RWebShare>
          </div>
          <div style={{paddingLeft: 15, paddingRight: 10}}>
            <i
              onClick={() => {
                if (!(storeUser && storeUser.email)) {
                  alert("Please login to use this feature");
                  return;
                }
                saveMessageLikes({
                  ...real,
                  likes: !real.likes
                    ? JSON.stringify([storeUser.user_id])
                    : real.likes && real.likes.includes(storeUser.user_id)
                    ? JSON.stringify(
                        real.likes.filter(res => res != storeUser.user_id)
                      )
                    : JSON.stringify([...real.likes, storeUser.user_id])
                });
              }}
              style={{
                backgroundColor: "#f2f3f5",
                padding: 10,
                borderRadius: 10,
                color:
                  real.likes &&
                  storeUser.user_id &&
                  real.likes.includes(storeUser.user_id)
                    ? "#2096F3"
                    : "black"
              }}
              className={`fas fa-heart`}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

const styleInfo = {
  wrapPadMydiv: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMydiv: {
    fontSize: 10,
    color: "#1c1e21",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

export default CardNewsList;
