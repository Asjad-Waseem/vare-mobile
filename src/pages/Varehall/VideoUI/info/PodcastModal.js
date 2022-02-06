import React, {useState, useEffect, useRef} from "react";

import "./select.css";

import {Row, Card} from "reactstrap";
import UserAvatar from "react-user-avatar";
import cookie from "react-cookies";
import {useHistory} from "react-router-dom";
import TextInput from "react-autocomplete-input";
import moment from "moment";
import styled from "styled-components";

import PageModal from "./PageModal";
import VideoModal from "./VideoModal";
import VoteChart from "./VoteChart";
import queryString from "query-string";
import MultiTag from "./MultiTag";
import {RWebShare} from "react-web-share";
import PageMenu from "./PageMenu";
import PageFooter from "./PageFooter";

import RESTCall from "../../../../redux/actions/restApi";
import useLocalStorage from "./localStorage";

const PodcastModal = ({
  setLoginUser,
  loginUser,
  activeUser,
}) => {
  const history = useHistory();
  const [keyUsers, setKeyUsers] = useState([
    "dafolo11@gmail.com",
    "larraking@test.com",
    "kristin@leetest.com",
    "civicadmin@vareapp.com"
  ]);

  const [sharedVideo, setSharedVideo] = useState(false);
  const [itemId, setItemId] = useState(false);
  const [userSource, setUserSource] = useState(false);
  const [chartId, setChartId] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fullView, setFullView] = useState(false);
  const [showEchoIndex, setShowEchoIndex] = useState(-1);
  const [showMenuIndex, setShowMenuIndex] = useState(-1);
  const [podcastMedia, setPodcastMedia] = useState([]);
  const [searchPodcastMedia, setSearchPodcastMedia] = useState([]);
  const [storedPodcastMedia, setStoredPodcastMedia] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [videoUrl, setVideoUrl] = useState({});
  const [pictureUrl, setPictureUrl] = useState(false);

  const [storeUser, setStoreUser] = useLocalStorage("user");

  const pathurl = useRef(history.location);

  useEffect(() => {
    const query = queryString.parse(pathurl.current.search);
    if (query && query.app && query.app == "vare") setUserSource("app");
    if (query && query.share) {
      setItemId(query.share);
      setSharedVideo(true);
      setVideoUrl({});
    }
    if (
      !cookie.load("vare") &&
      query &&
      query.app &&
      query.app == "vare" &&
      query.id
    ) {
      getUserEmail(query.id);
    }
    getContent();
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

  const getUserEmail = id => {
    if (id.includes("@")) {
      loginAppUser(id);
      return;
    }
    const formData = {
      request: "search",
      query: {
        user_id: id
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData).then(response => {
      const data = response && response.data && response.data[0];
      if (data && data.email) {
        loginAppUser(data.email);
      }
    });
  };

  const loginAppUser = userEmail => {
    if (!userEmail) {
      return;
    }
    const formData = {
      request: "vareappprofile",
      query: {
        email: userEmail.toLowerCase()
      },
      resource: "vare_user",
      id: ""
    };
    RESTCall.axiosQuery(formData)
      .then(response => {
        if (response && response.token) {
          cookie.save("vare", response.token, {path: "/"});
          response["name"] = response.fullName;
          setStoreUser(response);
          window.location.reload();
        } else {
          alert(
            response && response.message
              ? response.message
              : "Please verify your Email and Password or Register your account."
          );
        }
      })
      .catch(err => {
        cookie.remove("vare", {path: "/"});
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setStoreUser("");
          alert(
            err &&
              err.response &&
              err.response.data &&
              err.response.data.message
          );
        }
      });
  };

  const getContent = () => {
    const queryInfo = {
      reply: false,
      mediaType: null
    };

    if (
      pathurl.current.search &&
      queryString.parse(pathurl.current.search) &&
      queryString.parse(pathurl.current.search).forum
    ) {
      queryInfo["mediaType"] = "forum";
    }

    const formData = {
      request: "search",
      query: {...queryInfo},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data.map(rep => {
              if (rep.likes) rep["likes"] = JSON.parse(rep.likes);
              if (rep.views) rep["views"] = JSON.parse(rep.views);
              return rep;
            })
          : [];

      if (data.length > 0) {
        setStoredPodcastMedia([...data]);
      }
      // return data;
    });
  };

  const saveMessageLikes = async message => {
    const formData = {
      request: "insert",
      query: {
        likes: message.likes,
        user_id: message.user_id,
        item_id: message.item_id
      }, //add table key value to edit
      resource: "vare_contents", //add table name
      check: ["user_id", "item_id"]
    };
    const result = await RESTCall.axiosQuery(formData).then(contents => {
      return "done";
    });

    const info = result && (await updateMessageLikes(message));
    return info;
  };

  const updateMessageLikes = async message => {
    const formData = {
      request: "search",
      query: {item_id: message.item_id, date: message.date},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    return await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data
          : [];
      if (data.length > 0 && data[0].likes) {
        return JSON.parse(data[0].likes);
      }
    });
  };

  const saveMessageViews = async message => {
    const formData = {
      request: "insertstats",
      query: {
        views: message.views,
        user_id: message.user_id,
        item_id: message.item_id
      }, //add table key value to edit
      resource: "vare_contents", //add table name
      check: ["user_id", "item_id"]
    };
    const result = await RESTCall.axiosQuery(formData).then(contents => {
      return "done";
    });

    const info = result && (await updateMessageViews(message));
    return info;
  };

  const updateMessageViews = async message => {
    const formData = {
      request: "search",
      query: {item_id: message.item_id, user_id: message.user_id},
      resource: "vare_contents",
      id: "",
      orderBy: "dsc",
      sortBy: "date"
    };
    return await RESTCall.axiosQuery(formData).then(response => {
      const data =
        response && response.data && response.data.length > 0
          ? response.data
          : [];
      if (data.length > 0 && data[0].views) {
        return JSON.parse(data[0].views);
      }
    });
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

      const formData = {
        request: "insert",
        query: dbVote,
        resource: "vare_vote",
        check: ["item_id", "user_id"]
      };
      return await RESTCall.axiosQuery(formData)
        .then(response => {
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

  const deleteMedia = async item => {
    if (window.confirm("Are you sure you want to delete?")) {
      const formData = {
        request: "delete",
        resource: "vare_contents",
        id: item._id
      };
      await RESTCall.axiosQuery(formData).then(response => {
        getContent();
      });
    }
  };

  const ListContentInfo = props => {
    const {real, index} = props;
    const [newLike, setNewLikes] = useState(false);
    const [newViews, setNewViews] = useState(false);

    useEffect(() => {
      setNewLikes(real.likes);
      setNewViews(real.views);
    }, [real]);

    return (
      <>
        <div
          onClick={() => {
            setPictureUrl(real.img);
          }}
        >
          <UserAvatar
            size="40"
            name={real.name ? real.name : "Guest"}
            src={
              real.img
                ? real.img
                : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
            }
          />
        </div>
        <div
          style={{
            width: "70%",
            flexDirection: "column",
            paddingLeft: 10,
          }}
        >
          <div
            style={{
              width: "70%",
              fontSize: 14,
              fontWeight: "bold",
              color: "gray",
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
              {real.user_id && real.user_id.replace(/\s/g, "").length > 0
                ? real.name
                : "Vare Media"}
            </div>

            <i
              className={`fas fa-link`}
              style={{
                fontSize: 12,
                color: "#2096F3"
              }}
            >
              {` ${
                real.bill_id
                  ? real.bill_id + "  (Bill ID)"
                  : real.item_id + "  (Bill ID)"
              }`}
            </i>
          </div>
          <div
            style={{
              fontSize: 16,
              width: "70%",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {real.title ? real.title : ""}
          </div>

          <div
            style={{
              width: "100%",
              fontSize: 12,
              color: "gray",
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div>{`views: ${
              newViews &&
              newViews.length &&
              !real.mediaType &&
              real.mediaType != "forum"
                ? newViews.length + 3239
                : newLike.length
                ? newLike.length
                : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>{`   likes: ${
              real.likes && real.likes.length ? real.likes.length : 0
            }`}</div>
            <div style={{paddingLeft: 20}}>
              {real.date ? moment(real.date || moment.now()).fromNow() : ""}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 10,
            paddingTop: 15
          }}
        >
          <div style={{paddingLeft: 15}}>
            <i
              onClick={() => {
                setVideoUrl(real);
                setModalIsOpen(true);
              }}
              style={{
                padding: 10,
                borderRadius: 10
              }}
              className={`fas fa-play`}
            />
          </div>
          <div
            style={{
              paddingLeft: 15,
              marginBottom: 100
            }}
          >
            <RWebShare
              data={{
                text: real.name,
                url:
                  real.bill_id || real.item_id
                    ? window.location.href +
                      `https://www.varehall.com/podcast/?share=${
                        real.bill_id ? real.bill_id : real.item_id
                      }`
                    : window.location.href,
                title: real.title
              }}
              onClick={() => {
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
          <div
            onClick={() => {
              if (!(storeUser && storeUser.email)) {
                alert("Please login to use this feature");
                return;
              }
              saveMessageLikes({
                ...real,
                likes:
                  !real.likes && storeUser
                    ? JSON.stringify([storeUser.user_id])
                    : real.likes && real.likes.includes(storeUser.user_id)
                    ? JSON.stringify(
                        real?.likes?.filter(res => res != storeUser.user_id)
                      )
                    : JSON.stringify([...real.likes, storeUser.user_id])
              }).then(rex => {
                setNewLikes(rex);
              });
            }}
            style={{paddingLeft: 15}}
          >
            <i
              style={{
                backgroundColor: "#f2f3f5",
                padding: 10,
                borderRadius: 10,
                color:
                  real.likes &&
                  storeUser &&
                  storeUser.user_id &&
                  real.likes.includes(storeUser.user_id)
                    ? "#2096F3"
                    : "black"
              }}
              className={`fas fa-2x fa-heart`}
            />
          </div>
        </div>
      </>
    );
  };

  const CardListContentInfo = ({real, index}) => {
    const [newLike, setNewLikes] = useState(false);
    const [newViews, setNewViews] = useState(false);

    useEffect(() => {
      setNewLikes(real.likes);
      setNewViews(real.views);
    }, [real]);

    return (
      <>
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 15,
            zIndex: 11,
          }}
        >
          <div
            onClick={() => {
              setPictureUrl(
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              );
            }}
          >
            <UserAvatar
              size="40"
              name={real.name ? real.name : "Guest"}
              src={
                real.img
                  ? real.img
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
            />
          </div>
        </div>

        {videoUrl.video && videoUrl._id == real._id ? (
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        ) : (
          <img
            onClick={() => {
              setItemId(itemId == real.item_id ? false : real.item_id);
              setSharedVideo(true);
              setVideoUrl({});
              saveMessageViews({
                ...real,
                views: !newViews
                  ? JSON.stringify([storeUser.user_id])
                  : JSON.stringify([...newViews, storeUser.user_id])
              }).then(rex => {
                const newRex = rex?.filter(rec => rec != null);

                newRex && setNewViews(newRex);
              });
            }}
            width={"100%"}
            height={250}
            src={
              real.picture
                ? real.picture
                : "https://varefiles.s3.us-east-2.amazonaws.com/meetings.jpg"
            }
          />
        )}

        <div
          style={{
            position: "relative",
            top:
              videoUrl.video && videoUrl._id == real._id ? -25 : -35,
            borderRadius: 10,
            backgroundColor: "rgba(0,0,0,.80)",
            height: "310px",
            width: "90%",
            left: "5%",
            marginBottom: 10,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            color: "white"
          }}
        >
          <div
            style={{
              width: "100%",
              fontSize: 14,
              fontWeight: "bold",
              color: "red",
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div
              onClick={() => {
              }}
              style={{
                flexDirection: "column",
                width: "100%",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  height: 30
                }}
                onClick={() => {
                  setVideoUrl(
                    !(videoUrl.video && videoUrl._id == real._id) ? real : {}
                  );
                  setShowMenuIndex(real.item_id);
                }}
              >
                <i
                  className={`fas fa-2x fa-${
                    !(videoUrl.video && videoUrl._id == real._id)
                      ? "play-circle"
                      : "stop"
                  }`}
                  style={{
                    color: "red"
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              onClick={() => {
                setShowMenuIndex(
                  showMenuIndex == real.item_id ? -1 : real.item_id
                );
              }}
              style={{
                padding: 10,
                fontSize: 18,
                fontWeight: "bold",
                width: "100%",
                textAlign: "center",
                alignSelf: "center",
                marginLeft: "auto",
                marginRight: "auto",
                paddingLeft: "auto",
                paddingRight: "auto"
              }}
            >
              {real.title ? real.title + "..." : ""}
            </div>
            <div
              style={{
                fontSize: 13
              }}
            >
              {`Post By:  ${
                real.user_id &&
                real.user_id.replace(/\s/g, "").length > 0 &&
                real.name != "Oluwalowo Oluwadamilola"
                  ? real.name
                  : "Vare Media"
              }`}
            </div>

            {real.bill_id && real.bill_id && (
              <div
                style={{
                  paddingTop: 10,
                  paddingLeft: 20,
                  paddingBottom: 10,
                  fontSize: 12,
                  color: "#2096F3"
                }}
              >
                {` ${
                  real.bill_id && real.bill_id
                    ? real.bill_id + "  (Bill Details)"
                    : "Bill Detail"
                }`}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "0",
                display: "flex",
                textAlign: "center",
                left: "50%",
                transform: "translate(-50%, -50%)",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onClick={() => {
                if (!(storeUser && storeUser.email)) {
                  alert("Please login to use this feature");
                  return;
                }
                setChartId(chartId == real.item_id ? false : real);
                setShowMenuIndex(real.item_id);
              }}
            >
              <VoteChart
                setChartId={setChartId}
                chartId={chartId}
                real={real}
                innerFont={13}
                width={210}
                fontSize={13}
              />
            </div>
          </div>

          {showMenuIndex == real.item_id && (
            <>
              <div
                style={{
                  paddingTop: 10,
                  paddingLeft: 10,
                  fontWeight: "bold",
                  width: "100%",
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12
                }}
              >
                <div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <i
                    onClick={() => {
                      real.bill_id &&
                        window.open(
                          `https://www.congress.gov/search?q={"source":"legislation","search":"` +
                            real.bill_id +
                            `"}`,
                          "_blank"
                        );
                    }}
                    className={`fas fa-2x fa-eye`}
                  />
                  <div>{`${
                    newViews &&
                    newViews.length &&
                    !real.mediaType &&
                    real.mediaType != "forum"
                      ? newViews.length + 3239
                      : newLike && newLike.length
                      ? newLike.length
                      : 0
                  }`}</div>
                </div>

                {(userSource &&
                  userSource == "app" &&
                  real.email == storeUser.email) ||
                (storeUser && keyUsers.includes(storeUser.email)) ? (
                  <>
                    {" "}
                    <div
                      style={{
                        width: "20%",
                        flexDirection: "column"
                      }}
                    >
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }
                          if (userSource && userSource == "app") {
                            window.open(
                              `${
                                pathurl.current.search.includes("edit=") &&
                                pathurl.current.search.split("edit=")[1]
                                  ? "/podcast" +
                                    pathurl.current.search.split("edit=")[0] +
                                    "edit=" +
                                    real.item_id
                                  : "/podcast" +
                                    pathurl.current.search +
                                    "&edit=" +
                                    real.item_id
                              }
                          `,
                              "_self"
                            );
                          } else {
                            alert("Edits only available on app at this time");
                          }
                        }}
                        style={{}}
                        className={`fas fa-2x fa-edit`}
                      />
                      <div>{"edit"}</div>
                    </div>
                    <div
                      style={{
                        width: "20%",
                        flexDirection: "column"
                      }}
                    >
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }
                          deleteMedia(real);
                        }}
                        style={{}}
                        className={`fas fa-2x fa-trash`}
                      />
                      <div>{"trash"}</div>
                    </div>
                  </>
                ) : null}

                <div
                  style={{
                    width: "20%",
                    flexDirection: "column"
                  }}
                >
                  <div>
                    {userSource && userSource == "app" ? (
                      <i
                        onClick={() => {
                          if (!(storeUser && storeUser.email)) {
                            alert("Please login to use this feature");
                            return;
                          }

                          window.open(
                            `${
                              pathurl.current.search.includes("share=") &&
                              pathurl.current.search.split("share=")[1]
                                ? "/podcast" +
                                  pathurl.current.search.split("share=")[0] +
                                  "share=" +
                                  real.item_id
                                : "/podcast" +
                                  pathurl.current.search +
                                  "&share=" +
                                  real.item_id
                            }
                          `,
                            "_self"
                          );
                        }}
                        style={{}}
                        className={`fas fa-2x fa-share-alt`}
                      />
                    ) : (
                      <div style={{flexDirection: "column"}}>
                        <div
                          data={{
                            text: real.name,
                            url:
                              real.bill_id || real.item_id
                                ? `https://www.varehall.com/podcast/?share=${
                                    real.bill_id ? real.bill_id : real.item_id
                                  }`
                                : window.location.href,
                            title: real.title
                          }}
                          onClick={info => {
                            alert(
                              "Please use the Vare App to share contents instead"
                            );
                          }}
                        >
                          <i style={{}} className={`fas fa-2x fa-share-alt`} />
                        </div>
                      </div>
                    )}

                    <div>{"share"}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const CardSubListContentInfo = ({pic, index}) => {

    return (
      <div>
        <img
          style={{
            borderRadius: 10,
            background: "yellow"
          }}
          width={200}
          height={200}
          src={
            pic
              ? pic
              : "https://varefiles.s3.us-east-2.amazonaws.com/meetingpic1.jpg"
          }
        />
        <div
          style={{
            height: 120,
            width: 200,
            borderRadius: 10
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 15,
              padding: 2
            }}
            onClick={() => {
              setPictureUrl(pic);
            }}
          >
            <UserAvatar
              size="40"
              name={"Guest"}
              src={
                pic
                  ? pic
                  : "https://varefiles.s3.us-east-2.amazonaws.com/06.jpg"
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const PodcastContent = ({real, index}) => {
    return (
        <div
          style={{
            paddingLeft: 10,
            textAlign: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {fullView ? (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                padding: 10,
                flexDirection: "row", 
                marginRight: "20px !important"               
              }}
            >
              <ListContentInfo real={real} index={index} />
            </Card>
          ) : (
            <Card
              style={{
                borderColor: videoUrl._id == real._id ? "red" : "",
                width: "100%",
                minHeight: 450,
                padding: 10,
                flexDirection: "row",
                overflowX: showEchoIndex == index ? "scroll" : "hidden",
                overflowY: "hidden",
                width: 395,
                height: 550,
              }}
            >
              {showEchoIndex == index &&
              real.pictures &&
              real.pictures.length > 0 ? (
                JSON.parse(real.pictures).map((pic, i) => {
                  return (
                    <div
                      style={{
                        paddingRight: 20
                      }}
                      key={"sjhdhssh" + i}
                    >
                      <CardSubListContentInfo pic={pic} index={i} />
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <CardListContentInfo real={real} index={index} />
                </div>
              )}
            </Card>
          )}
        </div>
    );
  };

  return (
    <React.Fragment>
      {!(userSource && userSource == "app") ? (
        <PageMenu
          setLoginUser={setLoginUser}
          loginUser={loginUser}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          marginTop: !(userSource && userSource == "app") ? 65 : 25,
          height: 200,
          backgroundRepeat: "repeat-x",
          backgroundImage: `url(${"https://varefiles.s3.us-east-2.amazonaws.com/podcastinfo.jpg"}`,
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
          {"Policy Podcast Collections"}
          <i
            onClick={() => {
              setFullView(!fullView);
            }}
            style={{
              padding: 10,
              borderRadius: 10,
              color: "black"
            }}
            className={`fas fa-x fa-${fullView ? "arrows-alt" : "expand"}`}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginRight: "-17.5px",
        }}
      >
        <PageModal
          header={`Member Votes `}
          activeUser={"activeUser"}
          setActiveUser={() => {
            setChartId(false);
          }}
          modalIsOpen={chartId ? true : false}
          setModalIsOpen={() => {}}
          myWidth={350}
          myHeight={300}
        >
          <MultiTag setChartId={setChartId} chartId={chartId} />
        </PageModal>
        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setPictureUrl(false);
          }}
          modalIsOpen={pictureUrl ? true : false}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <img
            width="100%"
            key={pictureUrl}
            controls
            autoPlay
            src={pictureUrl}
          />
        </PageModal>

        <PageModal
          activeUser={activeUser}
          setActiveUser={() => {
            setModalIsOpen(false);
            setVideoUrl({});
          }}
          modalIsOpen={videoUrl && videoUrl.video && modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          myWidth={350}
          myHeight={300}
        >
          <video width="100%" height="240" key={videoUrl._id} controls autoPlay>
            <source src={videoUrl.video} />
          </video>
        </PageModal>

        <div>
          <Row
            style={{
              width: "100%",
              justifyContent: "center"
            }}
          >
            {itemId ? (
              <div>
                <VideoModal
                  updateMessageLikes={updateMessageLikes}
                  page={"podcast"}
                  saveMessageLikes={saveMessageLikes}
                  setSharedVideo={setSharedVideo}
                  sharedVideo={sharedVideo}
                  setItemId={setItemId}
                  item_id={itemId}
                />
              </div>
            ) : null}
            {itemId ? (
              <div>
                {podcastMedia &&
                  podcastMedia.length > 0 &&
                  podcastMedia.map((real, index) => {
                    return (
                      <PodcastContent
                        key={"fdkvldhsgjsd" + real._id}
                        real={real}
                        index={index}
                      />
                    );
                  })}
              </div>
            ) : (
              podcastMedia &&
              podcastMedia.length > 0 &&
              podcastMedia.map((real, index) => {
                return (
                  <PodcastContent
                    key={"fdkvldhsgjsd" + real._id}
                    real={real}
                    index={index}
                  />
                );
              })
            )}
          </Row>
        </div>
      </div>
      {!(userSource && userSource == "app") ? (
        <PageFooter setLoginUser={setLoginUser} loginUser={loginUser} />
      ) : null}
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

export default PodcastModal;
