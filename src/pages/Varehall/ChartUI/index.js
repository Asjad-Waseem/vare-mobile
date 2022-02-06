import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ScrollMenu from "react-horizontal-scrolling-menu";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from 'react-player'
import '../style.css'; // Tell webpack that Button.js uses these styles
import Cards, { Card } from 'react-swipe-card'
import CommentsBlock from 'simple-react-comments';
import BrowserViewComp from '../browser';
import MobileViewComp from './info';

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

//Import Section Title
import SectionTitle from "../../../components/common/section-title";

//Import Images
import map from "../../../assets/images/features/map.png";
import pics from "../../../assets/images/04.jpg";
import pics5 from "../../../assets/images/05.jpg";
import VideoApp from "../video";

import "../info.css";


const videoFeeds = {
}

const data = ['Alexandre', 'Thomas', 'Lucien']

const listItem = [1,2,3,4,5,6,7,8,9]


const Home = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [height, setWindowHeight] = useState(window.innerHeight + 'px');
  const [width, setWindowWidth] = useState(window.innerWidth + 'px');
  const [user, setUser] = useState(111);
  const [meetingDetails, setMeetingDetails] = useState({
      duration:1,
      committee:'committee',
      meeting_id:'calendarId',
      member_id:'member_id',
      bill_id:'bill_id',
      bill_title:'bill_title',
      author:'author',
      content:'this.props.title ',
      description:'description',
      publishedAt:new Date(),
      title:'this.props.title ',
      url:"",
      urlToImage:"",
      comments:4,
      shares:3,
      likes:7,
      length:2,
      installId:'Constants.installationId'
  })

  const [attendees, setAttendees] = useState({
     meetingId:100,
     host: {
        name: 'John Larry',
        userId: 1,
        image:"06.jpg",
        msg: true,
      },
     data: [
       {
         name: 'John Larry',
         userId: 111,
         image:"03.jpg",
         msg:true
       },
       {
         name: 'John Larry',
         userId: 1,
         image:"03.jpg",
         msg:true
       },
       {
         name: 'John Doe',
         userId: 2,
         image:"08.jpg",
         msg:false
       },
       {
         name: 'John Doe2',
         userId: 3,
         image:"10.jpg"
       },
       {
         name: 'John Doe3',
         userId: 4,
         image:"04.jpg",
         msg:true
       },
       {
         name: 'John Doe4',
         userId: 5,
         image:"05.jpg"
       },
       {
         name: 'John Doe5',
         userId: 6,
         image:"06.jpg",
         msg:true
       },
       {
         name: 'John Doe6',
         userId: 7,
         image:"07.jpg",
         msg:true
       }
     ],
      messages:[
        {
          time:'10:30',
          message:'test message for vare application',
          replyId:'',
          senderId:1,
        },
        {
            time:'10:33',
            message:'test message for vare application',
            replyId:'',
            senderId:1,
        },
        {
          time:'10:30',
          message:'test message for vare application sdsd sdsdsd sdsdsd sdsdsds sdsdsds sdsdsds',
          replyId:3,
          senderId:2,
          likes:[2,3,4,5,6,7]
        },
        {
          time:'10:30',
          message:'I dont agree that thisngs work that way.  We need to take this offline to discuss further.',
          replyId:3,
          senderId:4,
          likes:[2,3,4,5]
        }
      ]})

  useEffect(() => { //alert(8)
    // socket.current = io.connect("/");
     setWindowHeight(window.innerHeight + 'px')
     setWindowWidth(window.innerWidth + 'px')
     // console.log('height',width)
  }, []);


    return (<React.Fragment>
                <MobileViewComp
                 user={user}
                 host={attendees.host}
                 meetingId={attendees.meetingId}
                 attendees={attendees.data}
                 messages={attendees.messages}
                 height={height}
                 width={width}
                />
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

export default Home;
