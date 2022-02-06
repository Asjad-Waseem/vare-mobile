import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import ScrollMenu from "react-horizontal-scrolling-menu";

// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from 'react-player'
import './style.css'; // Tell webpack that Button.js uses these styles
import Cards, { Card } from 'react-swipe-card'
import CommentsBlock from 'simple-react-comments';


//Import Section Title
import SectionTitle from "../../../components/common/section-title";

//Import Images
import map from "../../../assets/images/features/map.png";
import pics from "../../../assets/images/04.jpg";
import pics5 from "../../../assets/images/05.jpg";
import VideoApp from "./video";

import "./info.css";


const videoFeeds = {
}




const CommentsList = ({listItem}) => {
  return <Row style={{
  }}><ul className="comments">
    <li className="comment">
      <a href="#"
      title="View this user profile"
      className="">
        <img src={pics}
          style={{
           height:40,
           width:40,
           borderRadius:100
          }}
          alt=""
         />
      </a>
      <div className="meta">Kasper | 2012.07.24 14:58 <a className="reply">Reply</a></div>
      <div className="body">Cupcake ipsum dolor sit amet. Icing donut cheesecake muffin marzipan chocolate biscuit. Sweet roll chocolate marzipan.</div>
    </li>

    <li className="comment">
      <a href="#" title="View this user profile" className="">
      <img src={pics}
        style={{
         height:40,
         width:40,
         borderRadius:100
        }}
        alt=""
       />
      </a>
      <div className="meta">Jane | 2012.07.24 15:32  <a className="reply">Reply</a></div>
      <div className="body">Cupcake ipsum dolor sit amet. Icing donut cheesecake muffin marzipan chocolate biscuit.</div>
    </li>

    <li className="comment">
      <a href="#" title="View this user profile" className="">
      <img src={pics}
        style={{
         height:40,
         width:40,
         borderRadius:100
        }}
        alt=""
       />
      </a>
      <div className="meta">Jane | 2012.07.24 15:32  <a className="reply">Reply</a></div>
      <div className="body">Cupcake ipsum dolor sit amet. Icing donut cheesecake muffin marzipan chocolate biscuit.</div>
    </li>
  </ul>
  </Row>
}

const CommenstField = () => {
  const [comments, setComments] = useState([]);

  return <div style={{
        // overflow:'auto'
      }}>
           <div>
              <textarea
                style={{
                  backgroundColor:'#cfcfc4'
                }}
                className="css-u55gqp" name="comment-text" id="comment-text"
                placeholder="Leave a comment">
                </textarea>
              <Row>
              <Col sm={12} lg={12}>
                <button className={'css-oot9fd'} >
                  POST
                </button>
              </Col>

               <Col sm={12} lg={12}>
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
                              }}>Like</div>
                            </div>
                            <div className="font10">
                              <div><i className="fas fa-share"></i></div>
                              <div style={{
                                color:'gray'
                              }}>Share</div>
                            </div>
                            <div className="font10">
                              <div><i className="fas fa-cloud"></i></div>
                              <div style={{
                                color:'gray'
                              }}>Save</div>
                            </div>
                 </Row>
                 </Col>


              </Row>
              <CommentsList />
          </div>
      </div>
  }


const VideoComponent = () => {
  return <div style={{
    width:'100%',
    backgroundColor:'white',
    padding:20,
    borderRadius:10,
    overflow:'auto'
  }}>

    <FormGroup className="mt-1">
      <Row style={{
        padding:5
      }}>
      <div style={{
        paddingLeft:2,
        color:'gray'
      }}>
       <Row>
          <Col sm={4} lg={4}>
          <img src={pics}
           style={{
            height:50,
            width:50,
            borderRadius:100
           }}
           alt=""
          />
          </Col>
          <Col sm={8} lg={8}>
              <div>John Doez </div>
              <div>@JohnDoez </div>
          </Col>
        </Row>
      </div>
      </Row>
      <Row>
        <div style={{
          position:'absolute',
          paddingLeft:2,
          color:'gray'
        }}>
          Oct 20, 2020
        </div>
        <div style={{
          height:400,
          width:600,
          marginBottom:30
        }}>
        <VideoApp />
        </div>
      </Row>

      <Row>
        <div style={{
          color:'gray',
          paddingLeft:10
        }}>video description information </div>
      </Row>

      <hr/>


    </FormGroup>
  </div>
}

const UserFeeds = ({listItem}) => {
  const Halls = ({item, index}) => {
    // console.log('item',item)
    return  <div style={{
      flex:1,
      height:150,
      width:130,
      marginLeft:10,
      marginRight:10,
      backgroundColor:'black',
      borderRadius:25
    }}>
      <div
       style={{
         position:'absolute',
         margin:5,
         padding: 2,
         borderStyle:'solid',
         borderRadius:100,
         borderColor:'red',
         borderWidth: 'thin',
       }}>
       <img src={pics}
         style={{
          height:40,
          width:40,
          borderRadius:100
        }} />
           <span style={{
             width:30,
             top:10,
             left:80,
             position:'absolute',
             fontSize:10,
             color:'white'
           }}>
             John Larry
           </span>
          </div>
       <div>
          <p  style={
            styleInfo.wrapPadMyText
          }>
            Topic: dsdsds dfssdf ghfhfghfhgfhgfhgfghfghfghfhgfhgfghgh
          </p>
          </div>
    </div>
  }
  return  <ScrollMenu
      alignCenter={false}
      arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
      arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
      data={listItem.map((item, index) => (<div
        key={'wessswe'+index}
        style={{
        //
      }}>
        <Halls
        item={item}
        index={index}
         /></div> ))}
    />
}

const UserProfile = ({listItem}) => {
  return <ScrollMenu
      alignCenter={false}
      arrowLeft={<div style={{ fontSize: "30px" }}>{" < "}</div>}
      arrowRight={<div style={{ fontSize: "30px" }}>{" > "}</div>}
      data={listItem.map((item, index) => (<div
      key={'fggjjj'+index}>
      <img src={pics}
        className="rounded mb-2 img-thumbnail"
        style={{
         marginTop:20,
         height:100,
         margin:10
         // width:130,
         // borderRadius:100
        }}
        alt=""
       />
       </div>))}
    />
   }


const Home = ({
  listItem,
  height,
  width
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [usermenu, setUsermenu] = useState(false);

  useEffect(() => { //alert(8)

  }, []);


    return (<React.Fragment>
                <div className="" id="contact"
                style={{
                  backgroundColor:'#f2f3f5',
                  height:height,
                  overflowY:'auto',
                }} >
                  <Container>
                    {usermenu
                      ? <UserFeeds listItem={listItem}  />
                      : null}
                   <Row>
                     <Col className="mt-3" lg={12} sm={12}>
                         <UserProfile listItem={listItem} />
                         <Row style={{
                           height:20,
                         }}>
                          <Col style={{
                            backgroundColor:'#2096F3',
                            width:'50%',
                            textAlign: 'center',
                          }}>
                            video
                          </Col>
                          <Col style={{
                            backgroundColor:'#cfcfc4',
                            width:'50%',
                            textAlign: 'center',
                          }}>
                            comments
                          </Col>
                         </Row>
                         <Row style={{
                              height:950,
                            }}
                           className="container"
                        >
                          <Col className="vdeoComponent" lg={6} sm={6} >
                             <VideoComponent listItem={listItem} />
                           </Col>
                           <Col className="commenstField" lg={6} sm={6} >
                              <CommenstField listItem={listItem} />
                           </Col>
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

export default Home;
