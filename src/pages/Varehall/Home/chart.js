import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Card,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggl,
  Container, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ScrollMenu from "react-horizontal-scrolling-menu";
import { useLocation } from 'react-router-dom';

import { connect } from 'react-redux'
import { handleQuery, generalSuccess }
  from '../../../redux/actions/keyInfoActions'
  import { logoutFromView }
  from '../../../redux/actions/authActions'

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from 'react-player'
import './style.css'; // Tell webpack that Button.js uses these styles
import CommentsBlock from 'simple-react-comments';

//Import Section Title
import SectionTitle from "../../../components/common/section-title";

import AddToCalendar from "react-add-to-calendar";
//Import Images
import map from "../../../assets/images/features/map.png";
import pics from "../../../assets/images/04.jpg";
import pics5 from "../../../assets/images/05.jpg";
import tempVideo from "../../../assets/images/video.mp4";

// import VideoApp from "./video";

import "./info.css";
import styled from "styled-components";

import io from "socket.io-client";
import Peer from "simple-peer";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import { Colxx, Separator } from './components/common/CustomBootstrap';
import GradientWithRadialProgressCard from './components/cards/GradientWithRadialProgressCard';
import RadialProgressCard from './components/cards/RadialProgressCard';
import SurveyListItem from './components/applications/SurveyListItem';
import SurveyDetailCard  from './components/applications/SurveyDetailCard';
import {SliderTooltip} from "./components/common/SliderTooltips";

import SurveyQuota from './components/applications/SurveyQuota';
import MessageCard from './components/applications/MessageCard';
import Line from './components/charts/Line';
import SmallLine from './components/charts/SmallLine';
import Doughnut from './components/charts/Doughnut';
import Pie from './components/charts/Pie';
import PolarArea from './components/charts/PolarArea';
import Scatter from './components/charts/Scatter';
import Bar from './components/charts/Bar';



import DatatablePagination from './components/DatatablePagination';

import ChatHeading from './components/applications/ChatHeading';
import TableRecord from './components/TableRecord';
import {
  lineChartData,
  smallChartData1,
  doughnutChartData,
  pieChartData,
  polarAreaChartData,
  scatterChartData,
  barChartData
} from './data/charts';



const Video = styled.video`
  /* border: 1px solid blue; */
  width: 100%;
  /* height: 50%; */
`;

const surveyList = [
      {
        "id":1,
        "title": "COMPLETED",
        "createDate":"2020-06-01",
        "status": "COMPLETED",
        "category": "H.R. 7994",
        "labelColor": "#4F6577",
        "label": "Proccessed"
      },
      {
        "id":2,
        "title": "COMPLETED",
        "createDate":"2020-06-02",
        "status": "COMPLETED",
        "category": "H.R. 7994",
        "labelColor": "#4F6577",
        "label": "Yes"
      },
      {
        "id":3,
        "title": "COMPLETED",
        "createDate":"2020-06-02",
        "status": "COMPLETED",
        "category": "H.R. 7994",
        "labelColor": "#4F6577",
        "label": 'Yes'
      }
   ]

   const surveyDetailList = [
         {
           "id":1,
           "createDate":"2020-06-01",
           "title": "COMPLETED",
           "detail": "H.R. 7994",
           "category":"vbvbvn",
           "labelColor": "#4F6577",
           "label": "Yes"
         },
         {
           "id":2,
           "createDate":"2020-06-01",
           "title": "COMPLETED",
           "detail": "H.R. 7994",
           "category":"vbvbvn",
           "labelColor": "#4F6577",
           "label": "Yes"
         },
         {
           "id":3,
           "createDate":"2020-06-01",
           "title": "COMPLETED",
           "detail": "H.R. 7994",
           "category":"vbvbvn",
           "labelColor": "#4F6577",
           "label": "Yes"
         },
      ]

const bills = [
      {
      "createDate":"2020-06-01",
      "title": "H.R. 7994",
      "legislation#": "H.R. 7994 - To authorize the President to award the Purple Heart to Anselm \"Jerry\" Cramer for injuries incurred during the Korean War while a member of the Marine Corps.",
      "url": "https://www.congress.gov/bill/116th-congress/house-bill/7990",
      "vote": 'Yes',
      "race":{
        "White": 80,
        "Black": 80,
        "Asian": 80,
        "American Indian":20,
        "Native Hawaiian":10,
        "Alaska Native":30
     },
     "age":{
       "20's Age Group": 90,
       "30's Age Group": 90,
       "40's Age Group": 90,
       "50's Age Group":90,
       "60's Age Group":90,
       "70's Age Group":95,
       "80's Age Group":85
    },
    "party":{
        "Republican": 80,
        "Democrat": 80,
        "Independent": 50,
        "Libertarian":20,
        "Green":10,
        "Other":30
      }
    },
    {
      "createDate":"2020-06-02",
      "title": "H.R. 7993",
      "legislation#": "H.R. 7993 - To support the efforts of Community Development Financial Institutions (CDFIs), minority CDFIs, and minority depository institutions to serve consumers, small businesses, and minority-owned businesses, especially in low-income and underserved communities, and for other purposes.",
      "url": "https://www.congress.gov/bill/116th-congress/house-bill/7990",
      "vote": 'No',
      "race":{
        "White": 80,
        "Black": 60,
        "Asian": 80,
        "American Indian":20,
        "Native Hawaiian":10,
        "Alaska Native":30
     },
     "age":{
       "20's Age Group": 80,
       "30's Age Group": 80,
       "40's Age Group": 90,
       "50's Age Group":20,
       "60's Age Group":10,
       "70's Age Group":30,
       "80's Age Group":30
    },
    "party":{
        "Republican": 80,
        "Democrat": 80,
        "Independent": 80,
        "Libertarian":20,
        "Green":10,
        "Other":30
      }
    },
    {
      "createDate":"2020-06-01",
      "title": "H.R. 7992",
      "legislation#": "H.R. 7992 - To expand access to telehealth services, and for other purposes.",
      "url": "https://www.congress.gov/bill/116th-congress/house-bill/7990",
      "vote": 'No',
      "race":{
        "White": 80,
        "Black": 50,
        "Asian": 80,
        "American Indian":20,
        "Native Hawaiian":10,
        "Alaska Native":30
     },
     "age":{
       "20's Age Group": 80,
       "30's Age Group": 80,
       "40's Age Group": 90,
       "50's Age Group":20,
       "60's Age Group":10,
       "70's Age Group":30,
       "80's Age Group":30
    },
    "party":{
        "Republican": 80,
        "Democrat": 80,
        "Independent": 80,
        "Libertarian":20,
        "Green":10,
        "Other":30
      }
    }
]


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
      console.log('props',props)
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
    <img src={require(`../../../assets/images/${host.image}`)}
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
    src={require(`../../../assets/images/save.png`)}
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
              <img src={senderObject ? require(`../../../assets/images/${senderObject.image}`) : pics}
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
               <img src={otherObject ? require(`../../../assets/images/${otherObject.image}`) : pics}
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
                src={rep ? require(`../../../assets/images/${rep.image}`) : pics}
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
           src={require(`../../../assets/images/save.png`)}
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
          src={require(`../../../assets/images/save.png`)}
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


const VideoComponent = ({
  host,
  meetingId,
  height,
  attendees,
  activeUser,
  stream,
  userVideo,
  partnerVideo,
  incomingCall,
  users,
  yourID,
  callPeer,
  callAccepted,
}) => {
  const userData =
  activeUser
  && activeUser
  && attendees.length > 0
  && attendees.filter(res => {
    return res.userId == activeUser
  })
  // console.log('userData',userData)
  let UserVideo;
  if (stream) {
    UserVideo = (<Fragment>
       <div>
         <Video playsInline muted ref={userVideo} autoPlay />
          <audio controls>
            <source src="" type="audio/ogg" />
            <source src={""} type="audio/mpeg" />
          </audio>
       </div>
     </Fragment>
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  return <div  style={{
    width:'100%',
    backgroundColor:'black',
    padding:20,
    borderRadius:10,
    overflow:'auto'
  }}>

    <FormGroup className="">
      <Row>
        <div style={{
          position:'absolute',
          paddingLeft:2,
          color:'gray'
        }}>
        <Row>
           <Col sm={4} lg={4}>
           <img src={userData ? require(`../../../assets/images/${userData[0].image}`) : pics}
            style={{
             height:50,
             width:50,
             borderRadius:100
            }}
            alt=""
           />
           </Col>
           <Col sm={8} lg={8}>
               <div>{userData ? userData[0].name : 'Temp'}</div>
           </Col>
         </Row>
          Oct 20, 2020
        </div>
        <div style={{
          // height:400,
          width:500,
          marginBottom:30,

        }}>
        <div style={{
          paddingLeft:50,
          display:'flex',
          flexDirection:'row'
        }}>
          <div style={{
            color:'gray',
            paddingLeft:10
          }}>
              video description information
          </div>
        </div>
         {UserVideo
           ? UserVideo
           : userData && userData.length > 0
             ? <img src={require(`../../../assets/images/${userData[0].image}`)}
               style={{
                width:"100%",
                height:"240",
                borderRadius:25
               }}
               alt=""
              />
           : <video width="100%" height="240" controls>
            <source src={tempVideo} type="video/mp4"/>
          Your browser does not support the video tag.
          </video>}

          {PartnerVideo && PartnerVideo}


          <CommenstFieldHeader />

         <div style={{
           display:'flex',
           flexDirection:'row'
         }}>
           {Object.keys(users).map((key,index) => {
             if (key === yourID) {
               return null;
             }
             return (
               <button key={'fklisshg'+index} onClick={callPeer(key)}>Add Guest {key}</button>
             );
           })}
         </div>
         <div style={{
           display:'flex',
           flexDirection:'row'
         }}>
           {incomingCall}
         </div>
        </div>
      </Row>


      <hr/>
    </FormGroup>
  </div>
}


const UserProfile = ({
  host,
  meetingId,
  attendees,
  stream,
  incomingCall,
  users,
  yourID,
  callPeer,
  callAccepted,
  // partnerVideo,
  setActiveUser
}) => {


  let listData = attendees.map((item, index) => (<div
    key={'ljfrj'+index}
    onClick={()=>{
      setActiveUser(item.userId)
    }}>
    <div style={{
      flexDirection:'column',
    }}>
      {item.msg
        ? <span style={{
        position:'absolute',
        top:50,
        // left:1,
        height:25,
        width:25,
        borderRadius:'100%',
        // borderWidth:2,
        // backgroundColor:'green',
      }}>
         <i className="fas fa-comments" style={{color:'#FA8072'}}></i>
      </span>
    : null}
    <img src={require(`../../../assets/images/${item.image}`)}
      className="mb-2"
      style={{
        border:'1px solid #FA8072',
       // marginTop:20,
       padding:5,
       height:50,
       width:50,
       marginTop:10,
       marginRight:10,
       marginLeft:10,
       borderRadius:100
      }}
      alt=""
     />
    <p style={{
    fontSize:10,
    marginRight:10,
    marginLeft:10,
    overflowWrap: 'break-word',
    width: 50

  }}>
      {item.name && item.name.length >14
      ? `${item.name.substring(0,14)}...`
      : item.name}
    </p>
   </div>
 </div>))

   listData.unshift(<div
     key={'sdljfrj'}
     onClick={()=>{
       setActiveUser('')
     }}
     // onClick={()=>{
     // setActiveUser('')
   // }}
   >
   {/*PartnerVideo ? PartnerVideo : */}
   <img src={require(`../../../assets/images/${host.image}`)}
     className="mb-2"
     style={{
       border:'1px solid #FA8072',
      // marginTop:20,
      padding:5,
      height:100,
      width:100,
      margin:10,
      borderRadius:100
     }}
     alt=""
    />
    <p style={{
    fontSize:10,
    // marginRight:10,
    // marginLeft:10,
    overflowWrap: 'break-word',
    width: '100%',
    textAlign:'center',
    fontWeight:'bold',
  }}>
        <span style={{
          color:'#FA8072'
        }}>Host: </span>
        {host ? host.name : ''}
    </p>
     {/*<video
      style={{
     height:100,
     width:100,
     margin:10
   }} controls>
      <source src={tempVideo} type="video/mp4"/>
    Your browser does not support the video tag.
    </video>*/}
   </div>)



  return <Row>
  <Col lg={12} sm={12}>
      <ScrollMenu
          alignCenter={false}
          // arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
          // arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
          data={listData}
        />
    </Col>
    </Row>
   }

   const ViewOptions = ({setWatch}) => {
     return <Row style={{
     }}>
        <Col
         onClick={()=>{
           setWatch(true)
         }}
        style={{
          padding:12,
          height:50,
          backgroundColor:'#2096F3',
          width:'50%',
          textAlign: 'center',
          color:'white'
        }}>
          Watch
        </Col>
        <Col
        onClick={()=>{
          setWatch(false)
        }}
        style={{
          padding:12,
          height:50,
          backgroundColor:'#cfcfc4',
          width:'50%',
          textAlign: 'center',
          color:'black'
        }}>
          Comments
        </Col>
     </Row>
   }


const Home = ({
  user,
  messages,
  host,
  meetingId,
  attendees,
  height,
  width,
  onHandleQuery,
  info
}) => {
  // const myRef = useRef(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [watch, setWatch] = useState(false);
  const [activeNav, setActiveNav] = useState('watch');
  const [selectedLike, setSelectedLike] = useState(-1);
  const [navItems, setNavItems] = useState([
      { id: 1 , idnm : "watch", navheading: "Watch" },
      { id: 2 , idnm : "comments", navheading: "Comments" }
  ])
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [activeUser, setActiveUser] = useState('');

  let eventCalendar = {
      title: 'Sample Event',
      description: 'This is the sample event provided as an example only',
      location: 'Portland, OR',
      startTime: '2016-09-16T20:15:00-04:00',
      endTime: '2016-09-16T21:45:00-04:00'
  };


  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const dataInfo = useRef();

  // console.log('watch',watch)

  // const usePathname = () => {
  //   const location = useLocation();
  //   return window.location.href;
  // }

  useEffect(() => {
    // alert(2)
    console.log('location',window.location.href);
    // console.log(props.match);
    // console.log(props.history);

         const formData1 = {
		         request:'insert',
		         query: {},
		         resource: 'vare_elections_favs',
		         check:['key_id','user_id']
		       }

           const formData2 = {
              request:'search',
              query: {member_id: 'H001075'},
              resource:'vare_meetings',
              id:''
            }

            const formData3 = {
               request:'get',
               resource: 'vare_meetings'
            }

           const formData = {
   		         request:'insert',
   		         query: {},
   		         resource: '',
   		         check:['key_id','user_id']
   		       }

    onHandleQuery(formData3)
    dataInfo.current = info
    console.log('info',info);



  }, [info]);

  const callPeer = (id) => { //alert(id)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "DEEAJIBOLA@GMAIL.COM",
                credential: "2813101942"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "DEEAJIBOLA@GMAIL.COM",
                credential: "2813101942"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => { //alert(55)
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }


  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall",
      {
        signal: data,
        to: caller
      })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }


  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }

  // console.log('callAccepted',callAccepted)

  const PageMenu = () => {
    return <div style={{
          height:10
        }}
        className="navbar navbar-home">
      <div className="navbar-inner">

        <div className="subnavbar">
          <div className="subnavbar-inner">
            <div className="toolbar tabbar tabbar-scrollable toolbar-category">
              <div className="toolbar-inner">
                <div className="right">
                  <a href="#">
                    <h4>Jonathan</h4>
                    <img src="images/author.jpg" alt="" />
                  </a>
                </div>
                {/*<span href="#tab1"
                  onClick={()=>setActiveNav('home')}
                  className={`tab-link ${activeNav=='home' && 'tab-link-active'}`}>
                   {'Home'}
                </span>*/}
                {navItems && navItems.length>0
                  ? navItems.map((res,index) => {
                    return <span
                      key={'sjdh'+index}
                      onClick={()=>setActiveNav(res.idnm)}
                      href="#tab1"
                      className={`tab-link ${activeNav==res.idnm && 'tab-link-active'}`}
                    >
                      {res.navheading}
                    </span>
                  }):
                null}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  }

      const ScrollDemo = () => {
       return (<div style={{
         borderStyle: 'solid',
         borderColor:'gray',
         borderRadius:25,
         width:'100%',
         height:30,
         paddingLeft:20,
         margin:10,
            overflowX:'auto'
       }}>
         <span>
             Element sdddddsddssddsdsdsd dsssdds sdsddsdsd sdsdsdsds sddsdsd sdsdsdd sdsdddsd sdsdddssddsd sddsddsd ddsdsddd aasas asasasa asasasa assaasa asasa sddssdd sdsdsdsd to scroll to
         </span>
      </div>
       )
    }

    return (<React.Fragment>

        <div className="" id="contact"
        style={{
          paddingTop:50,
          backgroundColor:'#f2f3f5',
          // height:height,
          // overflowY:'auto',
        }} >
        {/*<ViewOptions setWatch={setWatch.bind(this)} />*/}
        <div className="borderSolid" style={{
          width:'100%',
          height:50,
          top:0,
          zIndex:99,
          position: 'absolute',
          backgroundColor:'#D6DBDF'
        }}>
        <PageMenu  />
      </div>
          <Container>
              <Row className="mt-4">
                 <Col lg={12} sm={12}>
                   <UserProfile
                     user={user}
                     host={host}
                     meetingId={meetingId}
                     setActiveUser={setActiveUser}
                     attendees={attendees}
                     callAccepted={callAccepted}
                     stream={stream}
                     incomingCall={incomingCall}
                     users={users}
                     yourID={yourID}
                     callPeer={callPeer.bind(this)}
                   />

                   <AddToCalendar event={eventCalendar} />

                     {/*<ScrollDemo />*/}

                  <Row style={{
                    paddingBottom:50
                  }} className="container" >
                      {
                      !isMobile
                      ? <Fragment>
                        <SurveyListItem
                          item={surveyList[0]}
                          handleCheckChange={()=>{alert(6)}}
                          isSelected={false}
                        />
                        <SurveyDetailCard
                          survey={surveyDetailList[0]}
                          handleCheckChange={()=>{alert(6)}}
                          isSelected={false}
                        />
                        <SliderTooltip
                        />
                         <Colxx className={"card"} lg={6} sm={6} >
                           <SmallLine
                             data={smallChartData1}
                           />
                         </Colxx>
                         <Colxx className={"card"}  lg={6} sm={6} >
                          <div  className={"chart card-body pt-0"} >
                             <Line
                               data={lineChartData}
                             />
                          </div>
                         </Colxx>

                         <Colxx className={"card"}  lg={6} sm={6} >
                           <Doughnut
                              data={doughnutChartData}
                           />
                         </Colxx>

                         <Colxx className={"card"}  lg={6} sm={6} >
                           <Pie
                              data={pieChartData}
                           />
                         </Colxx>

                         <Colxx className={"card"}  lg={6} sm={6} >
                           <PolarArea
                              data={polarAreaChartData}
                           />
                         </Colxx>

                         <Colxx className={"card"}  lg={3} sm={3} >
                           <Scatter
                              data={scatterChartData}
                           />
                         </Colxx>

                         <Colxx className={"card"}  lg={6} sm={6} >
                           <Bar
                              data={barChartData}
                           />
                         </Colxx>



                         <Col className={activeNav=='watch' ? "commenstField mb-3" : "vdeoComponent mb-3"} lg={6} sm={6} >
                         <CommentList
                          user={user}
                          setActiveUser={setActiveUser}
                          selectedLike={selectedLike}
                          setSelectedLike={setSelectedLike}
                           messages={messages}
                           host={host}
                           meetingId={meetingId}
                           attendees={attendees}
                           activeUser={activeUser}
                         />
                        </Col>
                      </Fragment>
                      : activeNav=='watch'
                      ? <Fragment>
                      <SurveyListItem
                        item={surveyList[0]}
                        handleCheckChange={()=>{alert(6)}}
                        isSelected={false}
                      />
                      <SurveyDetailCard
                        survey={surveyDetailList[0]}
                        handleCheckChange={()=>{alert(6)}}
                        isSelected={false}
                      />
                      <SliderTooltip
                      />
                      </Fragment>
                       : <Col className="commenstField" lg={12} sm={12} >
                           <CommentList
                             user={user}
                             selectedLike={selectedLike}
                             setSelectedLike={setSelectedLike}
                             messages={messages}
                             host={host}
                             meetingId={meetingId}
                             attendees={attendees}
                             activeUser={activeUser}
                           />
                        </Col>
                      }
                </Row>
               </Col>

            </Row>
            </Container>
        </div>
    </React.Fragment>
    );
  }

    const styleInfo = {
      wrapPadMyText: {
        margin:10,
        paddingTop:60,
        fontSize:10,
        color:'white',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto'
      },
      wrapMyText: {
        fontSize:10,
        color:'white',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto'
      }
    }

    const mapStateToProps = (state, ownProps) => {
      const storeData = state
      console.log('contentmapStateToProps',state)
      return {
        info: storeData.keyInfo
      }
    }

    const mapDispatchToProps = dispatch => {
      return {
        onHandleQuery: (formData) => {
          dispatch(handleQuery(formData))
        },
        onLogoutFromView: () => {
          dispatch(logoutFromView())
        }
      }
    }

    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(Home)
// export default Home;
