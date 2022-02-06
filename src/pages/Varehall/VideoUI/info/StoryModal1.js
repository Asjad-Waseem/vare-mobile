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

const NewsModal = ({
  setLoginUser,
  loginUser,
  info,
  onHandleQuery,
  activeUser,
  setActiveUser
}) => {
  const history = useHistory();
  const pathurl = useRef(history.location);
  const [videos, setVedeos] = useState([1, 2, 3, 4]);
  const [playIndex, setPlayIndex] = useState(-1);
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [userSource, setUserSource] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [newslimit, setNewsLimit] = useState(8);
  const [chatslimit, setChatslimit] = useState(2);
  const [gameslimit, setGameslimit] = useState(2);

  const [offset, setOffset] = useState(0);

  //call back from Component
  const [storyEnd, setStoryEnd] = useState(false);
  const storyIndex = useRef(0);

  const clientWidth = useRef();

  const [rawStoryData, setRawStoryData] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [statusState, setStatusState] = useState(-1);

  const correctColor = useRef();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    if (query && query.app && query.app == "vare") setUserSource("app");
    getAllLikes();
  }, [offset]);

  const onSendReply = useCallback((newStories = []) => {
    setStories(previousMessages => {
      // console.log("offset", offset);
      return newStories;
    });
  });

  const saveGameResponse = ({dragpoint}) => {
    console.log(
      "onDrag",
      dragpoint
      // "clientWidth",
      // clientWidth.current.clientWidth,
      // "clientHeight",
      // clientWidth.current.clientHeight,
      // "box width",
      // getOffset(clientWidth.current)
    );
    console.log(
      "parent length",
      clientWidth.current.clientWidth / 2 + getOffset(clientWidth.current).left
    );
    const middlePointX =
      clientWidth.current.clientWidth / 2 + getOffset(clientWidth.current).left;

    if (
      dragpoint &&
      dragpoint.clientX > middlePointX &&
      dragpoint.screenY > 240 &&
      dragpoint.screenY < 340
    ) {
      correctColor.current = "left";
      console.log("33");
    } else {
      correctColor.current = "right";
    }
  };

  const getColor = rep => {
    return rep.answer == "left" && correctColor.current == "left"
      ? "#2096F3"
      : rep.answer != "left" && correctColor.current == "left"
      ? "red"
      : "#f2f3f5";
  };

  const databaseSaveVote = async ({props, vote}) => {
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

  const getAllLikes = async () => {
    if (!(storeUser && storeUser.email)) {
      return;
    }
    const formData = {
      request: "search",
      query: {
        name: null
      },
      resource: "vare_user_likes",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
      // limit: limit,
      // skip: limit * offset
    };
    const result = await RESTCall.axiosQuery(formData).then(rep => {
      // if (rep && rep.data && rep.data.length > 0) setAllLikes(rep.data);
      getVareNews({likes: rep.data});
    });
  };

  const getVareNews = ({likes}) => {
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
        getGameContents({newsData: data, rawData, likes});
      }
    });
  };

  const getChatContents = async ({newsData, rawData, likes}) => {
    const formData = {
      request: "search",
      query: {
        public: true
      },
      id: "",
      resource: "vare_chats",
      orderBy: "dsc",
      sortBy: "createdAt",
      limit: chatslimit,
      skip: chatslimit * offset
    };
    // console.log("getChatContents1", formData);

    await RESTCall.axiosQuery(formData).then(response => {
      // console.log("getChatContents", formData, response);
      const rawDataNew = [...rawData];
      const data =
        response &&
        response.data &&
        response.data.length > 0 &&
        response.data
          // .splice(0, 5)
          .map((rep, index) => {
            // console.log("responsexx", rep);
            const QandAComponent = () => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    overflowX: "auto"
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
                              borderColor: "white",
                              margin: 5,
                              borderWidth: 2,
                              paddingRight: 10,
                              paddingLeft: 10,
                              borderRadius: 20,
                              // alignItems: "stretch",
                              // justifyContent: "center",
                              // alignSelf: "center",
                              // height: 30,
                              color: "white",
                              minWidth: myTitle.length * 10,
                              // flexDirection: "row"
                              flexWrap: "nowrap"
                            }}
                          >
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
                  <QandAComponent />
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
                  <QandAComponent />
                </div>
              );
            } else {
              storyInfo["url"] = rep.video ? rep.video : rep.image;
            }

            return storyInfo;
          });
      if (data.length > 0) {
        onSendReply([...data, ...newsData]);
        setRawStoryData(rawDataNew);
      }
    });
  };

  const getGameContents = async ({newsData, rawData, likes}) => {
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
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    overflowX: "auto"
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
                              borderColor: "white",
                              margin: 5,
                              borderWidth: 2,
                              paddingRight: 10,
                              paddingLeft: 10,
                              borderRadius: 20,
                              // alignItems: "stretch",
                              // justifyContent: "center",
                              // alignSelf: "center",
                              // height: 30,
                              color: "white",
                              minWidth: myTitle.length * 10,
                              // flexDirection: "row"
                              flexWrap: "nowrap"
                            }}
                          >
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
                  <QandAComponent />
                </div>
              )
            };
            // if (rep.video) storyInfo["type"] = "video";
            if (rep.imageLf && rep.imageRt) {
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
                      marginTop: 5
                    }}
                  >
                    {"Play me to increase your Vare Social Impact credits"}
                  </h3>
                  <h1 style={{marginTop: 5}}>{rep.comment}</h1>
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
                        background: getColor(rep),

                        width: "100%",
                        display: "flex",
                        borderWidth: 2,
                        borderColor: "white",
                        // padding: 5,
                        flexDirection: "row"
                      }}
                    >
                      <Draggable
                        grid={[10, 10]}
                        // axis='y'
                        // bounds="children"
                        // onStart={x => {
                        //   console.log("onStart", x);
                        // }}
                        onDrag={dragpoint => {
                          saveGameResponse({dragpoint});
                          console.log(
                            "onStop",
                            rep.answer,
                            correctColor.current
                          );
                        }}
                        // onStop={x => {
                        //   console.log("onStop", x);
                        // }}
                        // onMouseUp: This is event is evoked when the mouse is moved before stoping the drag.
                        // onMouseDown: Called when the mouse is clicked to begin drag.
                        // onTouchEnd: This is called in touch state before the drag ends.
                        // onTouchStart: In
                      >
                        <div
                          style={{
                            position: "absolute",
                            zIndex: 99999,
                            display: "flex",
                            textAlign: "center",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <img
                            src="https://varefiles.s3.us-east-2.amazonaws.com/09.jpg"
                            alt=""
                            className="handle"
                            style={{
                              // position: "absolute",
                              // top: 100,
                              // zIndex: 99999,
                              // marginRight: 40,
                              width: 40,
                              borderRadius: 100
                            }}
                          />
                        </div>
                      </Draggable>
                      <div
                        style={{
                          // background: getColor(rep),

                          // marginRight: 15,
                          padding: 20,
                          width: "50%",
                          display: "flex",
                          textAlign: "center",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        id="outer-dropzone"
                      >
                        <img
                          src="https://varefiles.s3.us-east-2.amazonaws.com/09.jpg"
                          alt=""
                          className=""
                          style={{
                            width: 150,
                            borderRadius: 100
                          }}
                        />
                      </div>
                      <div
                        style={{
                          // background: ,

                          padding: 20,
                          width: "50%",
                          // padding: 10,
                          display: "flex",
                          textAlign: "center",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        id="inner-dropzone"
                      >
                        <img
                          src="https://varefiles.s3.us-east-2.amazonaws.com/09.jpg"
                          alt=""
                          className=""
                          style={{width: 150, borderRadius: 100}}
                        />
                      </div>
                    </div>
                  </div>
                  <QandAComponent />
                </div>
              );
            } else {
              storyInfo["url"] = rep.video ? rep.video : rep.image;
            }

            return storyInfo;
          });
      if (data.length > 0) {
        onSendReply([...data, ...newsData]);
        setRawStoryData(rawDataNew);
      }
    });
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
          // loop={true}
          width={432}
          height={768}
        />
        <VareActionMenu myStoryIndex={myStoryIndex} />
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
        ) : null}
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
