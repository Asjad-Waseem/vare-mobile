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

import { connect } from 'react-redux'
import { handleQuery, generalSuccess }
  from '../../../redux/actions/keyInfoActions'
  import { logoutFromView }
  from '../../../redux/actions/authActions'

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

// require('dotenv').config()


const videoFeeds = {
}

const data = ['Alexandre', 'Thomas', 'Lucien']

const listItem = [1,2,3,4,5,6,7,8,9]


const Home = ({
  info,
  onHandleQuery
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);
  const [height, setWindowHeight] = useState(window.innerHeight + 'px');
  const [width, setWindowWidth] = useState(window.innerWidth + 'px');
  const [user, setUser] = useState({
     name: 'Stacy',
     user_id: 'test@test6.com',
     msg: true,
   });

  const meetingId = useRef();
  const meetingDetails = info && info['vare_meetings'] && info['vare_meetings'].response;
  const meetingRSVP = info && info['vare_meeting_rsvp']  && info['vare_meeting_rsvp'].response;
  const meetingComments = info && info['vare_meeting_comments']  && info['vare_meeting_comments'].response;

  useEffect(() => {

  }, []);


  useEffect(() => { //alert(8)
    // socket.current = io.connect("/");
     setWindowHeight(window.innerHeight + 'px')
     setWindowWidth(window.innerWidth + 'px')
     // console.log('height',width)
  // }, []);
  //
  // useEffect(() => { //alert(8)

       const url = window.location.href
       if(url.includes('meeting/')){
            const urlV1 = url && url.split('meeting/')
            meetingId.current = urlV1 && urlV1[1]
            console.log('location',meetingId.current);
       }

       const formData1 = {
           request:'insert',
           query: {},
           resource: 'vare_elections_favs',
           check:['key_id','user_id']
        }

         const formData2 = {
            request:'search',
            query: {meeting_id: meetingId.current ? meetingId.current : {}},
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

         const formData4 = {
            request:'search',
            query: {meeting_id: meetingId.current ? meetingId.current : {}},
            resource:'vare_meeting_rsvp',
            id:''
        }

        const formData5 = {
           request:'search',
           query: {meeting_id: meetingId.current ? meetingId.current : {}},
           resource:'vare_meeting_comments',
           id:''
       }

        onHandleQuery(formData2)

         onHandleQuery(formData4)

         onHandleQuery(formData5)




        // console.log(myFacebook)
         // alert(process.env.REACT_APP_API_BASE_URL)
         // dataInfo.current = info
         // setMeetingDetails(info.driver && info.driver.response ? info.driver.response : [])
        // console.log('meetingDetails',meetingDetails);


   }, []);

   const saveMeetingComment = (e) => {
     console.log('newMessagexx',e)
     const formData = {
         request:'insert',
         query: e,
         resource: 'vare_meeting_comments',
         check:['date']
     }
     onHandleQuery(formData)
   }


    return (<React.Fragment>
                <MobileViewComp
                 meetingRSVP={meetingRSVP}
                 meetingDetails={meetingDetails}
                 meetingComments={meetingComments}
                 user={user}
                 meetingId={meetingId.current}
                 saveMeetingComment={saveMeetingComment}
                 // attendees={attendees.data}
                 // messages={attendees.messages}
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

  const mapStateToProps = (state, ownProps) => {
    const storeData = state
    // console.log('contentmapStateToProps',state)
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
