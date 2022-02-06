import React, {useState, useEffect, useRef} from "react";

import "./select.css";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import "../../info.css";
import "../../../../assets/css/sass/_gogo.style.scss";

import {Row} from "reactstrap";
import queryString from "query-string";
import {useHistory} from "react-router-dom";
import TextInput from "react-autocomplete-input";

import NewsCardList from "./NewsCardList";
import PageModal from "./PageModal";
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";

import RESTCall from "../../../../redux/actions/restApi";
import useLocalStorage from "./localStorage";

const NewsModal = ({
  activeUser,
}) => {

  const history = useHistory();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(-1);

  const [podcastMedia, setPodcastMedia] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [searchPodcastMedia, setSearchPodcastMedia] = useState([]);
  const [storedPodcastMedia, setStoredPodcastMedia] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [userSource, setUserSource] = useState(false);
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [videoUrl, setVideoUrl] = useState({});
  const [shareItem, setShareItem] = useState({});

  const pathurl = useRef(history.location);

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    if (query && query.app && query.app == "vare") setUserSource("app");
    getNews();
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      setPodcastMedia(
        searchPodcastMedia.length > 0 ? [...searchPodcastMedia] : []
      );
    } else {
      setPodcastMedia([...storedPodcastMedia]);
    }
  }, [storedPodcastMedia, searchPodcastMedia, searchText]);

  useEffect(() => {
  }, [selectedValue]);
  useEffect(() => {
  }, [detailsIndex]);

  useEffect(() => {
  }, [podcastMedia, shareItem]);

  const handleAllNotice = () => {};

  const getNewsAPI = async () => {
    const newsurl =
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=904fe7cb2cd4412593c3326ccc240c04";
    let result = await fetch(newsurl).then(response => response.json());
    if (result && result.articles) saveNews(result.articles);
    return result.articles;
  };

  const saveNews = async articles => {
    return await Promise.all(
      articles.map(rep => {
        const formData = {
          request: "insert",
          query: rep,
          resource: "vare_news_feeds",
          check: ["publishedAt", "author"]
        };
        return RESTCall.axiosQuery(formData).then(response => {
          return response;
        });
      })
    );
  };

  const getNews = () => {
    const formData = {
      request: "search",
      query: {
        name: null
      },
      resource: "vare_news_feeds",
      id: "",
      orderBy: "dsc",
      sortBy: "publishedAt"
    };
    RESTCall.axiosQuery(formData).then(response => {
      console.log("response", response);

      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              return rep;
            })
          : [];
      if (data.length > 0) setStoredPodcastMedia([...data]);
    });
  };

  const saveMessageLikes = async message => {
    const temp = {...message};
    delete temp["_id"];
    const formData = {
      request: "insert",
      query: {
        ...temp
      }, //add table key value to edit
      resource: "vare_news_feeds", //add table name
      check: ["author", "publishedAt"]
    };
    return await RESTCall.axiosQuery(formData).then(contents => {
      getNews();
      return contents;
    });
  };

  return (
    <React.Fragment>
      {userSource && userSource == "app" ? null : <PageMenu />}
      <div
        style={{
          display: "flex",
          marginTop: 65,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"}`,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
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
                  podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.filter(rep => {
                    return JSON.stringify(rep)
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
                setSearchPodcastMedia(newItem);
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
          width: "100%"
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          {"360 News Updates"}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginRight: "20px"
        }}
      >
        <Row
          style={{
            marginLeft: "20px",
            marginRight: "20px"
          }}
        >
          <div
            className="row"
            style={{
              paddingBottom: 80,
              justifyContent: "center"
            }}
          >
            {" "}
            {videoUrl && videoUrl.video ? (
              <PageModal
                activeUser={activeUser}
                setActiveUser={() => {
                  setModalIsOpen(false);
                  setVideoUrl({});
                }}
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
                myWidth={350}
                myHeight={400}
              >
                <video
                  width="350"
                  height="400"
                  key={videoUrl._id}
                  controls
                  autoPlay
                >
                  <source src={videoUrl.video} />
                </video>
              </PageModal>
            ) : null}
            {podcastMedia && podcastMedia.length > 0
              ? podcastMedia.map((real, index) => {
                  return (
                    <div key={"jghfgft" + index}>
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
          </div>
        </Row>
      </div>
      {userSource && userSource == "app" ? null : <PageFooter />}
    </React.Fragment>
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

export default NewsModal;
