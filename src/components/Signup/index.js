import React, { Component } from 'react';
import { Container, Row, Col, Media, FormGroup } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';

//Import Section Title
import SectionTitle from "../common/section-title";

//Import Images
import map from "../../assets/images/features/map.png";
import pics from "../../assets/images/04.jpg";


class Signup extends Component {
    render() {

       const SignIn = () => {
         return <div style={{
           // width: 100,
           // height: 100,
           // position: 'relative',
           // top: '50%,',
           // left: '50%',
           // margin: '-25 0 0 -25'
         }}>
   					<Row>
                <div style={{
                  display:'flex',
                  flexDirection:'row'
                }}>
                  <img src={pics}
                   style={{
                    height:100,
                    width:100,
                    borderRadius:100
                   }}
                   alt=""
                  />
                  <div style={{

                    padding:10
                  }}>
       							<div style={{
                      fontWeight:'bold'
                    }}>Welcome to Followers Community</div>
                    <div style={{
                      paddingTop:10,
                      // fontWeight:'bold'
                    }}> Sign in with</div>
       						</div>
                </div>

   					</Row>


   					<div class="social-sign-in">
   						<div class="row">
   							<div class="col-33">
   								<div class="content bg-facebook" >
   									<a href="#">
   										<i class="fab fa-facebook-f"></i>Facebook
   									</a>
   								</div>
   							</div>
   							<div class="col-33">
   								<div class="content bg-twitter">
   									<a href="#">
   										<i class="fab fa-twitter"></i>Google
   									</a>
   								</div>
   							</div>
   							<div class="col-33">
   								<div class="content bg-google">
   									<a href="#">
   										<i class="fab fa-google"></i>Twitter
   									</a>
   								</div>
   							</div>
   						</div>
   					</div>
   				</div>
       }

       const InputElement = () => {
         return <div style={{
           width:'90%',
           flex:1,
           display:'flex',
           flexDirection:'row'
         }}>
         <input
           style={{width:'90%'}}
           name="name"
           placeholder="Search by media handle or name"
           id="name"
           type="text"
           className="form-control is-touched is-pristine av-invalid"
           value=""
          />
            <i style={{paddingLeft:10}}
             class="fas fa-search fa-2x"
            ></i>
         </div>
       }

        return (<React.Fragment>
                <section className="section" id="contact"
                style={{
                  height:650,
                  overflowY:'auto',
                  // flex:1,
                  // display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'center'
                }} >
                    <Container>

                      <Row className="mt-0">
                      <div style={{
                         // paddingTop:350,
                         flex:1,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center'
                       }}>
                         <Col xs={8} lg={4}>
                            <SignIn />
                         </Col>
                         </div>
                      </Row>


                        <Row >
                            <Col lg={6}>
                                <div className="mt-5">
                                    <div style={{backgroundImage: `url(${map})`, backgroundRepeat : "no-repeat"}} >
                                    <SectionTitle
                                        title="Build a community for your followers"
                                        subtitle="activate your follower community"
                                        desc="Link with all your social media followers in one place so you never have to worrry about not being able to get your message our because of sensorship."
                                    />
                                    </div>

                                </div>

                                <div className="custom-form">
                                    <div id="message"></div>
                                    <AvForm name="contact-form" id="contact-form">
                                        <Row>
                                            <Col lg={12}>
                                                <FormGroup className="mt-1">
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
                                                <FormGroup className="mt-1">
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
                                                <FormGroup className="mt-1">
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
                                            <div style={{
                                               flex:1,
                                               display: 'flex',
                                               alignItems: 'center',
                                               justifyContent: 'center'
                                             }}>
                                                <input
                                                  type="submit"
                                                  id="submit" name="send"
                                                  className="submitBnt btn btn-primary"
                                                  value="Add Profile"/>
                                                <div id="simple-msg"></div>
                                            </div>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                </div>
                            </Col>



                            <Col lg={6}>
                            <div className="mt-5">
                            <SectionTitle
                                title="Reconnect with your following"
                                subtitle="follow a community"
                                desc="Link with all your social media followers in one place so you never have to loose your followers or be sensored again."
                            />
                            </div>
                            <AvForm name="contact-form" id="contact-form">
                                <Row>
                                    <Col lg={12}>
                                        <FormGroup className="mt-3">
                                        <InputElement />
                                        </FormGroup>
                                    </Col>
                                </Row>

                            </AvForm>
                            </Col>

                        </Row>

                    </Container>
                </section>
            </React.Fragment>
        );
    }
}

export default Signup;
