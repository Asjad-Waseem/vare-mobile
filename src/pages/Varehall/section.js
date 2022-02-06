import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Carousel,
    CarouselItem,
    CarouselControl
} from "reactstrap";

//Importing Modal
import ModalSection from '../../components/common/ModalSection';

//Import Images
import bg1 from "../../assets/images/bg-1.jpg";
import bg2 from "../../assets/images/bg-2.jpg";
import bg3 from "../../assets/images/bg-3.jpg";


class Section extends Component {
    constructor() {
        super();
        this.state = {
            items : [
                {
                    id : 1
                },
                {
                    id : 2
                },
                {
                    id : 3
                }
            ],
            isOpen: false,
            height:window.innerHeight,
            activeIndex : 0
        }
        this.callModal.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    callModal = () => {
        this.refs.child.openModal();
    }

    onExiting(){
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        // if (this.animating) return;
        // const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1;
        // this.setState({ activeIndex : nextIndex });
      }

    previous() {
        // if (this.animating) return;
        // const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1;
        // this.setState({ activeIndex : nextIndex });
    }

    componentDidMount(){
        // var e1=document.getElementsByClassName("carousel-item");
        // for(var i=0; i<3; i++){
        //     if(i===0)
        //         e1[i].style.backgroundImage = `url(${bg1})`;
        //     if(i===1)
        //         e1[i].style.backgroundImage = `url(${bg2})`;
        //     if(i===2)
        //         e1[i].style.backgroundImage = `url(${bg3})`;
        // }
    }

    render() {
        const slides = this.state.items.map((item) => {
            return(
                <CarouselItem
                    key = {item.id}
                    onExiting = {this.onExiting()}
                    onExited = {this.onExited()}
                  >
                        <div className="bg-overlay"></div>
                                <div className="home-center">
                                    <div className="home-desc-center">
                                        <Container>
                                        {
                                            item.id === 1 &&
                                            <Row className="justify-content-center">
                                                <Col md="12">
                                                    <div className="home-content text-white">
                                                        <div className="watch-video mt-5">
                                                            <Link onClick={this.callModal} to="#" className="video-play-icon-trigger text-white">
                                                                <i className="mdi mdi-play play-icon-circle play play-icon f-30"></i>
                                                            </Link>
                                                        </div>
                                                        <h5 className="sub-title mt-4 text-white pt-2 text-uppercase">VARA</h5>
                                                        <h1 className="title mt-4 text-white text-uppercase">Voter Access to Representation <br/>.</h1>
                                                        <div className="pt-4 mt-1">
                                                            <Link to="#" className="btn btn-outline-white mt-2 mr-3">View Mandates</Link>
                                                            <Link to="#" className="btn btn-primary mt-2">Volunteer</Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            }{
                                            item.id === 2 &&
                                            <Row className="justify-content-center">
                                                <Col md={12}>
                                                    <div className="home-content text-right">
                                                        <div className="watch-video mt-5">
                                                            <Link to="#" onClick={this.callModal} className="video-play-icon-trigger text-white">
                                                                <i className="mdi mdi-play play-icon-circle play play-icon f-30"></i>
                                                            </Link>
                                                        </div>
                                                        <h1 className="title mt-4 pt-3 text-white text-uppercase">Why Wait? Join VARA<br/>Right Now!</h1>
                                                        <p className="text-white mt-4 f-18">Birthing young African Leaders out of Service & Necessity.  At VARA, leaders are chosen by the youth to lead a necessary solutions through voluntary public service.
                                                            </p>
                                                        <div className="pt-4 mt-1">
                                                          <Link to="#" className="btn btn-outline-white mt-2 mr-3">View Mandates</Link>
                                                          <Link to="#" className="btn btn-primary mt-2">Volunteer</Link>
                                                    </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        }{
                                            item.id === 3 &&
                                            <Row className="justify-content-center">
                                            <Col md={12}>
                                                <div className="home-content text-center text-white">
                                                    <div className="watch-video mt-5">
                                                        <Link to="#" onClick={this.callModal} className="video-play-icon-trigger text-white">
                                                            <i className="mdi mdi-play play-icon-circle play play-icon f-30"></i>
                                                        </Link>
                                                    </div>
                                                    <h1 className="title mt-4 text-white text-uppercase">Mission </h1>
                                                    <p className="text-white mt-4 f-18">The youths in Africa are dying for guardians and leadership, they have been left wanting by their Government due to lack of modern and viable solution at hand.   pay to lead them; so instead of nominating leaders that only have experience in selling dreams, VARA has decided to push leaders that are apt to server and serve only to demonstrate results.</p>
                                                    <div className="pt-4 mt-1">
                                                      <Link to="#" className="btn btn-outline-white mt-2 mr-3">View Mandates</Link>
                                                      <Link to="#" className="btn btn-primary mt-2">Volunteer</Link>
                                                  </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        }
                                        </Container>
                                    </div>
                                </div>
                </CarouselItem>
        )}
        );
        return (
            <React.Fragment>
                <section className="home-section" id="home">

                    {/* Render ModalSection Component for Modal */}
                    <ModalSection ref="child" channel='vimeo' videoId='99025203' />
                </section>
            </React.Fragment>
        );
    }
}

export default Section;
