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
  FormGroup,
  Progress,
  CardTitle,
  Label,
  Button
} from "reactstrap";
import {Formik, Form, Field} from "formik";
import RESTCall from "../../../../redux/actions/restApi";
import PageFooter from "./PageFooter";
import cookie from "react-cookies";
import PlaceholderMessage from "./PlaceholderMessage";

import Select from "react-select";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";
import "./select.css";
import ImageUploader from "react-images-upload";
import FileUploadProgress from "react-fileupload-progress";

import {useHistory} from "react-router-dom";

import {connect} from "react-redux";
import {
  handleQuery,
  generalSuccess
} from "../../../../redux/actions/keyInfoActions";
import {logoutFromView} from "../../../../redux/actions/authActions";

import ReactDOM from "react-dom";
import Modal from "react-modal";

import moment from "moment";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from "react-player";
import "../../style.css"; // Tell webpack that Button.js uses these styles
import CommentsBlock from "simple-react-comments";

import "../../info.css";
import "../../../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

import PageMenu from "./PageMenu";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";

import {ThemeColors} from "../../helpers/ThemeColors";

//Import Section Title

import Axios from "axios";

import useLocalStorage from "./localStorage";

const colors = ThemeColors();

const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");

const AddContent = ({info, onHandleQuery}) => {
  const history = useHistory();
  const [storeUser, setStoreUser] = useLocalStorage("user");
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState("VareHall");

  // const [selectedLike, setSelectedLike] = useState(-1);

  const [errors, setErrors] = useState({});
  const [selectVal, setSelectVal] = useState([]);

  const [touched, setTouched] = useState({});

  const validateEmail = mail => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        mail
      )
    ) {
      return true;
    }
    alert("You have entered an invalid email address!");
    return false;
  };

  const myTitleRef = useRef("");
  const myFileLinkRef = useRef("");
  const myFileRef = useRef("");
  const myVideoDisplay = useRef("");

  const fileImageName = useRef("");
  const fileImageData = useRef("");
  const fileImageMime = useRef("");
  const fileVideoName = useRef("");
  const fileVideoData = useRef("");

  const handleAddContent = async () => {
    const hashtag = Object.keys(selectVal).filter(rep => {
      return selectVal[rep] == true;
    });
    // return;
    const formData = {
      request: "insert",
      query: {
        date: moment().format(),
        message_id: "2",
        author: "Guest User88",
        user_id: "a76468",
        title: "Test Upload",
        message:
          "My son, keep thy father's commandment, and forsake not the law of thy ...",
        name: "Guest User",
        likes: "",
        audio: "https://varefiles.s3.us-east-2.amazonaws.com/bgmusic.mp3",
        video: "https://varefiles.s3.us-east-2.amazonaws.com/vare_video.mp4",
        img: "https://varefiles.s3.us-east-2.amazonaws.com/church/2.jpg",
        comments: "2",
        avatar: "test@test2.jpg",
        hashtag: hashtag && hashtag.length > 0 ? hashtag[0].toString() : ""
      },
      resource: "tube_contents",
      check: ["user_id", "video", "img"]
    };

    const imageUploader = await Axios.post(url, {
      mime: fileImageMime.current,
      name: fileImageName.current.toLowerCase(),
      image: fileImageData.current
    })
      .then(img => {
        // console.log("img", img);
        formData.query["img"] = `https://varefiles.s3.us-east-2.amazonaws.com/${
          img.data && img.data.key
            ? img.data.key
            : fileImageName.current.toLowerCase()
        }`;
        return true;
      })
      .catch(err => {
        alert("Image Not loaded");
        return false;
      });

    const videoUploader = await Axios.post(urlVideo, fileVideoData.current, {
      headers: {
        "my-name": fileVideoName.current.toLowerCase(),
        "Content-Type": fileVideoData.current.type
      }
    })
      .then(video => {
        // console.log("video", video.data.key);
        formData.query[
          "video"
        ] = `https://varefiles.s3.us-east-2.amazonaws.com/${
          video.data && video.data.key
            ? video.data.key
            : fileVideoName.current.toLowerCase()
        }`;
        return true;
      })
      .catch(err => {
        alert("Video Not loaded");
        return false;
      });

    if (imageUploader && videoUploader) {
      // console.log("ddddd", formData);
      const completeLoad = await RESTCall.axiosQuery(formData)
        .then(response => {
          // console.log("kkkkdispatch", formData, response);
        })
        .catch(error => {
          console.log("error", error);
          return error;
        });
    }
  };

  const [progress, setProgress] = useState("getUpload");
  const [errorMessage, setErrorMessage] = useState("");
  // const [url, setImageURL] = useState('http://localhost:5000/upload/myUpload');
  const [url, setImageURL] = useState(
    // "https://meeting.varehall.com/upload/myUpload"
    "https://media.varehall.com/upload/myUpload"
    // "http://localhost:5000/upload/myUpload"
  );

  const [urlVideo, setVideoURL] = useState(
    // "https://meeting.varehall.com/upload/myUpload"
    "https://media.varehall.com/upload/myVideoUpload"
    // "http://localhost:5000/upload/myVideoUpload"
  );

  const onImageFile = async (failedImages, successImages) => {
    if (!url) {
      setErrorMessage("missing a url to upload to");
      setProgress("uploadError");
      return;
    }

    setProgress("uploading");
    try {
      const name =
        successImages[0].split(";") &&
        successImages[0].split(";")[1] &&
        successImages[0].split(";")[1].split("=") &&
        successImages[0].split(";")[1].split("=")[1] &&
        successImages[0].split(";")[1].split("=")[1];
      const imageString = await resizeImage(successImages, 200, 200);
      const image =
        name && (name.includes(".png") || name.includes(".jpg"))
          ? await [imageString]
          : successImages;

      const parts = successImages[0].split(";");
      const mime = parts[0].split(":")[1];

      fileImageName.current = name;
      fileImageData.current = image[0];
      fileImageMime.current = mime;
      setProgress("uploaded");
    } catch (error) {
      console.log("error in upload", error);
      setErrorMessage(error.message);
      setProgress("uploadError");
    }
  };

  const resizeImage = (base64Str, maxWidth = 400, maxHeight = 350) => {
    return new Promise(resolve => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_WIDTH = maxWidth;
        const MAX_HEIGHT = maxHeight;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  const onVideoFile = () => {
    var fileInput = myFileRef.current;
    const file = fileInput.files[0];
    fileVideoName.current = file.name;
    fileVideoData.current = file;
  };

  useEffect(() => {
    console.log("fileVideoName", fileVideoName.current, fileVideoData.current);
  }, [fileVideoName.current, fileVideoData.current]);

  // console.log('activeNav',activeNav)
  return (
    <React.Fragment>
      <PageMenu />
      <div
        className=""
        id="contact"
        style={{
          // paddingTop: 100,
          // paddingBottom: 80,
          background:
            "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
          backgroundSize: "cover",
          right: 0,

          // bottom: 0,
          left: 0,
          position: "fixed",
          height: height
        }}
      >
        <div
          style={{
            marginTop: 100,
            overflow: "auto",
            height: "90%",
            paddingBottom: 1000
          }}
          // className="col-12 col-md-10"
        >
          {cookie.load("vare") ? (
            <div
              style={{
                marginRight: 25,
                marginLeft: 25,
                backgroundColor: "white",
                borderRadius: 5
              }}
            >
              <div
                style={{
                  background:
                    "url(/assets/img/login/balloon-lg.jpg) no-repeat center center fixed",
                  // backgroundColor: "red",
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
                    className=""
                    style={{width: 40, height: 40, borderRadius: 100}}
                  />
                  <div className="">ADD CONTENT</div>
                </div>
              </div>
              <div style={{height: "100%", padding: 20, paddingBottom: 80}}>
                <div
                  style={{
                    marginRight: 10
                  }}
                  className="mb-4 card-title"
                >
                  Use form to add content below.
                </div>
                <form action="#" className="">
                  <div className="form-group has-float-label form-group">
                    <label className="">Title</label>
                    <input
                      ref={myTitleRef}
                      name="name"
                      className="form-control"
                      // placeholder="demo@gogo.com"
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f2f3f5",
                      padding: 10,
                      display: "flex",
                      flexDirection: "column"
                    }}
                    className="form-group has-float-label form-group"
                  >
                    <label className="">Add File</label>
                    <ImageUploader
                      key="image-uploader"
                      withIcon={true}
                      singleImage={true}
                      withPreview={true}
                      label="Maximum size file: 5MB"
                      buttonText="Add Avatar Image"
                      onChange={onImageFile}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={250242880}
                    />
                    <div
                      style={{
                        padding: 10
                      }}
                    >
                      Or{" "}
                    </div>
                    <div className="form-group has-float-label form-group">
                      <label className="">Add File Link</label>
                      <input
                        ref={myFileLinkRef}
                        name="myFile"
                        className="form-control"
                        placeholder="file link"
                      />
                      {errors.select && touched.select ? (
                        <div className="invalid-feedback d-block">
                          {errors.select}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="form-group has-float-label form-group">
                    <label className="">Add Video to S3</label>
                    <input
                      accept=" video/*"
                      ref={myFileRef}
                      type="file"
                      onChange={onVideoFile}
                    />
                  </div>

                  <div className="form-group has-float-label form-group">
                    <label className="">Select Tag</label>
                    <select
                      name="select"
                      className="form-control"
                      // value={selectVal}
                      onClick={val => {
                        setSelectVal({
                          ...selectVal,
                          [val.target.value]: !selectVal[val.target.value]
                        });
                        // console.log("ddd", selectVal);
                      }}
                      // onBlur={handleBlur}
                      multiple
                    >
                      <option value="politics">Politics</option>
                      <option value="news">News</option>
                      <option value="comedy">Comedy</option>
                      <option value="gospel">Gospel</option>
                      <option value="all">Other</option>
                    </select>
                  </div>
                  <div
                    style={{
                      float: "right"
                      // display: "flex",
                      // right: 70,
                      // position: "absolute",
                      // bottom: 50
                    }}
                  >
                    <Button
                      style={{
                        marginLeft: 10
                      }}
                      onClick={() => {
                        handleAddContent();
                      }}
                      href={"adminRoot"}
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      Add
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <PlaceholderMessage />
          )}
        </div>
      </div>{" "}
      <PageFooter />
      {/*viewLevel == "demography" ? <HeaderFilter /> : null*/}
    </React.Fragment>
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

const mapStateToProps = (state, ownProps) => {
  const storeData = state;
  // console.log("contentmapStateToProps", state);
  return {
    info: storeData.keyInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHandleQuery: formData => {
      dispatch(handleQuery(formData));
    },
    onLogoutFromView: () => {
      dispatch(logoutFromView());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContent);
