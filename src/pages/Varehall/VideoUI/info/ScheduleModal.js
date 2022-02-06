import React, {useState, useEffect} from "react";

import "../../style.css"; // Tell webpack that Button.js uses these styles
import "../../info.css";

import { Row } from "reactstrap";
import TextInput from "react-autocomplete-input";
import {useHistory} from "react-router-dom";

import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";
import NewsCardList from "./NewsCardList";

import RESTCall from "../../../../redux/actions/restApi";
import {parseURL} from "../../helpers/Utils";

import useLocalStorage from "./localStorage";

const Home = ({setLoginUser, loginUser}) => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchMeetingDetails, setSearchMeetingDetails] = useState([]);
  const [storedMeetingDetails, setStoredMeetingDetails] = useState([]);

  const [videoUrl, setVideoUrl] = useState({});
  const [detailsIndex, setDetailsIndex] = useState(-1);
  const [shareItem, setShareItem] = useState({});

  useEffect(() => {
    handleMeetingDetails();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      setMeetingDetails(
        searchMeetingDetails.length > 0 ? [...searchMeetingDetails] : []
      );
    } else {
      setMeetingDetails([...storedMeetingDetails]);
    }
  }, [storedMeetingDetails, searchMeetingDetails, searchText]);

  const handleMeetingDetails = async () => {
    const urlParams = parseURL(history.location.search);
    const formData = {
      request: "search",
      query: {
        member_id: ""
      },
      resource: "vare_meetings",
      id: ""
    };
    RESTCall.axiosQuery(formData).then(response => {
      if (response && response.data) {
        const data =
          response && response.data && response.data.length > 0
            ? response.data.map(rep => {
                if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
                return rep;
              })
            : [];
        if (data) setStoredMeetingDetails([...data]);
      }
    });
  };

  const saveMessageLikes = async message => {
    const formData = {
      request: "insert",
      query: {
        author: message.author,
        meeting_id: message.meeting_id,
        likes: message.likes
      }, //add table key value to edit
      resource: "vare_meetings", //add table name
      check: ["author", "meeting_id"]
    };
    return await RESTCall.axiosQuery(formData).then(contents => {
      handleMeetingDetails();
      // return contents;
    });
  };

  return (
    <div>
      <PageMenu />
      <div
        style={{
          display: "flex",
          marginTop: 65,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/meetings.jpg"}`,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: 50,
            width: 380,
            height: 30,
            flexDirection: "row",
            backgroundColor: "rgba(0,0,0,.69)",
            borderRadius: 25
          }}
        >
          <div>
            <TextInput
              value={searchText}
              style={{
                borderWidth: 0,
                width: 300,
                textAlign: "center",
                fontSize: 18,
                color: "white"
              }}
              placeholder={"Search"}
              onChange={text => {
                const newItem =
                  meetingDetails &&
                  meetingDetails.length > 0 &&
                  meetingDetails.filter(rep => {
                    return JSON.stringify(rep)
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
                setSearchMeetingDetails(newItem);
                setSearchText(text);
              }}
            />{" "}
          </div>
          <div>
            <i
              onClick={() => {
                setSearchText("");
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                color: "white"
              }}
              className={`fas fa-x fa-sync-alt`}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          paddingTop: 10,
          width: "100%",
          paddingBottom: 80
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          Vare Scheduled Meetings
        </div>
        <Row
        style={{
          marginLeft: "20px",
          marginRight: "20px",
          justifyContent: "center"
        }}>
          {meetingDetails && meetingDetails.length > 0
            ? meetingDetails.map((real, index) => {
                if (0 <= index && index < 4) {
                  real[
                    "urlToImage"
                  ] = `https://varefiles.s3.us-east-2.amazonaws.com/meetingpic${index +
                    1}.jpg`;
                } else {
                  real[
                    "urlToImage"
                  ] = `https://varefiles.s3.us-east-2.amazonaws.com/meetingpic1.jpg`;
                }

                real["url"] = real.meeting_id
                  ? `/meeting?id=${real.meeting_id}`
                  : "";

                real[
                  "shareText"
                ] = `${real.description} | Author: ${real.author} | Topic: ${real.title} | Date: ${real.date}`;
                real["shareUrl"] = "";

                real["likes"] =
                  real.likes && Array.isArray(real.likes) ? real.likes : "";

                return (
                  <div key={"jghfgftssadaaadd" + index}>
                      <NewsCardList
                        storeUser={storeUser}
                        saveMessageLikes={saveMessageLikes}
                        shareItem={shareItem}
                        detailsIndex={detailsIndex}
                        videoUrl={videoUrl}
                        real={real}
                        index={index}
                      />
                    </div>
                );
              })
            : null}
        </Row>
      </div>
      <PageFooter />
    </div>
  );
};

const styleInfo = {
  wrapPadMyText: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMyText: {
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

export default Home;
