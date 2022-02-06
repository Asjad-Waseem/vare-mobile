import React, {
  Fragment,
  useEffect,
  useRef,
  useState
} from "react";

import {
  Colxx,
  Separator
} from '../../mycomponents/common/CustomBootstrap';
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";

import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import ScrollMenu from "react-horizontal-scrolling-menu";
import VideoControls from "./VideoControls";
import Draggable from 'react-draggable-component';
import LiveChats from "./LiveChats";
import addDefaultSrc from "./addDefaultSrc";
import ReactPlayer from 'react-player'



const Container = styled.div `
    padding: 20px;
    height: 100vh;
    width: 90%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video `
    flexDirection:'row',
    height: 40%;
    width: 100%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
      props.peer.on("stream", stream => {
        ref.current.srcObject = stream;
      })
    }, []);

    return ( < div style = {
        {
          margin: 3
        }
      } >
      <
      StyledVideo playsInline controls autoPlay ref = {
        ref
      }
      /> <
      /div>);
    }


    const videoConstraints = {
      height: window.innerHeight / 2,
      width: window.innerWidth / 2
    };

    const VideoCofRoom = (props) => {
        const [peers, setPeers] = useState([]);
        const [guestUsers, setGuestUsers] = useState([]);
        const [videoStarted, setVideoStarted] = useState(false);
        const [showComments, setShowComments] = useState(false);
        const [msg, setMsg] = useState([{
            date: '1/22/20',
            name: 'Guest User6',
            user_id: 'test@test6.com',
            comment: 'Looking fwd to using this platform',
            emoji: 'fa-heart'
          },
          {
            date: '1/22/20',
            name: 'Guest User4',
            user_id: 'test@test4.com',
            comment: 'Awsome idea.. Very timely!',
            emoji: 'fa-heart'
          },
          {
            date: '1/22/20',
            name: 'Guest User3',
            user_id: 'test@test3.com',
            comment: 'Good job!',
          }
        ]);
        const [guestUsersIndex, setGuestUsersIndex] = useState([]);

        const [uniqueName, setUniqueName] = useState([props.user.user_id]);



        const videoStatus = useRef(false);
        const audioStatus = useRef(true);
        const socketRef = useRef();
        const userVideo = useRef();
        const peersRef = useRef([]);
        const roomDetails = {
          roomID: props.roomID,
          guestID: props.activeUser.userId,
          vareName: props.user.name,
          vareID: props.user.user_id
        }

        useEffect(() => {
          // console.log('xxguestUsersIndex',guestUsersIndex)
        }, [guestUsersIndex]);

        useEffect(() => {
          if (props.initialVideoStatus) {
            videoStatus.current = false
          }
        }, []);

        const updatChatList = (chat) => {
          // msg.unshift([chat])
          // const newChats = [...msg,...chat]
          const newChats = [...chat]
          newChats.sort((a, b) => {
            var dateA = new Date(a.date).getTime();
            var dateB = new Date(b.date).getTime();
            return dateA > dateB ? -1 : 1;
          })
          setMsg(newChats)
          // console.log('xxx',newChats)
        }

        const getMonthFromString = (mon) => {
          return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
        }

        const saveChatList = (chat) => {
          // console.log('msgzzz',chat)
          // socketRef.current = io.connect("https://meeting.varehall.com", { origins: '*:*'});
          socketRef.current = io.connect("http://localhost:5000", {
            origins: '*:*'
          });
          socketRef.current.emit("save chat", chat);
          socketRef.current.on("chat message", chat => {
            const newChats = [...chat]
            newChats.sort((a, b) => {
              var dateA = new Date(a.date).getTime();
              var dateB = new Date(b.date).getTime();
              return dateA > dateB ? -1 : 1;
            })
            setMsg(newChats)
            // console.log('newChats',newChats)

          })
        }

        const deleteChat = (chat) => {
          console.log('msg', chat)

          chat.id = chat._id
          chat.resource = 'vare_web_chat'
          // socketRef.current = io.connect("https://meeting.varehall.com", { origins: '*:*'});
          socketRef.current = io.connect("http://localhost:5000", {
            origins: '*:*'
          });
          socketRef.current.emit("delete chat", chat);
          socketRef.current.on("chat message", chat => {
            const newChats = [...chat]
            newChats.sort((a, b) => {
              var dateA = new Date(a.date).getTime();
              var dateB = new Date(b.date).getTime();
              return dateA > dateB ? -1 : 1;
            })
            setMsg(newChats)
            // console.log('msg',chat)
          })
        }

        // const addDefaultSrc = (ev) => {
        //    ev.target.src = "https://varefiles.s3.us-east-2.amazonaws.com/icon.png"
        // }

        function startVideoSession() {
          setVideoStarted(true)
          // props.parentVideoStatus(true)
          // socketRef.current = io.connect("https://meeting.varehall.com", { origins: '*:*'});
          if (!props.roomID) return
          // socketRef.current = io.connect("http://localhost:5000", { origins: '*:*'});
          socketRef.current = io.connect("https://meeting.varehall.com", {
            origins: '*:*'
          });
          // socketRef.current = io.connect("/");
          navigator.mediaDevices.getUserMedia({
            video: videoStatus.current,
            audio: true
          }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomDetails);
            socketRef.current.on("all users", response => {
              const users = response.users
              const guests = response.guests

              const peers = [];
              users.forEach(userID => {
                const peer = createPeer(userID, socketRef.current.id, stream);
                peersRef.current.push({
                  peerID: userID,
                  peer
                })
                peers.push(peer);
              })
              setPeers(peers);
              sendInfo(users, guests)
            })

            socketRef.current.on("user joined", payload => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                peerID: payload.callerID,
                peer
              })
              setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
              const item = peersRef.current.find(p => p.peerID === payload.id);
              item.peer.signal(payload.signal);
            });
          })
        }

        const shouldStop = useRef(false) //setShouldStop] = useState(false);
        const [stopped, setStopped] = useState(true);
        const downloadLink = useRef() //document.getElementById('download');
        const stopButton = document.getElementById('stop');

        const mediaRecorder = useRef();
        const recordedBlobs = useRef([])
        const download = useRef(null);


        const startAudioRecord = async () => {
          // alert(1)
          // https://developers.google.com/web/fundamentals/media/recording-audio
          const options = {
            mimeType: 'audio/webm'
          };
          // const recordedChunks = [];
          mediaRecorder.current = new MediaRecorder(userVideo.current.srcObject, options);
          console.log('startAudioRecord', mediaRecorder.current)
          mediaRecorder.current.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobs.current);
          };
          mediaRecorder.current.ondataavailable = handleDataAvailable;
          mediaRecorder.current.start();
        }

        const handleDataAvailable = (event) => {
          console.log('handleDataAvailable', event);
          if (event.data && event.data.size > 0) {
            recordedBlobs.current.push(event.data);
          }
        }

        const stopRecording = () => {
          console.log('stop recording');
          mediaRecorder.current.stop();
        }

        const downloadRecording = () => {
          console.log('downloadRecording');
          const blob = new Blob(recordedBlobs.current, {
            type: 'video/mp4'
          });
          const url = window.URL.createObjectURL(blob);
          console.log('downloadxx', url);
          const a = download.current //document.createElement('a');
          // a.style.display = 'none';
          a.href = url;
          a.download = 'test.mp4';

          // download.current.props.href =
          // document.body.appendChild(a);
          // a.click();
          // setTimeout(() => {
          //   document.body.removeChild(a);
          //   window.URL.revokeObjectURL(url);
          // }, 100);
        }



        const sendInfo = async (users, guests) => {
          // console.log('guestsIndex',users,guests)

          const newGuest = await users.map((userID, index) => {
            const tempGuest = guests[props.meetingId] &&
              guests[props.meetingId][userID] &&
              guests[props.meetingId][userID].split('__') &&
              guests[props.meetingId][userID].split('__')[1] ?
              guests[props.meetingId][userID].split('__')[1] :
              'NA'
            return tempGuest
          })
          if (guestUsersIndex.length > 0) {
            setGuestUsersIndex([...guestUsersIndex, ...newGuest])
          } else {
            setGuestUsersIndex([...newGuest])
          }
          // console.log('yyguestsIndex',newGuest,guestUsersIndex)
        }




        function createPeer(userToSignal, callerID, stream) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peer.on("signal", signal => {
            socketRef.current.emit("sending signal", {
              userToSignal,
              callerID,
              signal,
              vareName: props.user.name,
              vareID: props.user.user_id
            })
          })
          // console.log('peer',peer)
          return peer;
        }

        function addPeer(incomingSignal, callerID, stream) {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
          })

          peer.on("signal", signal => {
            socketRef.current.emit("returning signal", {
              signal,
              callerID
            })
          })

          peer.signal(incomingSignal);

          return peer;
        }

        function muteVideo() {
          if (videoStarted == false) {
            startVideoSession()
          } else {
            navigator.mediaDevices.getUserMedia({
                video: videoStatus.current,
                audio: audioStatus.current
              })
              .then(stream => {
                userVideo.current.srcObject = stream;
              })
          }
        }



        // console.log('userVideo',userVideo.current && userVideo.current.srcObject)

        return ( < Card className = "mb-6"
            style = {
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 900,
                // backgroundColor:'red',
                paddingBottom: 350,
                // marginBottom:300
              }
            } >
            <
            div style = {
              {
                width: '100%',
                position: 'absolute',
                left: 0,
                top: 0,
              }
            } >
            <
            VideoControls {
              ...props
            }
            downloadLink = {
              downloadLink
            }
            user = {
              props.user
            }
            videoToggle = {
              () => {
                if (audioStatus.current == false &&
                  videoStatus.current) {
                  alert("You are about to exit this meeting since. At least one of audio and video must be requested")
                } else {
                  videoStatus.current == true ?
                    videoStatus.current = false :
                    videoStatus.current = true
                  muteVideo()
                }
              }
            }
            audioToggle = {
              () => {
                if (videoStatus.current == false &&
                  audioStatus.current) {
                  alert("You are about to exit this meeting since. At least one of audio and video must be requested")
                } else {
                  audioStatus.current == true ?
                    audioStatus.current = false :
                    audioStatus.current = true
                  muteVideo()
                }
              }
            }
            videoStatus = {
              videoStatus.current
            }
            showComments = {
              () => {
                setShowComments(true)
              }
            }
            disconnectVideo = {
              () => {
                window.location.reload(false);
              }
            }
            startAudioRecord = {
              () => {
                setStopped(false)
                startAudioRecord()
              }
            }
            setShouldStop = {
              () => {
                setStopped(true)
                stopRecording()
              }
            }
            downloadRecording = {
              () => {
                setStopped(false)
                downloadRecording()
              }
            }
            stopped = {
              stopped
            }
            /> <
            /div> {
              /*<a
                          onClick={()=>{
                            downloadRecording()
                          }}
                          ref={download}
                          style={{
                          // display:'none'
                        }} href="#" >
                          Download
                        </a>*/
            } {
              /*download.current
                          && download.current.href
                          ? <ReactPlayer url={download.current.href} playing />
                         : null*/
            }

            <
            div style = {
              {
                width: '100%',
                position: 'absolute',
                left: 0,
                bottom: 0
              }
            } >
            <
            div >
            <
            div style = {
              {
                bottom: 150,
                position: 'absolute',
                zIndex: 9,
                height: 180,
                overflowY: 'auto',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,.29)',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingTop: 10,
                paddingLeft: 10,
                paddingBottom: 250
              }
            } >

            {
              msg &&
              msg.length &&
              msg.length > 0 &&
              msg.map((rep, index) => {
                  const unique = uniqueName.indexOf(rep.user_id)
                  if (unique == -1) {
                    setUniqueName([...uniqueName, rep.user_id])
                  }
                  return <div
                  key = {
                    'ssddcdp' + index
                  }
                  style = {
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        paddingBottom: 5
                      }
                    } >
                    <
                    img
                  onError = {
                    (e) => addDefaultSrc(e, rep, unique)
                  }
                  src = {
                    rep.user_id && `https://varefiles.s3.us-east-2.amazonaws.com/${rep.user_id.replace('.com','.jpg')}`
                  }
                  style = {
                    {
                      height: 40,
                      width: 40,
                      borderRadius: 100
                    }
                  }
                  alt = "" /
                    >
                    <
                    div style = {
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: 10
                      }
                    } >
                    <
                    div style = {
                      {
                        fontSize: 12,
                        fontWeight: 'bold'
                      }
                    } > {
                      rep.name
                    } < /div> <
                    div style = {
                      {
                        fontSize: 10,
                        flexDirection: 'row'
                      }
                    } > {
                      rep.emoji ?
                      < i
                      style = {
                        {
                          color: rep.emoji == 'fa-thumbs-up' ?
                            'green' :
                            rep.emoji == 'fa-thumbs-down' ?
                            '#ff6961' :
                            rep.emoji == 'fa-heart' ?
                            '#ff9700' :
                            ''
                        }
                      }
                      className = {
                        `fas fa-x ${rep.emoji ? rep.emoji : ""}`
                      } > < /i> :
                        null
                    } <
                    span style = {
                      {
                        color: 'white'
                      }
                    } > {
                      rep.comment
                    } < /span> {
                      props.user &&
                        props.user.user_id &&
                        props.user.user_id == rep.user_id ?
                        < div
                      onClick = {
                        () => {
                          deleteChat(rep)
                        }
                      }
                      style = {
                          {
                            position: 'absolute',
                            color: 'white',
                            right: 30
                          }
                        } >
                        <
                        i
                      className = {
                        `fas fa-trash-alt`
                      }
                      /> <
                      /div> : null} <
                      hr style = {
                        {
                          width: 300,
                          backgroundColor: '#f2f3f5'
                        }
                      }
                      /> <
                      /div>

                      <
                      /div> <
                      /div>

                    })
              }

              <
              /div> <
              LiveChats {
                ...props
              }
              // socketRef={socketRef}
              saveChatList = {
                (chat) => {
                  saveChatList(chat)
                }
              }
              updatChatList = {
                (chat) => {
                  updatChatList(chat)
                }
              }
              /> <
              /div>

              <
              /div>



              <
              div style = {
                {
                  display: 'flex',
                  height: 300,
                  overflowY: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              } >
              <
              CardBody className = "align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center" >
              <
              div
              className = "list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1" >

              <
              div >
              <
              StyledVideo muted ref = {
                userVideo
              }
              controls autoPlay playsInline
              poster = {
                `https://varefiles.s3.us-east-2.amazonaws.com/${props.user.user_id.replace('.com','.jpg')}`
              }
              /> <
              span style = {
                {
                  color: 'red'
                }
              }
              className = "align-middle d-inline-block" > {
                userVideo.current && userVideo.current.srcObject ? props.user.name : 'Turn on Video to Join Meeting'
              } <
              /span> {
                peers && peers.length > 0 ?
                  peers.map((peer, index) => {
                      // console.log('xxxccc',guestUsersIndex && )
                      return ( < div style = {
                          {
                            paddingTop: 50
                          }
                        }
                        key = {
                          'jhgh' + index
                        } >
                        <
                        Video style = {
                          {
                            height: '100%'
                          }
                        }
                        key = {
                          'vvvxss' + index
                        }
                        peer = {
                          peer
                        }
                        /> {
                          guestUsersIndex && < div > {
                              guestUsersIndex &&
                              guestUsersIndex[0] ?
                              guestUsersIndex[0] :
                                'Guest User'
                            } < /div>} <
                            /div>);
                        }): null
                    } <
                    /div> <
                    /div> <
                    /CardBody> <
                    /div> <
                    /Card>
                  );
              };

              export default VideoCofRoom;