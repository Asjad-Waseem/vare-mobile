import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
// import ReactPlayer from 'react-player/youtube'
import ReactPlayer from 'react-player'
import './style.css'; // Tell webpack that Button.js uses these styles
import Cards, { Card } from 'react-swipe-card'
import CommentsBlock from 'simple-react-comments';


//Import Section Title
import SectionTitle from "../common/section-title";

//Import Images
import map from "../../assets/images/features/map.png";
import pics from "../../assets/images/04.jpg";
import pics5 from "../../assets/images/05.jpg";


const videoFeeds = {
}

const data = ['Alexandre', 'Thomas', 'Lucien']

const listItem = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]


const CommentsList = () => {
  return <ul className="comments">
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
  </ul>
}

const CommenstField = () => {
  const [comments, setComments] = useState([]);

  return <div>
           <div>
              <textarea className="css-u55gqp" name="comment-text" id="comment-text" placeholder="Leave a comment"></textarea>
              <Row>
                <Col sm={8} lg={8}>
                    <i className="fas fa-comments"></i>
                    <span style={{
                      color:'gray',
                      paddingLeft:10,
                      // fontSize:10
                      // fontStyle: 'Verdana, sans-serif'
                    }}>
                      838473 Comments
                    </span>
                </Col>
                <Col sm={4} lg={4}>
                  <button className={'css-oot9fd'} >
                    POST
                  </button>
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
        <ReactPlayer
        url={'https://www.youtube.com/watch?v=ysz5S6PUM-U'}
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          },
          facebook: {
            appId: '12345'
          }
        }}
        width='100%'
        height='100%'
      />
      </Row>

      <Row>
        <div style={{
          color:'gray',
          paddingLeft:10
        }}>video description information </div>
      </Row>
      <Row>
          <Col sm={4} lg={4}>
              <Row>
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
      <Col sm={6} lg={6}>
       <div style={{
         color:'gray'
       }}
       className="font10">Views: 999  |  Likes: 999</div>
       </Col>
       </Row>
      <hr/>
         <CommenstField />

    </FormGroup>
  </div>
}

const UserFeeds = () => {
  return  <Row style={{
      marginLeft:15,
      marginRight:15,
      backgroundColor:'#343a40',
      // borderWidth: 'thin !important',
      // borderColor:'red !important',
      borderRadius:10,
      width:'100%',
      height:70,
      backgroundcolor:'gray',
      overflow:'auto'
    }}
      >
       {listItem
        && listItem.map((res, i) => {
          return <div
            key={'weswe'+i}
          >
            <div
             style={{
               margin:5,
               padding: 2,
               borderStyle:'solid',
               borderRadius:100,
               borderColor:'red',
               borderWidth: 'thin'
             }}>
             <img src={pics}
               style={{
                height:40,
                width:40,
                borderRadius:100
           }}
           alt=""
          />
          </div>
          <div style={{
            fontSize:10,
            color:'white'
          }}>dsdsds
          </div>
        </div>
        })}

    </Row>
}

const UserProfile = () => {
  return <div style={{
    paddingLeft:20
  }} className="row">
        <div className="bg-white shadow rounded overflow-hidden">
            <div className="px-4 pt-0 pb-4 bg-dark">
                <div className="media align-items-end profile-header">
                    <div className="profile mr-3">
                    <img src={pics}
                      className="rounded mb-2 img-thumbnail"
                      style={{
                        marginTop:20,
                       height:240,
                       // width:130,
                       // borderRadius:100
                  }}
                  alt=""
                 />

                    <a href="#" className="btn btn-dark btn-sm btn-block">Edit profile</a></div>
                    <div className="media-body mb-5 text-white">
                        <h4 className="mt-0 mb-0">Manuella Tarly</h4>
                        <p className="small mb-4"> <i className="fa fa-map-marker mr-2"></i>San Farcisco</p>
                    </div>
                </div>
            </div>

            <div className="bg-light p-4 d-flex justify-content-end text-center">
                <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                        <h5 className="font-weight-bold mb-0 d-block">241</h5><small className="text-muted"> <i className="fa fa-picture-o mr-1"></i>Photos</small>
                    </li>
                    <li className="list-inline-item">
                        <h5 className="font-weight-bold mb-0 d-block">84K</h5><small className="text-muted"> <i className="fa fa-user-circle-o mr-1"></i>Followers</small>
                    </li>
                </ul>
            </div>

            <div className="py-4 px-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="mb-0">Recent photos</h5><a href="#" className="btn btn-link text-muted">Show all</a>
                </div>

                <div className="py-4">
                    <h5 className="mb-3">Recent posts</h5>
                    <div className="p-4 bg-light rounded shadow-sm">
                        <p className="font-italic mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
                        <ul className="list-inline small text-muted mt-3 mb-0">
                            <li className="list-inline-item"><i className="fa fa-comment-o mr-2"></i>12 Comments</li>
                            <li className="list-inline-item"><i className="fa fa-heart-o mr-2"></i>200 Likes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div></div>

}


const Home = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (<React.Fragment>
                <div className="" id="contact"
                style={{
                  backgroundColor:'#f2f3f5',
                  height:1200,
                  overflowY:'auto',
                  // flex:1,
                  // display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'center'
                }} >
                  <Container>
                   <Row>
                     <Col className="mt-3" lg={6} sm={6}>
                         <Row
                           // className="borderSolid"
                         >
                           <UserFeeds />
                         </Row>
                         <Row style={{
                                    height:950,
                                    overflow:'auto'
                                  }}
                              className="backgroundColorALl">
                          {listItem
                            && listItem.length > 0
                            ? listItem.map((res, i) => {
                             return <Col
                               key={'sssddsd'+i}
                               className="mt-3" lg={12} sm={12}>
                              <VideoComponent />
                           </Col>
                         }):
                       null}
                        </Row>
                       </Col>
                       <Col className="mt-3" lg={6} sm={6}>
                          <UserProfile />
                       </Col>
                    </Row>


                    </Container>
                </div>
            </React.Fragment>
        );
    }

export default Home;
