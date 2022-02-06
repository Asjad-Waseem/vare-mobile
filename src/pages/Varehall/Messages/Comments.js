import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Card,CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggl,
  Container, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ScrollMenu from "react-horizontal-scrolling-menu";
import { useLocation, Link } from 'react-router-dom';
import SectionTitle from "../../../../components/common/section-title";

//Import Images

// import VideoApp from "./video";

import "../../info.css";
import styled from "styled-components";

import io from "socket.io-client";
import Peer from "simple-peer";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";


const map = require("../../../../assets/images/features/map.png");
const pics = require("../../../../assets/images/04.jpg");
const pics5 = require("../../../../assets/images/05.jpg");
const tempVideo = require("../../../../assets/images/video.mp4");


const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;


const CommentList = ({
  host,
  user,
  setActiveUser,
  selectedLike,
  setSelectedLike,
  messages,
  activeUser,
  attendees
 }) => {
   const textInput = useRef(null)
   const userTextInput = useRef(null)
   // const [newMessage, setNewMessage] = useState({})


   const messageList = activeUser
   && activeUser > 0
   ? messages.filter(res=> {
     return res.senderId == activeUser
   })
   : messages

   useEffect(() => {

   },[])

   // console.log('selectedLike',index,selectedLike)
    const saveNewMessagetoDB = (props) => {
      // console.log('props',props)
      messages.unshift({
       ...props
     })
    }


   // console.log('newMessage',newMessage)

  return <Row style={{
    // height:300,
    // overflow:'auto'
  }}>
  <Col lg={12}>
  <ul className="col comments">
  <li className="comment">
    <a href="#"
    title="View this user profile"
    className="">
    <img src={require(`../../../../assets/images/06.jpg`)}
        style={{
         height:40,
         width:40,
         borderRadius:100
        }}
        alt=""
       />
    </a>
    <div className="meta">Kasper | 2012.07.24 14:58 <a className="reply">Reply</a></div>
    <img
    onClick={()=>{
      saveNewMessagetoDB({
        time: new Date(),
        message:userTextInput.current
        && userTextInput.current.value
        ? userTextInput.current.value : '',
        senderId:user
    })
    // alert(2)
    }}
    src={require(`../../../../assets/images/save.png`)}
      style={{
       zIndex:99,
       position:'absolute',
       height:30,
       width:30,
       borderRadius:100
      }}
      alt=""
   />
    <textarea
      ref={userTextInput}
      style={{
        backgroundColor:'#f2f3f5',
        padding:5,
        paddingLeft:50,
        width:'100%'
      }}
      type="text"
      name="name"
       placeholder="Leave a comment"
     />
  </li>
  </ul>

  <ul className="comments">
    {messageList
      && messageList.length > 0
      ? messageList.map((res, index) => {

        const senderArray = attendees && attendees.length > 0
        ? attendees.filter(rep =>{
          return rep.userId == res.senderId
        }) : ''

        const senderObject = senderArray && senderArray.length > 0
        ? senderArray[0] : ''

        const otherArray = attendees && attendees.length > 0
        ? attendees.filter(rep => {
          return rep.userId == res.replyId
        }) : ''

        const otherObject = otherArray && otherArray.length > 0
        ? otherArray[0] : ''

        const likedMessages = attendees
        && attendees.length>0
        && attendees.filter(rep => {
          return res.likes && res.likes.includes(rep.userId)
        })

        // console.log('selectedLike',index,selectedLike)


        return <li
        key={'kbffxx'+index}
        className="comment">
          <div style={{
            width:"100%",
            display:'flex',
            flexDirection:'row'
          }}>
             <div>
              <img src={senderObject ? require(`../../../../assets/images/${senderObject.image}`) : pics}
                style={{
                 height:40,
                 width:40,
                 borderRadius:100
                }}
                alt=""
               />
              <span className="meta">{senderObject.name}</span>
              </div>
            {otherObject
              ? <div style={{
                paddingLeft:20
              }}>
               <img src={otherObject ? require(`../../../../assets/images/${otherObject.image}`) : pics}
                 style={{
                  height:30,
                  width:30,
                  borderRadius:100
                 }}
                 alt=""
                />
               <span style={{
                 color:'#2096F3'
               }}
               className="meta">@{otherObject.name}</span>
               </div>: null}
               <span style={{
                 color:'gray',
                 // paddingLeft:50,
                 float:'right'
               }}>
                 2012.07.24 14:58
               </span>
          </div>
      <div
      onClick={()=>setSelectedLike(index
        && selectedLike
        && index == selectedLike
        ? -1
        : index)}
       style={{
        display:'flex',
        flexDirection:'row',
        paddingBottom:5,
        paddingTop:5
      }} className="">
        <i style={{
           color:res.likes
             && res.likes.length > 0
             ? '#2096F3'
             :'#f2f3f5'
        }} className="fas fa-heart">  {res.likes
          && res.likes.length > 0
          ? res.likes.length
          : ''}</i>
        <a style={{
           // display: 'none',
           float: 'right',
           paddingLeft:30
        }}>Reply
        </a>
      </div>
      <div style={{
        // display:'flex',
        // flexDirection:'row',
        paddingBottom:5,
        paddingTop:5}}>
      {index
        && selectedLike
        && selectedLike!=-1
        && index == selectedLike
        && likedMessages
        && likedMessages.length
        && likedMessages.length>0
        ? <Fragment>
        <ScrollMenu
          alignCenter={false}
          // arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
          // arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
          data={likedMessages
            && likedMessages.length
            && likedMessages.length>0
           ? likedMessages.map((rep,index) => {
            return <div
            key={'lvgggnh'+index}
            onClick={()=>setActiveUser(rep.userId)}
            style={{
              paddingTop:10,
              backgroundColor:'#2096F3',
              // borderRadius:25,
              paddingLeft:10,
              paddingRight:10
            }}>
              <img
                onClick={()=>alert(senderObject.userId)}
                src={rep ? require(`../../../../assets/images/${rep.image}`) : pics}
                style={{
                 height:30,
                 width:30,
                 borderRadius:100
                }}
                alt=""
             />
              <span style={{
                fontSize:9,
                color:'white'
              }}>
               {rep.name}
             </span>
           </div>})
           : null
         }
        />
        <div  className="body">
        <img
            onClick={()=>{
              saveNewMessagetoDB({
              time: new Date(),
              message:textInput.current && textInput.current.value ? textInput.current.value : '',
              replyId:senderObject.userId,
              senderId:user
            })
            // alert(2)
            }}
           src={require(`../../../../assets/images/save.png`)}
          style={{
            zIndex:99,
          position:'absolute',
           height:30,
           width:30,
           borderRadius:100
          }}
          alt=""
        />
            <textarea
            ref={textInput}
              style={{
                backgroundColor:'#f2f3f5',
                padding:5,
                paddingLeft:50,
                width:'100%'
              }}
              type="text"
              name="name"
               placeholder="Reply with comment"
             />
          </div>
        </Fragment>
        : index == selectedLike
          ? <div
          className="body">
          <img
          onClick={()=>{
            saveNewMessagetoDB({
            time: new Date(),
            message:textInput.current && textInput.current.value ? textInput.current.value : '',
            replyId:senderObject.userId,
            senderId:user
          })
          // alert(2)
          }}
          src={require(`../../../../assets/images/save.png`)}
            style={{
             zIndex:99,
             position:'absolute',
             height:30,
             width:30,
             borderRadius:100
            }}
            alt=""
         />
            <textarea
              ref={textInput}
              style={{
                backgroundColor:'#f2f3f5',
                padding:5,
                paddingLeft:50,
                width:'100%'
              }}
              type="text"
              name="name"
               placeholder="Reply with comment"
             />
          </div>: null
      }
      </div>

      <div className="body">{res.message}</div>
    </li>
    })
    : null}
  </ul>
  </Col>
  </Row>
}

const CommenstFieldHeader = ({
  user,
  setActiveUser,
  selectedLike,
  setSelectedLike,
  messages,
  host,
  meetingId,
  activeUser,
  attendees
}) => {
  const [comments, setComments] = useState([]);

  return <div style={{
        // overflow:'auto'
      }}>
           <div style={{
             display:'flex',
             flexDirection:'row',
             padding:20
           }}>
               <Col sm={6} lg={6}>
                   <Row>
                        <div style={{
                          paddingLeft:10
                        }}
                        className="font10">
                          <div ><i className="fas fa-comments"></i></div>
                          <div style={{
                            color:'gray'
                          }}>838473 Comments</div>
                        </div>
                            <div style={{
                              paddingLeft:10
                            }}
                            className="font10">
                              <div ><i className="fas fa-heart"></i></div>
                              <div style={{
                                color:'gray'
                              }}>55 Like</div>
                            </div>
                            <div className="font10">
                              <div><i className="fas fa-share"></i></div>
                              <div style={{
                                color:'gray'
                              }}>Share</div>
                            </div>
                            {/*<div className="font10">
                              <div><i className="fas fa-cloud"></i></div>
                            <div
                            style={{
                              color:'gray'
                            }}>Save</div>
                          </div>*/}
                 </Row>
                 </Col>
          </div>
      </div>
  }


export default CommentList;
