import React, {Fragment, useState, useEffect, useRef} from "react";
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
  FormGroup
} from "reactstrap";
import ScrollMenu from "react-horizontal-scrolling-menu";
import UserAvatar from "react-user-avatar";
import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import ReactSwipe from "react-swipe";
import {useHistory} from "react-router-dom";
import {groupBy} from "../../helpers";
import HoverVideoPlayer from "react-hover-video-player";
import ControlItems from "./ControlItems";
import CommentControls from "./CommentControls";
import CommentsComponent from "./CommentsComponent";
import cookie from "react-cookies";
import useLocalStorage from "./localStorage";

// import {Helmet} from "react-helmet";
import {
  FacebookShareCount,
  HatenaShareCount,
  OKShareCount,
  PinterestShareCount,
  RedditShareCount,
  TumblrShareCount,
  VKShareCount
} from "react-share";

import "../../info.css";
import styled from "styled-components";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const MediaCard = ({
  data,
  index,
  linkedMedia,
  commentStatus,
  setCommentStatus
}) => {
  const history = useHistory();
  const [selectedContent, setSelectedContent] = useState();
  const [contents, setContents] = useState("");
  const [storeUser, setStoreUser] = useLocalStorage("user");

  const [myIndex, setMyIndex] = useState(-1);
  const [goVideo, setGoVideo] = useState(-1);

  const Slide = props => {
    let reactSwipeEl;

    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
      // console.log("user", user);
      if (cookie.load("vare")) {
        setContents(data);
      } else {
        setContents([]);
      }
    }, [contents]);

    return (
      <div
        style={{
          top: 30,
          position: "absolute",
          width: 400
          // overflowY: "auto"
        }}
      >
        <ReactSwipe
          className="carousel"
          swipeOptions={{continuous: false}}
          ref={el => (reactSwipeEl = el)}
        >
          {props.children}
        </ReactSwipe>
        {!isMobile && !props.linkedMedia ? (
          <i
            onClick={() => {
              if (slideIndex > 0) {
                setSlideIndex(slideIndex - 1);
                reactSwipeEl.prev();
              }
            }}
            style={{
              position: "absolute",
              zIndex: 15,
              top: 350,
              left: 0,
              color: "#cfcfc4"
            }}
            className={`fas fa-3x fa-chevron-left`}
          >
            {" "}
          </i>
        ) : null}
        {!isMobile && !props.linkedMedia ? (
          <i
            onClick={() => {
              if (contents && slideIndex < contents.length - 1) {
                setSlideIndex(slideIndex + 1);
                reactSwipeEl.next();
              }
            }}
            style={{
              position: "absolute",
              zIndex: 15,
              top: 350,
              right: 0,
              color: "gray"
            }}
            className={`fas fa-3x fa-chevron-right`}
          >
            {" "}
          </i>
        ) : null}
        <div
          style={{
            top: -15,
            left: "50%",
            display: "flex",
            flexDirection: "row",
            position: "absolute"
          }}
        >
          {!props.linkedMedia &&
            contents &&
            contents.length > 0 &&
            contents.map((result, view) => {
              return (
                <div
                  key={"hvvvcc" + view}
                  style={{
                    ...styleInfo.dotStyle,
                    backgroundColor:
                      view == slideIndex ? "rgba(0,0,0,.54)" : "rgba(0,0,0,.1)"
                  }}
                ></div>
              );
            })}
        </div>
      </div>
    );
  };

  const Scripture = props => {
    return (
      <div
        // setSelectedContent
        style={{
          // width: "100%",
          top: 40,
          // width: "100%",
          left: 80,
          position: "absolute",
          zIndex: 6,
          padding: 10,
          backgroundColor: "rgba(0,0,0,.54)",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <div>
          <h2 style={{color: "green"}}>Proverbs 6:20 </h2>
        </div>
        <div
          style={{
            fontWeight: "bold",
            width: 150,
            display: "flex",
            flexWrap: "wrap",
            color: "white"
          }}
        >
          {props.message}
        </div>
        {/*<div>
          <i
            onClick={() => {
              setSelectedContent(props.rep);
            }}
            style={{
              backgroundColor: "white",
              borderRadius: 25,
              padding: 5
            }}
            className={`fas fa-x fa-play`}
          />
        </div>*/}
      </div>
    );
  };

  const MediaCardMobile = ({
    handleVideo,
    contents,
    setPlayIndex,
    playIndex
  }) => {
    const [myIndex, setMyIndex] = useState("");
    const [commentStatus, setCommentStatus] = useState(false);

    return (
      <div
        style={{
          paddingTop: 20
        }}
      >
        {contents && contents.length > 0
          ? contents.map((rep, index) => {
              // console.log("rep", rep);
              return (
                <>
                  <div
                    style={{
                      borderRadius: 5,
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "white",
                      paddingTop: 10,
                      marginBottom: 3
                    }}
                    key={index + "ssdfjchggghshhz"}
                    className="each-slide"
                  >
                    <div
                      style={{
                        borderRadius: 5,
                        height: 130,
                        width: 130
                      }}
                    >
                      <div
                        onClick={() => {
                          handleVideo(index);
                        }}
                      >
                        <HoverVideoPlayer
                          videoSrc={""}
                          pausedOverlay={
                            <>
                              <img
                                src={rep.img}
                                alt=""
                                style={{
                                  // Make the image expand to cover the video's dimensions
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                            </>
                          }
                          volume={0.5}
                          muted={false}
                          loop={false}
                          loadingOverlay={
                            <div className="loading-spinner-overlay" />
                          }
                          // controls
                        />
                      </div>
                    </div>

                    <ControlItems
                      handleAction={info => {
                        // alert(info);
                      }}
                      handleComment={info => {
                        if (commentStatus && index == myIndex) {
                          setMyIndex(-1);
                          setCommentStatus(false);
                        } else {
                          setMyIndex(index);
                          setCommentStatus(true);
                        }
                      }}
                      commentStatus={index == myIndex ? commentStatus : false}
                      noAvatar={true}
                      rep={rep}
                      hashtag={rep.hashtag}
                      author={rep.author}
                      message={rep.message ? rep.message : rep.title}
                    />
                  </div>
                  {index == myIndex && commentStatus ? (
                    <div
                      style={{
                        width: "100%",
                        maxHeight: 500,
                        overflowY: "auto",
                        overflowX: "hidden",
                        backgroundColor: "#f2f3f5"
                      }}
                    >
                      <CommentsComponent contentId={contents[myIndex]["_id"]} />
                    </div>
                  ) : null}
                </>
              );
            })
          : null}
      </div>
    );
  };

  const ContentDetails = () => {
    useEffect(() => {
      // console.log("vvvv", index, myIndex, commentStatus);
    }, []);
    return (
      <>
        {index == myIndex && commentStatus ? (
          <div
            style={{
              width: 400,
              backgroundColor: "#f2f3f5"
            }}
          >
            <CommentsComponent contentId={contents[myIndex]["_id"]} />
          </div>
        ) : index == myIndex || linkedMedia ? (
          <div
            style={{
              width: 400,
              backgroundColor: "#f2f3f5"
            }}
          >
            <MediaCardMobile
              contents={contents}
              handleVideo={videoStatus => {
                setGoVideo(videoStatus);
              }}
            />
          </div>
        ) : null}
      </>
    );
  };

  return (
    <Colxx key={"jghfgft" + index} sm={12} lg={4}>
      <div
        style={{
          marginTop: 20,
          width: 400,
          backgroundColor: "#f2f3f5",
          borderRadius: 5,
          height: 470,
          paddingBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Slide linkedMedia={linkedMedia} go={goVideo}>
          {contents && contents.length > 0
            ? contents.map((rep, index) => {
                return (
                  <div key={index + "ssjchhshhz"} className="each-slide">
                    <div
                      style={{
                        borderRadius: 5,
                        height: 470,
                        position: "relative",
                        width: 430
                      }}
                    >
                      <div
                        onClick={() => {
                          history.push(`/content?hall=${rep.user_id}`);
                        }}
                      >
                        <HoverVideoPlayer
                          videoSrc={rep.video}
                          pausedOverlay={
                            <>
                              <img
                                src={rep.img}
                                alt=""
                                style={{
                                  // Make the image expand to cover the video's dimensions
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover"
                                }}
                              />
                              <Scripture message={rep.message} />
                            </>
                          }
                          volume={0.5}
                          muted={false}
                          loop={false}
                          loadingOverlay={
                            <div className="loading-spinner-overlay" />
                          }
                          controls
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        top: 260,
                        left: 10,
                        position: "fixed",
                        zIndex: 8,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ControlItems
                        handleAction={info => {
                          // alert(info);
                        }}
                        handleComment={info => {
                          if (commentStatus && index == myIndex) {
                            setMyIndex(-1);
                            setCommentStatus(false);
                          } else {
                            setMyIndex(index);
                            setCommentStatus(true);
                          }
                        }}
                        commentStatus={index == myIndex ? commentStatus : false}
                        noAvatar={false}
                        rep={rep}
                        hashtag={rep.hashtag}
                        author={rep.author}
                        message={rep.message ? rep.message : rep.title}
                      />
                      <i
                        onClick={() => {
                          setGoVideo(-1);
                          setCommentStatus(false);
                          setMyIndex(myIndex == -1 ? index : -1);
                        }}
                        style={{
                          position: "absolute",
                          zIndex: 15,
                          bottom: -60,
                          // right: 40,
                          color:
                            myIndex == -1 ? "#cfcfc4" : "rgb(135, 206, 250)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        className={
                          index == myIndex
                            ? `fas fa-3x fa-caret-up`
                            : `fas fa-3x fa-caret-down`
                        }
                      >
                        {" "}
                      </i>
                    </div>{" "}
                  </div>
                );
              })
            : null}
        </Slide>
      </div>
      <ContentDetails />
    </Colxx>
  );
};

const styleInfo = {
  dotStyle: {
    marginRight: 2,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 10,
    height: 10
    // backgroundColor: "red"
  }
};

export default MediaCard;
