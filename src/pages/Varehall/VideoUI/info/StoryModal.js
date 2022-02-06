import React, {Fragment, useState, useCallback, useEffect, useRef} from "react";
import {
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggl,
  Container,
  Col,
  Media,
  FormGroup,
  Progress,
  CardTitle,
  Label,
  Button
} from "reactstrap";
import PageMenu from "./PageMenu";
import UseAudio from "./UseAudio";
import ScrollAnimation from "react-animate-on-scroll";
import Picker from "emoji-picker-react";
import LiveChatComponent from "./LiveChatComponent";
import {RWebShare} from "react-web-share";

import queryString from "query-string";

import Draggable from "react-draggable";
// import {useDropzone} from "react-dropzone";

import moment from "moment";
import {useHistory} from "react-router-dom";
import RESTCall from "../../../../redux/actions/restApi";
import Stories from "react-insta-stories";
import PageFooter from "./PageFooter";

import {groupBy} from "../../helpers";
import Axios from "axios";
import useLocalStorage from "./localStorage";
const fullWidth = window.screen.width;
const fullHeight = window.screen.height;

const getOffset = el => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
};

const NewsModal = (
  {
    // setLoginUser,
    // loginUser,
    // info
    // onHandleQuery,
    // activeUser,
    // setActiveUser
  }
) => {
  const history = useHistory();
  const pathurl = useRef(history.location);
  const [videos, setVedeos] = useState([1, 2, 3, 4]);
  const [playIndex, setPlayIndex] = useState(-1);
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [userSource, setUserSource] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [newslimit, setNewsLimit] = useState(2);
  const [chatslimit, setChatslimit] = useState(2);
  const [gameslimit, setGameslimit] = useState(0);

  const [offset, setOffset] = useState(0);

  //call back from Component
  const [storyEnd, setStoryEnd] = useState(false);
  const storyIndex = useRef(0);

  const clientWidth = useRef();

  const [rawStoryData, setRawStoryData] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [statusState, setStatusState] = useState(-1);
  const [providerId, setProviderId] = useState(false);
  const [pageIcon, setPageIcon] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [stories, setStories] = useState([]);
  const metaImage = useRef(
    "https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"
  );

  // useEffect(() => {
  //   // alert(33);
  //   const query = queryString.parse(pathurl.current.search);
  //   // console.log("INFO", pathurl.current);
  //   if (query && query.app && query.app == "vare") setUserSource("app");
  //   if (query && query.share) {
  //     // console.log("ss", query.share);
  //     setItemId(query.share);
  //     setSharedVideo(true);
  //     setVideoUrl({});
  //   }
  //   if (
  //     !cookie.load("vare") &&
  //     query &&
  //     query.app &&
  //     query.app == "vare" &&
  //     query.id
  //     // pathurl.current.pathname.includes("podcast")
  //   ) {
  //     // alert(2);
  //     // console.log("INFO", query.id);
  //     getUserEmail(query.id);
  //   }
  //   getContent();
  // }, []);

  useEffect(() => {
    // console.log("offset");

    const query = queryString.parse(pathurl.current.search);
    if (query && query.app && query.app == "vare") setUserSource("app");

    if (query && query.share) {
      console.log("offset", query.share);

      getAllLikes({contentId: query.share});
    } else {
      getAllLikes({contentId: false});
    }

    // if (query && query.mypage) getPageIcon();
  }, [offset]);

  const getPageIcon = () => {
    // var link = document.querySelector("link[rel~='icon']");
    // if (!link) {
    //   link = document.createElement("link");
    //   link.rel = "icon";
    //   document.getElementsByTagName("head")[0].appendChild(pageIcon);
    // }
    // link.href = metaImage;
  };

  const onSendReply = useCallback((newStories = []) => {
    setStories(previousMessages => {
      // console.log("offset", offset);
      return newStories;
    });
  });

  const databaseSaveVote = async ({props, vote}) => {
    // alert(3);
    if (storeUser && storeUser.email) {
      const influencerInfo =
        !props.influencer_id || props.influencer_id == "NA"
          ? {}
          : {influencer_id: props.influencer_id};
      const dbVote = {
        ...influencerInfo,
        name: storeUser.name,
        img: storeUser.img,
        date: moment().format(),
        user_id: storeUser.user_id ? storeUser.user_id : storeUser.email,
        item_id: props["_id"],
        title: props["comment"],
        vote: vote,
        sex: storeUser.age,
        age: storeUser.age,
        race: storeUser.race,
        party: storeUser.party
      };
      // console.log("dbVote", storeUser, dbVote);
      // return;
      const formData = {
        request: "insert",
        query: dbVote,
        resource: "vare_chat_vote",
        check: ["item_id", "user_id"]
      };
      return await RESTCall.axiosQuery(formData)
        .then(response => {
          // console.log("postInfo", response);
          alert(
            'Your position has been saved.  Go to "My Reps" tab on the Vare App to see all your votes match with your Representatives.'
          );
          return response;
        })
        .catch(error => {
          return error;
        });
    }
  };

  const onEmojiClick = async (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) return emojiObject.emoji;
  };

  const getAllLikes = async ({contentId}) => {
    // if (!(storeUser && storeUser.email)) {
    //   return;
    // }
    const myQuery = contentId
      ? {
          item_id: contentId
        }
      : {
          name: null
        };

    const formData = {
      request: "search",
      query: {
        ...myQuery
      },
      resource: "vare_user_likes",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
      // limit: limit,
      // skip: limit * offset
    };
    await RESTCall.axiosQuery(formData)
      .then(rep => {
        // if (rep && rep.data && rep.data.length > 0) setAllLikes(rep.data);
        getVareNews({likes: rep.data, contentId});
        return rep;
      })
      .catch(err => {
        // if (rep && rep.data && rep.data.length > 0) setAllLikes(rep.data);
        getVareNews({likes: [], contentId});
        return err;
      });
  };

  const getVareNews = ({likes, contentId}) => {
    // if (newslimit == 0) {
    //   getGameContents({newsData: [], rawData: [], likes, contentId});
    //   return;
    // }
    const formData = {
      request: "get",
      resource: "vare_contents",
      // id: "",
      orderBy: "dsc",
      sortBy: "date",
      limit: newslimit,
      skip: newslimit * offset
    };
    RESTCall.axiosQuery(formData).then(response => {
      // console.log("response", formData, response);
      const rawData = [];
      const data =
        response &&
        response.data &&
        response.data.data &&
        response.data.data.length > 0 &&
        response.data.data
          // .splice(0, 5)
          // .filter(real => real.author && real.content && real.urlToImage)
          .map((rep, index) => {
            // console.log("responsexx", rep);

            const likeIndex =
              likes &&
              Array.isArray(likes) &&
              likes.findIndex(repx => {
                return repx.item_id == rep._id;
              });

            if (likeIndex > -1) rep["like"] = likes[likeIndex].like;
            // if (rep.views) rep["views"] = JSON.parse(rep.views);
            rawData.push(rep);
            const storyInfo = {
              header: {
                heading:
                  (rep.name == "Oluwalowo Oluwadamilola"
                    ? "Vare Media"
                    : rep.name) +
                  " | " +
                  rep.title,
                subheading: moment(rep.date || moment.now()).fromNow(),
                profileImage: rep.img
              },
              url: rep.video ? rep.video : rep.picture,
              duration: 5000,
              seeMore: ({close}) => {
                return <div onClick={close}>Hello, click to close this.</div>;
              },
              seeMoreCollapsed: ({toggleMore, action}) => (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    top: -240,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  <span
                    style={{
                      color: "red"
                    }}
                    onClick={() => {
                      action("pause");
                      window.open(rep.url, "_blank");
                    }}
                  >
                    View Story
                  </span>
                </div>
              )
            };
            if (rep.video) storyInfo["type"] = "video";

            return storyInfo;
          });
      // console.log("hhh", data);
      if (data.length > 0) {
        // onSendReply(data);
        // setRawStoryData(rawData)
        // getChatContents({newsData: data, rawData, likes});
        getGameContents({newsData: data, rawData, likes, contentId});
      } else {
        getGameContents({newsData: [], rawData, likes, contentId});
      }
    });
  };

  const getChatContents = async ({newsData, rawData, likes, contentId}) => {
    // if (chatslimit == 0) {
    //   onSendReply([...newsData]);
    //   setRawStoryData(rawData);
    //   return;
    // }
    const myQuery = contentId
      ? {
          content_id: contentId,
          public: true
        }
      : {
          public: true
        };
    const formData = {
      request: "search",
      query: {
        ...myQuery
      },
      id: "",
      resource: "vare_chats",
      orderBy: "dsc",
      sortBy: "date",
      limit: chatslimit,
      skip: chatslimit * offset
    };
    // console.log("getChatContents1", formData);

    await RESTCall.axiosQuery(formData).then(response => {
      console.log("getChatContents", formData, response);
      const rawDataNew = [...rawData];
      const data =
        response &&
        response.data &&
        response.data.length > 0 &&
        response.data
          // .splice(0, 5)
          .map((rep, index) => {
            const QandAChatComponent = () => {
              if (rep.image) {
                metaImage.current = rep.image;
              } else {
                // console.log("props", metaImage.current);
                metaImage.current =
                  "https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg";
              }
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    overflowX: "auto",
                    // backgroundColor: "red",
                    // backgroundColor: "rgba(0,0,0,.70)",
                    paddingBottom: 30
                    // borderBottomRightRadius: "25%",
                    // borderBottomLeftRadius: "25%"
                  }}
                >
                  {rep.quickReplies &&
                  rep.quickReplies.values &&
                  rep.quickReplies.values.length > 0
                    ? rep.quickReplies.values.map((item, index) => {
                        // console.log("item", item);
                        const {title} = item;
                        const myTitle =
                          title &&
                          title.charAt(0).toUpperCase() + title.slice(1);
                        // console.log("ss", myTitle.length);
                        return (
                          <div
                            key={"slsdishiwe" + index}
                            onClick={() => {
                              databaseSaveVote({
                                props: rep,
                                vote: title
                              });
                            }}
                            style={{
                              backgroundColor:
                                statusState == item._id
                                  ? "#87CEFA"
                                  : "rgba(0,0,0,.70)",
                              borderColor: "#cfcfc4",
                              // margin: 5,
                              borderWidth: 2,
                              paddingRight: 5,
                              paddingLeft: 5,
                              borderRadius: 20,
                              // alignItems: "stretch",
                              // justifyContent: "center",
                              // alignSelf: "center",
                              // height: 30,
                              color: "#cfcfc4",
                              minWidth: myTitle.length * 10,
                              // flexDirection: "row"
                              flexWrap: "nowrap",
                              borderRadius: 40,
                              marginRight: 10,
                              border: "2px solid rgba(255, 255, 255, 0.8)"
                            }}
                          >
                            <i
                              style={{
                                // marginTop: 3
                                paddingRight: 5
                              }}
                              className={`fas fa-question-circle`}
                            />
                            {myTitle}
                          </div>
                        );
                      })
                    : null}
                </div>
              );
            };
            const likeIndex =
              likes &&
              Array.isArray(likes) &&
              likes.findIndex(repx => {
                return repx.item_id == rep._id;
              });

            if (likeIndex > -1) rep["like"] = likes[likeIndex].like;
            // if (rep.views) rep["views"] = JSON.parse(rep.views);
            rawDataNew.unshift(rep);
            const storyInfo = {
              header: {
                heading:
                  (rep.name == "Oluwalowo Oluwadamilola"
                    ? "Vare Media"
                    : rep.name) +
                  " | " +
                  rep.comment,
                subheading: moment(rep.createdAt || moment.now()).fromNow(),
                profileImage: rep.img
              },

              duration: 5000,
              seeMore: ({close}) => {
                return <div onClick={close}>Hello, click to close this.</div>;
              },
              seeMoreCollapsed: ({toggleMore, action}) => (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    top: -240,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  <span
                    style={{
                      color: "red"
                    }}
                    onClick={() => {
                      action("pause");
                      window.open(rep.url, "_blank");
                    }}
                  >
                    View Story
                  </span>
                  <QandAChatComponent />
                </div>
              )
            };
            if (rep.video) storyInfo["type"] = "video";
            if (!rep.video && !rep.image) {
              storyInfo["content"] = props => (
                <div
                  style={{
                    flexDirection: "column"
                  }}
                >
                  <div style={{background: "pink", padding: 20}}>
                    <h1 style={{marginTop: "100%", marginBottom: 0}}>🌝</h1>
                    <h1 style={{marginTop: 5}}>{rep.comment}</h1>
                  </div>
                  <QandAChatComponent />
                </div>
              );
            } else {
              // storyInfo["url"] = rep.video ? rep.video : rep.image;
              //TODO

              storyInfo["content"] = props => (
                <div
                  style={{
                    top: 20,
                    // backgroundColor: "#f2f3f5",
                    backgroundColor: "black",
                    position: "absolute",
                    height: "inherit",
                    width: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    // background: `url(${rep.image}) no-repeat`,
                    backgroundSize: "contain"
                    // alignItems: "center"
                    // alignContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 20,
                      alignItems: "flex-start",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={rep.img}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                        marginRight: 10,
                        border: "2px solid rgba(255, 255, 255, 0.8)"
                      }}
                    />
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          // color: "gray",
                          color: "white",
                          fontWeight: "bold",
                          // color: "rgba(255, 255, 255, 0.9)",
                          margin: "0px 0px 2px"
                        }}
                      >
                        {rep.name == "Oluwalowo Oluwadamilola"
                          ? "Vare Media"
                          : rep.name + " | " + rep.comment}
                      </p>
                      <p
                        style={{
                          color: "white",
                          fontWeight: "bold"
                          // color: "rgba(255, 255, 255, 0.9)"
                        }}
                      >
                        {moment(rep.createdAt || moment.now()).fromNow()}
                      </p>
                    </span>
                  </div>
                  {rep.image ? (
                    <img
                      src={rep.image}
                      alt=""
                      className=""
                      style={{
                        // marginTop: 5,
                        // marginLeft: 20,
                        // borderRadius: 40,
                        width: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : rep.video ? (
                    <video
                      // height={isMobile ? '100%' : 220}
                      autoPlay
                      // loop="loop"
                      muted="muted"
                      volume="0"
                    >
                      <source src={{uri: rep.video}} type="video/mp4" />
                      <source src="movie.ogg" type="video/ogg" />
                      Your browser does not support the video tag.{" "}
                    </video>
                  ) : null}
                  <div
                    style={{
                      zIndex: 999999,
                      width: "100%",
                      height: "100%"
                    }}
                  >
                    <ShareComponent {...rep} />
                    <EmojiComponent {...rep} />
                    <div
                      style={{
                        alignItems: "flex-start",
                        paddingLeft: 20
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          marginTop: 5,
                          color: "#f2f3f5"
                        }}
                      >
                        {"Stroy"}
                      </div>
                      <p style={{color: "#cfcfc4"}}>{rep.text}</p>
                      <div
                        style={{
                          fontWeight: "bold",
                          marginTop: 5,
                          paddingBottom: 3,
                          color: "#f2f3f5"
                        }}
                      >
                        {"Reaction"}
                      </div>
                      <QandAChatComponent />
                    </div>
                  </div>
                  <LiveChatComponent
                    saveChatList={chat => {
                      // saveChatList(chat);
                    }}
                    updatChatList={chat => {
                      // updatChatList(chat);
                    }}
                  />
                </div>
              );
            }
            // console.log("bbb", storyInfo);
            return storyInfo;
          });
      if (data.length > 0) {
        onSendReply([...data, ...newsData]);
        setRawStoryData(rawDataNew);
      } else {
        onSendReply([...newsData]);
        setRawStoryData(rawDataNew);
      }
    });
  };

  const getGameContents = async ({newsData, rawData, likes, contentId}) => {
    // if (gameslimit == 0) {
    //   getChatContents({
    //     newsData: [],
    //     rawData: rawData,
    //     likes,
    //     contentId
    //   });
    //   return;
    // }
    const formData = {
      request: "search",
      query: {
        public: true
      },
      id: "",
      resource: "vare_games",
      orderBy: "dsc",
      sortBy: "createdAt",
      limit: gameslimit,
      skip: gameslimit * offset
    };
    // console.log("getChatContents1", formData);

    await RESTCall.axiosQuery(formData).then(response => {
      // console.log("getChatContents", formData, response);
      const rawDataNew = rawData ? [...rawData] : [];
      const data =
        response &&
        response.data &&
        response.data.length > 0 &&
        response.data
          // .splice(0, 5)
          .map((rep, index) => {
            // console.log("responsexx", rep);
            const QandAComponent = () => {
              const [correctColor, setCorrectColor] = useState(false);
              const [play, setPlay] = useState(false);
              var audio = useRef(new Audio());

              useEffect(() => {
                // console.log("correctColor", correctColor);
              }, [correctColor]);

              return (
                <div
                  key={"assssla" + index}
                  style={{
                    background: correctColor.value,
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    overflowX: "auto"
                  }}
                >
                  {correctColor ? (
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(0,0,0,.50)",
                        // height: 40,
                        // width: 40,
                        // borderRadius: 100,
                        position: "absolute",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 14,
                        padding: 20
                      }}
                    >
                      {correctColor && correctColor.value == "#2096F3"
                        ? `Congrats, you nailed it!! Correct answer is (${rep.quickReplies.answer.toUpperCase()}). Keep playing to enter earn 1000 Units and be automatically entered to win up to $500`
                        : "Sorry, wrong answer!! Keep playing to enter earn 1000 Units and be automatically entered to win up to $500"}
                    </div>
                  ) : null}
                  {rep.quickReplies &&
                  rep.quickReplies.values &&
                  rep.quickReplies.values.length > 0
                    ? rep.quickReplies.values.map((item, index) => {
                        // console.log("item", index);
                        const {title, value, image, video} = item;
                        const myTitle =
                          title &&
                          title.charAt(0).toUpperCase() + title.slice(1);
                        // console.log("ss", myTitle.length);
                        return (
                          <div
                            key={"slsdishiwe" + index}
                            style={{
                              // border: correctAnswer.current == value ? '#2096F3' : 'red',
                              padding: 20,
                              width: "50%",
                              // padding: 10,
                              display: "flex",
                              textAlign: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column"
                            }}
                            id="inner-dropzone"
                          >
                            <img
                              src={image}
                              alt=""
                              className=""
                              style={{width: 150, borderRadius: 100}}
                            />
                            <div
                              style={{
                                color: "white",
                                fontWeight: "bold"
                              }}
                            >
                              {title}
                            </div>
                            <div
                              style={{
                                backgroundColor: "rgba(0,0,0,.50)",
                                height: 40,
                                width: 40,
                                borderRadius: 100,
                                position: "absolute",
                                zIndex: 9,
                                color: "white",
                                borderColor:
                                  correctColor &&
                                  correctColor.value &&
                                  rep.quickReplies &&
                                  rep.quickReplies.answer &&
                                  rep.quickReplies == value
                                    ? "#2096F3"
                                    : "white",
                                border: "solid"
                              }}
                            >
                              <div
                                onClick={() => {
                                  // alert(3);
                                  if (!(storeUser && storeUser.email)) {
                                    alert("Please login to use this feature");
                                    return;
                                  }
                                  if (!correctColor) {
                                    setCorrectColor({
                                      value:
                                        rep.quickReplies &&
                                        rep.quickReplies.answer &&
                                        value &&
                                        value == rep.quickReplies.answer
                                          ? "#2096F3"
                                          : rep.quickReplies &&
                                            rep.quickReplies.answer &&
                                            value &&
                                            value != rep.quickReplies.answer
                                          ? "red"
                                          : "white",
                                      color: index
                                    });
                                    setTimeout(() => {
                                      if (
                                        rep.quickReplies &&
                                        rep.quickReplies.answer &&
                                        value &&
                                        value == rep.quickReplies.answer
                                      ) {
                                        // alert(
                                        //   "Congrats, you nailed it!  You have earned 30 units of Vare Social Knowledge credits.  Keep playing to enter earn 1000 Units and be automatically entered to win up to $500"
                                        // );
                                        audio.current.src =
                                          "https://varefiles.s3.us-east-2.amazonaws.com/correct_answer.mp3";
                                        audio.current.play();
                                        setTimeout(() => {
                                          audio.current.pause();
                                          audio.current.currentTime = 0;
                                        }, 5000);
                                      } else {
                                        // alert(
                                        //   "Sorry, wrong answer! Keep playing to enter earn 1000 Units and be automatically entered to win up to $500"
                                        // );
                                        audio.current.src =
                                          "https://varefiles.s3.us-east-2.amazonaws.com/wrong_answer.mp3";
                                        audio.current.play();
                                        setTimeout(() => {
                                          audio.current.pause();
                                          audio.current.currentTime = 0;
                                        }, 5000);
                                      }
                                    }, 500);
                                  }
                                }}
                                style={{
                                  textAlign: "center",
                                  marginTop: 6,
                                  fontSize: 14,
                                  borderColor:
                                    correctColor &&
                                    correctColor.value &&
                                    correctColor.color &&
                                    correctColor.color == index
                                      ? correctColor.value
                                      : "white"
                                }}
                              >
                                {value}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              );
            };
            const likeIndex =
              likes &&
              Array.isArray(likes) &&
              likes.findIndex(repx => {
                return repx.item_id == rep._id;
              });

            if (likeIndex > -1) rep["like"] = likes[likeIndex].like;
            // if (rep.views) rep["views"] = JSON.parse(rep.views);
            rawDataNew.unshift(rep);
            const storyInfo = {
              header: {
                heading:
                  (rep.name == "Oluwalowo Oluwadamilola"
                    ? "Vare Media"
                    : rep.name) +
                  " | " +
                  rep.comment,
                subheading: moment(rep.createdAt || moment.now()).fromNow(),
                profileImage: rep.img
              },

              duration: rep.quickReplies ? 20000 : 5000,
              seeMore: ({close}) => {
                return <div onClick={close}>Hello, click to close this.</div>;
              },
              customCollapsedComponent: ({toggleMore, action}) => (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 5,
                    top: -240,
                    width: "100%",
                    textAlign: "center"
                  }}
                >
                  {rep.url && (
                    <span
                      style={{
                        color: "red"
                      }}
                      onClick={() => {
                        action("pause");
                        window.open(rep.url, "_blank");
                      }}
                    >
                      View Story
                    </span>
                  )}
                </div>
              )
            };
            // if (rep.video) storyInfo["type"] = "video";

            storyInfo["content"] = props => (
              <div
                ref={clientWidth}
                style={{
                  flexDirection: "column",
                  // display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  with: "100%"
                }}
              >
                <h3
                  style={{
                    marginTop: 5,
                    paddingLeft: 30,
                    paddingRight: 30
                  }}
                >
                  {"Play me to increase your Vare Social Impact credits"}
                </h3>
                <h1 style={{marginTop: 5, paddingLeft: 30, paddingRight: 30}}>
                  {rep.comment}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    with: "100%",
                    background: "pink"
                    // padding: 20
                  }}
                >
                  <div
                    style={{
                      // background: getColor(rep),

                      width: "100%",
                      display: "flex",
                      borderWidth: 2,
                      borderColor: "white",
                      // padding: 5,
                      flexDirection: "row"
                    }}
                  >
                    <QandAComponent />
                  </div>
                </div>
              </div>
            );

            return storyInfo;
          });
      if (data.length > 0) {
        getChatContents({
          newsData:
            newsData && newsData.length > 0 && data && data.length > 0
              ? [...data, ...newsData]
              : !(newsData && newsData.length > 0)
              ? data
              : !(data && data.length > 0)
              ? newsData
              : [],
          rawData: rawDataNew,
          likes,
          contentId
        });

        // onSendReply([...data, ...newsData]);
        // setRawStoryData(rawDataNew);
      } else {
        getChatContents({
          newsData: [],
          rawData: rawDataNew,
          likes,
          contentId
        });
      }
    });
  };

  const ShareComponent = props => {
    const [commentsLength, setCommentsLength] = useState();
    const {content_id, text} = props;

    // useEffect(() => {
    //   if (props.image) setMetaImage(props.image);
    // }, []);
    //
    // console.log("props", props);

    return (
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          borderRadius: 25,
          backgroundColor: "red",
          backgroundColor: "rgba(0,0,0,.64)",
          width: 40,
          flexDirection: "column"
        }}
      >
        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            // paddingTop: 20,
            paddingTop: 5,
            marginBottom: 0,
            textAlign: "center"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3,
              textAlign: "center",
              color: "white"
            }}
            // name={"times"}
            className={`fas fa-2x fa-play`}
          />
        </div>

        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            paddingTop: 20,
            textAlign: "center",
            flexDirection: "column"
          }}
        >
          <i
            style={{
              marginTop: 3,
              textAlign: "center",
              color: "white"
            }}
            className={`fas fa-2x fa-comments`}
          />
          {commentsLength ? (
            <div
              style={{
                color: "white",
                fontSize: 9
              }}
            >
              2322K
            </div>
          ) : null}
        </div>
        <div
          style={{
            paddingTop: 20,
            marginBottom: 0,
            textAlign: "center",
            paddingBottom: 5
          }}
        >
          <RWebShare
            data={{
              text: content_id,
              url: content_id
                ? `https://www.varehall.com/story/?share=${content_id}`
                : window.location.href,
              title: text
            }}
            onClick={() => {
              // shareItem(real);
            }}
          >
            <i
              style={{
                //marginBottom: 6,
                marginTop: 3,
                textAlign: "center",
                color: "white"
              }}
              // name={"times"}
              className={`fas fa-2x fa-paper-plane`}
            />
          </RWebShare>
        </div>
      </div>
    );
  };

  const EmojiComponent = () => {
    return (
      <div
        style={{
          backgroundColor: "red",
          backgroundColor: "rgba(0,0,0,.14)",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          paddingTop: 20
        }}
      >
        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            height: 40,
            width: 40,
            marginBottom: 0,
            padding: 5,
            textAlign: "center",
            fontSize: 20
          }}
        >
          🌝
        </div>
        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            height: 45,
            width: 45,
            marginLeft: 20,
            marginBottom: 0,
            padding: 5,
            // alignItems: "center",
            textAlign: "center",
            fontSize: 20
            // justifyContent: "center",
            // alignSelf: "center"
          }}
        >
          ❤️
        </div>
        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            height: 50,
            width: 50,
            marginLeft: 20,
            marginBottom: 0,
            padding: 5,
            fontSize: 20,
            textAlign: "center"
          }}
        >
          💪🏼
        </div>
        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            height: 45,
            width: 45,
            marginLeft: 20,
            marginBottom: 0,
            padding: 5,
            fontSize: 20,
            textAlign: "center"
          }}
        >
          👍🏾
        </div>

        <div
          onClick={() => {
            alert("smile");
          }}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            height: 40,
            width: 40,
            marginLeft: 20,
            marginBottom: 0,
            padding: 5,
            fontSize: 20,
            textAlign: "center"
          }}
        >
          🙏🏼
        </div>
      </div>
    );
  };

  const VareActionMenu = ({myStoryIndex}) => {
    const [stateLike, setStateLike] = useState([]);
    const [messageInfo, setMessageInfo] = useState(false);

    useEffect(() => {
      setStateLike(allLikes);
    }, [allLikes]);

    useEffect(() => {
      const messageInfo =
        allLikes &&
        myStoryIndex &&
        rawStoryData[myStoryIndex] &&
        allLikes.findIndex(rep => {
          return (
            rawStoryData[myStoryIndex] &&
            rep.item_id == rawStoryData[myStoryIndex]["_id"] &&
            rawStoryData[myStoryIndex].like
          );
        });
    }, [myStoryIndex]);

    const saveLike = async ({message, like}) => {
      if (!(storeUser && storeUser.email)) {
        alert("Please login to use this feature");
        return;
      }
      const formData = {
        request: "insert",
        query: {
          date: moment().format(),
          like: like == true ? false : true,
          user_id: storeUser.user_id,
          item_id: message._id,
          category: "vare_contents"
        }, //add table key value to edit
        resource: "vare_user_likes", //add table name
        check: ["item_id", "user_id"]
      };

      // console.log("formData", formData);

      const result = await RESTCall.axiosQuery(formData).then(contents => {
        return "done";
      });
    };

    return (
      <div
        style={{
          display: "flex",
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,.14)",
          // paddingLeft: "80%",
          top: "45%",
          position: "absolute",
          zIndex: 99999,
          right: "10%",
          width: 50,
          alignItems: "center",
          // paddingRight: 10,
          flexDirection: "column"
        }}
      >
        <div
          onClick={() => {
            const message =
              storyIndex.current &&
              myStoryIndex &&
              rawStoryData[storyIndex.current] &&
              rawStoryData[storyIndex.current];
            // : rawStoryData[0];

            if (message && storyIndex.current)
              saveLike({
                message: message,
                like: message.like
              }).then(rex => {
                // getAllLikes(storeUser.user_id);
              });
          }}
          style={{
            flexDirection: "column",
            paddingBottom: 10,
            paddingTop: 10,
            color: "white"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3,
              textAlign: "center",
              color:
                myStoryIndex && rawStoryData[myStoryIndex].like == true
                  ? "#2096F3"
                  : "white"
            }}
            // name={"times"}
            className={`fas fa-2x fa-heart`}
          />
          <div
            style={{
              fontSize: 10,
              marginTop: 3,
              textAlign: "center"
            }}
          >
            11
          </div>
        </div>
        <div
          style={{
            flexDirection: "column",
            paddingBottom: 10,
            // paddingTop: 10,
            color: "white"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3,
              textAlign: "center"
            }}
            // name={"times"}
            className={`fas fa-2x fa-comment`}
          />
          <div
            style={{
              fontSize: 10,
              marginTop: 3,
              textAlign: "center"
            }}
          >
            33
          </div>
        </div>

        <div
          style={{
            flexDirection: "column",
            paddingBottom: 10,
            // paddingTop: 10,
            color: "white"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3,
              textAlign: "center"
            }}
            // name={"times"}
            className={`fas fa-2x fa-share`}
          />
          <div
            style={{
              fontSize: 10,
              marginTop: 3,
              textAlign: "center"
            }}
          >
            33
          </div>
        </div>

        <div
          style={{
            flexDirection: "column",
            paddingBottom: 10,
            // paddingTop: 10,
            color: "white"
          }}
        >
          <i
            style={{
              //marginBottom: 6,
              marginTop: 3
            }}
            // name={"times"}
            className={`fas fa-2x fa-ellipsis-v`}
          />
        </div>
      </div>
    );
  };

  const PaginationMenu = () => {
    return (
      <>
        {storyEnd ? (
          <div
            style={{
              // backgroundColor: "#2096F3",
              bottom: 80,
              position: "absolute",
              zIndex: 99999,
              width: 432,
              textAlign: "center"
            }}
          >
            {offset != 0 ? (
              <span
                style={{
                  paddingRight: 50,
                  color: "white"
                }}
                onClick={() => {
                  setOffset(offset - 1);
                }}
              >
                <i
                  style={{
                    //marginBottom: 6,
                    marginTop: 3,
                    textAlign: "center"
                  }}
                  // name={"times"}
                  className={`fas fa-arrow-circle-left`}
                />{" "}
                Jump Back
              </span>
            ) : null}
            <span
              style={{
                color: "white"
              }}
              onClick={() => {
                setOffset(offset + 1);
              }}
            >
              Jump Forward{" "}
              <i
                style={{
                  //marginBottom: 6,
                  marginTop: 3,
                  textAlign: "center"
                }}
                // name={"times"}
                className={`fas fa-arrow-circle-right`}
              />
            </span>
          </div>
        ) : null}
      </>
    );
  };

  const NewStories = props => {
    const {stories, setStoryEnd, setOffset, storyIndex} = props;
    const [myStoryIndex, setMyStoryIndex] = useState(0);

    const savediv = async ({message}) => {
      if (!(storeUser && storeUser.email)) {
        alert("Please login to use this feature");
        return;
      }
      const formData = {
        request: "insert",
        query: {
          date: moment().format(),
          user_id: storeUser.user_id,
          item_id: message._id,
          category: "vare_contents",
          installId: "na"
        }, //add table key value to edit
        resource: "vare_views", //add table name
        check: ["item_id", "user_id"]
      };
      const result = await RESTCall.axiosQuery(formData).then(contents => {
        return "done";
      });
    };

    return (
      <>
        <Stories
          onStoryStart={info => {
            storyIndex.current = info;
            setStoryEnd(false);
            setMyStoryIndex(info);
            // const message =
            //   info && rawStoryData[info] ? rawStoryData[info] : rawStoryData[0];
            // // savediv({message});
          }}
          onAllStoriesEnd={() => {
            setStoryEnd(true);
            setOffset(offset + 1);
          }}
          stories={stories}
          defaultInterval={1500}
          // loop={false}
          width={432}
          height={768}
        />
        {/*<VareActionMenu myStoryIndex={myStoryIndex} />*/}
      </>
    );
  };
  //
  return (
    <>
      {/*userSource && userSource == "app" ? null : <PageMenu />*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
          // height: fullHeight,
          backgroundColor: "#111111"
        }}
      >
        {stories && stories.length > 0 ? (
          <NewStories
            storyIndex={storyIndex}
            setOffset={setOffset}
            stories={stories}
            setStoryEnd={setStoryEnd}
          />
        ) : (
          <div
            style={{
              // paddingTop: 90,
              width: "100%"
              // alignItems: "center",
              // justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                width: fullWidth,
                marginTop: 65,
                height: 200,
                backgroundRepeat: "repeat-x",
                backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"}`,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center"
              }}
            ></div>
            <div
              style={{
                height: "100%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                padding: 50,
                color: "white"
              }}
            >
              {"No new stories in this category"}
            </div>
          </div>
        )}
        <PaginationMenu />
      </div>
      {userSource && userSource == "app" ? null : <PageFooter />}
    </>
  );
};

const styleInfo = {
  outer_dropzone: {height: "140px"},
  inner_dropzone: {height: "80px"},
  dropzone: {
    backgroundColor: "#bfe4ff",
    border: "dashed 4px transparent",
    borderRadius: "4px",
    margin: "10px auto 30px",
    padding: "10px",
    width: "80%",
    transition: "background-color 0.3s"
  },
  drop_active: {borderColor: "#aaa"},
  drop_target: {
    backgroundColor: "#29e",
    borderColor: "#fff",
    borderStyle: "solid"
  },
  drag_drop: {
    display: "inline-block",
    minWidth: "40px",
    padding: "2em 0.5em",
    margin: "1rem 0 0 1rem",
    color: "#fff",
    backgroundColor: "#29e",
    border: "solid 2px #fff",
    touchAction: "none",
    transform: "translate(0px, 0px)",
    transition: "background-color 0.3s"
  },
  drag_drop_can_drop: {color: "#000", backgroundColor: "#4e4"}
};

export default NewsModal;
