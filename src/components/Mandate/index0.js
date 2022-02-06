import React, { Component } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';

//Import Section Title
import SectionTitle from "../common/section-title";

//Import Images
import map from "../../assets/images/features/map.png";
import pic3 from "../../assets/images/03.jpg";
import pic4 from "../../assets/images/04.jpg";
import pic5 from "../../assets/images/05.jpg";
import pic6 from "../../assets/images/06.jpg";
import pic7 from "../../assets/images/07.jpg";
import pic8 from "../../assets/images/08.jpg";
import pic9 from "../../assets/images/09.jpg";
import pic10 from "../../assets/images/10.jpg";

const myPics = [pic3,pic4,pic5,pic6,pic7,pic8,pic9,pic10]


class GetInTouch extends Component {
  constructor(props) {
        super(props);
        this.state = {
          navMini: false,
          listId:-1,
          mandateItems:{
            'Police Reform': [
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'Better education system':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'Employment Opportunities':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry2 Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle2 Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre2 Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'Youth empowerment':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'More Empathy from our leader':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'Good roads':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ],
            'Better Power Supply':[
              {
                  name:'John Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Larry Doe',
                  idea:'get help from private sector'
              },
              {
                  name:'Kunle Lawal',
                  idea:'get help from private sector'
              },
              {
                  name:'Lanre Lagungu',
                  idea:'get help from private sector'
              }
            ]
          }
        }
    }


    render() {
        const { mandateItems, listId } = this.state

        const Idea = ({item,id}) => {
          return <div
          key={id+'sfkekr'}
          style={{
            backgroundColor:'red',
            borderRadius:25,
            color:'white',
            width:100,
            height:200,
            display: "flex",
            alignItems: "center",
            flexDirection:'column',
            marginRight:10
           }} >
           <img style={{
             marginTop:5,
             height:60,
             width:60,
             borderRadius:100
           }} src={myPics[id*1+3]} />
              <div style={{
                fontSize:12,
                padding:3
              }} className="mt-3">
              {item.name}
              {item.idea}
              </div>


          </div>
        }

         const Ideas = ({items}) => {
           return <div style={{
             flex:1,
             position:'relative',
             backgroundColor:'#f2f3f5',
             borderRadius:25,
             color:'black',
             width:350,
             height:350
           }} >
           <div style={{
             padding:8
           }} className="mt-3">
           <p className="text-muted">Phone: +71 612-234-4023
               <br/>Fax: +954-627-9727</p>
           </div>
           <div style={{
              display: "flex",
              overflowX: 'scroll !important',
              backgroundColor:'gray'
            }}>
               {items
                 && items.length>0
                 ? items.map((res, id) => {
                   return <Idea item={res} id={id} />
                 })
                 : null}
            </div>
           </div>
         }

        return (
            <React.Fragment>
                <section className="section" id="contact">
                    <Container>
                        <Row className="pt-2">
                            <Col lg={5}>
                                <div className="contact-info">
                                    <div style={{backgroundImage: `url(${map})`, backgroundRepeat : "no-repeat"}} >

                                        {mandateItems
                                          && Object.keys(mandateItems).length > 0
                                          ? Object.keys(mandateItems).map((res, id) => {
                                            return <div
                                              key={id+'ssdsd'}>
                                              <div
                                              style={{
                                                  backgroundColor:'#f1894c',
                                                  borderRadius:25,
                                                  color:'white',
                                                  width:'89%',
                                                  justifyContent: 'center'
                                                 }}
                                             className="mt-3">
                                             <span
                                               onClick={()=>{this.setState({
                                                 listId:listId != id ? id : -1
                                               })}}
                                               style={{
                                               color:'white !important',
                                               marginRight:10,
                                             }}>
                                             <i
                                             className="mdi mdi-arrow-down-bold-circle h4"></i>
                                             </span>
                                              {res}
                                              </div>
                                              {listId == id && <Ideas items={mandateItems && mandateItems[res]} />}
                                          </div>
                                        })
                                        : null}



                                        <Media className="mt-4">
                                            <i className="mdi mdi-phone text-primary h4"></i>
                                            <Media body className="ml-4">
                                                <p className="text-muted">Phone: +71 612-234-4023
                                                    <br/>Fax: +954-627-9727</p>
                                            </Media>
                                        </Media>

                                        <Media className="media mt-4">
                                            <i className="mdi mdi-calendar-clock text-primary h4"></i>
                                            <Media body className="ml-4">
                                                <p className="text-muted">Monday-friday: 9.00-19.00
                                                    <br/>Saturday-Sunday: Holiday</p>
                                            </Media>
                                        </Media>

                                        <Media className="media mt-4">
                                            <i className="mdi mdi-email text-primary h4"></i>
                                            <Media body className="ml-4">
                                                <p className="text-muted">Email: FredVWeaver@rhyta.com</p>
                                            </Media>
                                        </Media>

                                    </div>

                                </div>
                            </Col>

                            <Col lg={7}>
                                <div className="custom-form">
                                    <div id="message"></div>
                                    <AvForm name="contact-form" id="contact-form">
                                        <Row>
                                            <Col lg={12}>
                                                <FormGroup className="mt-3">
                                                <AvField
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Your name"
                                                    errorMessage="Enter Your Name"
                                                    validate={{ required: { value: true } }}
                                                />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={6}>
                                                <FormGroup className="mt-3">
                                                <AvField
                                                    name="email"
                                                    id="email"
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Your email"
                                                    errorMessage="Enter Your email"
                                                    validate={{
                                                        required: { value: true },
                                                        email: { value: true }
                                                    }}
                                                />
                                                </FormGroup>
                                            </Col>

                                            <Col lg={6}>
                                                <FormGroup className="mt-3">
                                                <AvField
                                                    name="number"
                                                    id="number"
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Phone number"
                                                    errorMessage="Enter Your Phone number"
                                                    validate={{
                                                        required: { value: true },
                                                    }}
                                                />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={12}>
                                                <FormGroup className="mt-3">
                                                    <textarea name="comments" id="comments" rows="5" className="form-control" placeholder="Your message"></textarea>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col lg={12}>
                                                <div className="mt-3">
                                                    <input type="submit" id="submit" name="send" className="submitBnt btn btn-primary" value="Send Message"/>
                                                    <div id="simple-msg"></div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </div>
                            </Col>

                        </Row>

                    </Container>
                </section>
            </React.Fragment>
        );
    }
}

export default GetInTouch;
