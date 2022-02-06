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
import FlatList from "flatlist-react";

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

  const [newslimit, setNewsLimit] = useState(9);
  const [chatslimit, setChatslimit] = useState(1);

  const [offset, setOffset] = useState(0);

  //call back from Component
  const [storyEnd, setStoryEnd] = useState(false);
  const storyIndex = useRef(0);

  const [rawStoryData, setRawStoryData] = useState([]);
  const [allLikes, setAllLikes] = useState([]);

  const [stories, setStories] = useState(
    // false
    [
      // {
      //   header: {
      //     heading: "Mohit Karekar",
      //     subheading: "Posted 30m ago",
      //     profileImage: "https://varefiles.s3.us-east-2.amazonaws.com/08.jpg"
      //   },
      //   url: "https://varefiles.s3.us-east-2.amazonaws.com/08.jpg",
      //   duration: 5000,
      //   seeMore: ({close}) => {
      //     return <div onClick={close}>Hello, click to close this.</div>;
      //   },
      //   seeMoreCollapsed: ({toggleMore, action}) => (
      //     <h2
      //       onClick={() => {
      //         action("pause");
      //         window.open("https://mywebsite.url", "_blank");
      //       }}
      //     >
      //       More Details
      //     </h2>
      //   )
      // },
      // {
      //   header: {
      //     heading: "Mohit Karekar",
      //     subheading: "Posted 30m ago",
      //     profileImage: "https://varefiles.s3.us-east-2.amazonaws.com/08.jpg"
      //   },
      //   url: "https://varefiles.s3.us-east-2.amazonaws.com/09.jpg",
      //   duration: 2000,
      //   seeMore: ({close}) => {
      //     return (
      //       <div
      //         style={{
      //           height: "100%",
      //           width: "100%",
      //           backgroundColor: "red"
      //         }}
      //         onClick={close}
      //       >
      //         Hello, click to close this.
      //       </div>
      //     );
      //   }
      // }
      // {
      //   header: {
      //     heading: "Mohit Karekar",
      //     subheading: "Posted 30m ago",
      //     profileImage: "https://varefiles.s3.us-east-2.amazonaws.com/08.jpg"
      //   },
      //   url: "https://varefiles.s3.us-east-2.amazonaws.com/how-to-use-vare.mp4",
      //   duration: 5000, // ignored
      //   type: "video",
      //   seeMore: ({close}) => {
      //     return <div onClick={close}>Hello, click to close this.</div>;
      //   }
      // }
    ]
  );

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    if (query && query.app && query.app == "vare") setUserSource("app");
    getAllLikes();

    // console.log("storeUser", storeUser);
  }, [offset]);

  const onSendReply = useCallback((newStories = []) => {
    setStories(previousMessages => {
      // console.log("offset", offset);
      return newStories;
    });
  });

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
        getChatContents({newsData: data, rawData, likes});
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
              url: rep.video ? rep.video : rep.image,
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
            // .filter(real => real.author && real.content && real.urlToImage)

            return storyInfo;
          });
      // console.log("hhh", data);
      // return;
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
      // console.log(
      //   "ddd",
      //   // rawStoryData,
      //   // myStoryIndex,
      //   // allLikes,
      //   // storyIndex.current,
      //   // rawStoryData[storyIndex.current],
      //   messageInfo
      // );
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

  const VareVoteMenu = ({myStoryIndex}) => {
    const [stateLike, setStateLike] = useState([]);
    const [messageInfo, setMessageInfo] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // useEffect(() => {
    //   setStateLike(allLikes);
    // }, [allLikes]);
    useEffect(() => {
      const info =
        myStoryIndex && rawStoryData
          ? rawStoryData[myStoryIndex]
          : rawStoryData[0];
      const infoAnswers = info && info.quickReplies && info.quickReplies.values;
      console.log("cccc", infoAnswers, rawStoryData);
      setMessageInfo(infoAnswers);
    }, [myStoryIndex]);

    const Tag = ({colorPill, title, myIcon, item, statusState}) => {
      return (
        <div
          style={{
            display: "flex",
            backgroundColor: statusState ? "#87CEFA" : "rgba(0,0,0,.70)",
            borderColor: "white",
            borderWidth: 2,
            marginLeft: 3,
            paddingRight: 10,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            flexDirection: "row"
          }}
        >
          <i
            style={{
              color: "white",
              marginTop: 3,
              textAlign: "center"
            }}
            // name={"times"}
            className={`fas fa-times-circle`}
          />
          <div
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              padding: 5,
              fontWeight: "bold",
              color: "white",
              fontSize: 16
            }}
          >
            {title && title.charAt(0).toUpperCase() + title.slice(1)}
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          display: "flex",
          borderRadius: 10,
          // backgroundColor: "rgba(0,0,0,.64)",
          // paddingLeft: "80%",
          top: 50,
          position: "absolute",
          zIndex: 99999,
          right: "10%",
          // width: "100%",
          alignItems: "center",
          // paddingRight: 10,
          flexDirection: "row"
        }}
      >
        {messageInfo && messageInfo.length > 0
          ? messageInfo.map((item, index) => {
              console.log("item", item);
              return (
                <Tag
                  key={index + "ssdewed"}
                  colorPill={""}
                  title={item["title"]}
                  item={item}
                />
              );
            })
          : null}
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
        <VareVoteMenu myStoryIndex={myStoryIndex} />
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

export default NewsModal;
